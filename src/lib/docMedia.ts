import { supabase } from "@/lib/supabase";

export type DocMediaItem = {
	kind: "image" | "video";
	url: string;
	posterUrl: string | null;
	alt: string;
	caption: string | null;
	width: number | null;
	height: number | null;
};

type DocMediaRow = {
	step: number;
	kind: "image" | "video";
	path: string;
	poster_path: string | null;
	alt: string;
	caption: string | null;
	width: number | null;
	height: number | null;
};

const BUCKET = "doc-media";

function publicUrl(path: string): string {
	return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

/**
 * The media attached to a docs page, by step number. A page's text does not
 * depend on this: if the lookup fails, the page renders without media.
 */
export async function getDocMedia(slug: string): Promise<Map<number, DocMediaItem[]>> {
	const byStep = new Map<number, DocMediaItem[]>();
	const { data, error } = await supabase
		.from("doc_media")
		.select("step, kind, path, poster_path, alt, caption, width, height")
		.eq("tutorial_slug", slug)
		.order("step")
		.order("position");
	if (error || !data) return byStep;

	for (const row of data as DocMediaRow[]) {
		const items = byStep.get(row.step) ?? [];
		items.push({
			kind: row.kind,
			url: publicUrl(row.path),
			posterUrl: row.poster_path ? publicUrl(row.poster_path) : null,
			alt: row.alt,
			caption: row.caption,
			width: row.width,
			height: row.height,
		});
		byStep.set(row.step, items);
	}
	return byStep;
}
