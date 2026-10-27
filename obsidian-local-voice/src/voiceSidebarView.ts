import { ItemView, Notice, WorkspaceLeaf, setIcon } from "obsidian";
import type LocalVoicePlugin from "./main";
import {
	CURATED_EDGE_VOICES,
	PIPER_MODELS,
	ReadSourceMode,
	TTSEngineType,
} from "./types";
import {
	installPiperAndVoice,
	isPiperReady,
} from "./engines/piperTts";
import { getSystemVoices } from "./engines/systemTts";

export const VIEW_TYPE_LOCAL_VOICE = "local-voice-sidebar-view";

export class VoiceSidebarView extends ItemView {
	private plugin: LocalVoicePlugin;
	private unsubscribePlayer: (() => void) | null = null;
	private isInstallingPiper = false;
	private installStatusText = "";
	private lastScrolledIndex = -1;

	// DOM references for fast updates without losing scroll position
	private headerTitleEl!: HTMLElement;
	private modeBadgeEl!: HTMLElement;
	private engineSelectEl!: HTMLSelectElement;
	private voiceSelectEl!: HTMLSelectElement;
	private piperBannerEl!: HTMLElement;
	private statusBannerEl!: HTMLElement;
	private playBtnEl!: HTMLButtonElement;
	private stopBtnEl!: HTMLButtonElement;
	private prevBtnEl!: HTMLButtonElement;
	private nextBtnEl!: HTMLButtonElement;
	private speedSelectEl!: HTMLSelectElement;
	private progressTextEl!: HTMLElement;
	private progressFillEl!: HTMLElement;
	private transcriptContainerEl!: HTMLElement;
	private renderedChunksSignature = "";

	constructor(leaf: WorkspaceLeaf, plugin: LocalVoicePlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return VIEW_TYPE_LOCAL_VOICE;
	}

	getDisplayText(): string {
		return "Local Voice (TTS)";
	}

	getIcon(): string {
		return "volume-2";
	}

	async onOpen(): Promise<void> {
		this.buildUI();
		this.unsubscribePlayer = this.plugin.player.subscribe(() => {
			this.updateUIFromState();
		});

		// Load active markdown note if player is empty
		if (this.plugin.player.chunks.length === 0) {
			this.plugin.loadActiveNoteIntoPlayer("full-note", false);
		} else {
			this.updateUIFromState();
		}
	}

	async onClose(): Promise<void> {
		if (this.unsubscribePlayer) {
			this.unsubscribePlayer();
			this.unsubscribePlayer = null;
		}
	}

