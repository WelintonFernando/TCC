import { Notice } from "obsidian";
import {
	LocalVoiceSettings,
	ParagraphChunk,
	PlaybackStatus,
	ReadSourceMode,
} from "./types";
import { synthesizeEdgeTTS } from "./engines/edgeTts";
import { synthesizePiperTTS } from "./engines/piperTts";
import { SystemSpeechController } from "./engines/systemTts";

export type PlayerListener = () => void;

export class PlayerController {
	public chunks: ParagraphChunk[] = [];
	public currentIndex = -1;
	public status: PlaybackStatus = "idle";
	public noteTitle = "Nenhuma nota selecionada";
	public notePath = "";
	public sourceMode: ReadSourceMode = "full-note";
	public errorMessage: string | null = null;

	private settings: LocalVoiceSettings;
	private pluginDir: string;
	private listeners: Set<PlayerListener> = new Set();
	private onActiveChunkChanged?: (chunk: ParagraphChunk) => void;

	private audioEl: HTMLAudioElement | null = null;
	private currentObjectUrl: string | null = null;
	private systemController = new SystemSpeechController();

	// Prefetch cache: key -> Promise<Buffer>
	private audioCache: Map<string, Promise<Buffer>> = new Map();
	private playbackSessionId = 0;

	constructor(
		settings: LocalVoiceSettings,
		pluginDir: string,
		onActiveChunkChanged?: (chunk: ParagraphChunk) => void
	) {
		this.settings = settings;
		this.pluginDir = pluginDir;
		this.onActiveChunkChanged = onActiveChunkChanged;
	}

	public updateSettings(settings: LocalVoiceSettings): void {
		const engineOrVoiceChanged =
			this.settings.engine !== settings.engine ||
			this.settings.edgeVoice !== settings.edgeVoice ||
			this.settings.piperVoiceId !== settings.piperVoiceId ||
			this.settings.piperLengthScale !== settings.piperLengthScale;

		this.settings = settings;

		if (engineOrVoiceChanged) {
			this.audioCache.clear();
		}

		if (this.audioEl) {
			this.audioEl.playbackRate = this.settings.playbackRate;
		}
		this.notify();
	}

	public subscribe(listener: PlayerListener): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	public notify(): void {
		for (const listener of this.listeners) {
			try {
				listener();
			} catch (e) {
				console.error("Erro no listener do LocalVoice:", e);
			}
		}
	}

	public loadChunks(
		chunks: ParagraphChunk[],
		noteTitle: string,
		notePath: string,
		sourceMode: ReadSourceMode = "full-note"
	): void {
		this.stop();
		this.chunks = chunks;
		this.noteTitle = noteTitle;
		this.notePath = notePath;
		this.sourceMode = sourceMode;
		this.currentIndex = chunks.length > 0 ? 0 : -1;
		this.errorMessage = null;
		this.audioCache.clear();
		this.notify();
	}

	public async playFromIndex(index: number): Promise<void> {
		if (this.chunks.length === 0) {
			new Notice("Não há texto legível nesta nota.");
			return;
		}
		if (index < 0 || index >= this.chunks.length) {
			this.stop();
			return;
		}

		this.cleanupCurrentAudio();
		this.systemController.stop();

		this.currentIndex = index;
		this.status = "loading";
		this.errorMessage = null;
		const sessionId = ++this.playbackSessionId;
		this.notify();

		const chunk = this.chunks[index];
		if (this.onActiveChunkChanged) {
			this.onActiveChunkChanged(chunk);
		}

		if (this.settings.engine === "system") {
			this.status = "playing";
			this.notify();
			this.systemController.speak(
				chunk.spokenText,
				this.settings.systemVoiceURI,
				this.settings.playbackRate,
				() => {
					if (this.playbackSessionId !== sessionId) return;
					if (this.currentIndex + 1 < this.chunks.length) {
						this.playFromIndex(this.currentIndex + 1);
					} else {
						this.status = "idle";
						this.notify();
					}
				},
				(err) => {
					if (this.playbackSessionId !== sessionId) return;
					this.errorMessage = err.message;
					this.status = "idle";
					this.notify();
					new Notice(`Erro no TTS: ${err.message}`);
				}
			);
			return;
		}

		// Piper or Edge engine (HTMLAudioElement based)
		try {
			const audioBuf = await this.getOrSynthesizeAudio(index);
			if (this.playbackSessionId !== sessionId) return;

			// Prefetch next chunk in background while current one plays
			if (
				this.settings.prefetchNextChunk &&
				index + 1 < this.chunks.length
			) {
				this.getOrSynthesizeAudio(index + 1).catch(() => {
					// Ignore prefetch errors until chunk is actually played
				});
			}

			const mimeType =
				this.settings.engine === "edge" ? "audio/mpeg" : "audio/wav";
			const blob = new Blob([new Uint8Array(audioBuf)], { type: mimeType });
			this.currentObjectUrl = URL.createObjectURL(blob);

			const audio = new Audio(this.currentObjectUrl);
			audio.playbackRate = this.settings.playbackRate;
			audio.preservesPitch = true;
			this.audioEl = audio;

			audio.onended = () => {
				if (this.playbackSessionId !== sessionId) return;
				if (this.currentIndex + 1 < this.chunks.length) {
					this.playFromIndex(this.currentIndex + 1);
				} else {
					this.cleanupCurrentAudio();
					this.status = "idle";
					this.notify();
				}
			};

			audio.onerror = () => {
				if (this.playbackSessionId !== sessionId) return;
				this.errorMessage = "Falha ao reproduzir o buffer de áudio.";
				this.status = "idle";
				this.notify();
			};

			this.status = "playing";
			this.notify();
			await audio.play();
		} catch (err: any) {
			if (this.playbackSessionId !== sessionId) return;
			const msg = err?.message || String(err);
			this.errorMessage = msg;
			this.status = "idle";
			this.notify();
			new Notice(`Erro ao gerar voz: ${msg}`);
		}
	}

