#!/usr/bin/env node
// Checks the docs for mistakes that would otherwise only show up as a 404 or a
// missing page: run by `npm run build` (the `prebuild` script), so a broken
// docs change fails the build instead of reaching the site.
//
//   node scripts/check-docs.mjs
//
// It checks that:
//   - every page in src/lib/docs.ts has a file in src/content/docs, and every
//     file there is listed (an unlisted file is a page that cannot be reached);
//   - no slug is used twice;
//   - a page's `features` are all listed in `docFeatures`, and a tutorial has
//     at least one;
//   - every internal link in the docs (Markdown links) and in the app's pages
//     and components (href="/…") points at a page that exists.
//
// External links and `#anchors` are not checked. It also reports how many
// screenshots are still marked as to do; that is information, not an error.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const docsSource = readFileSync(path.join(root, "src/lib/docs.ts"), "utf8");
const contentDir = path.join(root, "src/content/docs");
const problems = [];

// ── docs.ts ──────────────────────────────────────────────────────────────

/** The text of the array assigned to `export const <name>`, brackets excluded. */
function arrayBody(name) {
	const start = docsSource.indexOf(`export const ${name}`);
	if (start === -1) throw new Error(`docs.ts has no export named ${name}`);
	const open = docsSource.indexOf("= [", start) + 2;
	let depth = 0;
	for (let i = open; i < docsSource.length; i++) {
		if (docsSource[i] === "[") depth++;
		if (docsSource[i] === "]" && --depth === 0) return docsSource.slice(open + 1, i);
	}
	throw new Error(`docs.ts: the ${name} array is not closed`);
}

/** The top-level `{ … }` objects of an array body. */
function objects(body) {
	const found = [];
	let depth = 0;
	let begin = -1;
	for (let i = 0; i < body.length; i++) {
		if (body[i] === "{") {
			if (depth++ === 0) begin = i;
		} else if (body[i] === "}" && --depth === 0) {
			found.push(body.slice(begin, i + 1));
		}
	}
	return found;
}

const field = (object, name) => object.match(new RegExp(`\\b${name}:\\s*"([^"]*)"`))?.[1];

const features = objects(arrayBody("docFeatures")).map((o) => field(o, "slug"));
const pages = objects(arrayBody("docPages")).map((o) => ({
	slug: field(o, "slug"),
	kind: field(o, "kind") ?? "guide",
	features: [...(o.match(/\bfeatures:\s*\[([^\]]*)\]/)?.[1].matchAll(/"([^"]+)"/g) ?? [])].map(
		(m) => m[1],
	),
}));

const seen = new Set();
for (const page of pages) {
	if (!page.slug) {
		problems.push("docs.ts: a page has no slug");
		continue;
	}
	if (seen.has(page.slug)) problems.push(`docs.ts: the slug "${page.slug}" is used twice`);
	seen.add(page.slug);
	if (!existsSync(path.join(contentDir, `${page.slug}.md`))) {
		problems.push(`docs.ts: "${page.slug}" has no file src/content/docs/${page.slug}.md`);
	}
	for (const feature of page.features) {
		if (!features.includes(feature)) {
			problems.push(`docs.ts: "${page.slug}" is under the unknown feature "${feature}"`);
		}
	}
	if (page.kind === "tutorial" && page.features.length === 0) {
		problems.push(`docs.ts: the tutorial "${page.slug}" is not under any feature`);
	}
}

const files = readdirSync(contentDir).filter((f) => f.endsWith(".md"));
for (const file of files) {
	const slug = file.slice(0, -3);
	if (!seen.has(slug)) problems.push(`src/content/docs/${file} is not listed in docs.ts, so it has no page`);
}

// ── Routes that exist ────────────────────────────────────────────────────

const routes = new Set(["/"]);
function walk(dir, prefix) {
	for (const entry of readdirSync(dir)) {
		const full = path.join(dir, entry);
		if (!statSync(full).isDirectory()) continue;
		if (existsSync(path.join(full, "page.tsx"))) routes.add(`${prefix}/${entry}`);
		walk(full, `${prefix}/${entry}`);
	}
}
walk(path.join(root, "src/app"), "");
for (const page of pages) routes.add(`/docs/${page.slug}`);
const tutorialFeatures = new Set(pages.filter((p) => p.kind === "tutorial").flatMap((p) => p.features));
for (const feature of tutorialFeatures) routes.add(`/docs/tutorials/${feature}`);
// Dynamic routes the app serves itself.
const dynamicRoutes = [/^\/extensions\/[^/]+$/];

function resolves(href) {
	const target = href.split("#")[0].split("?")[0].replace(/(.)\/$/, "$1");
	return target === "" || routes.has(target) || dynamicRoutes.some((r) => r.test(target));
}

// ── Links ────────────────────────────────────────────────────────────────

function stripCode(markdown) {
	return markdown.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
}

for (const file of files) {
	const text = stripCode(readFileSync(path.join(contentDir, file), "utf8"));
	for (const match of text.matchAll(/\]\((\/[^)\s]*)\)/g)) {
		if (!resolves(match[1])) problems.push(`src/content/docs/${file}: the link ${match[1]} goes nowhere`);
	}
}

function sourceFiles(dir) {
	return readdirSync(dir).flatMap((entry) => {
		const full = path.join(dir, entry);
		if (statSync(full).isDirectory()) return sourceFiles(full);
		return /\.(tsx|ts)$/.test(entry) ? [full] : [];
	});
}
for (const file of sourceFiles(path.join(root, "src"))) {
	const text = readFileSync(file, "utf8");
	for (const match of text.matchAll(/\bhref(?:=|:\s*)\{?["'](\/[^"'`${}\s]*)["']/g)) {
		if (!resolves(match[1])) {
			problems.push(`${path.relative(root, file).replaceAll("\\", "/")}: the link ${match[1]} goes nowhere`);
		}
	}
}

// ── Report ───────────────────────────────────────────────────────────────

const todo = files.reduce(
	(n, file) =>
		n + (readFileSync(path.join(contentDir, file), "utf8").match(/^\[\/\/\]: # \(TODO screenshot/gm)?.length ?? 0),
	0,
);

if (problems.length > 0) {
	console.error(`Docs check failed (${problems.length}):`);
	for (const problem of problems) console.error(`  - ${problem}`);
	process.exit(1);
}
console.log(
	`Docs check passed: ${pages.length} pages, ${tutorialFeatures.size} tutorial features, ${todo} screenshots still to capture.`,
);