	private buildUI(): void {
		const container = this.containerEl.children[1] as HTMLElement;
		container.empty();
		container.addClass("lv-sidebar-container");

		// 1. Header with Note Title & Refresh button
		const header = container.createDiv({ cls: "lv-header" });
		const titleRow = header.createDiv({ cls: "lv-title-row" });

		const titleIcon = titleRow.createSpan({ cls: "lv-title-icon" });
		setIcon(titleIcon, "headphones");

		this.headerTitleEl = titleRow.createDiv({
			cls: "lv-note-title",
			text: "Nenhuma nota selecionada",
		});

		this.modeBadgeEl = titleRow.createSpan({
			cls: "lv-mode-badge",
			text: "Nota Inteira",
		});

		// Quick Source Mode Action Bar
		const sourceActions = header.createDiv({ cls: "lv-source-actions" });

		const btnFull = sourceActions.createEl("button", {
			cls: "lv-source-btn",
			attr: { title: "Carregar e ler a nota inteira" },
		});
		const iconFull = btnFull.createSpan({ cls: "lv-btn-icon" });
		setIcon(iconFull, "file-text");
		btnFull.createSpan({ text: "Nota Inteira" });
		btnFull.addEventListener("click", () => {
			this.plugin.loadActiveNoteIntoPlayer("full-note", true);
		});

		const btnCursor = sourceActions.createEl("button", {
			cls: "lv-source-btn",
			attr: { title: "Ler a partir da posição atual do cursor" },
		});
		const iconCursor = btnCursor.createSpan({ cls: "lv-btn-icon" });
		setIcon(iconCursor, "text-cursor-input");
		btnCursor.createSpan({ text: "Do Cursor" });
		btnCursor.addEventListener("click", () => {
			this.plugin.loadActiveNoteIntoPlayer("from-cursor", true);
		});

		const btnSelection = sourceActions.createEl("button", {
			cls: "lv-source-btn",
			attr: { title: "Ler apenas o texto selecionado" },
		});
		const iconSel = btnSelection.createSpan({ cls: "lv-btn-icon" });
		setIcon(iconSel, "highlighter");
		btnSelection.createSpan({ text: "Seleção" });
		btnSelection.addEventListener("click", () => {
			this.plugin.loadActiveNoteIntoPlayer("selection", true);
		});

		// 2. Engine & Voice Selector Bar
		const configBar = container.createDiv({ cls: "lv-config-bar" });

		const engineField = configBar.createDiv({ cls: "lv-field-group" });
		engineField.createEl("label", {
			cls: "lv-field-label",
			text: "Motor TTS",
		});
		this.engineSelectEl = engineField.createEl("select", {
			cls: "lv-select",
		});
		this.engineSelectEl.createEl("option", {
			value: "edge",
			text: "⚡ Edge Neural (Sem API / Natural)",
		});
		this.engineSelectEl.createEl("option", {
			value: "piper",
			text: "🔒 Piper TTS (100% Local / Offline)",
		});
		this.engineSelectEl.createEl("option", {
			value: "system",
			text: "💻 Vozes do Sistema (Windows)",
		});
		this.engineSelectEl.value = this.plugin.settings.engine;
		this.engineSelectEl.addEventListener("change", async () => {
			this.plugin.settings.engine = this.engineSelectEl
				.value as TTSEngineType;
			await this.plugin.saveSettings();
			this.populateVoiceDropdown();
			this.updatePiperBanner();
		});

		const voiceField = configBar.createDiv({ cls: "lv-field-group" });
		voiceField.createEl("label", { cls: "lv-field-label", text: "Voz" });
		this.voiceSelectEl = voiceField.createEl("select", {
			cls: "lv-select",
		});
		this.populateVoiceDropdown();
		this.voiceSelectEl.addEventListener("change", async () => {
			const val = this.voiceSelectEl.value;
			if (this.plugin.settings.engine === "edge") {
				this.plugin.settings.edgeVoice = val;
			} else if (this.plugin.settings.engine === "piper") {
				this.plugin.settings.piperVoiceId = val;
			} else {
				this.plugin.settings.systemVoiceURI = val;
			}
			await this.plugin.saveSettings();
			this.updatePiperBanner();
		});

		// 3. Piper 1-Click Installer Banner (shown only if Piper is selected and not installed)
		this.piperBannerEl = container.createDiv({
			cls: "lv-piper-banner is-hidden",
		});

		// 4. Error / Status Banner
		this.statusBannerEl = container.createDiv({
			cls: "lv-status-banner is-hidden",
		});

		// 5. Main Player Transport Controls
		const playerCard = container.createDiv({ cls: "lv-player-card" });

		const controlsRow = playerCard.createDiv({ cls: "lv-controls-row" });

		this.prevBtnEl = controlsRow.createEl("button", {
			cls: "lv-ctrl-btn",
			attr: { title: "Parágrafo anterior" },
		});
		setIcon(this.prevBtnEl, "skip-back");
		this.prevBtnEl.addEventListener("click", () => {
			this.plugin.player.previous();
		});

		this.playBtnEl = controlsRow.createEl("button", {
			cls: "lv-ctrl-btn lv-play-btn",
			attr: { title: "Play / Pause" },
		});
		setIcon(this.playBtnEl, "play");
		this.playBtnEl.addEventListener("click", () => {
			if (this.plugin.player.chunks.length === 0) {
				this.plugin.loadActiveNoteIntoPlayer("full-note", true);
			} else {
				this.plugin.player.togglePlayPause();
			}
		});

		this.stopBtnEl = controlsRow.createEl("button", {
			cls: "lv-ctrl-btn",
			attr: { title: "Parar leitura" },
		});
		setIcon(this.stopBtnEl, "square");
		this.stopBtnEl.addEventListener("click", () => {
			this.plugin.player.stop();
		});

		this.nextBtnEl = controlsRow.createEl("button", {
			cls: "lv-ctrl-btn",
			attr: { title: "Próximo parágrafo" },
		});
		setIcon(this.nextBtnEl, "skip-forward");
		this.nextBtnEl.addEventListener("click", () => {
			this.plugin.player.next();
		});

		// Speed selector
		this.speedSelectEl = controlsRow.createEl("select", {
			cls: "lv-speed-select",
			attr: { title: "Velocidade de reprodução" },
		});
		for (const rate of [0.75, 1.0, 1.25, 1.5, 1.75, 2.0]) {
			this.speedSelectEl.createEl("option", {
				value: String(rate),
				text: `${rate}x`,
			});
		}
		this.speedSelectEl.value = String(this.plugin.settings.playbackRate);
		this.speedSelectEl.addEventListener("change", async () => {
			const rate = parseFloat(this.speedSelectEl.value) || 1.0;
			this.plugin.settings.playbackRate = rate;
			this.plugin.player.setPlaybackRate(rate);
			await this.plugin.saveSettings();
		});

		// Progress Bar & Paragraph Counter
		const progressArea = playerCard.createDiv({ cls: "lv-progress-area" });
		const progressBarTrack = progressArea.createDiv({
			cls: "lv-progress-track",
		});
		this.progressFillEl = progressBarTrack.createDiv({
			cls: "lv-progress-fill",
		});
		this.progressTextEl = progressArea.createDiv({
			cls: "lv-progress-text",
			text: "Pronto para ler",
		});

		// 6. Interactive Transcript List
		const transcriptHeader = container.createDiv({
			cls: "lv-transcript-header",
		});
		transcriptHeader.createSpan({
			text: "Parágrafos da Nota (clique para ouvir daqui)",
		});

		this.transcriptContainerEl = container.createDiv({
			cls: "lv-transcript-list",
		});

		this.updatePiperBanner();
	}

