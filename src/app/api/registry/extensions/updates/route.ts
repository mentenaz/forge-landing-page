import { NextRequest, NextResponse } from "next/server";
import { registryAdminClient, toExtensionMetadata, RegistryExtensionRow } from "@/lib/registry";

// GET /api/registry/extensions/updates — called by extension_host.rs's
// fetch_extensions_with_update_available. Returns latest known metadata for
// the given ids; the client compares each against its own locally
// installed version and decides whether to upgrade, so this doesn't need
// to know what version is currently installed.
export async function GET(req: NextRequest) {
	const params = req.nextUrl.searchParams;
	const idsParam = params.get("ids");
	const maxSchemaVersion = params.get("max_schema_version");

	if (!idsParam) {
		return NextResponse.json({ data: [] });
	}

	const ids = idsParam.split(",").filter(Boolean);
	if (ids.length === 0) {
		return NextResponse.json({ data: [] });
	}

	const admin = registryAdminClient();
	let query = admin.from("registry_extensions").select("*").eq("is_latest", true).in("id", ids);

	if (maxSchemaVersion !== null) {
		const parsed = Number(maxSchemaVersion);
		if (!Number.isNaN(parsed)) {
			query = query.or(`schema_version.is.null,schema_version.lte.${parsed}`);
		}
	}

	const { data, error } = await query;
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({
		data: (data as RegistryExtensionRow[]).map(toExtensionMetadata),
	});
}

export const dynamic = "force-dynamic";
