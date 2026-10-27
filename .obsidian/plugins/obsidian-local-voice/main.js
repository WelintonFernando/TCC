var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => LocalVoicePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");
var path2 = __toESM(require("path"));

// src/types.ts
var DEFAULT_SETTINGS = {
  engine: "edge",
  playbackRate: 1,
  piperVoiceId: "pt_BR-faber-medium",
  customPiperExePath: "",
  customPiperModelPath: "",
  piperLengthScale: 1,
  edgeVoice: "pt-BR-AntonioNeural",
  systemVoiceURI: "",
  autoScrollSidebar: true,
  scrollEditorWithPlayback: true,
  ignoreCodeBlocks: true,
  ignoreFrontmatter: true,
  ignoreUrls: true,
  ignoreTables: false,
  ignoreCalloutHeaders: false,
  prefetchNextChunk: true
};
var PIPER_MODELS = [
  {
    id: "pt_BR-faber-medium",
    name: "Faber (Portugu\xEAs Brasil - Masculina Natural)",
    language: "pt-BR",
    quality: "Medium (Recomendado)",
    sizeLabel: "~63 MB",
    onnxUrl: "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx",
    jsonUrl: "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx.json"
  },
  {
    id: "pt_BR-cadu-medium",
    name: "Cadu (Portugu\xEAs Brasil - Masculina Expressiva)",
    language: "pt-BR",
    quality: "Medium",
    sizeLabel: "~63 MB",
    onnxUrl: "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/cadu/medium/pt_BR-cadu-medium.onnx",
    jsonUrl: "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/cadu/medium/pt_BR-cadu-medium.onnx.json"
  },
  {
    id: "pt_BR-edresson-low",
    name: "Edresson (Portugu\xEAs Brasil - Ultra Leve/R\xE1pida)",
    language: "pt-BR",
    quality: "Low",
    sizeLabel: "~63 MB",
    onnxUrl: "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/edresson/low/pt_BR-edresson-low.onnx",
    jsonUrl: "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/edresson/low/pt_BR-edresson-low.onnx.json"
  },
  {
    id: "pt_PT-tugao-medium",
    name: "Tug\xE3o (Portugu\xEAs Portugal - Masculina)",
    language: "pt-PT",
    quality: "Medium",
    sizeLabel: "~63 MB",
    onnxUrl: "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_PT/tugao/medium/pt_PT-tugao-medium.onnx",
    jsonUrl: "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_PT/tugao/medium/pt_PT-tugao-medium.onnx.json"
  },
  {
    id: "en_US-lessac-medium",
    name: "Lessac (Ingl\xEAs EUA - Feminina Natural)",
    language: "en-US",
    quality: "Medium",
    sizeLabel: "~63 MB",
    onnxUrl: "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx",
    jsonUrl: "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json"
  }
];
var CURATED_EDGE_VOICES = [
  {
    shortName: "pt-BR-AntonioNeural",
    friendlyName: "\u{1F1E7}\u{1F1F7} Ant\xF4nio Neural (Portugu\xEAs Brasil - Masculina)",
    locale: "pt-BR",
    gender: "Male"
  },
  {
    shortName: "pt-BR-FranciscaNeural",
    friendlyName: "\u{1F1E7}\u{1F1F7} Francisca Neural (Portugu\xEAs Brasil - Feminina)",
    locale: "pt-BR",
    gender: "Female"
  },
  {
    shortName: "pt-BR-ThalitaMultilingualNeural",
    friendlyName: "\u{1F1E7}\u{1F1F7} Thalita Multil\xEDngue (Portugu\xEAs/Ingl\xEAs - Feminina)",
    locale: "pt-BR",
    gender: "Female"
  },
  {
    shortName: "pt-PT-DuarteNeural",
    friendlyName: "\u{1F1F5}\u{1F1F9} Duarte Neural (Portugu\xEAs Portugal - Masculina)",
    locale: "pt-PT",
    gender: "Male"
  },
  {
    shortName: "pt-PT-RaquelNeural",
    friendlyName: "\u{1F1F5}\u{1F1F9} Raquel Neural (Portugu\xEAs Portugal - Feminina)",
    locale: "pt-PT",
    gender: "Female"
  },
  {
    shortName: "en-US-AndrewMultilingualNeural",
    friendlyName: "\u{1F1FA}\u{1F1F8} Andrew Multil\xEDngue (Ingl\xEAs EUA - Masculina)",
    locale: "en-US",
    gender: "Male"
  },
  {
    shortName: "en-US-EmmaMultilingualNeural",
    friendlyName: "\u{1F1FA}\u{1F1F8} Emma Multil\xEDngue (Ingl\xEAs EUA - Feminina)",
    locale: "en-US",
    gender: "Female"
  },
  {
    shortName: "es-ES-AlvaroNeural",
    friendlyName: "\u{1F1EA}\u{1F1F8} \xC1lvaro Neural (Espanhol - Masculina)",
    locale: "es-ES",
    gender: "Male"
  }
];

