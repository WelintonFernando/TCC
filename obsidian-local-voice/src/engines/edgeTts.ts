import * as crypto from "crypto";
import * as tls from "tls";
import * as https from "https";
import { EdgeVoiceInfo, CURATED_EDGE_VOICES } from "../types";

const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const WIN_EPOCH = 11644473600;
const CHROMIUM_FULL_VERSION = "143.0.3650.75";
const CHROMIUM_MAJOR_VERSION = "143";
const SEC_MS_GEC_VERSION = `2-${CHROMIUM_FULL_VERSION}`;
const EDGE_HOST = "speech.platform.bing.com";

const SHA256_INITIAL = [
	0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
	0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
];
const SHA256_STATE = [
	0xfd9fbea2, 0x91243ce7, 0xbe499094, 0xcd2e1e0a,
	0x6c006f49, 0x04bd35ab, 0xfeb0a7e4, 0x03effbd2,
];
const SHA256_SCHEDULE = [
	0xeb24bf9e, 0x1558691f, 0xa0c09ee2, 0x0cfa32ba,
	0xa622ee8c, 0xd1dd9491, 0xc0dd25a0, 0xf9e70ab6,
	0xf0c31573, 0x7058ce4e, 0x7188e606, 0x00e5ab33,
	0xd258b060, 0x72766564,
];
const SHA256_ROUND_CONSTANTS = [
	0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];
const SHA256_ADJUSTMENT = 0xc9dc06a7;
const SHA256_BLOCK_CONSTANTS = [
	...SHA256_ROUND_CONSTANTS.slice(0, 14),
	SHA256_ADJUSTMENT,
	...SHA256_ROUND_CONSTANTS.slice(15),
];
const SHA256_SIGMA0_ADJUSTMENT = 0x059c0b80;
const SHA256_SIGMA1_ADJUSTMENT = 0x000b92c0;

const CS64_COEFFICIENTS: [number, number][] = [
	[0xe82e91b1, 0xb32700d0],
	[0x44de24c6, 0x88dff51d],
	[0x3beb65bc, 0x29514038],
	[0xc89c5933, 0xb328cbdf],
	[0x8d1ec211, 0xd405b4d5],
	[0x314ef5d5, 0x26e55f3c],
	[0xe92491b1, 0x607801c6],
	[0xf0a5b9d5, 0x82b2c1fb],
	[0x06064cf3, 0xfa51a3da],
	[0xda79fa60, 0x207cc464],
	[0xbed20560, 0x3c3c74f3],
	[0x89f9c9f8, 0xd2d14b61],
	[0x35fa38c6, 0xbb04a2c1],
	[0xcb49e3c6, 0xc5626167],
];
const CS64_FACTOR = 0x82893933;
const CS64_ADJUSTMENT0 = 0xf2f90b1a;
const CS64_ADJUSTMENT1 = 0x0b1a0000;

function mul32(a: number, b: number): number {
	return Math.imul(a, b) >>> 0;
}
function rol16(v: number): number {
	v = v >>> 0;
	return ((v << 16) | (v >>> 16)) >>> 0;
}
function rotr(v: number, n: number): number {
	v = v >>> 0;
	return ((v >>> n) | (v << (32 - n))) >>> 0;
}
function sigma0(v: number): number {
	v = v >>> 0;
	return (rotr(v, 7) ^ rotr(v, 18) ^ (v >>> 3)) >>> 0;
}
function sigma1(v: number): number {
	v = v >>> 0;
	return (rotr(v, 17) ^ rotr(v, 19) ^ (v >>> 10)) >>> 0;
}

function expandSchedule(words: number[], firstWord = 16): void {
	for (let i = firstWord; i < 64; i++) {
		words.push(
			(sigma1(words[i - 2]) +
				words[i - 7] +
				sigma0(words[i - 15]) +
				words[i - 16]) >>>
				0
		);
	}
}

function sha256Rounds(
	state: number[],
	words: number[],
	firstRound = 0
): number[] {
	let [a, b, c, d, e, f, g, h] = state;
	const constants =
		firstRound === 14 ? SHA256_BLOCK_CONSTANTS : SHA256_ROUND_CONSTANTS;
	for (let i = firstRound; i < 64; i++) {
		const S1 = (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) >>> 0;
		const ch = (g ^ (e & (f ^ g))) >>> 0;
		const t1 = (h + S1 + ch + constants[i] + words[i]) >>> 0;
		const S0 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) >>> 0;
		const maj = ((a & b) | (c & (a | b))) >>> 0;
		const t2 = (S0 + maj) >>> 0;
		h = g;
		g = f;
		f = e;
		e = (d + t1) >>> 0;
		d = c;
		c = b;
		b = a;
		a = (t1 + t2) >>> 0;
	}
	return [a, b, c, d, e, f, g, h];
}

