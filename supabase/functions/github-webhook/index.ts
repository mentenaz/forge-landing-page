// supabase/functions/github-webhook/index.ts
// Handles GitHub release webhook events.
// Verifies HMAC signature, upserts releases + assets into Supabase.
// Deployed on the Forge project (daquiwsaqffoxtqijwzo).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function platformFromFilename(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith(".exe")) return "windows";
  if (lower.endsWith(".deb")) return "linux-deb";
  if (lower.endsWith(".appimage")) return "linux-appimage";
  if (lower.endsWith(".rpm")) return "linux-rpm";
  if (lower.endsWith(".dmg") || lower.endsWith(".pkg")) return "macos";
  return "other";
}

async function verifySignature(payload: string, signature: string | null, secret: string): Promise<boolean> {
  if (!signature) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const expected = "sha256=" + Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return expected === signature;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const rawBody = await req.text();

    // Verify webhook signature
    const webhookSecret = Deno.env.get("GITHUB_WEBHOOK_SECRET");
    if (webhookSecret) {
      const signature = req.headers.get("x-hub-signature-256");
      const valid = await verifySignature(rawBody, signature, webhookSecret);
      if (!valid) {
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const event = req.headers.get("x-github-event");
    const delivery = req.headers.get("x-github-delivery");

    if (event === "ping") {
      return new Response(JSON.stringify({ ok: true, pong: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (event !== "release") {
      return new Response(JSON.stringify({ ok: true, skipped: event }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = JSON.parse(rawBody);

    if (payload.action !== "published") {
      return new Response(JSON.stringify({ ok: true, skipped_action: payload.action }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const release = payload.release;
    const version = release.tag_name.replace(/^v/, "");

    // Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Upsert release
    const { error: releaseError } = await supabase.from("releases").upsert(
      {
        version,
        name: release.name,
        description: release.body,
        is_latest: true,
        release_date: release.published_at,
      },
      { onConflict: "version" },
    );

    if (releaseError) {
      console.error("Release upsert error:", releaseError);
      return new Response(JSON.stringify({ error: "Failed to save release" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark all other releases as not latest
    await supabase
      .from("releases")
      .update({ is_latest: false })
      .neq("version", version);

    // Get release ID
    const { data: releaseRow } = await supabase
      .from("releases")
      .select("id")
      .eq("version", version)
      .single();

    if (!releaseRow) {
      return new Response(JSON.stringify({ error: "Release not found after insert" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Delete old assets for this version
    await supabase.from("release_assets").delete().eq("release_id", releaseRow.id);

    // Insert new assets
    const assets = (release.assets || [])
      .filter((a: any) => a.state === "uploaded")
      .map((a: any) => ({
        release_id: releaseRow.id,
        platform: platformFromFilename(a.name),
        filename: a.name,
        file_size: a.size,
        download_url: a.browser_download_url,
      }));

    if (assets.length > 0) {
      const { error: assetsError } = await supabase.from("release_assets").insert(assets);
      if (assetsError) {
        console.error("Assets insert error:", assetsError);
      }
    }

    // Update site stats
    const { count: totalReleases } = await supabase
      .from("releases")
      .select("*", { count: "exact", head: true });

    await supabase.from("site_stats").upsert(
      { key: "total_releases", value: totalReleases ?? 0 },
      { onConflict: "key" },
    );

    return new Response(JSON.stringify({
      ok: true,
      release: version,
      assets: assets.length,
      delivery,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("github-webhook error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