// src/markdownCleaner.ts
function cleanInlineMarkdown(raw, settings) {
  let text = raw;
  text = text.replace(/%%[\s\S]*?%%/g, " ");
  text = text.replace(/<!--[\s\S]*?-->/g, " ");
  text = text.replace(/!\[\[[^\]]*\]\]/g, " ");
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, " ");
  text = text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2");
  text = text.replace(/\[\[([^\]#]+)#([^\]]+)\]\]/g, "$1, $2");
  text = text.replace(/\[\[([^\]]+)\]\]/g, "$1");
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  if (settings.ignoreUrls) {
    text = text.replace(/https?:\/\/[^\s)>]+/gi, " ");
  }
  text = text.replace(/\$\$[\s\S]*?\$\$/g, " ");
  text = text.replace(/\$([^$\n]+)\$/g, "$1");
  text = text.replace(/`+([^`]+)`+/g, "$1");
  text = text.replace(/\[\^[^\]]+\]/g, " ");
  text = text.replace(/<[^>]+>/g, " ");
  text = text.replace(/\[![a-zA-Z0-9_-]+\][+-]?/g, " ");
  text = text.replace(/^\s*[-*+]\s*\[[ xX/\->?]\]\s+/gm, "");
  text = text.replace(/^\s*[-*+]\s+/gm, "");
  text = text.replace(/^\s*>+\s?/gm, "");
  text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");
  text = text.replace(/(\*|_)(.*?)\1/g, "$2");
  text = text.replace(/~~(.*?)~~/g, "$1");
  text = text.replace(/==(.*?)==/g, "$1");
  text = text.replace(/\|/g, ", ");
  text = text.replace(/\s+/g, " ").trim();
  return text;
}
function parseMarkdownToChunks(markdown, settings, baseStartLine = 0) {
  const lines = markdown.split(/\r?\n/);
  const chunks = [];
  let i = 0;
  if (baseStartLine === 0 && lines.length > 0 && lines[0].trim() === "---") {
    let endYaml = -1;
    for (let j = 1; j < lines.length; j++) {
      if (lines[j].trim() === "---" || lines[j].trim() === "...") {
        endYaml = j;
        break;
      }
    }
    if (endYaml !== -1 && settings.ignoreFrontmatter) {
      i = endYaml + 1;
    }
  }
  let currentParagraphLines = [];
  let currentStartLine = i;
  const flushParagraph = (endLineIdx) => {
    if (currentParagraphLines.length === 0)
      return;
    const rawBlock = currentParagraphLines.join("\n").trim();
    currentParagraphLines = [];
    if (!rawBlock)
      return;
    if (/^([-*_]\s*){3,}$/.test(rawBlock))
      return;
    if (/^[\s|:-]+$/.test(rawBlock))
      return;
    const spokenText = cleanInlineMarkdown(rawBlock, settings);
    if (!spokenText || !/[\p{L}\p{N}]/u.test(spokenText))
      return;
    chunks.push({
      index: chunks.length,
      spokenText,
      displayText: spokenText,
      isHeading: false,
      startLine: baseStartLine + currentStartLine,
      endLine: baseStartLine + endLineIdx
    });
  };
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (/^(`{3,}|~{3,})/.test(trimmed)) {
      flushParagraph(i - 1);
      const fence = trimmed.match(/^(`{3,}|~{3,})/)[1][0];
      const codeStart = i;
      i++;
      const codeContent = [];
      while (i < lines.length && !new RegExp(`^\\s*${fence}{3,}`).test(lines[i])) {
        codeContent.push(lines[i]);
        i++;
      }
      const codeEnd = i < lines.length ? i : lines.length - 1;
      if (!settings.ignoreCodeBlocks && codeContent.length > 0) {
        const spoken = cleanInlineMarkdown(codeContent.join(" "), settings);
        if (spoken && /[\p{L}\p{N}]/u.test(spoken)) {
          chunks.push({
            index: chunks.length,
            spokenText: spoken,
            displayText: `[C\xF3digo] ${spoken}`,
            isHeading: false,
            startLine: baseStartLine + codeStart,
            endLine: baseStartLine + codeEnd
          });
        }
      }
      i++;
      currentStartLine = i;
      continue;
    }
    if (trimmed.startsWith("%%") && !trimmed.slice(2).includes("%%")) {
      flushParagraph(i - 1);
      i++;
      while (i < lines.length && !lines[i].includes("%%")) {
        i++;
      }
      i++;
      currentStartLine = i;
      continue;
    }
    if (trimmed.startsWith("$$") && !trimmed.slice(2).includes("$$")) {
      flushParagraph(i - 1);
      i++;
      while (i < lines.length && !lines[i].includes("$$")) {
        i++;
      }
      i++;
      currentStartLine = i;
      continue;
    }
    if (trimmed === "") {
      flushParagraph(i - 1);
      i++;
      currentStartLine = i;
      continue;
    }
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph(i - 1);
      const level = headingMatch[1].length;
      const rawHeading = headingMatch[2].replace(/\s+#+\s*$/, "");
      const spoken = cleanInlineMarkdown(rawHeading, settings);
      if (spoken && /[\p{L}\p{N}]/u.test(spoken)) {
        chunks.push({
          index: chunks.length,
          spokenText: spoken,
          displayText: spoken,
          isHeading: true,
          headingLevel: level,
          startLine: baseStartLine + i,
          endLine: baseStartLine + i
        });
      }
      i++;
      currentStartLine = i;
      continue;
    }
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (settings.ignoreTables) {
        flushParagraph(i - 1);
        i++;
        currentStartLine = i;
        continue;
      }
      if (/^[\s|:-]+$/.test(trimmed)) {
        i++;
        continue;
      }
    }
    if (/^>\s*\[![a-zA-Z0-9_-]+\]/.test(trimmed)) {
      flushParagraph(i - 1);
      if (!settings.ignoreCalloutHeaders) {
        const afterTag = trimmed.replace(/^>\s*\[![a-zA-Z0-9_-]+\][+-]?\s*/, "");
        const spoken = cleanInlineMarkdown(afterTag, settings);
        if (spoken && /[\p{L}\p{N}]/u.test(spoken)) {
          chunks.push({
            index: chunks.length,
            spokenText: spoken,
            displayText: `\u{1F4CC} ${spoken}`,
            isHeading: true,
            headingLevel: 4,
            startLine: baseStartLine + i,
            endLine: baseStartLine + i
          });
        }
      }
      i++;
      currentStartLine = i;
      continue;
    }
    if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) {
      flushParagraph(i - 1);
      currentStartLine = i;
      currentParagraphLines.push(line);
      flushParagraph(i);
      i++;
      currentStartLine = i;
      continue;
    }
    if (currentParagraphLines.length === 0) {
      currentStartLine = i;
    }
    currentParagraphLines.push(line);
    i++;
  }
  flushParagraph(lines.length - 1);
  return chunks;
}

// src/playerController.ts
var import_obsidian = require("obsidian");

// src/engines/edgeTts.ts
var crypto = __toESM(require("crypto"));
var tls = __toESM(require("tls"));
var https = __toESM(require("https"));
var TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
var WIN_EPOCH = 11644473600;
var CHROMIUM_FULL_VERSION = "143.0.3650.75";
var CHROMIUM_MAJOR_VERSION = "143";
var SEC_MS_GEC_VERSION = `2-${CHROMIUM_FULL_VERSION}`;
var EDGE_HOST = "speech.platform.bing.com";
var SHA256_INITIAL = [
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
];
var SHA256_STATE = [
  4255104674,
  2435071207,
  3192492180,
  3442351626,
  1811967817,
  79508907,
  4272990180,
  66059218
];
var SHA256_SCHEDULE = [
  3945054110,
  358115615,
  2696978146,
  217723578,
  2787307148,
  3520959633,
  3235718560,
  4192668342,
  4039316851,
  1884868174,
  1904797190,
  15051571,
  3529027680,
  1920361828
];
var SHA256_ROUND_CONSTANTS = [
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
];
var SHA256_ADJUSTMENT = 3386640039;
var SHA256_BLOCK_CONSTANTS = [
  ...SHA256_ROUND_CONSTANTS.slice(0, 14),
  SHA256_ADJUSTMENT,
  ...SHA256_ROUND_CONSTANTS.slice(15)
];
var SHA256_SIGMA0_ADJUSTMENT = 94112640;
var SHA256_SIGMA1_ADJUSTMENT = 758464;
var CS64_COEFFICIENTS = [
  [3895366065, 3005677776],
  [1155409094, 2296378653],
  [1005282748, 693190712],
  [3365689651, 3005795295],
  [2367603217, 3557143765],
  [827258325, 652566332],
  [3911487921, 1618477510],
  [4037392853, 2192753147],
  [101076211, 4199654362],
  [3665427040, 545047652],
  [3201434976, 1010595059],
  [2314848760, 3536931681],
  [905590982, 3137643201],
  [3410617286, 3311559015]
];
var CS64_FACTOR = 2190031155;
var CS64_ADJUSTMENT0 = 4076407578;
var CS64_ADJUSTMENT1 = 186253312;
function mul32(a, b) {
  return Math.imul(a, b) >>> 0;
}
function rol16(v) {
  v = v >>> 0;
  return (v << 16 | v >>> 16) >>> 0;
}
function rotr(v, n) {
  v = v >>> 0;
  return (v >>> n | v << 32 - n) >>> 0;
}
function sigma0(v) {
  v = v >>> 0;
  return (rotr(v, 7) ^ rotr(v, 18) ^ v >>> 3) >>> 0;
}
function sigma1(v) {
  v = v >>> 0;
  return (rotr(v, 17) ^ rotr(v, 19) ^ v >>> 10) >>> 0;
}
function expandSchedule(words, firstWord = 16) {
  for (let i = firstWord; i < 64; i++) {
    words.push(
      sigma1(words[i - 2]) + words[i - 7] + sigma0(words[i - 15]) + words[i - 16] >>> 0
    );
  }
}
function sha256Rounds(state, words, firstRound = 0) {
  let [a, b, c, d, e, f, g, h] = state;
  const constants = firstRound === 14 ? SHA256_BLOCK_CONSTANTS : SHA256_ROUND_CONSTANTS;
  for (let i = firstRound; i < 64; i++) {
    const S1 = (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) >>> 0;
    const ch = (g ^ e & (f ^ g)) >>> 0;
    const t1 = h + S1 + ch + constants[i] + words[i] >>> 0;
    const S0 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) >>> 0;
    const maj = (a & b | c & (a | b)) >>> 0;
    const t2 = S0 + maj >>> 0;
    h = g;
    g = f;
    f = e;
    e = d + t1 >>> 0;
    d = c;
    c = b;
    b = a;
    a = t1 + t2 >>> 0;
  }
  return [a, b, c, d, e, f, g, h];
}
function sha256Init(data7) {
  const words = new Array(14).fill(0);
  words.push((data7[0] << 16 | data7[1] << 8 | data7[2]) >>> 0);
  words.push(data7.readUInt32BE(3));
  for (let i = 16; i < 30; i++) {
    let val = SHA256_SCHEDULE[i - 16];
    if (i - 2 >= 14) {
      val = val + (i === 16 ? (sigma1(words[i - 2]) ^ SHA256_SIGMA1_ADJUSTMENT) >>> 0 : sigma1(words[i - 2])) >>> 0;
    }
    if (i - 7 >= 14) {
      val = val + words[i - 7] >>> 0;
    }
    if (i - 15 >= 14) {
      val = val + (i === 29 ? (sigma0(words[i - 15]) ^ SHA256_SIGMA0_ADJUSTMENT) >>> 0 : sigma0(words[i - 15])) >>> 0;
    }
    words.push(val >>> 0);
  }
  words.push(
    sigma1(words[28]) + words[23] + sigma0(words[15]) + words[14] + SHA256_ADJUSTMENT - SHA256_ROUND_CONSTANTS[14] >>> 0
  );
  expandSchedule(words, 31);
  const working = sha256Rounds(SHA256_STATE, words, 14);
  return SHA256_INITIAL.map((x, idx) => x + working[idx] >>> 0);
}
function sha256Digest(data) {
  const length = 57 + data.length;
  const rest = data.subarray(7);
  const padZeroLen = ((55 - length) % 64 + 64) % 64;
  const padded = Buffer.alloc(rest.length + 1 + padZeroLen + 8);
  rest.copy(padded, 0);
  padded[rest.length] = 128;
  padded.writeBigUInt64BE(BigInt(length * 8), padded.length - 8);
  let state = sha256Init(data.subarray(0, 7));
  for (let offset = 0; offset < padded.length; offset += 64) {
    const words = [];
    for (let j = 0; j < 16; j++) {
      words.push(padded.readUInt32BE(offset + j * 4));
    }
    expandSchedule(words, 16);
    const working = sha256Rounds(state, words, 0);
    state = state.map((x, idx) => x + working[idx] >>> 0);
  }
  const out = Buffer.alloc(32);
  state.forEach((v, idx) => out.writeUInt32BE(v >>> 0, idx * 4));
  return out;
}
function wordsLe4Even(data) {
  const pad = (4 - data.length % 4) % 4;
  const buf = pad ? Buffer.concat([data, Buffer.alloc(pad)]) : data;
  const words = [];
  for (let i = 0; i < buf.length; i += 4) {
    words.push(buf.readUInt32LE(i));
  }
  if (words.length % 2 !== 0)
    words.push(0);
  return words;
}
function cs64Digest(data, digest) {
  const keyA = (digest.readUInt32LE(0) | 1) >>> 0;
  const keyB = (digest.readUInt32LE(4) | 1) >>> 0;
  const factors = [mul32(keyA, CS64_FACTOR), mul32(keyB, CS64_FACTOR)];
  const terms = CS64_COEFFICIENTS.map(
    ([coeff], idx) => mul32(coeff, factors[idx % 2])
  );
  const offsets = CS64_COEFFICIENTS.map(([, off]) => off >>> 0);
  const words = wordsLe4Even(Buffer.concat([Buffer.from([0]), data]));
  for (let idx = 0; idx < words.length; idx++) {
    const word = words[idx];
    let term = mul32(word, idx % 2 === 0 ? keyA : keyB);
    let offset = mul32(rol16(word), idx % 2 === 0 ? 4010109435 : 3273069531);
    if (idx === 0) {
      term = term + mul32(CS64_ADJUSTMENT0, factors[0]) >>> 0;
      offset = offset + CS64_ADJUSTMENT1 >>> 0;
    }
    terms.push(term);
    offsets.push(offset);
  }
  let swapAcc = 0, swapLast = 0, state = 0, acc = 0;
  for (let idx = 0; idx < terms.length; idx += 2) {
    const x = terms[idx], y = terms[idx + 1];
    let t = rol16(offsets[idx] + x >>> 0);
    let q = mul32(t, 1995771700);
    swapAcc = swapAcc + (mul32(rol16(q), 3287280279) + q >>> 0) >>> 0;
    t = rol16(offsets[idx + 1] + y >>> 0);
    q = mul32(t, 411160124);
    swapLast = mul32(rol16(q), 901586633) + q >>> 0;
    swapAcc = swapAcc + swapLast >>> 0;
    state = mul32(state, keyA) + x >>> 0;
    state = mul32(rol16(state), 3482890513);
    state = mul32(rol16(state), 2265471903);
    state = mul32(rol16(state), 315537773);
    state = mul32(rol16(state), 629022083);
    acc = acc + state >>> 0;
    t = mul32(state, keyB) + y >>> 0;
    t = mul32(rol16(t), 2725517045);
    t = mul32(rol16(t), 3548616447);
    state = mul32(rol16(mul32(rol16(t), 2090019721)), 3215236969);
    acc = acc + state >>> 0;
  }
  const out = Buffer.alloc(8);
  out.writeUInt32LE((swapLast ^ state) >>> 0, 0);
  out.writeUInt32LE((swapAcc ^ acc) >>> 0, 4);
  return out.toString("hex").toUpperCase();
}
var clockSkewSeconds = 0;
function generateSecMsGecV2() {
  let ticks = Math.floor(Date.now() / 1e3 + clockSkewSeconds) + WIN_EPOCH;
  ticks -= ticks % 300;
  ticks *= 1e7;
  const data = Buffer.from(ticks.toFixed(0) + TRUSTED_CLIENT_TOKEN, "ascii");
  const digest = sha256Digest(data);
  const cs64 = cs64Digest(data, digest);
  return `${cs64}-${digest.toString("hex").toUpperCase()}`;
}
function escapeXml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function encodeWsTextFrame(text) {
  const payload = Buffer.from(text, "utf8");
  const mask = crypto.randomBytes(4);
  let header;
  if (payload.length < 126) {
    header = Buffer.alloc(2);
    header[0] = 129;
    header[1] = 128 | payload.length;
  } else if (payload.length < 65536) {
    header = Buffer.alloc(4);
    header[0] = 129;
    header[1] = 128 | 126;
    header.writeUInt16BE(payload.length, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 129;
    header[1] = 128 | 127;
    header.writeBigUInt64BE(BigInt(payload.length), 2);
  }
  const maskedPayload = Buffer.alloc(payload.length);
  for (let i = 0; i < payload.length; i++) {
    maskedPayload[i] = payload[i] ^ mask[i % 4];
  }
  return Buffer.concat([header, mask, maskedPayload]);
}
async function syncClockSkew() {
  return new Promise((resolve) => {
    const req = https.get(
      `https://${EDGE_HOST}/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=${TRUSTED_CLIENT_TOKEN}`,
      {
        headers: {
          "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROMIUM_MAJOR_VERSION}.0.0.0 Safari/537.36 Edg/${CHROMIUM_MAJOR_VERSION}.0.0.0`
        }
      },
      (res) => {
        if (res.headers.date) {
          const serverTime = Date.parse(res.headers.date) / 1e3;
          if (!isNaN(serverTime)) {
            clockSkewSeconds = serverTime - Date.now() / 1e3;
          }
        }
        res.resume();
        resolve();
      }
    );
    req.on("error", () => resolve());
    req.setTimeout(4e3, () => {
      req.destroy();
      resolve();
    });
  });
}
async function synthesizeEdgeTTS(text, voice = "pt-BR-AntonioNeural", retryOnSkew = true) {
  return new Promise((resolve, reject) => {
    const secMsGec = generateSecMsGecV2();
    const connId = crypto.randomUUID().replace(/-/g, "");
    const reqId = crypto.randomUUID().replace(/-/g, "");
    const muid = crypto.randomBytes(16).toString("hex").toUpperCase();
    const wsKey = crypto.randomBytes(16).toString("base64");
    const wsPath = `/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}&Sec-MS-GEC=${secMsGec}&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}&ConnectionId=${connId}`;
    const socket = tls.connect(
      {
        host: EDGE_HOST,
        port: 443,
        servername: EDGE_HOST,
        ALPNProtocols: ["http/1.1"]
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
          `\r
`
        ].join("\r\n");
        socket.write(handshake);
      }
    );
    let handshakeComplete = false;
    let rawBuffer = Buffer.alloc(0);
    const audioChunks = [];
    let finished = false;
    const finishWithError = (err) => {
      if (finished)
        return;
      finished = true;
      socket.destroy();
      reject(err);
    };
    socket.setTimeout(2e4, () => {
      finishWithError(new Error("Tempo limite excedido ao conectar ao Edge TTS."));
    });
    socket.on("error", (err) => {
      finishWithError(err);
    });
    socket.on("data", (chunk) => {
      rawBuffer = Buffer.concat([rawBuffer, chunk]);
      if (!handshakeComplete) {
        const headerEnd = rawBuffer.indexOf("\r\n\r\n");
        if (headerEnd === -1)
          return;
        const headerStr = rawBuffer.subarray(0, headerEnd).toString("utf8");
        const firstLine = headerStr.split("\r\n")[0];
        if (!firstLine.includes("101")) {
          socket.destroy();
          if (retryOnSkew) {
            finished = true;
            syncClockSkew().then(() => synthesizeEdgeTTS(text, voice, false)).then(resolve).catch(reject);
            return;
          }
          finishWithError(
            new Error(`Falha no handshake do Edge TTS: ${firstLine}`)
          );
          return;
        }
        handshakeComplete = true;
        rawBuffer = rawBuffer.subarray(headerEnd + 4);
        const timestamp = (/* @__PURE__ */ new Date()).toString();
        const configMsg = `X-Timestamp:${timestamp}\r
Content-Type:application/json; charset=utf-8\r
Path:speech.config\r
\r
{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r
`;
        socket.write(encodeWsTextFrame(configMsg));
        const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='pt-BR'><voice name='${voice}'><prosody pitch='+0Hz' rate='+0%' volume='+0%'>${escapeXml(text)}</prosody></voice></speak>`;
        const ssmlMsg = `X-RequestId:${reqId}\r
Content-Type:application/ssml+xml\r
X-Timestamp:${timestamp}Z\r
Path:ssml\r
\r
` + ssml;
        socket.write(encodeWsTextFrame(ssmlMsg));
      }
      while (rawBuffer.length >= 2) {
        const firstByte = rawBuffer[0];
        const opcode = firstByte & 15;
        const secondByte = rawBuffer[1];
        const isMasked = (secondByte & 128) !== 0;
        let payloadLen = secondByte & 127;
        let offset = 2;
        if (payloadLen === 126) {
          if (rawBuffer.length < 4)
            break;
          payloadLen = rawBuffer.readUInt16BE(2);
          offset = 4;
        } else if (payloadLen === 127) {
          if (rawBuffer.length < 10)
            break;
          payloadLen = Number(rawBuffer.readBigUInt64BE(2));
          offset = 10;
        }
        const maskLen = isMasked ? 4 : 0;
        if (rawBuffer.length < offset + maskLen + payloadLen) {
          break;
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
        if (opcode === 1) {
          const msg = payload.toString("utf8");
          if (msg.includes("Path:turn.end")) {
            finished = true;
            socket.destroy();
            resolve(Buffer.concat(audioChunks));
            return;
          }
        } else if (opcode === 2) {
          if (payload.length >= 2) {
            const headerLen = payload.readUInt16BE(0);
            const headerText = payload.subarray(2, 2 + headerLen).toString("utf8");
            if (headerText.includes("Path:audio")) {
              const audioBytes = payload.subarray(2 + headerLen);
              if (audioBytes.length > 0) {
                audioChunks.push(Buffer.from(audioBytes));
              }
            }
          }
        } else if (opcode === 8) {
          if (!finished) {
            finished = true;
            socket.destroy();
            if (audioChunks.length > 0) {
              resolve(Buffer.concat(audioChunks));
            } else {
              reject(
                new Error("Conex\xE3o WebSocket do Edge TTS fechada sem \xE1udio.")
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
          reject(new Error("Conex\xE3o encerrada antes de receber o \xE1udio."));
        }
      }
    });
  });
}
var cachedVoiceList = null;
async function fetchEdgeVoices() {
  if (cachedVoiceList && cachedVoiceList.length > 0) {
    return cachedVoiceList;
  }
  return new Promise((resolve) => {
    const req = https.get(
      `https://${EDGE_HOST}/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=${TRUSTED_CLIENT_TOKEN}`,
      {
        headers: {
          "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROMIUM_MAJOR_VERSION}.0.0.0 Safari/537.36 Edg/${CHROMIUM_MAJOR_VERSION}.0.0.0`
        }
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => data += chunk);
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
              const mapped = parsed.map((v) => ({
                shortName: v.ShortName,
                friendlyName: v.FriendlyName || v.ShortName,
                locale: v.Locale,
                gender: v.Gender
              }));
              mapped.sort((a, b) => {
                const aPt = a.locale.startsWith("pt-") ? 0 : a.locale.startsWith("en-") ? 1 : 2;
                const bPt = b.locale.startsWith("pt-") ? 0 : b.locale.startsWith("en-") ? 1 : 2;
                if (aPt !== bPt)
                  return aPt - bPt;
                return a.shortName.localeCompare(b.shortName);
              });
              cachedVoiceList = mapped;
              resolve(mapped);
              return;
            }
          } catch {
          }
          resolve(CURATED_EDGE_VOICES);
        });
      }
    );
    req.on("error", () => resolve(CURATED_EDGE_VOICES));
    req.setTimeout(5e3, () => {
      req.destroy();
      resolve(CURATED_EDGE_VOICES);
    });
  });
}

