import { NextResponse } from "next/server";
import { registryAdminClient } from "@/lib/registry";

// GET /api/registry/extensions/{id}/readme — the README of an extension's latest version,
// for the app to show before installing. Kept apart from the list and the metadata route
// because a README can be up to 100 KB and most callers never read it.
//
//   { "data": { "id", "version", "readme", "readme_raw_base", "readme_blob_base" } }
//
// readme is a string, "" when the extension has none, or null when it has not been captured
// yet. The two bases are the addresses relative links and images in the README resolve
// against (raw files and file pages, at the commit that was built); they are null when the
// repository is not on GitHub.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const admin = registryAdminClient();
	const { data, error } = await admin
		.from("registry_extensions")
		.select("id, version, readme, readme_raw_base, readme_blob_base")
		.eq("id", id)
		.eq("is_latest", true)
		.maybeSingle();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	if (!data) {
		return NextResponse.json({ error: "not found" }, { status: 404 });
	}

	return NextResponse.json(
		{ data },
		// A README changes only when a new version is published.
		{ headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } },
	);
}

export const dynamic = "force-dynamic";