	private populateVoiceDropdown(): void {
		if (!this.voiceSelectEl) return;
		this.voiceSelectEl.empty();

		const engine = this.plugin.settings.engine;
		if (engine === "edge") {
			for (const v of CURATED_EDGE_VOICES) {
				this.voiceSelectEl.createEl("option", {
					value: v.shortName,
					text: v.friendlyName,
				});
			}
			this.voiceSelectEl.value = this.plugin.settings.edgeVoice;
		} else if (engine === "piper") {
			for (const m of PIPER_MODELS) {
				this.voiceSelectEl.createEl("option", {
					value: m.id,
					text: `${m.name} [${m.quality}]`,
				});
			}
			this.voiceSelectEl.value = this.plugin.settings.piperVoiceId;
		} else {
			const sysVoices = getSystemVoices();
			this.voiceSelectEl.createEl("option", {
				value: "",
				text: "Automática (Português / Padrão do Windows)",
			});
			for (const sv of sysVoices) {
				this.voiceSelectEl.createEl("option", {
					value: sv.voiceURI,
					text: sv.name,
				});
			}
			this.voiceSelectEl.value = this.plugin.settings.systemVoiceURI;
		}
	}

	private updatePiperBanner(): void {
		if (!this.piperBannerEl) return;
		this.piperBannerEl.empty();

		if (this.plugin.settings.engine !== "piper") {
			this.piperBannerEl.addClass("is-hidden");
			return;
		}

		const ready = isPiperReady(
			this.plugin.getPluginDir(),
			this.plugin.settings
		);
		if (ready && !this.isInstallingPiper) {
			this.piperBannerEl.addClass("is-hidden");
			return;
		}

		this.piperBannerEl.removeClass("is-hidden");
		const title = this.piperBannerEl.createDiv({
			cls: "lv-piper-banner-title",
			text: "📦 Motor Offline Piper TTS",
		});

		if (this.isInstallingPiper) {
			title.setText("⏳ Instalando Piper TTS Offline...");
			this.piperBannerEl.createDiv({
				cls: "lv-piper-banner-desc",
				text: this.installStatusText || "Iniciando download...",
			});
			return;
		}

		this.piperBannerEl.createDiv({
			cls: "lv-piper-banner-desc",
			text: `O motor Piper ou a voz '${this.plugin.settings.piperVoiceId}' ainda não está baixada na pasta do plugin.`,
		});

		const installBtn = this.piperBannerEl.createEl("button", {
			cls: "lv-install-btn mod-cta",
			text: "⬇️ Baixar Piper + Voz Offline Automaticamente (1 Clique)",
		});

		installBtn.addEventListener("click", async () => {
			if (this.isInstallingPiper) return;
			this.isInstallingPiper = true;
			this.updatePiperBanner();
			try {
				await installPiperAndVoice(
					this.plugin.getPluginDir(),
					this.plugin.settings.piperVoiceId,
					(status) => {
						this.installStatusText = status;
						this.updatePiperBanner();
					}
				);
				new Notice("✅ Piper TTS e voz instalados com sucesso!");
			} catch (err: any) {
				new Notice(
					`❌ Erro ao instalar Piper TTS: ${err?.message || err}`
				);
			} finally {
				this.isInstallingPiper = false;
				this.updatePiperBanner();
			}
		});
	}

