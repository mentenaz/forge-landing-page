import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import crypto from "crypto";

// ── GitHub webhook payload types ────────────────────────────
interface GitHubAsset {
  name: string;
  size: number | null;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string | null;
  name: string | null;
  body: string | null;
  published_at: string | null;
  assets: GitHubAsset[] | null;
}

interface GitHubReleaseEvent {
  action: string;
  release: GitHubRelease | null;
}

type ReleaseEvent = Omit<GitHubReleaseEvent, "release"> & {
  release: GitHubRelease;
};

type Platform = "windows" | "linux-deb" | "linux-rpm" | "linux-appimage" | "macos";

// ── GitHub webhook signature verification ───────────────────
function verifySignature(payload: string, signature: string | null): boolean {
  if (!signature) return false;
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[github-webhook] GITHUB_WEBHOOK_SECRET not set");
    return false;
  }
  const expected =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

// ── Map GitHub asset filename → platform key ────────────────
function detectPlatform(filename: string): Platform | null {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".exe")) return "windows";
  if (lower.endsWith(".deb")) return "linux-deb";
  if (lower.endsWith(".rpm")) return "linux-rpm";
  if (lower.endsWith(".appimage")) return "linux-appimage";
  if (lower.endsWith(".dmg") || lower.endsWith(".app")) return "macos";
  return null;
}

function parseReleaseEvent(body: string): ReleaseEvent {
  const raw = JSON.parse(body) as Partial<GitHubReleaseEvent>;
  if (typeof raw.action !== "string") {
    throw new Error("Payload is missing action");
  }
  if (!raw.release || typeof raw.release !== "object") {
    throw new Error("Payload is missing release");
  }
  return { action: raw.action, release: raw.release };
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-hub-signature-256");

    if (!verifySignature(body, signature)) {
      console.error("[github-webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = request.headers.get("x-github-event");

    // We only care about release events
    if (event !== "release") {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const payload = parseReleaseEvent(body);

    // Only handle published/prereleased releases (edited re-processes assets)
    if (
      payload.action !== "published" &&
      payload.action !== "prereleased" &&
      payload.action !== "edited"
    ) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        action: payload.action,
      });
    }

    const release = payload.release;
    const version = release.tag_name?.replace(/^v/, "");
    if (!version) {
      return NextResponse.json({ error: "No version in tag" }, { status: 400 });
    }

    console.log(`[github-webhook] Processing release v${version}`);

    const admin = createAdminClient();

    // Mark all existing releases as not latest
    const { error: updateError } = await admin
      .from("releases")
      .update({ is_latest: false })
      .eq("product", "forge-legacy")
      .eq("is_latest", true);

    if (updateError) {
      console.error("[github-webhook] Failed to update releases:", updateError);
    }

    // Insert or update release (upsert on version)
    // This webhook belongs to the legacy Tauri app. Forge Super releases come
    // from /api/releases/sync, called by its own workflow.
    const releaseRow = {
      product: "forge-legacy",
      version,
      name: release.name || `Mentenaz Forge v${version}`,
      description: release.body || null,
      is_latest: true,
      release_date: release.published_at || new Date().toISOString(),
    };

    const { data: insertedRelease, error: insertError } = await admin
      .from("releases")
      .upsert(releaseRow, { onConflict: "version" })
      .select("id")
      .single();

    if (insertError) {
      console.error("[github-webhook] Failed to upsert release:", insertError);
      return NextResponse.json(
        { error: "Failed to upsert release" },
        { status: 500 },
      );
    }

    // Insert release assets (installer files)
    const assets = release.assets ?? [];
    const assetRows: Array<{
      release_id: string;
      platform: Platform;
      filename: string;
      file_size: number | null;
      download_url: string;
    }> = [];

    for (const asset of assets) {
      const platform = detectPlatform(asset.name);
      if (!platform) continue;
      assetRows.push({
        release_id: insertedRelease.id,
        platform,
        filename: asset.name,
        file_size: asset.size ?? null,
        download_url: asset.browser_download_url,
      });
    }

    if (assetRows.length > 0) {
      // Clear stale assets for this release before inserting fresh ones
      const { error: deleteError } = await admin
        .from("release_assets")
        .delete()
        .eq("release_id", insertedRelease.id);

      if (deleteError) {
        console.error("[github-webhook] Failed to clear assets:", deleteError);
      }

      const { error: assetError } = await admin
        .from("release_assets")
        .insert(assetRows);

      if (assetError) {
        console.error("[github-webhook] Failed to insert assets:", assetError);
      } else {
        console.log(
          `[github-webhook] Inserted ${assetRows.length} assets for v${version}`,
        );
      }
    }

    // Update site_stats total_releases count
    const { count } = await admin
      .from("releases")
      .select("id", { count: "exact", head: true });

    if (count !== null) {
      await admin
        .from("site_stats")
        .upsert({ key: "total_releases", value: count }, { onConflict: "key" });
    }

    console.log(`[github-webhook] Release v${version} processed successfully`);
    return NextResponse.json({ ok: true, version, assets: assetRows.length });
  } catch (err) {
    console.error("[github-webhook] Unexpected error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
