import { NextRequest, NextResponse } from "next/server";
import {
	registryAdminClient,
	sanitizeFilterText,
	toExtensionMetadata,
	RegistryExtensionRow,
} from "@/lib/registry";

// GET /api/registry/extensions — list/search, called by extension_host.rs's
// fetch_extensions. Query params: filter (search text), provides
// (comma-separated, e.g. "languages,grammars"), max_schema_version.
export async function GET(req: NextRequest) {
	const params = req.nextUrl.searchParams;
	const filter = params.get("filter");
	const maxSchemaVersion = params.get("max_schema_version");
	const providesParam = params.get("provides");

	const admin = registryAdminClient();
	let query = admin.from("registry_extensions").select("*").eq("is_latest", true);

	if (maxSchemaVersion !== null) {
		const parsed = Number(maxSchemaVersion);
		if (!Number.isNaN(parsed)) {
			// schema_version is nullable; nulls are treated as always-compatible.
			query = query.or(`schema_version.is.null,schema_version.lte.${parsed}`);
		}
	}

	const sanitizedFilter = filter ? sanitizeFilterText(filter) : "";
	if (sanitizedFilter) {
		query = query.or(
			`name.ilike.%${sanitizedFilter}%,description.ilike.%${sanitizedFilter}%,id.ilike.%${sanitizedFilter}%`,
		);
	}

	if (providesParam) {
		const requested = providesParam.split(",").filter(Boolean);
		if (requested.length > 0) {
			query = query.overlaps("provides", requested);
		}
	}

	const { data, error } = await query.order("published_at", { ascending: false });
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({
		data: (data as RegistryExtensionRow[]).map(toExtensionMetadata),
	});
}

export const dynamic = "force-dynamic";
