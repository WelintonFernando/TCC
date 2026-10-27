import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import type LocalVoicePlugin from "./main";
import {
	CURATED_EDGE_VOICES,
	PIPER_MODELS,
	TTSEngineType,
} from "./types";
import {
	installPiperAndVoice,
	isVoiceModelInstalled,
	resolvePiperExePath,
} from "./engines/piperTts";
import { getSystemVoices } from "./engines/systemTts";
import { fetchEdgeVoices } from "./engines/edgeTts";

export class LocalVoiceSettingTab extends PluginSettingTab {
	plugin: LocalVoicePlugin;

	constructor(app: App, plugin: LocalVoicePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "Local Voice (TTS Reader)" });
		containerEl.createEl("p", {
			text: "Configure o motor de leitura em voz alta (TTS), gerencie vozes offline do Piper TTS e ajuste a limpeza de Markdown.",
		});

		// 1. Engine Selection
		new Setting(containerEl)
			.setName("Motor de Voz (TTS Engine)")
			.setDesc(
				"Escolha entre Edge Neural (gratuito e sem chave de API), Piper TTS (100% local e offline) ou Vozes Nativas do Windows."
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOption(
						"edge",
						"⚡ Edge Neural TTS (Sem API Key • Vozes Neurais PT-BR)"
					)
					.addOption(
						"piper",
						"🔒 Piper TTS (100% Local e Offline • Roda na CPU)"
					)
					.addOption(
						"system",
						"💻 Vozes Nativas do Sistema (Windows SAPI / Web Speech)"
					)
					.setValue(this.plugin.settings.engine)
					.onChange(async (value) => {
						this.plugin.settings.engine = value as TTSEngineType;
						await this.plugin.saveSettings();
						this.display();
					})
			);

		new Setting(containerEl)
			.setName("Velocidade Padrão de Leitura")
			.setDesc("Velocidade de reprodução do áudio (0.75x até 2.0x).")
			.addDropdown((drop) => {
				for (const r of [0.75, 1.0, 1.25, 1.5, 1.75, 2.0]) {
					drop.addOption(String(r), `${r}x`);
				}
				drop.setValue(String(this.plugin.settings.playbackRate));
				drop.onChange(async (val) => {
					const num = parseFloat(val) || 1.0;
					this.plugin.settings.playbackRate = num;
					this.plugin.player.setPlaybackRate(num);
					await this.plugin.saveSettings();
				});
			});

		// 2. Engine-Specific Configuration
		if (this.plugin.settings.engine === "edge") {
			containerEl.createEl("h3", {
				text: "⚡ Configurações do Edge Neural TTS (Sem Chave de API)",
			});

			const edgeVoiceSetting = new Setting(containerEl)
				.setName("Voz Neural do Edge")
				.setDesc(
					"Vozes neurais naturais da Microsoft (não requer conta nem chave de API)."
				)
				.addDropdown((drop) => {
					for (const v of CURATED_EDGE_VOICES) {
						drop.addOption(v.shortName, v.friendlyName);
					}
					drop.setValue(this.plugin.settings.edgeVoice);
					drop.onChange(async (val) => {
						this.plugin.settings.edgeVoice = val;
						await this.plugin.saveSettings();
					});
				});

			edgeVoiceSetting.addButton((btn) =>
				btn
					.setButtonText("Carregar Todas as Vozes")
					.onClick(async () => {
						btn.setButtonText("Carregando...");
						const allVoices = await fetchEdgeVoices();
						new Notice(
							`${allVoices.length} vozes carregadas do servidor!`
						);
						this.display();
					})
			);
		} else if (this.plugin.settings.engine === "piper") {
			containerEl.createEl("h3", {
				text: "🔒 Configurações do Piper TTS (100% Local e Offline)",
			});

			const pluginDir = this.plugin.getPluginDir();
			const exePath = resolvePiperExePath(
				pluginDir,
				this.plugin.settings
			);

			new Setting(containerEl)
				.setName("Status do Executável Piper")
				.setDesc(
					exePath
						? `✅ Instalado em: ${exePath}`
						: "⚠️ Executável não encontrado. Clique em qualquer botão 'Baixar & Ativar' abaixo para instalar automaticamente."
				);

			new Setting(containerEl)
				.setName("Voz Ativa do Piper")
				.setDesc("Selecione qual modelo de voz local usar.")
				.addDropdown((drop) => {
					for (const m of PIPER_MODELS) {
						const installed = isVoiceModelInstalled(
							pluginDir,
							m.id
						);
						drop.addOption(
							m.id,
							`${installed ? "✅ " : "⬇️ "}${m.name} (${m.quality})`
						);
					}
					drop.setValue(this.plugin.settings.piperVoiceId);
					drop.onChange(async (val) => {
						this.plugin.settings.piperVoiceId = val;
						await this.plugin.saveSettings();
						this.display();
					});
				});

			containerEl.createEl("h4", {
				text: "Gerenciador de Vozes Offline (Download com 1 Clique)",
			});

			for (const model of PIPER_MODELS) {
				const isInstalled = isVoiceModelInstalled(pluginDir, model.id);
				const isSelected =
					this.plugin.settings.piperVoiceId === model.id;

				new Setting(containerEl)
					.setName(
						`${model.name} ${isSelected ? "⭐ (Selecionada)" : ""}`
					)
					.setDesc(
						`Idioma: ${model.language} • Qualidade: ${model.quality} • Tamanho: ${model.sizeLabel} • Status: ${isInstalled ? "✅ Instalada no seu PC" : "Não baixada"}`
					)
					.addButton((btn) => {
						btn.setButtonText(
							isInstalled
								? isSelected
									? "✅ Pronta e Ativa"
									: "Usar esta Voz"
								: "⬇️ Baixar & Ativar"
						);
						if (!isInstalled) {
							btn.setCta();
						}
						btn.onClick(async () => {
							if (isInstalled) {
								this.plugin.settings.piperVoiceId = model.id;
								await this.plugin.saveSettings();
								new Notice(`Voz alterada para ${model.name}`);
								this.display();
								return;
							}
							btn.setDisabled(true);
							try {
								await installPiperAndVoice(
									pluginDir,
									model.id,
									(status) => {
										btn.setButtonText(status);
									}
								);
								this.plugin.settings.piperVoiceId = model.id;
								await this.plugin.saveSettings();
								new Notice(
									`✅ ${model.name} instalada e ativada!`
								);
								this.display();
							} catch (err: any) {
								new Notice(
									`❌ Erro no download: ${err?.message || err}`
								);
								btn.setDisabled(false);
								btn.setButtonText("⬇️ Tentar Novamente");
							}
						});
					});
			}

			new Setting(containerEl)
				.setName("Caminho Customizado do piper.exe (Opcional)")
				.setDesc(
					"Deixe em branco para usar o Piper instalado automaticamente na pasta do plugin."
				)
				.addText((text) =>
					text
						.setPlaceholder("Ex: C:\\piper\\piper.exe")
						.setValue(this.plugin.settings.customPiperExePath)
						.onChange(async (value) => {
							this.plugin.settings.customPiperExePath =
								value.trim();
							await this.plugin.saveSettings();
						})
				);

			new Setting(containerEl)
				.setName("Caminho Customizado de Modelo .onnx (Opcional)")
				.setDesc(
					"Deixe em branco para usar os modelos baixados pelo gerenciador acima."
				)
				.addText((text) =>
					text
						.setPlaceholder(
							"Ex: C:\\piper\\models\\pt_BR-faber-medium.onnx"
						)
						.setValue(this.plugin.settings.customPiperModelPath)
						.onChange(async (value) => {
							this.plugin.settings.customPiperModelPath =
								value.trim();
							await this.plugin.saveSettings();
						})
				);
		} else {
			containerEl.createEl("h3", {
				text: "💻 Configurações das Vozes Nativas do Sistema",
			});

			const sysVoices = getSystemVoices();
			new Setting(containerEl)
				.setName("Voz do Windows / Sistema")
				.setDesc(
					"Usa as vozes já instaladas no seu Windows (offline e instantâneo)."
				)
				.addDropdown((drop) => {
					drop.addOption("", "Automática (Português / Padrão)");
					for (const sv of sysVoices) {
						drop.addOption(sv.voiceURI, sv.name);
					}
					drop.setValue(this.plugin.settings.systemVoiceURI);
					drop.onChange(async (val) => {
						this.plugin.settings.systemVoiceURI = val;
						await this.plugin.saveSettings();
					});
				});
		}

		// 3. Behavior & Markdown Cleaning
		containerEl.createEl("h3", {
			text: "🧹 Limpeza de Markdown e Comportamento",
		});

		new Setting(containerEl)
			.setName("Auto-scroll na Aba Lateral")
			.setDesc(
				"Rola automaticamente a lista de parágrafos na aba lateral conforme a leitura avança."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.autoScrollSidebar)
					.onChange(async (val) => {
						this.plugin.settings.autoScrollSidebar = val;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Acompanhar Parágrafo no Editor da Nota")
			.setDesc(
				"Rola suavemente a nota aberta para a linha do parágrafo que está sendo lido no momento."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.scrollEditorWithPlayback)
					.onChange(async (val) => {
						this.plugin.settings.scrollEditorWithPlayback = val;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Pré-carregar Próximo Parágrafo (Zero Pausa)")
			.setDesc(
				"Sintetiza o próximo parágrafo em segundo plano enquanto o atual está tocando para leitura contínua sem pausas."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.prefetchNextChunk)
					.onChange(async (val) => {
						this.plugin.settings.prefetchNextChunk = val;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Ignorar Blocos de Código (```)")
			.setDesc("Pula blocos de código durante a leitura em voz alta.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.ignoreCodeBlocks)
					.onChange(async (val) => {
						this.plugin.settings.ignoreCodeBlocks = val;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Ignorar Propriedades / Frontmatter YAML")
			.setDesc("Pula o bloco YAML (---) no topo das notas.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.ignoreFrontmatter)
					.onChange(async (val) => {
						this.plugin.settings.ignoreFrontmatter = val;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Ignorar URLs puras (http/https)")
			.setDesc("Evita soletrar endereços web longos.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.ignoreUrls)
					.onChange(async (val) => {
						this.plugin.settings.ignoreUrls = val;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Ignorar Tabelas Markdown")
			.setDesc("Se ativado, pula tabelas inteiras durante a leitura.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.ignoreTables)
					.onChange(async (val) => {
						this.plugin.settings.ignoreTables = val;
						await this.plugin.saveSettings();
					})
			);
	}
}
