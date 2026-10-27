export type TTSEngineType = "piper" | "edge" | "system";

export type PlaybackStatus = "idle" | "loading" | "playing" | "paused";

export type ReadSourceMode = "full-note" | "selection" | "from-cursor";

export interface ParagraphChunk {
	index: number;
	/** Clean text to be spoken by TTS */
	spokenText: string;
	/** Display text shown in the sidebar transcript */
	displayText: string;
	/** Whether this chunk is a heading */
	isHeading: boolean;
	headingLevel?: number;
	/** Line range in the original Markdown editor */
	startLine: number;
	endLine: number;
}

export interface PiperVoiceModelInfo {
	id: string;
	name: string;
	language: string;
	quality: string;
	sizeLabel: string;
	onnxUrl: string;
	jsonUrl: string;
}

export interface EdgeVoiceInfo {
	shortName: string;
	friendlyName: string;
	locale: string;
	gender: string;
}

export interface LocalVoiceSettings {
	engine: TTSEngineType;
	playbackRate: number;
	// Piper settings
	piperVoiceId: string;
	customPiperExePath: string;
	customPiperModelPath: string;
	piperLengthScale: number;
	// Edge TTS settings
	edgeVoice: string;
	// System Web Speech settings
	systemVoiceURI: string;
	// Cleaning & UI behavior
	autoScrollSidebar: boolean;
	scrollEditorWithPlayback: boolean;
	ignoreCodeBlocks: boolean;
	ignoreFrontmatter: boolean;
	ignoreUrls: boolean;
	ignoreTables: boolean;
	ignoreCalloutHeaders: boolean;
	prefetchNextChunk: boolean;
}

export const DEFAULT_SETTINGS: LocalVoiceSettings = {
	engine: "edge",
	playbackRate: 1.0,
	piperVoiceId: "pt_BR-faber-medium",
	customPiperExePath: "",
	customPiperModelPath: "",
	piperLengthScale: 1.0,
	edgeVoice: "pt-BR-AntonioNeural",
	systemVoiceURI: "",
	autoScrollSidebar: true,
	scrollEditorWithPlayback: true,
	ignoreCodeBlocks: true,
	ignoreFrontmatter: true,
	ignoreUrls: true,
	ignoreTables: false,
	ignoreCalloutHeaders: false,
	prefetchNextChunk: true,
};

export const PIPER_MODELS: PiperVoiceModelInfo[] = [
	{
		id: "pt_BR-faber-medium",
		name: "Faber (Português Brasil - Masculina Natural)",
		language: "pt-BR",
		quality: "Medium (Recomendado)",
		sizeLabel: "~63 MB",
		onnxUrl:
			"https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx",
		jsonUrl:
			"https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx.json",
	},
	{
		id: "pt_BR-cadu-medium",
		name: "Cadu (Português Brasil - Masculina Expressiva)",
		language: "pt-BR",
		quality: "Medium",
		sizeLabel: "~63 MB",
		onnxUrl:
			"https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/cadu/medium/pt_BR-cadu-medium.onnx",
		jsonUrl:
			"https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/cadu/medium/pt_BR-cadu-medium.onnx.json",
	},
	{
		id: "pt_BR-edresson-low",
		name: "Edresson (Português Brasil - Ultra Leve/Rápida)",
		language: "pt-BR",
		quality: "Low",
		sizeLabel: "~63 MB",
		onnxUrl:
			"https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/edresson/low/pt_BR-edresson-low.onnx",
		jsonUrl:
			"https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/edresson/low/pt_BR-edresson-low.onnx.json",
	},
	{
		id: "pt_PT-tugao-medium",
		name: "Tugão (Português Portugal - Masculina)",
		language: "pt-PT",
		quality: "Medium",
		sizeLabel: "~63 MB",
		onnxUrl:
			"https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_PT/tugao/medium/pt_PT-tugao-medium.onnx",
		jsonUrl:
			"https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_PT/tugao/medium/pt_PT-tugao-medium.onnx.json",
	},
	{
		id: "en_US-lessac-medium",
		name: "Lessac (Inglês EUA - Feminina Natural)",
		language: "en-US",
		quality: "Medium",
		sizeLabel: "~63 MB",
		onnxUrl:
			"https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx",
		jsonUrl:
			"https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json",
	},
];

export const CURATED_EDGE_VOICES: EdgeVoiceInfo[] = [
	{
		shortName: "pt-BR-AntonioNeural",
		friendlyName: "🇧🇷 Antônio Neural (Português Brasil - Masculina)",
		locale: "pt-BR",
		gender: "Male",
	},
	{
		shortName: "pt-BR-FranciscaNeural",
		friendlyName: "🇧🇷 Francisca Neural (Português Brasil - Feminina)",
		locale: "pt-BR",
		gender: "Female",
	},
	{
		shortName: "pt-BR-ThalitaMultilingualNeural",
		friendlyName: "🇧🇷 Thalita Multilíngue (Português/Inglês - Feminina)",
		locale: "pt-BR",
		gender: "Female",
	},
	{
		shortName: "pt-PT-DuarteNeural",
		friendlyName: "🇵🇹 Duarte Neural (Português Portugal - Masculina)",
		locale: "pt-PT",
		gender: "Male",
	},
	{
		shortName: "pt-PT-RaquelNeural",
		friendlyName: "🇵🇹 Raquel Neural (Português Portugal - Feminina)",
		locale: "pt-PT",
		gender: "Female",
	},
	{
		shortName: "en-US-AndrewMultilingualNeural",
		friendlyName: "🇺🇸 Andrew Multilíngue (Inglês EUA - Masculina)",
		locale: "en-US",
		gender: "Male",
	},
	{
		shortName: "en-US-EmmaMultilingualNeural",
		friendlyName: "🇺🇸 Emma Multilíngue (Inglês EUA - Feminina)",
		locale: "en-US",
		gender: "Female",
	},
	{
		shortName: "es-ES-AlvaroNeural",
		friendlyName: "🇪🇸 Álvaro Neural (Espanhol - Masculina)",
		locale: "es-ES",
		gender: "Male",
	},
];
