// Edge function: send-booking-email
// Sends a booking notification to the master accounts using the Resend API.
// Requires the RESEND_API_KEY secret. Failures are non-fatal — the booking is
// already persisted to the database by the caller before this is invoked.

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface BookingPayload {
  id?: string;
  name: string;
  phone: string;
  email: string;
  movein?: string;
  income?: string;
  message?: string;
  source?: string;
  roomId?: string;
}

// NOTE: Until a custom sending domain is verified with Resend, the test
// sender (`onboarding@resend.dev`) can only deliver to the account owner's
// verified address (kwamiekaze@gmail.com). Sending to any other address
// returns a 403 validation_error and the email is silently dropped.
// Keep this list to the verified address so notifications actually arrive.
const MASTERS = ["kwamiekaze@gmail.com"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as BookingPayload;
    if (!body?.name || !body?.email || !body?.phone) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — skipping email send");
      return new Response(
        JSON.stringify({ ok: false, skipped: true, reason: "RESEND_API_KEY not configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const subject = `New SmartRoomUSA ${body.source === "tour" ? "Tour Request" : "Booking"}: ${body.name}`;
    const rows: [string, string][] = [
      ["Name", body.name],
      ["Phone", body.phone],
      ["Email", body.email],
      ["Source", body.source || "booking_form"],
    ];
    if (body.movein) rows.push(["Desired Move-In", body.movein]);
    if (body.income) rows.push(["Proof of Income", body.income]);
    if (body.roomId) rows.push(["Room", body.roomId]);
    if (body.message) rows.push(["Message", body.message]);

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1a1a1a">
        <h2 style="color:#a47410;margin:0 0 12px">New SmartRoomUSA submission</h2>
        <p style="margin:0 0 16px;color:#555">A new ${body.source === "tour" ? "tour request" : "booking"} just came in.</p>
        <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;border:1px solid #eee">
          ${rows
            .map(
              ([k, v]) =>
                `<tr><td style="border:1px solid #eee;background:#faf6ec;font-weight:bold;width:34%">${k}</td><td style="border:1px solid #eee">${escapeHtml(v)}</td></tr>`,
            )
            .join("")}
        </table>
        <p style="margin-top:20px;font-size:12px;color:#888">Sign in to the admin dashboard to manage submissions.</p>
      </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SmartRoomUSA <onboarding@resend.dev>",
        to: MASTERS,
        subject,
        html,
        reply_to: body.email,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Resend error", data);
      return new Response(JSON.stringify({ ok: false, error: data }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, id: data?.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-booking-email failure", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );
}
