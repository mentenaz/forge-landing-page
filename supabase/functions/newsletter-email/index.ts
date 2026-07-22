import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("NEWSLETTER_FROM_EMAIL") || "Mentenaz Forge <newsletter@mentenaz.com>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { type, email, name, subject, content } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (type === "thank_you") {
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
          <h1 style="color: #1a1a2e;">Welcome to Mentenaz Forge Newsletter!</h1>
          <p style="color: #555; font-size: 16px;">
            Hi ${name || "there"},
          </p>
          <p style="color: #555; font-size: 16px;">
            Thank you for subscribing to the Mentenaz Forge newsletter. You'll receive updates about:
          </p>
          <ul style="color: #555; font-size: 16px;">
            <li>New features and releases</li>
            <li>Product updates and improvements</li>
            <li>Community highlights</li>
            <li>Tips and tutorials</li>
          </ul>
          <p style="color: #555; font-size: 16px;">
            Stay tuned for exciting updates!
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 2rem 0;" />
          <p style="color: #999; font-size: 12px;">
            Mentenaz Forge - The future of development
          </p>
        </div>
      `;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: email,
          subject: "Welcome to Mentenaz Forge Newsletter!",
          html,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Resend error:", err);
        throw new Error(`Email send failed: ${err}`);
      }

      return new Response(JSON.stringify({ message: "Thank-you email sent" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "batch") {
      // Fetch all active subscribers
      const { data: subscribers, error: fetchError } = await supabase
        .from("newsletter_subscribers")
        .select("id, email, name")
        .eq("status", "active");

      if (fetchError) throw fetchError;
      if (!subscribers || subscribers.length === 0) {
        return new Response(JSON.stringify({ message: "No active subscribers" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      let sent = 0;
      let failed = 0;

      for (const sub of subscribers) {
        try {
          const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
              <h1 style="color: #1a1a2e;">${subject || "Mentenaz Forge Update"}</h1>
              <p style="color: #555; font-size: 16px;">
                Hi ${sub.name || "there"},
              </p>
              <div style="color: #555; font-size: 16px;">
                ${content || "<p>Stay tuned for exciting updates from Mentenaz Forge!</p>"}
              </div>
              <hr style="border: none; border-top: 1px solid #eee; margin: 2rem 0;" />
              <p style="color: #999; font-size: 12px;">
                Mentenaz Forge - The future of development
              </p>
            </div>
          `;

          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: FROM_EMAIL,
              to: sub.email,
              subject: subject || "Mentenaz Forge Update",
              html,
            }),
          });

          if (res.ok) {
            sent++;
            // Record send
            await supabase.from("newsletter_sends").insert({
              subscriber_id: sub.id,
              subject: subject || "Mentenaz Forge Update",
              status: "sent",
            });
          } else {
            failed++;
            await supabase.from("newsletter_sends").insert({
              subscriber_id: sub.id,
              subject: subject || "Mentenaz Forge Update",
              status: "failed",
            });
          }
        } catch {
          failed++;
        }
      }

      // Update config
      await supabase
        .from("newsletter_config")
        .update({ last_sent_at: new Date().toISOString() })
        .eq("id", (await supabase.from("newsletter_config").select("id").single()).data?.id);

      return new Response(
        JSON.stringify({ message: `Sent: ${sent}, Failed: ${failed}` }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ error: "Invalid type" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Newsletter email error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
