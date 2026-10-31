import { NextRequest, NextResponse } from "next/server";
import { registryAdminClient } from "@/lib/registry";

// POST /api/registry/sync — called by the extensions-fork GitHub Action
// (E:\mentenaz\extensions) after it has already run extension_cli and
// uploaded each changed extension's archive.tar.gz to a GitHub Release.
// This never builds or stores artifacts itself — it only upserts the
// metadata extension_cli already produced, plus the Release asset URL the
// Action computed.
//
// Auth: a shared secret (FORGE_REGISTRY_SYNC_SECRET), not a GitHub webhook
// signature — this isn't a GitHub-originated event, it's our own Action
// calling our own endpoint. Set the same value as a secret on the
// extensions fork and as this project's env var.

type SyncExtension = {
	id: string;
	version: string;
	name: string;
	description: string | null;
	authors: string[];
	repository: string;
	schema_version: number | null;
	wasm_api_version: string | null;
	provides: string[];
	artifact_url: string;
};

type SyncBody = {
	extensions: SyncExtension[];
};

function isValidExtension(value: unknown): value is SyncExtension {
	if (typeof value !== "object" || value === null) return false;
	const v = value as Record<string, unknown>;
	return (
		typeof v.id === "string" &&
		typeof v.version === "string" &&
		typeof v.name === "string" &&
		typeof v.repository === "string" &&
		typeof v.artifact_url === "string" &&
		Array.isArray(v.authors) &&
		Array.isArray(v.provides)
	);
}

export async function POST(req: NextRequest) {
	const secret = process.env.FORGE_REGISTRY_SYNC_SECRET;
	if (!secret) {
		console.error("[registry-sync] FORGE_REGISTRY_SYNC_SECRET not set");
		return NextResponse.json({ error: "server not configured" }, { status: 500 });
	}

	const authHeader = req.headers.get("authorization");
	if (authHeader !== `Bearer ${secret}`) {
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });
	}

	let body: SyncBody;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
	}

	if (!Array.isArray(body.extensions)) {
		return NextResponse.json({ error: "missing extensions array" }, { status: 400 });
	}

	const extensions = body.extensions.filter(isValidExtension);
	if (extensions.length === 0) {
		return NextResponse.json({ ok: true, synced: 0 });
	}

	const admin = registryAdminClient();
	const results: Array<{ id: string; version: string; ok: boolean; error?: string }> = [];

	for (const ext of extensions) {
		// Flip any previous "latest" row for this id before inserting the
		// new one, same two-step pattern github-webhook uses for releases.
		const { error: demoteError } = await admin
			.from("registry_extensions")
			.update({ is_latest: false })
			.eq("id", ext.id)
			.eq("is_latest", true);

		if (demoteError) {
			console.error(`[registry-sync] failed to demote previous latest for ${ext.id}:`, demoteError);
		}

		const { error: upsertError } = await admin.from("registry_extensions").upsert(
			{
				id: ext.id,
				version: ext.version,
				is_latest: true,
				name: ext.name,
				description: ext.description,
				authors: ext.authors,
				repository: ext.repository,
				schema_version: ext.schema_version,
				wasm_api_version: ext.wasm_api_version,
				provides: ext.provides,
				published_at: new Date().toISOString(),
				artifact_url: ext.artifact_url,
			},
			{ onConflict: "id,version" },
		);

		if (upsertError) {
			console.error(`[registry-sync] failed to upsert ${ext.id}@${ext.version}:`, upsertError);
			results.push({ id: ext.id, version: ext.version, ok: false, error: upsertError.message });
		} else {
			results.push({ id: ext.id, version: ext.version, ok: true });
		}
	}

	const failed = results.filter((r) => !r.ok);
	return NextResponse.json(
		{ ok: failed.length === 0, synced: results.length - failed.length, results },
		{ status: failed.length === 0 ? 200 : 207 },
	);
}

export const dynamic = "force-dynamic";
