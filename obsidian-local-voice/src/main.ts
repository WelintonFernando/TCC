import {
	FileSystemAdapter,
	MarkdownView,
	Menu,
	Notice,
	Plugin,
	TFile,
	WorkspaceLeaf,
} from "obsidian";
import * as path from "path";
import {
	DEFAULT_SETTINGS,
	LocalVoiceSettings,
	ParagraphChunk,
	ReadSourceMode,
} from "./types";
import { parseMarkdownToChunks } from "./markdownCleaner";
import { PlayerController } from "./playerController";
import {
	VIEW_TYPE_LOCAL_VOICE,
	VoiceSidebarView,
} from "./voiceSidebarView";
import { LocalVoiceSettingTab } from "./settingsTab";

export default class LocalVoicePlugin extends Plugin {
	settings!: LocalVoiceSettings;
	player!: PlayerController;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.player = new PlayerController(
			this.settings,
			this.getPluginDir(),
			(activeChunk) => {
				this.scrollEditorToChunk(activeChunk);
			}
		);

		this.registerView(
			VIEW_TYPE_LOCAL_VOICE,
			(leaf) => new VoiceSidebarView(leaf, this)
		);

		// Ribbon icon to open sidebar / read active note
		this.addRibbonIcon(
			"volume-2",
			"Local Voice: Abrir leitor em voz alta",
			async () => {
				await this.activateSidebarView();
				if (this.player.status === "idle") {
					await this.loadActiveNoteIntoPlayer("full-note", false);
				}
			}
		);

		// Commands
		this.addCommand({
			id: "open-local-voice-sidebar",
			name: "Abrir painel lateral de leitura (Local Voice)",
			callback: async () => {
				await this.activateSidebarView();
			},
		});

		this.addCommand({
			id: "read-active-note-aloud",
			name: "Ler nota atual em voz alta (Play / Pause)",
			callback: async () => {
				await this.activateSidebarView();
				if (
					this.player.status === "playing" ||
					this.player.status === "paused"
				) {
					await this.player.togglePlayPause();
				} else {
					await this.loadActiveNoteIntoPlayer("full-note", true);
				}
			},
		});

		this.addCommand({
			id: "read-selected-text-aloud",
			name: "Ler texto selecionado em voz alta",
			editorCallback: async () => {
				await this.activateSidebarView();
				await this.loadActiveNoteIntoPlayer("selection", true);
			},
		});

		this.addCommand({
			id: "read-from-cursor-aloud",
			name: "Ler nota a partir do cursor atual",
			editorCallback: async () => {
				await this.activateSidebarView();
				await this.loadActiveNoteIntoPlayer("from-cursor", true);
			},
		});

		this.addCommand({
			id: "stop-reading-aloud",
			name: "Parar leitura em voz alta",
			callback: () => {
				this.player.stop();
			},
		});

