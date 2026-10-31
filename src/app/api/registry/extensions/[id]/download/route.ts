import { NextResponse } from "next/server";
import { registryAdminClient } from "@/lib/registry";

// GET /api/registry/extensions/{id}/download — 302s to the latest
// version's artifact_url (a GitHub Release asset). extension_host.rs
// follows redirects, so this never proxies the archive bytes itself.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const admin = registryAdminClient();
	const { data, error } = await admin
		.from("registry_extensions")
		.select("artifact_url")
		.eq("id", id)
		.eq("is_latest", true)
		.maybeSingle();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	if (!data) {
		return NextResponse.json({ error: "not found" }, { status: 404 });
	}

	return NextResponse.redirect(data.artifact_url, 302);
}

export const dynamic = "force-dynamic";