function sha256Init(data7: Buffer): number[] {
	const words: number[] = new Array(14).fill(0);
	words.push(((data7[0] << 16) | (data7[1] << 8) | data7[2]) >>> 0);
	words.push(data7.readUInt32BE(3));
	for (let i = 16; i < 30; i++) {
		let val = SHA256_SCHEDULE[i - 16];
		if (i - 2 >= 14) {
			val =
				(val +
					(i === 16
						? (sigma1(words[i - 2]) ^ SHA256_SIGMA1_ADJUSTMENT) >>> 0
						: sigma1(words[i - 2]))) >>>
				0;
		}
		if (i - 7 >= 14) {
			val = (val + words[i - 7]) >>> 0;
		}
		if (i - 15 >= 14) {
			val =
				(val +
					(i === 29
						? (sigma0(words[i - 15]) ^ SHA256_SIGMA0_ADJUSTMENT) >>> 0
						: sigma0(words[i - 15]))) >>>
				0;
		}
		words.push(val >>> 0);
	}
	words.push(
		(sigma1(words[28]) +
			words[23] +
			sigma0(words[15]) +
			words[14] +
			SHA256_ADJUSTMENT -
			SHA256_ROUND_CONSTANTS[14]) >>>
			0
	);
	expandSchedule(words, 31);
	const working = sha256Rounds(SHA256_STATE, words, 14);
	return SHA256_INITIAL.map((x, idx) => (x + working[idx]) >>> 0);
}

function sha256Digest(data: Buffer): Buffer {
	const length = 57 + data.length;
	const rest = data.subarray(7);
	const padZeroLen = (((55 - length) % 64) + 64) % 64;
	const padded = Buffer.alloc(rest.length + 1 + padZeroLen + 8);
	rest.copy(padded, 0);
	padded[rest.length] = 0x80;
	padded.writeBigUInt64BE(BigInt(length * 8), padded.length - 8);
	let state = sha256Init(data.subarray(0, 7));
	for (let offset = 0; offset < padded.length; offset += 64) {
		const words: number[] = [];
		for (let j = 0; j < 16; j++) {
			words.push(padded.readUInt32BE(offset + j * 4));
		}
		expandSchedule(words, 16);
		const working = sha256Rounds(state, words, 0);
		state = state.map((x, idx) => (x + working[idx]) >>> 0);
	}
	const out = Buffer.alloc(32);
	state.forEach((v, idx) => out.writeUInt32BE(v >>> 0, idx * 4));
	return out;
}

function wordsLe4Even(data: Buffer): number[] {
	const pad = (4 - (data.length % 4)) % 4;
	const buf = pad ? Buffer.concat([data, Buffer.alloc(pad)]) : data;
	const words: number[] = [];
	for (let i = 0; i < buf.length; i += 4) {
		words.push(buf.readUInt32LE(i));
	}
	if (words.length % 2 !== 0) words.push(0);
	return words;
}

