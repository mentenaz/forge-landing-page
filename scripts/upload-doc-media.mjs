#!/usr/bin/env node
// Adds an image or a video to a step of a docs page, without a deploy.
//
//   node scripts/upload-doc-media.mjs <slug> <step> <file> --alt "text" [options]
//
//   <slug>   the docs page, e.g. first-flow
//   <step>   the step number of its `## N. Title` section (0 = the intro)
//   --alt    what the image shows, for people who cannot see it (required)
//   --caption "text"     shown under the media
//   --position N         order within the step (default: after what is there)
//   --width N --height N pixel size; read from a PNG automatically, required
//                        for other images, optional for video
//   --poster <file>      video only: a still shown before play
//
// Uploads the file to the `doc-media` bucket as <slug>/step-<step>-<name> and
// writes its row in `doc_media`; running it again for the same file replaces
// the row. The page picks it up within about five minutes.
//
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY, from the
// environment or .env.local.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "doc-media";
const TYPES = {
	".png": ["image", "image/png"],
	".jpg": ["image", "image/jpeg"],
	".jpeg": ["image", "image/jpeg"],
	".webp": ["image", "image/webp"],
	".gif": ["image", "image/gif"],
	".mp4": ["video", "video/mp4"],
	".webm": ["video", "video/webm"],
};

function fail(message) {
	console.error(`error: ${message}`);
	process.exit(1);
}

try {
	process.loadEnvFile(".env.local");
} catch {
	// Not there: the variables may be set already.
}

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: {
		alt: { type: "string" },
		caption: { type: "string" },
		position: { type: "string" },
		width: { type: "string" },
		height: { type: "string" },
		poster: { type: "string" },
	},
});
const [slug, stepText, file] = positionals;
if (!slug || stepText === undefined || !file) {
	fail('usage: upload-doc-media.mjs <slug> <step> <file> --alt "text" [--caption "text"] [--width N --height N]');
}
const step = Number(stepText);
if (!Number.isInteger(step) || step < 0) fail("<step> must be a whole number, 0 or more");
if (!values.alt) fail("--alt is required: say what the image shows");

const extension = path.extname(file).toLowerCase();
const type = TYPES[extension];
if (!type) fail(`unsupported file type "${extension}" (png, jpg, webp, gif, mp4, webm)`);
const [kind, contentType] = type;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) fail("set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY (environment or .env.local)");
const supabase = createClient(url, key);

const bytes = await readFile(file);

let width = values.width ? Number(values.width) : null;
let height = values.height ? Number(values.height) : null;
// A PNG states its size in the first bytes of the file.
if ((!width || !height) && extension === ".png" && bytes.length > 24) {
	width = bytes.readUInt32BE(16);
	height = bytes.readUInt32BE(20);
}
if (kind === "image" && (!width || !height)) fail("give --width and --height (only a PNG's size is read from the file)");

async function upload(localFile, objectPath, mime) {
	const body = localFile === file ? bytes : await readFile(localFile);
	const { error } = await supabase.storage.from(BUCKET).upload(objectPath, body, {
		contentType: mime,
		upsert: true,
	});
	if (error) fail(`upload of ${objectPath} failed: ${error.message}`);
}

const objectPath = `${slug}/step-${step}-${path.basename(file)}`;
await upload(file, objectPath, contentType);

let posterPath = null;
if (values.poster) {
	if (kind !== "video") fail("--poster is only for a video");
	const posterType = TYPES[path.extname(values.poster).toLowerCase()];
	if (!posterType || posterType[0] !== "image") fail("--poster must be an image");
	posterPath = `${slug}/step-${step}-${path.basename(values.poster)}`;
	await upload(values.poster, posterPath, posterType[1]);
}

let position = values.position === undefined ? null : Number(values.position);
if (position === null) {
	const { data } = await supabase
		.from("doc_media")
		.select("position")
		.eq("tutorial_slug", slug)
		.eq("step", step)
		.neq("path", objectPath)
		.order("position", { ascending: false })
		.limit(1);
	position = data?.length ? data[0].position + 1 : 0;
}

const { error } = await supabase.from("doc_media").upsert(
	{
		tutorial_slug: slug,
		step,
		position,
		kind,
		path: objectPath,
		poster_path: posterPath,
		alt: values.alt,
		caption: values.caption ?? null,
		width,
		height,
	},
	{ onConflict: "tutorial_slug,path" },
);
if (error) fail(`could not save the row: ${error.message}`);

console.log(`${kind} added to ${slug}, step ${step}: ${objectPath}`);
console.log("The page shows it within about five minutes.");
