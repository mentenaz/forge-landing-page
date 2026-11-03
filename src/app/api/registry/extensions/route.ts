import { NextRequest, NextResponse } from "next/server";
import {
	registryAdminClient,
	sanitizeFilterText,
	toExtensionMetadata,
	RegistryExtensionRow,
	REGISTRY_ROW_COLUMNS,
} from "@/lib/registry";

const PAGE_SIZE = 1000; // the most PostgREST returns per request
const MAX_PAGES = 20; // 20,000 extensions; a guard against a loop that never ends

// GET /api/registry/extensions — list/search, called by extension_host.rs's
// fetch_extensions. Query params: filter (search text), provides
// (comma-separated, e.g. "languages,grammars"), max_schema_version.
export async function GET(req: NextRequest) {
	const params = req.nextUrl.searchParams;
	const filter = params.get("filter");
	const maxSchemaVersion = params.get("max_schema_version");
	const providesParam = params.get("provides");

	const admin = registryAdminClient();
	const maxSchema = maxSchemaVersion !== null ? Number(maxSchemaVersion) : Number.NaN;
	const sanitizedFilter = filter ? sanitizeFilterText(filter) : "";
	const requestedProvides = providesParam ? providesParam.split(",").filter(Boolean) : [];

	// A fresh query per page: the builder is consumed when it is awaited.
	const pageQuery = (from: number) => {
		let query = admin.from("registry_extensions").select(REGISTRY_ROW_COLUMNS).eq("is_latest", true);

		if (!Number.isNaN(maxSchema)) {
			// schema_version is nullable; nulls are treated as always-compatible.
			query = query.or(`schema_version.is.null,schema_version.lte.${maxSchema}`);
		}

		if (sanitizedFilter) {
			query = query.or(
				`name.ilike.%${sanitizedFilter}%,description.ilike.%${sanitizedFilter}%,id.ilike.%${sanitizedFilter}%`,
			);
		}

		if (requestedProvides.length > 0) {
			query = query.overlaps("provides", requestedProvides);
		}

		// id breaks ties, so a row cannot move between pages while they are read.
		return query
			.order("published_at", { ascending: false })
			.order("id", { ascending: true })
			.range(from, from + PAGE_SIZE - 1);
	};

	// PostgREST returns at most 1000 rows per request, which silently cut the list
	// short once the registry grew past it. Read every page.
	const rows: RegistryExtensionRow[] = [];
	for (let page = 0; page < MAX_PAGES; page += 1) {
		const { data, error } = await pageQuery(page * PAGE_SIZE);
		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		rows.push(...(data as unknown as RegistryExtensionRow[]));
		if (data.length < PAGE_SIZE) break;
	}

	return NextResponse.json({
		data: rows.map(toExtensionMetadata),
	});
}

export const dynamic = "force-dynamic";