	private getCacheKey(index: number): string {
		const chunk = this.chunks[index];
		const voiceKey =
			this.settings.engine === "edge"
				? this.settings.edgeVoice
				: `${this.settings.piperVoiceId}-${this.settings.piperLengthScale}`;
		return `${this.settings.engine}:${voiceKey}:${index}:${chunk.spokenText}`;
	}

	private getOrSynthesizeAudio(index: number): Promise<Buffer> {
		const key = this.getCacheKey(index);
		const existing = this.audioCache.get(key);
		if (existing) {
			return existing;
		}

		// Keep cache bounded to 20 entries
		if (this.audioCache.size > 20) {
			const firstKey = this.audioCache.keys().next().value;
			if (firstKey) this.audioCache.delete(firstKey);
		}

		const chunk = this.chunks[index];
		const promise =
			this.settings.engine === "edge"
				? synthesizeEdgeTTS(chunk.spokenText, this.settings.edgeVoice)
				: synthesizePiperTTS(
						chunk.spokenText,
						this.pluginDir,
						this.settings
					);

		// Remove from cache if rejected so user can retry
		const handled = promise.catch((err) => {
			this.audioCache.delete(key);
			throw err;
		});

		this.audioCache.set(key, handled);
		return handled;
	}

	public async togglePlayPause(): Promise<void> {
		if (this.status === "playing") {
			this.pause();
		} else if (this.status === "paused") {
			this.resume();
		} else if (this.status === "idle") {
			const startIdx =
				this.currentIndex >= 0 && this.currentIndex < this.chunks.length
					? this.currentIndex
					: 0;
			await this.playFromIndex(startIdx);
		}
	}

	public pause(): void {
		if (this.status !== "playing") return;
		if (this.settings.engine === "system") {
			this.systemController.pause();
		} else if (this.audioEl) {
			this.audioEl.pause();
		}
		this.status = "paused";
		this.notify();
	}

	public resume(): void {
		if (this.status !== "paused") return;
		if (this.settings.engine === "system") {
			this.systemController.resume();
			this.status = "playing";
			this.notify();
		} else if (this.audioEl) {
			this.audioEl.playbackRate = this.settings.playbackRate;
			this.audioEl.play();
			this.status = "playing";
			this.notify();
		} else {
			this.playFromIndex(Math.max(0, this.currentIndex));
		}
	}

	public stop(): void {
		this.playbackSessionId++;
		this.cleanupCurrentAudio();
		this.systemController.stop();
		this.status = "idle";
		this.notify();
	}

	public async next(): Promise<void> {
		if (this.chunks.length === 0) return;
		const nextIdx = Math.min(this.chunks.length - 1, this.currentIndex + 1);
		await this.playFromIndex(nextIdx);
	}

	public async previous(): Promise<void> {
		if (this.chunks.length === 0) return;
		const prevIdx = Math.max(0, this.currentIndex - 1);
		await this.playFromIndex(prevIdx);
	}

	public setPlaybackRate(rate: number): void {
		this.settings.playbackRate = rate;
		if (this.audioEl) {
			this.audioEl.playbackRate = rate;
		} else if (
			this.settings.engine === "system" &&
			this.status === "playing" &&
			this.currentIndex >= 0
		) {
			this.playFromIndex(this.currentIndex);
		}
		this.notify();
	}

	private cleanupCurrentAudio(): void {
		if (this.audioEl) {
			this.audioEl.onended = null;
			this.audioEl.onerror = null;
			this.audioEl.pause();
			this.audioEl.src = "";
			this.audioEl = null;
		}
		if (this.currentObjectUrl) {
			URL.revokeObjectURL(this.currentObjectUrl);
			this.currentObjectUrl = null;
		}
	}
}
