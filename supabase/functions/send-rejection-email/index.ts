// Edge function: send-rejection-email
// Notifies a user that their SmartRoomUSA account application was not approved.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface Payload {
  email: string;
  reason?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = (await req.json()) as Payload;
    if (!body?.email) {
      return new Response(JSON.stringify({ error: "Missing email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ ok: false, skipped: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const reasonHtml = body.reason
      ? `<div style="margin-top:16px;padding:12px;background:#faf6ec;border:1px solid #eee;border-radius:6px;color:#333"><strong>Reason from our team:</strong><br/>${escapeHtml(body.reason)}</div>`
      : "";

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1a1a1a">
        <h2 style="color:#a47410;margin:0 0 12px">Update on your SmartRoomUSA application</h2>
        <p>Thank you for your interest in SmartRoomUSA. After review, we are unable to approve your account at this time.</p>
        ${reasonHtml}
        <p style="margin-top:20px">Questions? Reply to this email or call <strong>(404) 997-3763</strong>.</p>
      </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "SmartRoomUSA <onboarding@resend.dev>",
        to: [body.email],
        subject: "Update on your SmartRoomUSA application",
        html,
      }),
    });
    const data = await res.json();
    return new Response(JSON.stringify({ ok: res.ok, data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