function cs64Digest(data: Buffer, digest: Buffer): string {
	const keyA = (digest.readUInt32LE(0) | 1) >>> 0;
	const keyB = (digest.readUInt32LE(4) | 1) >>> 0;
	const factors = [mul32(keyA, CS64_FACTOR), mul32(keyB, CS64_FACTOR)];
	const terms = CS64_COEFFICIENTS.map(([coeff], idx) =>
		mul32(coeff, factors[idx % 2])
	);
	const offsets = CS64_COEFFICIENTS.map(([, off]) => off >>> 0);
	const words = wordsLe4Even(Buffer.concat([Buffer.from([0]), data]));
	for (let idx = 0; idx < words.length; idx++) {
		const word = words[idx];
		let term = mul32(word, idx % 2 === 0 ? keyA : keyB);
		let offset = mul32(rol16(word), idx % 2 === 0 ? 0xef0569fb : 0xc31713db);
		if (idx === 0) {
			term = (term + mul32(CS64_ADJUSTMENT0, factors[0])) >>> 0;
			offset = (offset + CS64_ADJUSTMENT1) >>> 0;
		}
		terms.push(term);
		offsets.push(offset);
	}
	let swapAcc = 0,
		swapLast = 0,
		state = 0,
		acc = 0;
	for (let idx = 0; idx < terms.length; idx += 2) {
		const x = terms[idx],
			y = terms[idx + 1];
		let t = rol16((offsets[idx] + x) >>> 0);
		let q = mul32(t, 0x76f50f34);
		swapAcc = (swapAcc + ((mul32(rol16(q), 0xc3efea97) + q) >>> 0)) >>> 0;
		t = rol16((offsets[idx + 1] + y) >>> 0);
		q = mul32(t, 0x1881ce3c);
		swapLast = (mul32(rol16(q), 0x35bd1ec9) + q) >>> 0;
		swapAcc = (swapAcc + swapLast) >>> 0;

		state = (mul32(state, keyA) + x) >>> 0;
		state = mul32(rol16(state), 0xcf98b111);
		state = mul32(rol16(state), 0x87085b9f);
		state = mul32(rol16(state), 0x12ceb96d);
		state = mul32(rol16(state), 0x257e1d83);
		acc = (acc + state) >>> 0;
		t = (mul32(state, keyB) + y) >>> 0;
		t = mul32(rol16(t), 0xa27416f5);
		t = mul32(rol16(t), 0xd38396ff);
		state = mul32(rol16(mul32(rol16(t), 0x7c932b89)), 0xbfa49f69);
		acc = (acc + state) >>> 0;
	}
	const out = Buffer.alloc(8);
	out.writeUInt32LE((swapLast ^ state) >>> 0, 0);
	out.writeUInt32LE((swapAcc ^ acc) >>> 0, 4);
	return out.toString("hex").toUpperCase();
}

let clockSkewSeconds = 0;

export function generateSecMsGecV2(): string {
	let ticks = Math.floor(Date.now() / 1000 + clockSkewSeconds) + WIN_EPOCH;
	ticks -= ticks % 300;
	ticks *= 1e7;
	const data = Buffer.from(ticks.toFixed(0) + TRUSTED_CLIENT_TOKEN, "ascii");
	const digest = sha256Digest(data);
	const cs64 = cs64Digest(data, digest);
	return `${cs64}-${digest.toString("hex").toUpperCase()}`;
}

