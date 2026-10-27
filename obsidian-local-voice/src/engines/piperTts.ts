import * as child_process from "child_process";
import * as fs from "fs";
import * as https from "https";
import * as http from "http";
import * as os from "os";
import * as path from "path";
import * as crypto from "crypto";
import { LocalVoiceSettings, PIPER_MODELS, PiperVoiceModelInfo } from "../types";

const PIPER_WIN_ZIP_URL =
	"https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_windows_amd64.zip";

export function getPiperBaseDir(pluginDir: string): string {
	return path.join(pluginDir, "piper-local");
}

export function getPiperModelsDir(pluginDir: string): string {
	return path.join(getPiperBaseDir(pluginDir), "models");
}

export function resolvePiperExePath(
	pluginDir: string,
	settings: LocalVoiceSettings
): string | null {
	if (
		settings.customPiperExePath &&
		fs.existsSync(settings.customPiperExePath)
	) {
		return settings.customPiperExePath;
	}
	const baseDir = getPiperBaseDir(pluginDir);
	const candidate1 = path.join(baseDir, "piper", "piper.exe");
	if (fs.existsSync(candidate1)) return candidate1;

	const candidate2 = path.join(baseDir, "piper.exe");
	if (fs.existsSync(candidate2)) return candidate2;

	return null;
}

export function resolvePiperModelPath(
	pluginDir: string,
	settings: LocalVoiceSettings
): string | null {
	if (
		settings.customPiperModelPath &&
		fs.existsSync(settings.customPiperModelPath)
	) {
		return settings.customPiperModelPath;
	}
	const modelsDir = getPiperModelsDir(pluginDir);
	const candidate = path.join(modelsDir, `${settings.piperVoiceId}.onnx`);
	const candidateJson = `${candidate}.json`;
	if (fs.existsSync(candidate) && fs.existsSync(candidateJson)) {
		return candidate;
	}
	return null;
}

export function isPiperReady(
	pluginDir: string,
	settings: LocalVoiceSettings
): boolean {
	return (
		resolvePiperExePath(pluginDir, settings) !== null &&
		resolvePiperModelPath(pluginDir, settings) !== null
	);
}

export function isVoiceModelInstalled(
	pluginDir: string,
	voiceId: string
): boolean {
	const modelsDir = getPiperModelsDir(pluginDir);
	const onnx = path.join(modelsDir, `${voiceId}.onnx`);
	const json = path.join(modelsDir, `${voiceId}.onnx.json`);
	return fs.existsSync(onnx) && fs.existsSync(json);
}

/**
 * Downloads a file following HTTP 301/302/303/307/308 redirects (including relative URLs).
 */
export function downloadFileWithProgress(
	urlStr: string,
	destPath: string,
	onProgress?: (downloadedBytes: number, totalBytes: number) => void,
	maxRedirects = 10
): Promise<void> {
	return new Promise((resolve, reject) => {
		if (maxRedirects <= 0) {
			reject(new Error("Muitos redirecionamentos ao baixar arquivo."));
			return;
		}

		const parsedUrl = new URL(urlStr);
		const client = parsedUrl.protocol === "https:" ? https : http;

		const req = client.get(
			urlStr,
			{
				headers: {
					"User-Agent": "Obsidian-Local-Voice-Plugin/1.0",
				},
			},
			(res) => {
				if (
					res.statusCode &&
					[301, 302, 303, 307, 308].includes(res.statusCode) &&
					res.headers.location
				) {
					res.resume();
					const redirectUrl = new URL(res.headers.location, urlStr).toString();
					downloadFileWithProgress(
						redirectUrl,
						destPath,
						onProgress,
						maxRedirects - 1
					)
						.then(resolve)
						.catch(reject);
					return;
				}

				if (res.statusCode !== 200) {
					res.resume();
					reject(
						new Error(
							`Falha no download (${res.statusCode}) em: ${urlStr}`
						)
					);
					return;
				}

				const totalBytes = parseInt(res.headers["content-length"] || "0", 10);
				let downloadedBytes = 0;

				fs.mkdirSync(path.dirname(destPath), { recursive: true });
				const tempPath = `${destPath}.part`;
				const fileStream = fs.createWriteStream(tempPath);

				res.on("data", (chunk: Buffer) => {
					downloadedBytes += chunk.length;
					if (onProgress) {
						onProgress(downloadedBytes, totalBytes);
					}
				});

				res.pipe(fileStream);

				fileStream.on("finish", () => {
					fileStream.close(() => {
						try {
							if (fs.existsSync(destPath)) {
								fs.unlinkSync(destPath);
							}
							fs.renameSync(tempPath, destPath);
							resolve();
						} catch (err) {
							reject(err);
						}
					});
				});

				fileStream.on("error", (err) => {
					try {
						if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
					} catch {
						// ignore
					}
					reject(err);
				});
			}
		);

		req.on("error", (err) => reject(err));
	});
}

/**
 * Installs Piper Windows binary and the selected voice model automatically.
 */
