import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

// POST /api/releases/sync — called by the Forge Super build_installers
// workflow once a dev-vN release is published. It records the release and its
// downloadable files so the homepage can list them. It stores nothing itself:
// the files stay on the GitHub Release and only their URLs are kept here.
//
// Auth: a shared secret (FORGE_RELEASE_SYNC_SECRET), not a GitHub webhook
// signature, because this is our own workflow calling our own endpoint. Set
// the same value as a secret on mentenaz.Forge.Super and as this project's
// env var.

type SyncAsset = {
	name: string;
	size: number | null;
	url: string;
};

type SyncBody = {
	tag: string;
	name: string | null;
	body: string | null;
	published_at: string | null;
	assets: SyncAsset[];
};

type Platform = "windows" | "linux-deb" | "linux-tarball" | "macos";

function detectPlatform(filename: string): Platform | null {
	const lower = filename.toLowerCase();
	if (lower.endsWith(".exe")) return "windows";
	if (lower.endsWith(".deb")) return "linux-deb";
	if (lower.endsWith(".tar.gz")) return "linux-tarball";
	if (lower.endsWith(".dmg")) return "macos";
	return null;
}

function isValidBody(value: unknown): value is SyncBody {
	if (typeof value !== "object" || value === null) return false;
	const v = value as Record<string, unknown>;
	return (
		typeof v.tag === "string" &&
		/^dev-v\d+$/.test(v.tag) &&
		Array.isArray(v.assets) &&
		v.assets.every((a) => {
			const asset = a as Record<string, unknown>;
			return (
				typeof asset?.name === "string" &&
				typeof asset?.url === "string" &&
				asset.url.startsWith("https://github.com/mentenaz/mentenaz.Forge.Super/")
			);
		})
	);
}

function authorised(req: NextRequest, secret: string): boolean {
	const expected = Buffer.from(`Bearer ${secret}`);
	const given = Buffer.from(req.headers.get("authorization") ?? "");
	return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}

export async function POST(req: NextRequest) {
	const secret = process.env.FORGE_RELEASE_SYNC_SECRET;
	if (!secret) {
		console.error("[release-sync] FORGE_RELEASE_SYNC_SECRET not set");
		return NextResponse.json({ error: "server not configured" }, { status: 500 });
	}
	if (!authorised(req, secret)) {
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });
	}

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
	}
	if (!isValidBody(body)) {
		return NextResponse.json({ error: "invalid payload" }, { status: 400 });
	}

	const admin = createAdminClient();

	// Only Forge Super's own "latest" flag moves; legacy releases keep theirs.
	const { error: clearError } = await admin
		.from("releases")
		.update({ is_latest: false })
		.eq("product", "forge-super")
		.eq("is_latest", true);
	if (clearError) {
		console.error("[release-sync] failed to clear latest flag:", clearError);
	}

	const { data: release, error: releaseError } = await admin
		.from("releases")
		.upsert(
			{
				product: "forge-super",
				version: body.tag,
				name: body.name || `Mentenaz Forge Super ${body.tag}`,
				description: body.body || null,
				is_latest: true,
				release_date: body.published_at || new Date().toISOString(),
			},
			{ onConflict: "version" },
		)
		.select("id")
		.single();
	if (releaseError || !release) {
		console.error("[release-sync] failed to upsert release:", releaseError);
		return NextResponse.json({ error: "failed to save release" }, { status: 500 });
	}

	const rows = body.assets.flatMap((asset) => {
		const platform = detectPlatform(asset.name);
		return platform
			? [
					{
						release_id: release.id,
						platform,
						filename: asset.name,
						file_size: asset.size ?? null,
						download_url: asset.url,
					},
				]
			: [];
	});

	const { error: deleteError } = await admin
		.from("release_assets")
		.delete()
		.eq("release_id", release.id);
	if (deleteError) {
		console.error("[release-sync] failed to clear assets:", deleteError);
	}
	if (rows.length > 0) {
		const { error: assetError } = await admin.from("release_assets").insert(rows);
		if (assetError) {
			console.error("[release-sync] failed to insert assets:", assetError);
			return NextResponse.json({ error: "failed to save assets" }, { status: 500 });
		}
	}

	const { count } = await admin.from("releases").select("id", { count: "exact", head: true });
	if (count !== null) {
		await admin
			.from("site_stats")
			.upsert({ key: "total_releases", value: count }, { onConflict: "key" });
	}

	return NextResponse.json({ ok: true, version: body.tag, assets: rows.length });
}