function escapeXml(unsafe: string): string {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function encodeWsTextFrame(text: string): Buffer {
	const payload = Buffer.from(text, "utf8");
	const mask = crypto.randomBytes(4);
	let header: Buffer;
	if (payload.length < 126) {
		header = Buffer.alloc(2);
		header[0] = 0x81; // FIN + Text frame
		header[1] = 0x80 | payload.length;
	} else if (payload.length < 65536) {
		header = Buffer.alloc(4);
		header[0] = 0x81;
		header[1] = 0x80 | 126;
		header.writeUInt16BE(payload.length, 2);
	} else {
		header = Buffer.alloc(10);
		header[0] = 0x81;
		header[1] = 0x80 | 127;
		header.writeBigUInt64BE(BigInt(payload.length), 2);
	}
	const maskedPayload = Buffer.alloc(payload.length);
	for (let i = 0; i < payload.length; i++) {
		maskedPayload[i] = payload[i] ^ mask[i % 4];
	}
	return Buffer.concat([header, mask, maskedPayload]);
}

async function syncClockSkew(): Promise<void> {
	return new Promise((resolve) => {
		const req = https.get(
			`https://${EDGE_HOST}/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=${TRUSTED_CLIENT_TOKEN}`,
			{
				headers: {
					"User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROMIUM_MAJOR_VERSION}.0.0.0 Safari/537.36 Edg/${CHROMIUM_MAJOR_VERSION}.0.0.0`,
				},
			},
			(res) => {
				if (res.headers.date) {
					const serverTime = Date.parse(res.headers.date) / 1000;
					if (!isNaN(serverTime)) {
						clockSkewSeconds = serverTime - Date.now() / 1000;
					}
				}
				res.resume();
				resolve();
			}
		);
		req.on("error", () => resolve());
		req.setTimeout(4000, () => {
			req.destroy();
			resolve();
		});
	});
}

/**
 * Synthesizes speech using Microsoft Edge Read Aloud neural voices without any API key.
 * Returns a Buffer containing MP3 audio data (audio-24khz-48kbitrate-mono-mp3).
 */
export async function synthesizeEdgeTTS(
	text: string,
	voice = "pt-BR-AntonioNeural",
	retryOnSkew = true
): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const secMsGec = generateSecMsGecV2();
		const connId = crypto.randomUUID().replace(/-/g, "");
		const reqId = crypto.randomUUID().replace(/-/g, "");
		const muid = crypto.randomBytes(16).toString("hex").toUpperCase();
		const wsKey = crypto.randomBytes(16).toString("base64");

		const wsPath =
			`/consumer/speech/synthesize/readaloud/edge/v1` +
			`?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}` +
			`&Sec-MS-GEC=${secMsGec}` +
			`&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}` +
			`&ConnectionId=${connId}`;

		const socket = tls.connect(
			{
				host: EDGE_HOST,
				port: 443,
				servername: EDGE_HOST,
				ALPNProtocols: ["http/1.1"],
			},
			() => {
				const handshake = [
					`GET ${wsPath} HTTP/1.1`,
					`Host: ${EDGE_HOST}`,
					`Upgrade: websocket`,
					`Connection: Upgrade`,
					`Sec-WebSocket-Key: ${wsKey}`,
					`Sec-WebSocket-Version: 13`,
					`Pragma: no-cache`,
					`Cache-Control: no-cache`,
					`Cookie: muid=${muid};`,
					`Origin: chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold`,
					`User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROMIUM_MAJOR_VERSION}.0.0.0 Safari/537.36 Edg/${CHROMIUM_MAJOR_VERSION}.0.0.0`,
					`Accept-Encoding: gzip, deflate, br, zstd`,
					`Accept-Language: en-US,en;q=0.9`,
					`\r\n`,
				].join("\r\n");

				socket.write(handshake);
			}
		);

		let handshakeComplete = false;
		let rawBuffer = Buffer.alloc(0);
		const audioChunks: Buffer[] = [];
		let finished = false;

		const finishWithError = (err: Error) => {
			if (finished) return;
			finished = true;
			socket.destroy();
			reject(err);
		};

		socket.setTimeout(20000, () => {
			finishWithError(new Error("Tempo limite excedido ao conectar ao Edge TTS."));
		});

		socket.on("error", (err) => {
			finishWithError(err);
		});

		socket.on("data", (chunk: Buffer) => {
			rawBuffer = Buffer.concat([rawBuffer, chunk]);

			if (!handshakeComplete) {
				const headerEnd = rawBuffer.indexOf("\r\n\r\n");
				if (headerEnd === -1) return;

				const headerStr = rawBuffer.subarray(0, headerEnd).toString("utf8");
				const firstLine = headerStr.split("\r\n")[0];
				if (!firstLine.includes("101")) {
					socket.destroy();
					if (retryOnSkew) {
						finished = true;
						syncClockSkew()
							.then(() => synthesizeEdgeTTS(text, voice, false))
							.then(resolve)
							.catch(reject);
						return;
					}
					finishWithError(
						new Error(`Falha no handshake do Edge TTS: ${firstLine}`)
					);
					return;
				}

				handshakeComplete = true;
				rawBuffer = rawBuffer.subarray(headerEnd + 4);

				// Send speech.config
				const timestamp = new Date().toString();
				const configMsg =
					`X-Timestamp:${timestamp}\r\n` +
					`Content-Type:application/json; charset=utf-8\r\n` +
					`Path:speech.config\r\n\r\n` +
					`{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n`;
				socket.write(encodeWsTextFrame(configMsg));

				// Send SSML request
				const ssml =
					`<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='pt-BR'>` +
					`<voice name='${voice}'>` +
					`<prosody pitch='+0Hz' rate='+0%' volume='+0%'>` +
					`${escapeXml(text)}` +
					`</prosody></voice></speak>`;

				const ssmlMsg =
					`X-RequestId:${reqId}\r\n` +
					`Content-Type:application/ssml+xml\r\n` +
					`X-Timestamp:${timestamp}Z\r\n` +
					`Path:ssml\r\n\r\n` +
					ssml;
				socket.write(encodeWsTextFrame(ssmlMsg));
			}

			// Parse WebSocket frames
			while (rawBuffer.length >= 2) {
				const firstByte = rawBuffer[0];
				const opcode = firstByte & 0x0f;
				const secondByte = rawBuffer[1];
				const isMasked = (secondByte & 0x80) !== 0;
				let payloadLen = secondByte & 0x7f;
				let offset = 2;

				if (payloadLen === 126) {
					if (rawBuffer.length < 4) break;
					payloadLen = rawBuffer.readUInt16BE(2);
					offset = 4;
				} else if (payloadLen === 127) {
					if (rawBuffer.length < 10) break;
					payloadLen = Number(rawBuffer.readBigUInt64BE(2));
					offset = 10;
				}

				const maskLen = isMasked ? 4 : 0;
				if (rawBuffer.length < offset + maskLen + payloadLen) {
					break; // Wait for full frame
				}

				let payload = rawBuffer.subarray(
					offset + maskLen,
					offset + maskLen + payloadLen
				);
				if (isMasked) {
					const mask = rawBuffer.subarray(offset, offset + 4);
					payload = Buffer.from(payload);
					for (let i = 0; i < payload.length; i++) {
						payload[i] ^= mask[i % 4];
					}
				}

				rawBuffer = rawBuffer.subarray(offset + maskLen + payloadLen);

				if (opcode === 0x01) {
					// Text frame
					const msg = payload.toString("utf8");
					if (msg.includes("Path:turn.end")) {
						finished = true;
						socket.destroy();
						resolve(Buffer.concat(audioChunks));
						return;
					}
				} else if (opcode === 0x02) {
					// Binary frame (audio data)
					if (payload.length >= 2) {
						const headerLen = payload.readUInt16BE(0);
						const headerText = payload
							.subarray(2, 2 + headerLen)
							.toString("utf8");
						if (headerText.includes("Path:audio")) {
							const audioBytes = payload.subarray(2 + headerLen);
							if (audioBytes.length > 0) {
								audioChunks.push(Buffer.from(audioBytes));
							}
						}
					}
				} else if (opcode === 0x08) {
					// Close frame
					if (!finished) {
						finished = true;
						socket.destroy();
						if (audioChunks.length > 0) {
							resolve(Buffer.concat(audioChunks));
						} else {
							reject(
								new Error("Conexão WebSocket do Edge TTS fechada sem áudio.")
							);
						}
					}
					return;
				}
			}
		});

		socket.on("close", () => {
			if (!finished) {
				finished = true;
				if (audioChunks.length > 0) {
					resolve(Buffer.concat(audioChunks));
				} else {
					reject(new Error("Conexão encerrada antes de receber o áudio."));
				}
			}
		});
	});
}