export async function installPiperAndVoice(
	pluginDir: string,
	voiceId: string,
	onStatus: (statusText: string) => void
): Promise<void> {
	const baseDir = getPiperBaseDir(pluginDir);
	const modelsDir = getPiperModelsDir(pluginDir);
	fs.mkdirSync(baseDir, { recursive: true });
	fs.mkdirSync(modelsDir, { recursive: true });

	const piperExe = path.join(baseDir, "piper", "piper.exe");
	if (!fs.existsSync(piperExe)) {
		const zipPath = path.join(baseDir, "piper_windows_amd64.zip");
		onStatus("Baixando motor Piper TTS (Windows)...");
		await downloadFileWithProgress(
			PIPER_WIN_ZIP_URL,
			zipPath,
			(downloaded, total) => {
				if (total > 0) {
					const pct = Math.round((downloaded / total) * 100);
					onStatus(`Baixando motor Piper TTS: ${pct}%`);
				} else {
					const mb = (downloaded / (1024 * 1024)).toFixed(1);
					onStatus(`Baixando motor Piper TTS: ${mb} MB`);
				}
			}
		);

		onStatus("Extraindo motor Piper TTS...");
		await new Promise<void>((resolve, reject) => {
			const ps = child_process.spawn("powershell.exe", [
				"-NoProfile",
				"-NonInteractive",
				"-Command",
				`Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${baseDir.replace(/'/g, "''")}' -Force`,
			]);
			let stderr = "";
			ps.stderr.on("data", (d) => (stderr += d.toString()));
			ps.on("close", (code) => {
				try {
					if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
				} catch {
					// ignore
				}
				if (code === 0 && fs.existsSync(piperExe)) {
					resolve();
				} else {
					reject(
						new Error(
							`Erro ao extrair Piper ZIP (código ${code}): ${stderr}`
						)
					);
				}
			});
			ps.on("error", reject);
		});
	}

	const voiceInfo: PiperVoiceModelInfo =
		PIPER_MODELS.find((m) => m.id === voiceId) || PIPER_MODELS[0];

	const onnxDest = path.join(modelsDir, `${voiceInfo.id}.onnx`);
	const jsonDest = path.join(modelsDir, `${voiceInfo.id}.onnx.json`);

	if (!fs.existsSync(jsonDest)) {
		onStatus(`Baixando configuração da voz (${voiceInfo.id})...`);
		await downloadFileWithProgress(voiceInfo.jsonUrl, jsonDest);
	}

	if (!fs.existsSync(onnxDest)) {
		onStatus(`Baixando modelo de voz ${voiceInfo.name}...`);
		await downloadFileWithProgress(
			voiceInfo.onnxUrl,
			onnxDest,
			(downloaded, total) => {
				if (total > 0) {
					const pct = Math.round((downloaded / total) * 100);
					const mb = (downloaded / (1024 * 1024)).toFixed(1);
					const totalMb = (total / (1024 * 1024)).toFixed(1);
					onStatus(
						`Baixando voz ${voiceInfo.id}: ${pct}% (${mb}/${totalMb} MB)`
					);
				} else {
					const mb = (downloaded / (1024 * 1024)).toFixed(1);
					onStatus(`Baixando voz ${voiceInfo.id}: ${mb} MB`);
				}
			}
		);
	}

	onStatus("Piper TTS instalado e pronto para uso offline!");
}

/**
 * Synthesizes speech 100% locally using Piper TTS executable.
 * Returns a Buffer containing WAV audio data.
 */
export async function synthesizePiperTTS(
	text: string,
	pluginDir: string,
	settings: LocalVoiceSettings
): Promise<Buffer> {
	const exePath = resolvePiperExePath(pluginDir, settings);
	if (!exePath) {
		throw new Error(
			"Executável do Piper TTS não encontrado. Clique em 'Instalar Piper + Voz Offline' na aba lateral ou nas configurações."
		);
	}

	const modelPath = resolvePiperModelPath(pluginDir, settings);
	if (!modelPath) {
		throw new Error(
			`Modelo de voz '${settings.piperVoiceId}' não encontrado. Baixe a voz nas configurações do plugin.`
		);
	}

	const tempWav = path.join(
		os.tmpdir(),
		`obsidian-voice-${crypto.randomUUID()}.wav`
	);

	return new Promise((resolve, reject) => {
		const args = [
			"--model",
			modelPath,
			"--output_file",
			tempWav,
			"--length_scale",
			String(settings.piperLengthScale || 1.0),
		];

		const child = child_process.spawn(exePath, args, {
			cwd: path.dirname(exePath),
			windowsHide: true,
		});

		let stderr = "";
		child.stderr.on("data", (d) => {
			stderr += d.toString();
		});

		child.on("error", (err) => {
			reject(new Error(`Falha ao executar Piper TTS: ${err.message}`));
		});

		child.on("close", (code) => {
			try {
				if (code === 0 && fs.existsSync(tempWav)) {
					const wavBuffer = fs.readFileSync(tempWav);
					try {
						fs.unlinkSync(tempWav);
					} catch {
						// ignore
					}
					if (wavBuffer.length > 44) {
						resolve(wavBuffer);
					} else {
						reject(
							new Error("Piper TTS gerou um arquivo de áudio vazio.")
						);
					}
				} else {
					try {
						if (fs.existsSync(tempWav)) fs.unlinkSync(tempWav);
					} catch {
						// ignore
					}
					reject(
						new Error(
							`Piper TTS encerrou com código ${code}: ${stderr.trim()}`
						)
					);
				}
			} catch (err: any) {
				reject(err);
			}
		});

		// Write UTF-8 text to stdin and close stdin
		const cleanSingleLine = text.replace(/\r?\n/g, " ").trim() + "\n";
		child.stdin.write(Buffer.from(cleanSingleLine, "utf8"));
		child.stdin.end();
	});
}
