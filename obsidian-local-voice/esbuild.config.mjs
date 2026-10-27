import esbuild from "esbuild";
import process from "process";
import fs from "fs";
import path from "path";

const prod = process.argv[2] === "production";

const context = await esbuild.context({
	entryPoints: ["src/main.ts"],
	bundle: true,
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		"child_process",
		"crypto",
		"fs",
		"http",
		"https",
		"os",
		"path",
		"stream",
		"tls",
		"url",
		"util",
		"zlib"
	],
	format: "cjs",
	target: "es2021",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	treeShaking: true,
	outfile: "main.js",
});

if (prod) {
	await context.rebuild();
	// Also copy ready-to-install files into dist/obsidian-local-voice
	const distDir = path.join(process.cwd(), "dist", "obsidian-local-voice");
	fs.mkdirSync(distDir, { recursive: true });
	for (const file of ["main.js", "manifest.json", "styles.css"]) {
		if (fs.existsSync(file)) {
			fs.copyFileSync(file, path.join(distDir, file));
		}
	}
	console.log("Build concluído! Arquivos prontos em: dist/obsidian-local-voice/");
	process.exit(0);
} else {
	await context.watch();
}
