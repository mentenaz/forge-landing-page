// supabase/functions/ai-chat/index.ts
// Proxies chat/brainstorm/code-assist to the AI Twin project's Edge Functions.
// Deployed on the Forge project (daquiwsaqffoxtqijwzo).
//
// Auth modes:
//   - Guest: uses AI_TWIN_SUPABASE_ANON_KEY (limited, anonymous)
//   - Authenticated: forwards user's Bearer token to AI Twin

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TWIN_URL = Deno.env.get("AI_TWIN_SUPABASE_URL") ?? "";
const TWIN_KEY = Deno.env.get("AI_TWIN_SUPABASE_ANON_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { message, mode } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const endpoint =
      mode === "brainstorm"
        ? "brainstorm"
        : mode === "code"
          ? "code-assist"
          : "chat";

    // Use user's token if provided, otherwise fall back to anon key
    const authHeader = req.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = bearerToken || TWIN_KEY;

    // Extract user ID from JWT payload when authenticated
    let userId = "web-user";
    if (bearerToken) {
      try {
        const payload = JSON.parse(atob(bearerToken.split(".")[1]));
        userId = payload.sub ?? "web-user";
      } catch {}
    }

    const res = await fetch(`${TWIN_URL}/functions/v1/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
        user_id: userId,
        project_context: "",
        source: "forge-site-web",
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(text, {
        status: res.status,
        headers: corsHeaders,
      });
    }

    // Stream the SSE response straight through
    return new Response(res.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("ai-chat error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