		// Right-click Editor Context Menu
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu: Menu, editor) => {
				const hasSelection = editor.somethingSelected();
				if (hasSelection) {
					menu.addItem((item) => {
						item.setTitle("🔊 Ler seleção em voz alta (Local Voice)")
							.setIcon("volume-2")
							.onClick(async () => {
								await this.activateSidebarView();
								await this.loadActiveNoteIntoPlayer(
									"selection",
									true
								);
							});
					});
				}

				menu.addItem((item) => {
					item.setTitle(
						"🔊 Ler a partir daqui em voz alta (Local Voice)"
					)
						.setIcon("play")
						.onClick(async () => {
							await this.activateSidebarView();
							await this.loadActiveNoteIntoPlayer(
								"from-cursor",
								true
							);
						});
				});
			})
		);

		// Update sidebar transcript when switching active note (only while idle)
		this.registerEvent(
			this.app.workspace.on("file-open", async (file: TFile | null) => {
				if (
					file &&
					file.extension === "md" &&
					this.player.status === "idle"
				) {
					await this.loadFileIntoPlayer(file, "full-note", false);
				}
			})
		);

		this.addSettingTab(new LocalVoiceSettingTab(this.app, this));
	}

	onunload(): void {
		if (this.player) {
			this.player.stop();
		}
	}

	public getPluginDir(): string {
		const adapter = this.app.vault.adapter;
		if (adapter instanceof FileSystemAdapter) {
			return path.join(
				adapter.getBasePath(),
				this.app.vault.configDir,
				"plugins",
				this.manifest.id
			);
		}
		return "";
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
		if (this.player) {
			this.player.updateSettings(this.settings);
		}
	}

	async activateSidebarView(): Promise<void> {
		const { workspace } = this.app;
		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_LOCAL_VOICE);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getRightLeaf(false);
			if (leaf) {
				await leaf.setViewState({
					type: VIEW_TYPE_LOCAL_VOICE,
					active: true,
				});
			}
		}

		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	/**
	 * Loads the active MarkdownView (or last active Markdown file) into the player.
	 */
	async loadActiveNoteIntoPlayer(
		mode: ReadSourceMode = "full-note",
		autoPlay = false
	): Promise<void> {
		let mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!mdView) {
			// Fallback: find any open Markdown leaf
			const mdLeaves = this.app.workspace.getLeavesOfType("markdown");
			if (mdLeaves.length > 0 && mdLeaves[0].view instanceof MarkdownView) {
				mdView = mdLeaves[0].view;
			}
		}

		if (mdView && mdView.file) {
			const editor = mdView.editor;
			const file = mdView.file;

			if (mode === "selection") {
				const selectedText = editor.getSelection();
				if (!selectedText || !selectedText.trim()) {
					new Notice(
						"Selecione um trecho de texto no editor primeiro, ou clique em 'Nota Inteira'."
					);
					return;
				}
				const fromPos = editor.getCursor("from");
				const chunks = parseMarkdownToChunks(
					selectedText,
					this.settings,
					fromPos.line
				);
				this.player.loadChunks(
					chunks,
					file.basename,
					file.path,
					"selection"
				);
				if (autoPlay && chunks.length > 0) {
					await this.player.playFromIndex(0);
				}
				return;
			}

			if (mode === "from-cursor") {
				const cursor = editor.getCursor("from");
				const fullText = editor.getValue();
				const allLines = fullText.split(/\r?\n/);
				const slicedText = allLines.slice(cursor.line).join("\n");
				const chunks = parseMarkdownToChunks(
					slicedText,
					this.settings,
					cursor.line
				);
				this.player.loadChunks(
					chunks,
					file.basename,
					file.path,
					"from-cursor"
				);
				if (autoPlay && chunks.length > 0) {
					await this.player.playFromIndex(0);
				}
				return;
			}

			// Full note
			const content = editor.getValue();
			const chunks = parseMarkdownToChunks(content, this.settings, 0);
			this.player.loadChunks(
				chunks,
				file.basename,
				file.path,
				"full-note"
			);
			if (autoPlay && chunks.length > 0) {
				await this.player.playFromIndex(0);
			}
			return;
		}

		// Fallback to active file if in Reading Mode without active editor
		const activeFile = this.app.workspace.getActiveFile();
		if (activeFile && activeFile.extension === "md") {
			await this.loadFileIntoPlayer(activeFile, "full-note", autoPlay);
		} else {
			new Notice("Abra uma nota em Markdown para ler em voz alta.");
		}
	}

	async loadFileIntoPlayer(
		file: TFile,
		mode: ReadSourceMode = "full-note",
		autoPlay = false
	): Promise<void> {
		const content = await this.app.vault.cachedRead(file);
		const chunks = parseMarkdownToChunks(content, this.settings, 0);
		this.player.loadChunks(chunks, file.basename, file.path, mode);
		if (autoPlay && chunks.length > 0) {
			await this.player.playFromIndex(0);
		}
	}

	private scrollEditorToChunk(chunk: ParagraphChunk): void {
		if (!this.settings.scrollEditorWithPlayback) return;
		const mdLeaves = this.app.workspace.getLeavesOfType("markdown");
		for (const leaf of mdLeaves) {
			if (
				leaf.view instanceof MarkdownView &&
				leaf.view.file?.path === this.player.notePath
			) {
				const editor = leaf.view.editor;
				editor.scrollIntoView(
					{
						from: { line: chunk.startLine, ch: 0 },
						to: { line: chunk.endLine, ch: 0 },
					},
					true
				);
				break;
			}
		}
	}
}