	public updateUIFromState(): void {
		if (!this.headerTitleEl) return;
		const player = this.plugin.player;

		this.headerTitleEl.setText(player.noteTitle);

		const modeLabels: Record<ReadSourceMode, string> = {
			"full-note": "Nota Inteira",
			"from-cursor": "Do Cursor",
			selection: "Seleção",
		};
		this.modeBadgeEl.setText(modeLabels[player.sourceMode]);

		// Sync engine & speed selectors
		if (this.engineSelectEl.value !== this.plugin.settings.engine) {
			this.engineSelectEl.value = this.plugin.settings.engine;
			this.populateVoiceDropdown();
		}
		this.speedSelectEl.value = String(this.plugin.settings.playbackRate);
		this.updatePiperBanner();

		// Error banner
		if (player.errorMessage) {
			this.statusBannerEl.removeClass("is-hidden");
			this.statusBannerEl.setText(`⚠️ ${player.errorMessage}`);
		} else {
			this.statusBannerEl.addClass("is-hidden");
		}

		// Play/Pause button icon & state
		this.playBtnEl.empty();
		this.playBtnEl.removeClass("is-loading");
		if (player.status === "playing") {
			setIcon(this.playBtnEl, "pause");
			this.playBtnEl.setAttr("title", "Pausar leitura");
		} else if (player.status === "loading") {
			setIcon(this.playBtnEl, "loader");
			this.playBtnEl.addClass("is-loading");
			this.playBtnEl.setAttr("title", "Gerando voz...");
		} else {
			setIcon(this.playBtnEl, "play");
			this.playBtnEl.setAttr("title", "Iniciar leitura");
		}

		// Progress counter & bar
		const total = player.chunks.length;
		const current = player.currentIndex >= 0 ? player.currentIndex + 1 : 0;
		if (total === 0) {
			this.progressTextEl.setText("Nenhum parágrafo carregado");
			this.progressFillEl.style.width = "0%";
		} else {
			const statusLabel =
				player.status === "playing"
					? "🔊 Lendo"
					: player.status === "loading"
						? "⏳ Sintetizando"
						: player.status === "paused"
							? "⏸️ Pausado"
							: "⏹️ Pronto";
			this.progressTextEl.setText(
				`${statusLabel} • Parágrafo ${current} de ${total}`
			);
			const pct = Math.round((current / total) * 100);
			this.progressFillEl.style.width = `${pct}%`;
		}

		// Render transcript items if chunks changed
		const signature = `${player.notePath}:${player.sourceMode}:${player.chunks.length}:${player.chunks[0]?.spokenText?.slice(0, 20) || ""}`;
		if (signature !== this.renderedChunksSignature) {
			this.renderedChunksSignature = signature;
			this.renderTranscriptChunks();
		}

		// Highlight active paragraph
		const items = this.transcriptContainerEl.querySelectorAll(
			".lv-chunk-item"
		);
		items.forEach((el, idx) => {
			el.toggleClass("is-active", idx === player.currentIndex);
			el.toggleClass(
				"is-playing",
				idx === player.currentIndex && player.status === "playing"
			);
			el.toggleClass("is-past", idx < player.currentIndex);
		});

		// Auto-scroll active paragraph into view when index advances
		if (
			this.plugin.settings.autoScrollSidebar &&
			player.currentIndex >= 0 &&
			player.currentIndex !== this.lastScrolledIndex
		) {
			this.lastScrolledIndex = player.currentIndex;
			const activeEl = items[player.currentIndex] as HTMLElement | undefined;
			if (activeEl) {
				activeEl.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
			}
		}
	}

	private renderTranscriptChunks(): void {
		this.transcriptContainerEl.empty();
		this.lastScrolledIndex = -1;

		const chunks = this.plugin.player.chunks;
		if (chunks.length === 0) {
			const emptyEl = this.transcriptContainerEl.createDiv({
				cls: "lv-empty-state",
			});
			emptyEl.createDiv({
				cls: "lv-empty-title",
				text: "Nenhum texto para ler",
			});
			emptyEl.createDiv({
				cls: "lv-empty-desc",
				text: "Abra uma nota em Markdown e clique em Play ou 'Nota Inteira' para começar a ouvir.",
			});
			return;
		}

		for (const chunk of chunks) {
			const itemEl = this.transcriptContainerEl.createDiv({
				cls: `lv-chunk-item ${chunk.isHeading ? "is-heading" : ""}`,
			});

			const indexBadge = itemEl.createSpan({
				cls: "lv-chunk-index",
				text: String(chunk.index + 1),
			});

			const textSpan = itemEl.createDiv({
				cls: "lv-chunk-text",
				text: chunk.displayText,
			});

			itemEl.addEventListener("click", () => {
				this.plugin.player.playFromIndex(chunk.index);
			});
		}
	}
}
