export interface SystemVoiceOption {
	voiceURI: string;
	name: string;
	lang: string;
}

export function getSystemVoices(): SystemVoiceOption[] {
	if (typeof window === "undefined" || !("speechSynthesis" in window)) {
		return [];
	}
	const voices = window.speechSynthesis.getVoices();
	const mapped = voices.map((v) => ({
		voiceURI: v.voiceURI,
		name: `${v.name} (${v.lang})`,
		lang: v.lang,
	}));
	// Sort Portuguese and English first
	mapped.sort((a, b) => {
		const aPt = a.lang.toLowerCase().startsWith("pt")
			? 0
			: a.lang.toLowerCase().startsWith("en")
				? 1
				: 2;
		const bPt = b.lang.toLowerCase().startsWith("pt")
			? 0
			: b.lang.toLowerCase().startsWith("en")
				? 1
				: 2;
		if (aPt !== bPt) return aPt - bPt;
		return a.name.localeCompare(b.name);
	});
	return mapped;
}

export class SystemSpeechController {
	private currentUtterance: SpeechSynthesisUtterance | null = null;

	public speak(
		text: string,
		voiceURI: string,
		rate: number,
		onEnd: () => void,
		onError: (err: Error) => void
	): void {
		this.stop();

		if (typeof window === "undefined" || !("speechSynthesis" in window)) {
			onError(new Error("Web Speech API não está disponível neste ambiente."));
			return;
		}

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.rate = Math.max(0.5, Math.min(3.0, rate));

		const voices = window.speechSynthesis.getVoices();
		if (voiceURI) {
			const matched = voices.find((v) => v.voiceURI === voiceURI);
			if (matched) {
				utterance.voice = matched;
				utterance.lang = matched.lang;
			}
		}
		if (!utterance.voice) {
			const ptVoice =
				voices.find((v) => v.lang.toLowerCase() === "pt-br") ||
				voices.find((v) => v.lang.toLowerCase().startsWith("pt"));
			if (ptVoice) {
				utterance.voice = ptVoice;
				utterance.lang = ptVoice.lang;
			} else {
				utterance.lang = "pt-BR";
			}
		}

		utterance.onend = () => {
			if (this.currentUtterance === utterance) {
				this.currentUtterance = null;
				onEnd();
			}
		};

		utterance.onerror = (ev) => {
			if (ev.error === "canceled" || ev.error === "interrupted") {
				return;
			}
			if (this.currentUtterance === utterance) {
				this.currentUtterance = null;
				onError(new Error(`Erro na voz do sistema: ${ev.error}`));
			}
		};

		this.currentUtterance = utterance;
		window.speechSynthesis.speak(utterance);
	}

	public pause(): void {
		if (typeof window !== "undefined" && "speechSynthesis" in window) {
			window.speechSynthesis.pause();
		}
	}

	public resume(): void {
		if (typeof window !== "undefined" && "speechSynthesis" in window) {
			window.speechSynthesis.resume();
		}
	}

	public stop(): void {
		this.currentUtterance = null;
		if (typeof window !== "undefined" && "speechSynthesis" in window) {
			window.speechSynthesis.cancel();
		}
	}
}
