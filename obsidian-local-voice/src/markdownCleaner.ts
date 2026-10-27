import { LocalVoiceSettings, ParagraphChunk } from "./types";

/**
 * Cleans a single inline or multi-line string of Markdown syntax
 * so it sounds natural when read aloud by a TTS engine.
 */
export function cleanInlineMarkdown(
	raw: string,
	settings: LocalVoiceSettings
): string {
	let text = raw;

	// Remove Obsidian comments %% ... %%
	text = text.replace(/%%[\s\S]*?%%/g, " ");

	// Remove HTML comments <!-- ... -->
	text = text.replace(/<!--[\s\S]*?-->/g, " ");

	// Remove embedded images/files ![[...]] and ![alt](url)
	text = text.replace(/!\[\[[^\]]*\]\]/g, " ");
	text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, " ");

	// Replace WikiLinks with alias [[Target|Alias]] -> Alias
	text = text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2");

	// Replace WikiLinks with heading [[Target#Heading]] -> Target, Heading
	text = text.replace(/\[\[([^\]#]+)#([^\]]+)\]\]/g, "$1, $2");

	// Replace plain WikiLinks [[Target]] -> Target
	text = text.replace(/\[\[([^\]]+)\]\]/g, "$1");

	// Replace Markdown links [Text](url) -> Text
	text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

	// Remove raw URLs if enabled
	if (settings.ignoreUrls) {
		text = text.replace(/https?:\/\/[^\s)>]+/gi, " ");
	}

	// Remove block MathJax $$...$$ and inline $...$
	text = text.replace(/\$\$[\s\S]*?\$\$/g, " ");
	text = text.replace(/\$([^$\n]+)\$/g, "$1");

	// Remove inline code backticks but keep the word inside
	text = text.replace(/`+([^`]+)`+/g, "$1");

	// Remove footnote markers [^1]
	text = text.replace(/\[\^[^\]]+\]/g, " ");

	// Remove HTML tags
	text = text.replace(/<[^>]+>/g, " ");

	// Remove callout syntax [!NOTE], [!WARNING], etc.
	text = text.replace(/\[![a-zA-Z0-9_-]+\][+-]?/g, " ");

	// Remove task list checkboxes - [ ], - [x], - [/]
	text = text.replace(/^\s*[-*+]\s*\[[ xX/\->?]\]\s+/gm, "");

	// Remove bullet/numbered list markers at start of lines
	text = text.replace(/^\s*[-*+]\s+/gm, "");

	// Remove blockquote markers '>'
	text = text.replace(/^\s*>+\s?/gm, "");

	// Remove bold, italic, strikethrough, highlight markers
	text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");
	text = text.replace(/(\*|_)(.*?)\1/g, "$2");
	text = text.replace(/~~(.*?)~~/g, "$1");
	text = text.replace(/==(.*?)==/g, "$1");

	// Clean table pipes if not ignoring tables
	text = text.replace(/\|/g, ", ");

	// Collapse multiple commas/spaces/newlines
	text = text.replace(/\s+/g, " ").trim();

	return text;
}

/**
 * Parses a Markdown document into an array of ParagraphChunks,
 * preserving accurate line numbers in the original note.
 */
export function parseMarkdownToChunks(
	markdown: string,
	settings: LocalVoiceSettings,
	baseStartLine = 0
): ParagraphChunk[] {
	const lines = markdown.split(/\r?\n/);
	const chunks: ParagraphChunk[] = [];

	let i = 0;

	// 1. Skip YAML frontmatter at top of document (if baseStartLine === 0)
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

	let currentParagraphLines: string[] = [];
	let currentStartLine = i;

	const flushParagraph = (endLineIdx: number) => {
		if (currentParagraphLines.length === 0) return;
		const rawBlock = currentParagraphLines.join("\n").trim();
		currentParagraphLines = [];
		if (!rawBlock) return;

		// Check if it's purely a horizontal rule or table separator
		if (/^([-*_]\s*){3,}$/.test(rawBlock)) return;
		if (/^[\s|:-]+$/.test(rawBlock)) return;

		const spokenText = cleanInlineMarkdown(rawBlock, settings);
		// Ensure it contains at least one letter or number
		if (!spokenText || !/[\p{L}\p{N}]/u.test(spokenText)) return;

		chunks.push({
			index: chunks.length,
			spokenText,
			displayText: spokenText,
			isHeading: false,
			startLine: baseStartLine + currentStartLine,
			endLine: baseStartLine + endLineIdx,
		});
	};

	while (i < lines.length) {
		const line = lines[i];
		const trimmed = line.trim();

		// Handle fenced code blocks ``` or ~~~
		if (/^(`{3,}|~{3,})/.test(trimmed)) {
			flushParagraph(i - 1);
			const fence = trimmed.match(/^(`{3,}|~{3,})/)![1][0];
			const codeStart = i;
			i++;
			const codeContent: string[] = [];
			while (
				i < lines.length &&
				!new RegExp(`^\\s*${fence}{3,}`).test(lines[i])
			) {
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
						displayText: `[Código] ${spoken}`,
						isHeading: false,
						startLine: baseStartLine + codeStart,
						endLine: baseStartLine + codeEnd,
					});
				}
			}
			i++;
			currentStartLine = i;
			continue;
		}

		// Handle multi-line Obsidian comments %% ... %%
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

		// Handle multi-line MathJax blocks $$ ... $$
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

		// Handle blank line -> paragraph boundary
		if (trimmed === "") {
			flushParagraph(i - 1);
			i++;
			currentStartLine = i;
			continue;
		}

		// Handle Markdown Headings (# Heading)
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
					endLine: baseStartLine + i,
				});
			}
			i++;
			currentStartLine = i;
			continue;
		}

		// Handle tables
		if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
			if (settings.ignoreTables) {
				flushParagraph(i - 1);
				i++;
				currentStartLine = i;
				continue;
			}
			// Skip markdown table divider line like |---|---|
			if (/^[\s|:-]+$/.test(trimmed)) {
				i++;
				continue;
			}
		}

		// Handle Callout header line > [!NOTE] Title
		if (/^>\s*\[![a-zA-Z0-9_-]+\]/.test(trimmed)) {
			flushParagraph(i - 1);
			if (!settings.ignoreCalloutHeaders) {
				const afterTag = trimmed.replace(/^>\s*\[![a-zA-Z0-9_-]+\][+-]?\s*/, "");
				const spoken = cleanInlineMarkdown(afterTag, settings);
				if (spoken && /[\p{L}\p{N}]/u.test(spoken)) {
					chunks.push({
						index: chunks.length,
						spokenText: spoken,
						displayText: `📌 ${spoken}`,
						isHeading: true,
						headingLevel: 4,
						startLine: baseStartLine + i,
						endLine: baseStartLine + i,
					});
				}
			}
			i++;
			currentStartLine = i;
			continue;
		}

		// List items: treat each list item as its own readable chunk so highlighting is granular
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
