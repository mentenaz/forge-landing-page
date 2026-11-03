import { supabase } from "@/lib/supabase";

// Read-only queries for the public extension catalogue page. They use the public
// (anon) key: registry_extensions has a public read policy, and nothing here
// writes. The app's own API (/api/registry/extensions) is separate.

export const PAGE_SIZE = 24;

// What an extension can provide, as stored in registry_extensions.provides.
export const EXTENSION_TYPES = [
	{ slug: "themes", label: "Themes" },
	{ slug: "languages", label: "Languages" },
	{ slug: "language-servers", label: "Language servers" },
	{ slug: "context-servers", label: "MCP servers" },
	{ slug: "snippets", label: "Snippets" },
	{ slug: "icon-themes", label: "Icon themes" },
	{ slug: "debug-adapters", label: "Debug adapters" },
] as const;

export type ExtensionTypeSlug = (typeof EXTENSION_TYPES)[number]["slug"];
export type CatalogSort = "name" | "new";

export function typeLabel(slug: string): string | null {
	return EXTENSION_TYPES.find((t) => t.slug === slug)?.label ?? null;
}

export function isExtensionType(value: string | undefined): value is ExtensionTypeSlug {
	return EXTENSION_TYPES.some((t) => t.slug === value);
}

export interface CatalogEntry {
	id: string;
	name: string;
	description: string | null;
	authors: string[];
	version: string;
	provides: string[];
	repository: string;
	published_at: string;
}

const ENTRY_COLUMNS = "id, name, description, authors, version, provides, repository, published_at";

// PostgREST's or= syntax uses "," and "()" as separators, and "%" and "*" are
// wildcards, so they are removed from the search text rather than escaped.
function cleanSearchText(text: string): string {
	return text.replace(/[,()"\\%*]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

// Extensions list their authors as "Name <name@example.com>" or "Name name@example.com". The
// names are shown; the email addresses are not, since they belong to people who never asked to be listed here.
export function displayAuthors(authors: string[]): string[] {
	return authors
		.map((author) =>
			author
				.replace(/\s*<[^>]*>/g, "")
				.replace(/\S+@\S+\.\S+/g, "")
				.replace(/\s+/g, " ")
				.trim(),
		)
		.filter((author) => author.length > 0);
}

export async function searchCatalog(options: {
	q: string;
	type: ExtensionTypeSlug | null;
	sort: CatalogSort;
	page: number;
}): Promise<{ entries: CatalogEntry[]; total: number; failed: boolean }> {
	let query = supabase
		.from("registry_extensions")
		.select(ENTRY_COLUMNS, { count: "exact" })
		.eq("is_latest", true);

	const text = cleanSearchText(options.q);
	if (text) {
		query = query.or(`name.ilike.%${text}%,description.ilike.%${text}%,id.ilike.%${text}%`);
	}
	if (options.type) {
		query = query.contains("provides", [options.type]);
	}

	query =
		options.sort === "new"
			? query.order("published_at", { ascending: false }).order("id")
			: query.order("name", { ascending: true }).order("id");

	const from = (options.page - 1) * PAGE_SIZE;
	const { data, count, error } = await query.range(from, from + PAGE_SIZE - 1);

	return {
		entries: (data as CatalogEntry[] | null) ?? [],
		total: count ?? 0,
		failed: error !== null,
	};
}

// How many extensions there are in total and per type. One light count query each.
export async function getCatalogCounts(): Promise<{
	total: number;
	byType: Record<string, number>;
}> {
	const base = () =>
		supabase
			.from("registry_extensions")
			.select("id", { count: "exact", head: true })
			.eq("is_latest", true);

	const [all, ...perType] = await Promise.all([
		base(),
		...EXTENSION_TYPES.map((t) => base().contains("provides", [t.slug])),
	]);

	const byType: Record<string, number> = {};
	EXTENSION_TYPES.forEach((t, index) => {
		byType[t.slug] = perType[index].count ?? 0;
	});
	return { total: all.count ?? 0, byType };
}

export async function getCatalogEntry(id: string): Promise<CatalogEntry | null> {
	const { data } = await supabase
		.from("registry_extensions")
		.select(ENTRY_COLUMNS)
		.eq("is_latest", true)
		.eq("id", id)
		.maybeSingle();
	return (data as CatalogEntry | null) ?? null;
}

export interface CatalogReadme {
	readme: string;
	rawBase: string | null;
	blobBase: string | null;
}

// Fetched on its own, not with the rest of the entry: if the README columns are missing or
// the query fails, the page still shows everything else. An empty README (the sync looked
// and found none) and a README not captured yet both come back as null.
export async function getCatalogReadme(id: string): Promise<CatalogReadme | null> {
	const { data, error } = await supabase
		.from("registry_extensions")
		.select("readme, readme_raw_base, readme_blob_base")
		.eq("is_latest", true)
		.eq("id", id)
		.maybeSingle();

	if (error || !data || !data.readme || !data.readme.trim()) return null;
	return {
		readme: data.readme as string,
		rawBase: (data.readme_raw_base as string | null) ?? null,
		blobBase: (data.readme_blob_base as string | null) ?? null,
	};
}
