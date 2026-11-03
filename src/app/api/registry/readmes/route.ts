import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { registryAdminClient } from "@/lib/registry";

// The README backfill. Extensions published before READMEs were captured have none, and the
// sync skips an extension whose version has not changed, so a one-off job fills them in:
//
//   GET  /api/registry/readmes?limit=200   ids of the latest versions with no README captured yet
//   POST /api/registry/readmes             { readmes: [{ id, readme, readme_raw_base, readme_blob_base }] }
//
// Same shared secret as /api/registry/sync (FORGE_REGISTRY_SYNC_SECRET): this is our own
// workflow calling our own endpoint, and it writes, so it is never public.

const MAX_README_CHARS = 100_000;
const MAX_BATCH = 200;

function authorised(req: NextRequest, secret: string): boolean {
	const expected = Buffer.from(`Bearer ${secret}`);
	const given = Buffer.from(req.headers.get("authorization") ?? "");
	return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}

function cleanBase(value: unknown): string | null {
	return typeof value === "string" && value.startsWith("https://") ? value.slice(0, 500) : null;
}

type Incoming = {
	id: string;
	readme: string;
	readme_raw_base?: string | null;
	readme_blob_base?: string | null;
};

function isIncoming(value: unknown): value is Incoming {
	if (typeof value !== "object" || value === null) return false;
	const v = value as Record<string, unknown>;
	return typeof v.id === "string" && v.id.length > 0 && typeof v.readme === "string";
}

function checkSecret(req: NextRequest): NextResponse | null {
	const secret = process.env.FORGE_REGISTRY_SYNC_SECRET;
	if (!secret) {
		console.error("[registry-readmes] FORGE_REGISTRY_SYNC_SECRET not set");
		return NextResponse.json({ error: "server not configured" }, { status: 500 });
	}
	if (!authorised(req, secret)) {
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });
	}
	return null;
}

export async function GET(req: NextRequest) {
	const denied = checkSecret(req);
	if (denied) return denied;

	const requested = Number(req.nextUrl.searchParams.get("limit") ?? MAX_BATCH);
	const limit = Number.isFinite(requested) ? Math.min(Math.max(1, Math.floor(requested)), 500) : MAX_BATCH;

	const admin = registryAdminClient();
	const { data, error, count } = await admin
		.from("registry_extensions")
		.select("id", { count: "exact" })
		.eq("is_latest", true)
		.is("readme", null)
		.order("id")
		.limit(limit);

	if (error) {
		console.error("[registry-readmes] list failed:", error);
		return NextResponse.json({ error: "failed to list" }, { status: 500 });
	}
	return NextResponse.json({ ids: (data ?? []).map((row) => row.id as string), remaining: count ?? 0 });
}

export async function POST(req: NextRequest) {
	const denied = checkSecret(req);
	if (denied) return denied;

	let body: { readmes?: unknown };
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
	}
	if (!Array.isArray(body.readmes) || body.readmes.length > MAX_BATCH) {
		return NextResponse.json({ error: `readmes must be an array of at most ${MAX_BATCH}` }, { status: 400 });
	}

	const admin = registryAdminClient();
	let updated = 0;
	const failed: string[] = [];

	for (const item of body.readmes.filter(isIncoming)) {
		const { error } = await admin
			.from("registry_extensions")
			.update({
				readme: item.readme.replace(/\u0000/g, "").slice(0, MAX_README_CHARS),
				readme_raw_base: cleanBase(item.readme_raw_base),
				readme_blob_base: cleanBase(item.readme_blob_base),
			})
			.eq("id", item.id)
			.eq("is_latest", true);

		if (error) {
			console.error(`[registry-readmes] failed to update ${item.id}:`, error);
			failed.push(item.id);
		} else {
			updated += 1;
		}
	}

	return NextResponse.json({ ok: failed.length === 0, updated, failed }, { status: failed.length === 0 ? 200 : 207 });
}

export const dynamic = "force-dynamic";