// src/engines/piperTts.ts
var child_process = __toESM(require("child_process"));
var fs = __toESM(require("fs"));
var https2 = __toESM(require("https"));
var http = __toESM(require("http"));
var os = __toESM(require("os"));
var path = __toESM(require("path"));
var crypto2 = __toESM(require("crypto"));
var PIPER_WIN_ZIP_URL = "https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_windows_amd64.zip";
function getPiperBaseDir(pluginDir) {
  return path.join(pluginDir, "piper-local");
}
function getPiperModelsDir(pluginDir) {
  return path.join(getPiperBaseDir(pluginDir), "models");
}
function resolvePiperExePath(pluginDir, settings) {
  if (settings.customPiperExePath && fs.existsSync(settings.customPiperExePath)) {
    return settings.customPiperExePath;
  }
  const baseDir = getPiperBaseDir(pluginDir);
  const candidate1 = path.join(baseDir, "piper", "piper.exe");
  if (fs.existsSync(candidate1))
    return candidate1;
  const candidate2 = path.join(baseDir, "piper.exe");
  if (fs.existsSync(candidate2))
    return candidate2;
  return null;
}
function resolvePiperModelPath(pluginDir, settings) {
  if (settings.customPiperModelPath && fs.existsSync(settings.customPiperModelPath)) {
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
function isPiperReady(pluginDir, settings) {
  return resolvePiperExePath(pluginDir, settings) !== null && resolvePiperModelPath(pluginDir, settings) !== null;
}
function isVoiceModelInstalled(pluginDir, voiceId) {
  const modelsDir = getPiperModelsDir(pluginDir);
  const onnx = path.join(modelsDir, `${voiceId}.onnx`);
  const json = path.join(modelsDir, `${voiceId}.onnx.json`);
  return fs.existsSync(onnx) && fs.existsSync(json);
}
function downloadFileWithProgress(urlStr, destPath, onProgress, maxRedirects = 10) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      reject(new Error("Muitos redirecionamentos ao baixar arquivo."));
      return;
    }
    const parsedUrl = new URL(urlStr);
    const client = parsedUrl.protocol === "https:" ? https2 : http;
    const req = client.get(
      urlStr,
      {
        headers: {
          "User-Agent": "Obsidian-Local-Voice-Plugin/1.0"
        }
      },
      (res) => {
        if (res.statusCode && [301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          res.resume();
          const redirectUrl = new URL(res.headers.location, urlStr).toString();
          downloadFileWithProgress(
            redirectUrl,
            destPath,
            onProgress,
            maxRedirects - 1
          ).then(resolve).catch(reject);
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
        res.on("data", (chunk) => {
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
            if (fs.existsSync(tempPath))
              fs.unlinkSync(tempPath);
          } catch {
          }
          reject(err);
        });
      }
    );
    req.on("error", (err) => reject(err));
  });
}
async function installPiperAndVoice(pluginDir, voiceId, onStatus) {
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
          const pct = Math.round(downloaded / total * 100);
          onStatus(`Baixando motor Piper TTS: ${pct}%`);
        } else {
          const mb = (downloaded / (1024 * 1024)).toFixed(1);
          onStatus(`Baixando motor Piper TTS: ${mb} MB`);
        }
      }
    );
    onStatus("Extraindo motor Piper TTS...");
    await new Promise((resolve, reject) => {
      const ps = child_process.spawn("powershell.exe", [
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        `Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${baseDir.replace(/'/g, "''")}' -Force`
      ]);
      let stderr = "";
      ps.stderr.on("data", (d) => stderr += d.toString());
      ps.on("close", (code) => {
        try {
          if (fs.existsSync(zipPath))
            fs.unlinkSync(zipPath);
        } catch {
        }
        if (code === 0 && fs.existsSync(piperExe)) {
          resolve();
        } else {
          reject(
            new Error(
              `Erro ao extrair Piper ZIP (c\xF3digo ${code}): ${stderr}`
            )
          );
        }
      });
      ps.on("error", reject);
    });
  }
  const voiceInfo = PIPER_MODELS.find((m) => m.id === voiceId) || PIPER_MODELS[0];
  const onnxDest = path.join(modelsDir, `${voiceInfo.id}.onnx`);
  const jsonDest = path.join(modelsDir, `${voiceInfo.id}.onnx.json`);
  if (!fs.existsSync(jsonDest)) {
    onStatus(`Baixando configura\xE7\xE3o da voz (${voiceInfo.id})...`);
    await downloadFileWithProgress(voiceInfo.jsonUrl, jsonDest);
  }
  if (!fs.existsSync(onnxDest)) {
    onStatus(`Baixando modelo de voz ${voiceInfo.name}...`);
    await downloadFileWithProgress(
      voiceInfo.onnxUrl,
      onnxDest,
      (downloaded, total) => {
        if (total > 0) {
          const pct = Math.round(downloaded / total * 100);
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
async function synthesizePiperTTS(text, pluginDir, settings) {
  const exePath = resolvePiperExePath(pluginDir, settings);
  if (!exePath) {
    throw new Error(
      "Execut\xE1vel do Piper TTS n\xE3o encontrado. Clique em 'Instalar Piper + Voz Offline' na aba lateral ou nas configura\xE7\xF5es."
    );
  }
  const modelPath = resolvePiperModelPath(pluginDir, settings);
  if (!modelPath) {
    throw new Error(
      `Modelo de voz '${settings.piperVoiceId}' n\xE3o encontrado. Baixe a voz nas configura\xE7\xF5es do plugin.`
    );
  }
  const tempWav = path.join(
    os.tmpdir(),
    `obsidian-voice-${crypto2.randomUUID()}.wav`
  );
  return new Promise((resolve, reject) => {
    const args = [
      "--model",
      modelPath,
      "--output_file",
      tempWav,
      "--length_scale",
      String(settings.piperLengthScale || 1)
    ];
    const child = child_process.spawn(exePath, args, {
      cwd: path.dirname(exePath),
      windowsHide: true
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
          }
          if (wavBuffer.length > 44) {
            resolve(wavBuffer);
          } else {
            reject(
              new Error("Piper TTS gerou um arquivo de \xE1udio vazio.")
            );
          }
        } else {
          try {
            if (fs.existsSync(tempWav))
              fs.unlinkSync(tempWav);
          } catch {
          }
          reject(
            new Error(
              `Piper TTS encerrou com c\xF3digo ${code}: ${stderr.trim()}`
            )
          );
        }
      } catch (err) {
        reject(err);
      }
    });
    const cleanSingleLine = text.replace(/\r?\n/g, " ").trim() + "\n";
    child.stdin.write(Buffer.from(cleanSingleLine, "utf8"));
    child.stdin.end();
  });
}

// src/engines/systemTts.ts
function getSystemVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }
  const voices = window.speechSynthesis.getVoices();
  const mapped = voices.map((v) => ({
    voiceURI: v.voiceURI,
    name: `${v.name} (${v.lang})`,
    lang: v.lang
  }));
  mapped.sort((a, b) => {
    const aPt = a.lang.toLowerCase().startsWith("pt") ? 0 : a.lang.toLowerCase().startsWith("en") ? 1 : 2;
    const bPt = b.lang.toLowerCase().startsWith("pt") ? 0 : b.lang.toLowerCase().startsWith("en") ? 1 : 2;
    if (aPt !== bPt)
      return aPt - bPt;
    return a.name.localeCompare(b.name);
  });
  return mapped;
}
var SystemSpeechController = class {
  constructor() {
    this.currentUtterance = null;
  }
  speak(text, voiceURI, rate, onEnd, onError) {
    this.stop();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      onError(new Error("Web Speech API n\xE3o est\xE1 dispon\xEDvel neste ambiente."));
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = Math.max(0.5, Math.min(3, rate));
    const voices = window.speechSynthesis.getVoices();
    if (voiceURI) {
      const matched = voices.find((v) => v.voiceURI === voiceURI);
      if (matched) {
        utterance.voice = matched;
        utterance.lang = matched.lang;
      }
    }
    if (!utterance.voice) {
      const ptVoice = voices.find((v) => v.lang.toLowerCase() === "pt-br") || voices.find((v) => v.lang.toLowerCase().startsWith("pt"));
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
  pause() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }
  }
  resume() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
    }
  }
  stop() {
    this.currentUtterance = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
};