let cachedVoiceList: EdgeVoiceInfo[] | null = null;

export async function fetchEdgeVoices(): Promise<EdgeVoiceInfo[]> {
	if (cachedVoiceList && cachedVoiceList.length > 0) {
		return cachedVoiceList;
	}
	return new Promise((resolve) => {
		const req = https.get(
			`https://${EDGE_HOST}/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=${TRUSTED_CLIENT_TOKEN}`,
			{
				headers: {
					"User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROMIUM_MAJOR_VERSION}.0.0.0 Safari/537.36 Edg/${CHROMIUM_MAJOR_VERSION}.0.0.0`,
				},
			},
			(res) => {
				let data = "";
				res.on("data", (chunk) => (data += chunk));
				res.on("end", () => {
					try {
						const parsed = JSON.parse(data);
						if (Array.isArray(parsed)) {
							const mapped: EdgeVoiceInfo[] = parsed.map((v: any) => ({
								shortName: v.ShortName,
								friendlyName: v.FriendlyName || v.ShortName,
								locale: v.Locale,
								gender: v.Gender,
							}));
							// Prioritize Portuguese & English voices at the top
							mapped.sort((a, b) => {
								const aPt = a.locale.startsWith("pt-") ? 0 : a.locale.startsWith("en-") ? 1 : 2;
								const bPt = b.locale.startsWith("pt-") ? 0 : b.locale.startsWith("en-") ? 1 : 2;
								if (aPt !== bPt) return aPt - bPt;
								return a.shortName.localeCompare(b.shortName);
							});
							cachedVoiceList = mapped;
							resolve(mapped);
							return;
						}
					} catch {
						// Ignore and fallback to curated list
					}
					resolve(CURATED_EDGE_VOICES);
				});
			}
		);
		req.on("error", () => resolve(CURATED_EDGE_VOICES));
		req.setTimeout(5000, () => {
			req.destroy();
			resolve(CURATED_EDGE_VOICES);
		});
	});
}