// src/playerController.ts
var PlayerController = class {
  constructor(settings, pluginDir, onActiveChunkChanged) {
    this.chunks = [];
    this.currentIndex = -1;
    this.status = "idle";
    this.noteTitle = "Nenhuma nota selecionada";
    this.notePath = "";
    this.sourceMode = "full-note";
    this.errorMessage = null;
    this.listeners = /* @__PURE__ */ new Set();
    this.audioEl = null;
    this.currentObjectUrl = null;
    this.systemController = new SystemSpeechController();
    // Prefetch cache: key -> Promise<Buffer>
    this.audioCache = /* @__PURE__ */ new Map();
    this.playbackSessionId = 0;
    this.settings = settings;
    this.pluginDir = pluginDir;
    this.onActiveChunkChanged = onActiveChunkChanged;
  }
  updateSettings(settings) {
    const engineOrVoiceChanged = this.settings.engine !== settings.engine || this.settings.edgeVoice !== settings.edgeVoice || this.settings.piperVoiceId !== settings.piperVoiceId || this.settings.piperLengthScale !== settings.piperLengthScale;
    this.settings = settings;
    if (engineOrVoiceChanged) {
      this.audioCache.clear();
    }
    if (this.audioEl) {
      this.audioEl.playbackRate = this.settings.playbackRate;
    }
    this.notify();
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  notify() {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (e) {
        console.error("Erro no listener do LocalVoice:", e);
      }
    }
  }
  loadChunks(chunks, noteTitle, notePath, sourceMode = "full-note") {
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
  async playFromIndex(index) {
    if (this.chunks.length === 0) {
      new import_obsidian.Notice("N\xE3o h\xE1 texto leg\xEDvel nesta nota.");
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
          if (this.playbackSessionId !== sessionId)
            return;
          if (this.currentIndex + 1 < this.chunks.length) {
            this.playFromIndex(this.currentIndex + 1);
          } else {
            this.status = "idle";
            this.notify();
          }
        },
        (err) => {
          if (this.playbackSessionId !== sessionId)
            return;
          this.errorMessage = err.message;
          this.status = "idle";
          this.notify();
          new import_obsidian.Notice(`Erro no TTS: ${err.message}`);
        }
      );
      return;
    }
    try {
      const audioBuf = await this.getOrSynthesizeAudio(index);
      if (this.playbackSessionId !== sessionId)
        return;
      if (this.settings.prefetchNextChunk && index + 1 < this.chunks.length) {
        this.getOrSynthesizeAudio(index + 1).catch(() => {
        });
      }
      const mimeType = this.settings.engine === "edge" ? "audio/mpeg" : "audio/wav";
      const blob = new Blob([new Uint8Array(audioBuf)], { type: mimeType });
      this.currentObjectUrl = URL.createObjectURL(blob);
      const audio = new Audio(this.currentObjectUrl);
      audio.playbackRate = this.settings.playbackRate;
      audio.preservesPitch = true;
      this.audioEl = audio;
      audio.onended = () => {
        if (this.playbackSessionId !== sessionId)
          return;
        if (this.currentIndex + 1 < this.chunks.length) {
          this.playFromIndex(this.currentIndex + 1);
        } else {
          this.cleanupCurrentAudio();
          this.status = "idle";
          this.notify();
        }
      };
      audio.onerror = () => {
        if (this.playbackSessionId !== sessionId)
          return;
        this.errorMessage = "Falha ao reproduzir o buffer de \xE1udio.";
        this.status = "idle";
        this.notify();
      };
      this.status = "playing";
      this.notify();
      await audio.play();
    } catch (err) {
      if (this.playbackSessionId !== sessionId)
        return;
      const msg = err?.message || String(err);
      this.errorMessage = msg;
      this.status = "idle";
      this.notify();
      new import_obsidian.Notice(`Erro ao gerar voz: ${msg}`);
    }
  }
  getCacheKey(index) {
    const chunk = this.chunks[index];
    const voiceKey = this.settings.engine === "edge" ? this.settings.edgeVoice : `${this.settings.piperVoiceId}-${this.settings.piperLengthScale}`;
    return `${this.settings.engine}:${voiceKey}:${index}:${chunk.spokenText}`;
  }
  getOrSynthesizeAudio(index) {
    const key = this.getCacheKey(index);
    const existing = this.audioCache.get(key);
    if (existing) {
      return existing;
    }
    if (this.audioCache.size > 20) {
      const firstKey = this.audioCache.keys().next().value;
      if (firstKey)
        this.audioCache.delete(firstKey);
    }
    const chunk = this.chunks[index];
    const promise = this.settings.engine === "edge" ? synthesizeEdgeTTS(chunk.spokenText, this.settings.edgeVoice) : synthesizePiperTTS(
      chunk.spokenText,
      this.pluginDir,
      this.settings
    );
    const handled = promise.catch((err) => {
      this.audioCache.delete(key);
      throw err;
    });
    this.audioCache.set(key, handled);
    return handled;
  }
  async togglePlayPause() {
    if (this.status === "playing") {
      this.pause();
    } else if (this.status === "paused") {
      this.resume();
    } else if (this.status === "idle") {
      const startIdx = this.currentIndex >= 0 && this.currentIndex < this.chunks.length ? this.currentIndex : 0;
      await this.playFromIndex(startIdx);
    }
  }
  pause() {
    if (this.status !== "playing")
      return;
    if (this.settings.engine === "system") {
      this.systemController.pause();
    } else if (this.audioEl) {
      this.audioEl.pause();
    }
    this.status = "paused";
    this.notify();
  }
  resume() {
    if (this.status !== "paused")
      return;
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
  stop() {
    this.playbackSessionId++;
    this.cleanupCurrentAudio();
    this.systemController.stop();
    this.status = "idle";
    this.notify();
  }
  async next() {
    if (this.chunks.length === 0)
      return;
    const nextIdx = Math.min(this.chunks.length - 1, this.currentIndex + 1);
    await this.playFromIndex(nextIdx);
  }
  async previous() {
    if (this.chunks.length === 0)
      return;
    const prevIdx = Math.max(0, this.currentIndex - 1);
    await this.playFromIndex(prevIdx);
  }
  setPlaybackRate(rate) {
    this.settings.playbackRate = rate;
    if (this.audioEl) {
      this.audioEl.playbackRate = rate;
    } else if (this.settings.engine === "system" && this.status === "playing" && this.currentIndex >= 0) {
      this.playFromIndex(this.currentIndex);
    }
    this.notify();
  }
  cleanupCurrentAudio() {
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
};

// src/voiceSidebarView.ts
var import_obsidian2 = require("obsidian");
var VIEW_TYPE_LOCAL_VOICE = "local-voice-sidebar-view";
var VoiceSidebarView = class extends import_obsidian2.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.unsubscribePlayer = null;
    this.isInstallingPiper = false;
    this.installStatusText = "";
    this.lastScrolledIndex = -1;
    this.renderedChunksSignature = "";
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_LOCAL_VOICE;
  }
  getDisplayText() {
    return "Local Voice (TTS)";
  }
  getIcon() {
    return "volume-2";
  }
  async onOpen() {
    this.buildUI();
    this.unsubscribePlayer = this.plugin.player.subscribe(() => {
      this.updateUIFromState();
    });
    if (this.plugin.player.chunks.length === 0) {
      this.plugin.loadActiveNoteIntoPlayer("full-note", false);
    } else {
      this.updateUIFromState();
    }
  }
  async onClose() {
    if (this.unsubscribePlayer) {
      this.unsubscribePlayer();
      this.unsubscribePlayer = null;
    }
  }
  buildUI() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass("lv-sidebar-container");
    const header = container.createDiv({ cls: "lv-header" });
    const titleRow = header.createDiv({ cls: "lv-title-row" });
    const titleIcon = titleRow.createSpan({ cls: "lv-title-icon" });
    (0, import_obsidian2.setIcon)(titleIcon, "headphones");
    this.headerTitleEl = titleRow.createDiv({
      cls: "lv-note-title",
      text: "Nenhuma nota selecionada"
    });
    this.modeBadgeEl = titleRow.createSpan({
      cls: "lv-mode-badge",
      text: "Nota Inteira"
    });
    const sourceActions = header.createDiv({ cls: "lv-source-actions" });
    const btnFull = sourceActions.createEl("button", {
      cls: "lv-source-btn",
      attr: { title: "Carregar e ler a nota inteira" }
    });
    const iconFull = btnFull.createSpan({ cls: "lv-btn-icon" });
    (0, import_obsidian2.setIcon)(iconFull, "file-text");
    btnFull.createSpan({ text: "Nota Inteira" });
    btnFull.addEventListener("click", () => {
      this.plugin.loadActiveNoteIntoPlayer("full-note", true);
    });
    const btnCursor = sourceActions.createEl("button", {
      cls: "lv-source-btn",
      attr: { title: "Ler a partir da posi\xE7\xE3o atual do cursor" }
    });
    const iconCursor = btnCursor.createSpan({ cls: "lv-btn-icon" });
    (0, import_obsidian2.setIcon)(iconCursor, "text-cursor-input");
    btnCursor.createSpan({ text: "Do Cursor" });
    btnCursor.addEventListener("click", () => {
      this.plugin.loadActiveNoteIntoPlayer("from-cursor", true);
    });
    const btnSelection = sourceActions.createEl("button", {
      cls: "lv-source-btn",
      attr: { title: "Ler apenas o texto selecionado" }
    });
    const iconSel = btnSelection.createSpan({ cls: "lv-btn-icon" });
    (0, import_obsidian2.setIcon)(iconSel, "highlighter");
    btnSelection.createSpan({ text: "Sele\xE7\xE3o" });
    btnSelection.addEventListener("click", () => {
      this.plugin.loadActiveNoteIntoPlayer("selection", true);
    });
    const configBar = container.createDiv({ cls: "lv-config-bar" });
    const engineField = configBar.createDiv({ cls: "lv-field-group" });
    engineField.createEl("label", {
      cls: "lv-field-label",
      text: "Motor TTS"
    });
    this.engineSelectEl = engineField.createEl("select", {
      cls: "lv-select"
    });
    this.engineSelectEl.createEl("option", {
      value: "edge",
      text: "\u26A1 Edge Neural (Sem API / Natural)"
    });
    this.engineSelectEl.createEl("option", {
      value: "piper",
      text: "\u{1F512} Piper TTS (100% Local / Offline)"
    });
    this.engineSelectEl.createEl("option", {
      value: "system",
      text: "\u{1F4BB} Vozes do Sistema (Windows)"
    });
    this.engineSelectEl.value = this.plugin.settings.engine;
    this.engineSelectEl.addEventListener("change", async () => {
      this.plugin.settings.engine = this.engineSelectEl.value;
      await this.plugin.saveSettings();
      this.populateVoiceDropdown();
      this.updatePiperBanner();
    });
    const voiceField = configBar.createDiv({ cls: "lv-field-group" });
    voiceField.createEl("label", { cls: "lv-field-label", text: "Voz" });
    this.voiceSelectEl = voiceField.createEl("select", {
      cls: "lv-select"
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
    this.piperBannerEl = container.createDiv({
      cls: "lv-piper-banner is-hidden"
    });
    this.statusBannerEl = container.createDiv({
      cls: "lv-status-banner is-hidden"
    });
    const playerCard = container.createDiv({ cls: "lv-player-card" });
    const controlsRow = playerCard.createDiv({ cls: "lv-controls-row" });
    this.prevBtnEl = controlsRow.createEl("button", {
      cls: "lv-ctrl-btn",
      attr: { title: "Par\xE1grafo anterior" }
    });
    (0, import_obsidian2.setIcon)(this.prevBtnEl, "skip-back");
    this.prevBtnEl.addEventListener("click", () => {
      this.plugin.player.previous();
    });
    this.playBtnEl = controlsRow.createEl("button", {
      cls: "lv-ctrl-btn lv-play-btn",
      attr: { title: "Play / Pause" }
    });
    (0, import_obsidian2.setIcon)(this.playBtnEl, "play");
    this.playBtnEl.addEventListener("click", () => {
      if (this.plugin.player.chunks.length === 0) {
        this.plugin.loadActiveNoteIntoPlayer("full-note", true);
      } else {
        this.plugin.player.togglePlayPause();
      }
    });
    this.stopBtnEl = controlsRow.createEl("button", {
      cls: "lv-ctrl-btn",
      attr: { title: "Parar leitura" }
    });
    (0, import_obsidian2.setIcon)(this.stopBtnEl, "square");
    this.stopBtnEl.addEventListener("click", () => {
      this.plugin.player.stop();
    });
    this.nextBtnEl = controlsRow.createEl("button", {
      cls: "lv-ctrl-btn",
      attr: { title: "Pr\xF3ximo par\xE1grafo" }
    });
    (0, import_obsidian2.setIcon)(this.nextBtnEl, "skip-forward");
    this.nextBtnEl.addEventListener("click", () => {
      this.plugin.player.next();
    });
    this.speedSelectEl = controlsRow.createEl("select", {
      cls: "lv-speed-select",
      attr: { title: "Velocidade de reprodu\xE7\xE3o" }
    });
    for (const rate of [0.75, 1, 1.25, 1.5, 1.75, 2]) {
      this.speedSelectEl.createEl("option", {
        value: String(rate),
        text: `${rate}x`
      });
    }
    this.speedSelectEl.value = String(this.plugin.settings.playbackRate);
    this.speedSelectEl.addEventListener("change", async () => {
      const rate = parseFloat(this.speedSelectEl.value) || 1;
      this.plugin.settings.playbackRate = rate;
      this.plugin.player.setPlaybackRate(rate);
      await this.plugin.saveSettings();
    });
    const progressArea = playerCard.createDiv({ cls: "lv-progress-area" });
    const progressBarTrack = progressArea.createDiv({
      cls: "lv-progress-track"
    });
    this.progressFillEl = progressBarTrack.createDiv({
      cls: "lv-progress-fill"
    });
    this.progressTextEl = progressArea.createDiv({
      cls: "lv-progress-text",
      text: "Pronto para ler"
    });
    const transcriptHeader = container.createDiv({
      cls: "lv-transcript-header"
    });
    transcriptHeader.createSpan({
      text: "Par\xE1grafos da Nota (clique para ouvir daqui)"
    });
    this.transcriptContainerEl = container.createDiv({
      cls: "lv-transcript-list"
    });
    this.updatePiperBanner();
  }
  populateVoiceDropdown() {
    if (!this.voiceSelectEl)
      return;
    this.voiceSelectEl.empty();
    const engine = this.plugin.settings.engine;
    if (engine === "edge") {
      for (const v of CURATED_EDGE_VOICES) {
        this.voiceSelectEl.createEl("option", {
          value: v.shortName,
          text: v.friendlyName
        });
      }
      this.voiceSelectEl.value = this.plugin.settings.edgeVoice;
    } else if (engine === "piper") {
      for (const m of PIPER_MODELS) {
        this.voiceSelectEl.createEl("option", {
          value: m.id,
          text: `${m.name} [${m.quality}]`
        });
      }
      this.voiceSelectEl.value = this.plugin.settings.piperVoiceId;
    } else {
      const sysVoices = getSystemVoices();
      this.voiceSelectEl.createEl("option", {
        value: "",
        text: "Autom\xE1tica (Portugu\xEAs / Padr\xE3o do Windows)"
      });
      for (const sv of sysVoices) {
        this.voiceSelectEl.createEl("option", {
          value: sv.voiceURI,
          text: sv.name
        });
      }
      this.voiceSelectEl.value = this.plugin.settings.systemVoiceURI;
    }
  }
  updatePiperBanner() {
    if (!this.piperBannerEl)
      return;
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
      text: "\u{1F4E6} Motor Offline Piper TTS"
    });
    if (this.isInstallingPiper) {
      title.setText("\u23F3 Instalando Piper TTS Offline...");
      this.piperBannerEl.createDiv({
        cls: "lv-piper-banner-desc",
        text: this.installStatusText || "Iniciando download..."
      });
      return;
    }
    this.piperBannerEl.createDiv({
      cls: "lv-piper-banner-desc",
      text: `O motor Piper ou a voz '${this.plugin.settings.piperVoiceId}' ainda n\xE3o est\xE1 baixada na pasta do plugin.`
    });
    const installBtn = this.piperBannerEl.createEl("button", {
      cls: "lv-install-btn mod-cta",
      text: "\u2B07\uFE0F Baixar Piper + Voz Offline Automaticamente (1 Clique)"
    });
    installBtn.addEventListener("click", async () => {
      if (this.isInstallingPiper)
        return;
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
        new import_obsidian2.Notice("\u2705 Piper TTS e voz instalados com sucesso!");
      } catch (err) {
        new import_obsidian2.Notice(
          `\u274C Erro ao instalar Piper TTS: ${err?.message || err}`
        );
      } finally {
        this.isInstallingPiper = false;
        this.updatePiperBanner();
      }
    });
  }
  updateUIFromState() {
    if (!this.headerTitleEl)
      return;
    const player = this.plugin.player;
    this.headerTitleEl.setText(player.noteTitle);
    const modeLabels = {
      "full-note": "Nota Inteira",
      "from-cursor": "Do Cursor",
      selection: "Sele\xE7\xE3o"
    };
    this.modeBadgeEl.setText(modeLabels[player.sourceMode]);
    if (this.engineSelectEl.value !== this.plugin.settings.engine) {
      this.engineSelectEl.value = this.plugin.settings.engine;
      this.populateVoiceDropdown();
    }
    this.speedSelectEl.value = String(this.plugin.settings.playbackRate);
    this.updatePiperBanner();
    if (player.errorMessage) {
      this.statusBannerEl.removeClass("is-hidden");
      this.statusBannerEl.setText(`\u26A0\uFE0F ${player.errorMessage}`);
    } else {
      this.statusBannerEl.addClass("is-hidden");
    }
    this.playBtnEl.empty();
    this.playBtnEl.removeClass("is-loading");
    if (player.status === "playing") {
      (0, import_obsidian2.setIcon)(this.playBtnEl, "pause");
      this.playBtnEl.setAttr("title", "Pausar leitura");
    } else if (player.status === "loading") {
      (0, import_obsidian2.setIcon)(this.playBtnEl, "loader");
      this.playBtnEl.addClass("is-loading");
      this.playBtnEl.setAttr("title", "Gerando voz...");
    } else {
      (0, import_obsidian2.setIcon)(this.playBtnEl, "play");
      this.playBtnEl.setAttr("title", "Iniciar leitura");
    }
    const total = player.chunks.length;
    const current = player.currentIndex >= 0 ? player.currentIndex + 1 : 0;
    if (total === 0) {
      this.progressTextEl.setText("Nenhum par\xE1grafo carregado");
      this.progressFillEl.style.width = "0%";
    } else {
      const statusLabel = player.status === "playing" ? "\u{1F50A} Lendo" : player.status === "loading" ? "\u23F3 Sintetizando" : player.status === "paused" ? "\u23F8\uFE0F Pausado" : "\u23F9\uFE0F Pronto";
      this.progressTextEl.setText(
        `${statusLabel} \u2022 Par\xE1grafo ${current} de ${total}`
      );
      const pct = Math.round(current / total * 100);
      this.progressFillEl.style.width = `${pct}%`;
    }
    const signature = `${player.notePath}:${player.sourceMode}:${player.chunks.length}:${player.chunks[0]?.spokenText?.slice(0, 20) || ""}`;
    if (signature !== this.renderedChunksSignature) {
      this.renderedChunksSignature = signature;
      this.renderTranscriptChunks();
    }
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
    if (this.plugin.settings.autoScrollSidebar && player.currentIndex >= 0 && player.currentIndex !== this.lastScrolledIndex) {
      this.lastScrolledIndex = player.currentIndex;
      const activeEl = items[player.currentIndex];
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    }
  }
  renderTranscriptChunks() {
    this.transcriptContainerEl.empty();
    this.lastScrolledIndex = -1;
    const chunks = this.plugin.player.chunks;
    if (chunks.length === 0) {
      const emptyEl = this.transcriptContainerEl.createDiv({
        cls: "lv-empty-state"
      });
      emptyEl.createDiv({
        cls: "lv-empty-title",
        text: "Nenhum texto para ler"
      });
      emptyEl.createDiv({
        cls: "lv-empty-desc",
        text: "Abra uma nota em Markdown e clique em Play ou 'Nota Inteira' para come\xE7ar a ouvir."
      });
      return;
    }
    for (const chunk of chunks) {
      const itemEl = this.transcriptContainerEl.createDiv({
        cls: `lv-chunk-item ${chunk.isHeading ? "is-heading" : ""}`
      });
      const indexBadge = itemEl.createSpan({
        cls: "lv-chunk-index",
        text: String(chunk.index + 1)
      });
      const textSpan = itemEl.createDiv({
        cls: "lv-chunk-text",
        text: chunk.displayText
      });
      itemEl.addEventListener("click", () => {
        this.plugin.player.playFromIndex(chunk.index);
      });
    }
  }
};

// src/settingsTab.ts
var import_obsidian3 = require("obsidian");
var LocalVoiceSettingTab = class extends import_obsidian3.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Local Voice (TTS Reader)" });
    containerEl.createEl("p", {
      text: "Configure o motor de leitura em voz alta (TTS), gerencie vozes offline do Piper TTS e ajuste a limpeza de Markdown."
    });
    new import_obsidian3.Setting(containerEl).setName("Motor de Voz (TTS Engine)").setDesc(
      "Escolha entre Edge Neural (gratuito e sem chave de API), Piper TTS (100% local e offline) ou Vozes Nativas do Windows."
    ).addDropdown(
      (dropdown) => dropdown.addOption(
        "edge",
        "\u26A1 Edge Neural TTS (Sem API Key \u2022 Vozes Neurais PT-BR)"
      ).addOption(
        "piper",
        "\u{1F512} Piper TTS (100% Local e Offline \u2022 Roda na CPU)"
      ).addOption(
        "system",
        "\u{1F4BB} Vozes Nativas do Sistema (Windows SAPI / Web Speech)"
      ).setValue(this.plugin.settings.engine).onChange(async (value) => {
        this.plugin.settings.engine = value;
        await this.plugin.saveSettings();
        this.display();
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Velocidade Padr\xE3o de Leitura").setDesc("Velocidade de reprodu\xE7\xE3o do \xE1udio (0.75x at\xE9 2.0x).").addDropdown((drop) => {
      for (const r of [0.75, 1, 1.25, 1.5, 1.75, 2]) {
        drop.addOption(String(r), `${r}x`);
      }
      drop.setValue(String(this.plugin.settings.playbackRate));
      drop.onChange(async (val) => {
        const num = parseFloat(val) || 1;
        this.plugin.settings.playbackRate = num;
        this.plugin.player.setPlaybackRate(num);
        await this.plugin.saveSettings();
      });
    });
    if (this.plugin.settings.engine === "edge") {
      containerEl.createEl("h3", {
        text: "\u26A1 Configura\xE7\xF5es do Edge Neural TTS (Sem Chave de API)"
      });
      const edgeVoiceSetting = new import_obsidian3.Setting(containerEl).setName("Voz Neural do Edge").setDesc(
        "Vozes neurais naturais da Microsoft (n\xE3o requer conta nem chave de API)."
      ).addDropdown((drop) => {
        for (const v of CURATED_EDGE_VOICES) {
          drop.addOption(v.shortName, v.friendlyName);
        }
        drop.setValue(this.plugin.settings.edgeVoice);
        drop.onChange(async (val) => {
          this.plugin.settings.edgeVoice = val;
          await this.plugin.saveSettings();
        });
      });
      edgeVoiceSetting.addButton(
        (btn) => btn.setButtonText("Carregar Todas as Vozes").onClick(async () => {
          btn.setButtonText("Carregando...");
          const allVoices = await fetchEdgeVoices();
          new import_obsidian3.Notice(
            `${allVoices.length} vozes carregadas do servidor!`
          );
          this.display();
        })
      );
    } else if (this.plugin.settings.engine === "piper") {
      containerEl.createEl("h3", {
        text: "\u{1F512} Configura\xE7\xF5es do Piper TTS (100% Local e Offline)"
      });
      const pluginDir = this.plugin.getPluginDir();
      const exePath = resolvePiperExePath(
        pluginDir,
        this.plugin.settings
      );
      new import_obsidian3.Setting(containerEl).setName("Status do Execut\xE1vel Piper").setDesc(
        exePath ? `\u2705 Instalado em: ${exePath}` : "\u26A0\uFE0F Execut\xE1vel n\xE3o encontrado. Clique em qualquer bot\xE3o 'Baixar & Ativar' abaixo para instalar automaticamente."
      );
      new import_obsidian3.Setting(containerEl).setName("Voz Ativa do Piper").setDesc("Selecione qual modelo de voz local usar.").addDropdown((drop) => {
        for (const m of PIPER_MODELS) {
          const installed = isVoiceModelInstalled(
            pluginDir,
            m.id
          );
          drop.addOption(
            m.id,
            `${installed ? "\u2705 " : "\u2B07\uFE0F "}${m.name} (${m.quality})`
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
        text: "Gerenciador de Vozes Offline (Download com 1 Clique)"
      });
      for (const model of PIPER_MODELS) {
        const isInstalled = isVoiceModelInstalled(pluginDir, model.id);
        const isSelected = this.plugin.settings.piperVoiceId === model.id;
        new import_obsidian3.Setting(containerEl).setName(
          `${model.name} ${isSelected ? "\u2B50 (Selecionada)" : ""}`
        ).setDesc(
          `Idioma: ${model.language} \u2022 Qualidade: ${model.quality} \u2022 Tamanho: ${model.sizeLabel} \u2022 Status: ${isInstalled ? "\u2705 Instalada no seu PC" : "N\xE3o baixada"}`
        ).addButton((btn) => {
          btn.setButtonText(
            isInstalled ? isSelected ? "\u2705 Pronta e Ativa" : "Usar esta Voz" : "\u2B07\uFE0F Baixar & Ativar"
          );
          if (!isInstalled) {
            btn.setCta();
          }
          btn.onClick(async () => {
            if (isInstalled) {
              this.plugin.settings.piperVoiceId = model.id;
              await this.plugin.saveSettings();
              new import_obsidian3.Notice(`Voz alterada para ${model.name}`);
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
              new import_obsidian3.Notice(
                `\u2705 ${model.name} instalada e ativada!`
              );
              this.display();
            } catch (err) {
              new import_obsidian3.Notice(
                `\u274C Erro no download: ${err?.message || err}`
              );
              btn.setDisabled(false);
              btn.setButtonText("\u2B07\uFE0F Tentar Novamente");
            }
          });
        });
      }
      new import_obsidian3.Setting(containerEl).setName("Caminho Customizado do piper.exe (Opcional)").setDesc(
        "Deixe em branco para usar o Piper instalado automaticamente na pasta do plugin."
      ).addText(
        (text) => text.setPlaceholder("Ex: C:\\piper\\piper.exe").setValue(this.plugin.settings.customPiperExePath).onChange(async (value) => {
          this.plugin.settings.customPiperExePath = value.trim();
          await this.plugin.saveSettings();
        })
      );
      new import_obsidian3.Setting(containerEl).setName("Caminho Customizado de Modelo .onnx (Opcional)").setDesc(
        "Deixe em branco para usar os modelos baixados pelo gerenciador acima."
      ).addText(
        (text) => text.setPlaceholder(
          "Ex: C:\\piper\\models\\pt_BR-faber-medium.onnx"
        ).setValue(this.plugin.settings.customPiperModelPath).onChange(async (value) => {
          this.plugin.settings.customPiperModelPath = value.trim();
          await this.plugin.saveSettings();
        })
      );
    } else {
      containerEl.createEl("h3", {
        text: "\u{1F4BB} Configura\xE7\xF5es das Vozes Nativas do Sistema"
      });
      const sysVoices = getSystemVoices();
      new import_obsidian3.Setting(containerEl).setName("Voz do Windows / Sistema").setDesc(
        "Usa as vozes j\xE1 instaladas no seu Windows (offline e instant\xE2neo)."
      ).addDropdown((drop) => {
        drop.addOption("", "Autom\xE1tica (Portugu\xEAs / Padr\xE3o)");
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
    containerEl.createEl("h3", {
      text: "\u{1F9F9} Limpeza de Markdown e Comportamento"
    });
    new import_obsidian3.Setting(containerEl).setName("Auto-scroll na Aba Lateral").setDesc(
      "Rola automaticamente a lista de par\xE1grafos na aba lateral conforme a leitura avan\xE7a."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoScrollSidebar).onChange(async (val) => {
        this.plugin.settings.autoScrollSidebar = val;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Acompanhar Par\xE1grafo no Editor da Nota").setDesc(
      "Rola suavemente a nota aberta para a linha do par\xE1grafo que est\xE1 sendo lido no momento."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.scrollEditorWithPlayback).onChange(async (val) => {
        this.plugin.settings.scrollEditorWithPlayback = val;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Pr\xE9-carregar Pr\xF3ximo Par\xE1grafo (Zero Pausa)").setDesc(
      "Sintetiza o pr\xF3ximo par\xE1grafo em segundo plano enquanto o atual est\xE1 tocando para leitura cont\xEDnua sem pausas."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.prefetchNextChunk).onChange(async (val) => {
        this.plugin.settings.prefetchNextChunk = val;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Ignorar Blocos de C\xF3digo (```)").setDesc("Pula blocos de c\xF3digo durante a leitura em voz alta.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.ignoreCodeBlocks).onChange(async (val) => {
        this.plugin.settings.ignoreCodeBlocks = val;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Ignorar Propriedades / Frontmatter YAML").setDesc("Pula o bloco YAML (---) no topo das notas.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.ignoreFrontmatter).onChange(async (val) => {
        this.plugin.settings.ignoreFrontmatter = val;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Ignorar URLs puras (http/https)").setDesc("Evita soletrar endere\xE7os web longos.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.ignoreUrls).onChange(async (val) => {
        this.plugin.settings.ignoreUrls = val;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian3.Setting(containerEl).setName("Ignorar Tabelas Markdown").setDesc("Se ativado, pula tabelas inteiras durante a leitura.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.ignoreTables).onChange(async (val) => {
        this.plugin.settings.ignoreTables = val;
        await this.plugin.saveSettings();
      })
    );
  }
};

// src/main.ts
var LocalVoicePlugin = class extends import_obsidian4.Plugin {
  async onload() {
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
    this.addCommand({
      id: "open-local-voice-sidebar",
      name: "Abrir painel lateral de leitura (Local Voice)",
      callback: async () => {
        await this.activateSidebarView();
      }
    });
    this.addCommand({
      id: "read-active-note-aloud",
      name: "Ler nota atual em voz alta (Play / Pause)",
      callback: async () => {
        await this.activateSidebarView();
        if (this.player.status === "playing" || this.player.status === "paused") {
          await this.player.togglePlayPause();
        } else {
          await this.loadActiveNoteIntoPlayer("full-note", true);
        }
      }
    });
    this.addCommand({
      id: "read-selected-text-aloud",
      name: "Ler texto selecionado em voz alta",
      editorCallback: async () => {
        await this.activateSidebarView();
        await this.loadActiveNoteIntoPlayer("selection", true);
      }
    });
    this.addCommand({
      id: "read-from-cursor-aloud",
      name: "Ler nota a partir do cursor atual",
      editorCallback: async () => {
        await this.activateSidebarView();
        await this.loadActiveNoteIntoPlayer("from-cursor", true);
      }
    });
    this.addCommand({
      id: "stop-reading-aloud",
      name: "Parar leitura em voz alta",
      callback: () => {
        this.player.stop();
      }
    });
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor) => {
        const hasSelection = editor.somethingSelected();
        if (hasSelection) {
          menu.addItem((item) => {
            item.setTitle("\u{1F50A} Ler sele\xE7\xE3o em voz alta (Local Voice)").setIcon("volume-2").onClick(async () => {
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
            "\u{1F50A} Ler a partir daqui em voz alta (Local Voice)"
          ).setIcon("play").onClick(async () => {
            await this.activateSidebarView();
            await this.loadActiveNoteIntoPlayer(
              "from-cursor",
              true
            );
          });
        });
      })
    );
    this.registerEvent(
      this.app.workspace.on("file-open", async (file) => {
        if (file && file.extension === "md" && this.player.status === "idle") {
          await this.loadFileIntoPlayer(file, "full-note", false);
        }
      })
    );
    this.addSettingTab(new LocalVoiceSettingTab(this.app, this));
  }
  onunload() {
    if (this.player) {
      this.player.stop();
    }
  }
  getPluginDir() {
    const adapter = this.app.vault.adapter;
    if (adapter instanceof import_obsidian4.FileSystemAdapter) {
      return path2.join(
        adapter.getBasePath(),
        this.app.vault.configDir,
        "plugins",
        this.manifest.id
      );
    }
    return "";
  }
  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData()
    );
  }
  async saveSettings() {
    await this.saveData(this.settings);
    if (this.player) {
      this.player.updateSettings(this.settings);
    }
  }
  async activateSidebarView() {
    const { workspace } = this.app;
    let leaf = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_LOCAL_VOICE);
    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = workspace.getRightLeaf(false);
      if (leaf) {
        await leaf.setViewState({
          type: VIEW_TYPE_LOCAL_VOICE,
          active: true
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
  async loadActiveNoteIntoPlayer(mode = "full-note", autoPlay = false) {
    let mdView = this.app.workspace.getActiveViewOfType(import_obsidian4.MarkdownView);
    if (!mdView) {
      const mdLeaves = this.app.workspace.getLeavesOfType("markdown");
      if (mdLeaves.length > 0 && mdLeaves[0].view instanceof import_obsidian4.MarkdownView) {
        mdView = mdLeaves[0].view;
      }
    }
    if (mdView && mdView.file) {
      const editor = mdView.editor;
      const file = mdView.file;
      if (mode === "selection") {
        const selectedText = editor.getSelection();
        if (!selectedText || !selectedText.trim()) {
          new import_obsidian4.Notice(
            "Selecione um trecho de texto no editor primeiro, ou clique em 'Nota Inteira'."
          );
          return;
        }
        const fromPos = editor.getCursor("from");
        const chunks2 = parseMarkdownToChunks(
          selectedText,
          this.settings,
          fromPos.line
        );
        this.player.loadChunks(
          chunks2,
          file.basename,
          file.path,
          "selection"
        );
        if (autoPlay && chunks2.length > 0) {
          await this.player.playFromIndex(0);
        }
        return;
      }
      if (mode === "from-cursor") {
        const cursor = editor.getCursor("from");
        const fullText = editor.getValue();
        const allLines = fullText.split(/\r?\n/);
        const slicedText = allLines.slice(cursor.line).join("\n");
        const chunks2 = parseMarkdownToChunks(
          slicedText,
          this.settings,
          cursor.line
        );
        this.player.loadChunks(
          chunks2,
          file.basename,
          file.path,
          "from-cursor"
        );
        if (autoPlay && chunks2.length > 0) {
          await this.player.playFromIndex(0);
        }
        return;
      }
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
    const activeFile = this.app.workspace.getActiveFile();
    if (activeFile && activeFile.extension === "md") {
      await this.loadFileIntoPlayer(activeFile, "full-note", autoPlay);
    } else {
      new import_obsidian4.Notice("Abra uma nota em Markdown para ler em voz alta.");
    }
  }
  async loadFileIntoPlayer(file, mode = "full-note", autoPlay = false) {
    const content = await this.app.vault.cachedRead(file);
    const chunks = parseMarkdownToChunks(content, this.settings, 0);
    this.player.loadChunks(chunks, file.basename, file.path, mode);
    if (autoPlay && chunks.length > 0) {
      await this.player.playFromIndex(0);
    }
  }
  scrollEditorToChunk(chunk) {
    if (!this.settings.scrollEditorWithPlayback)
      return;
    const mdLeaves = this.app.workspace.getLeavesOfType("markdown");
    for (const leaf of mdLeaves) {
      if (leaf.view instanceof import_obsidian4.MarkdownView && leaf.view.file?.path === this.player.notePath) {
        const editor = leaf.view.editor;
        editor.scrollIntoView(
          {
            from: { line: chunk.startLine, ch: 0 },
            to: { line: chunk.endLine, ch: 0 }
          },
          true
        );
        break;
      }
    }
  }
};
