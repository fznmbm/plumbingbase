// Vercel Serverless Function: POST /api/book
// Sends booking / call-back requests to the business by email (via Resend)
// and an automatic confirmation to the customer when they gave an email.
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY    required  – from resend.com
//   BOOKING_TO_EMAIL  optional  – where requests go (default plumbingbasecrawley@gmail.com)
//   FROM_EMAIL        optional  – verified sender (default "PlumbingBase <bookings@plumbingbase.co.uk>")
//   TURNSTILE_SECRET  optional  – Cloudflare Turnstile secret; if set, every request is verified

const TO = process.env.BOOKING_TO_EMAIL || "plumbingbasecrawley@gmail.com";
const FROM =
  process.env.FROM_EMAIL || "PlumbingBase <bookings@plumbingbase.co.uk>";
const PHONE = "07780 330558";
const WA = "447780330558";

const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const clip = (v, n = 200) =>
  typeof v === "string" ? v.trim().slice(0, n) : "";

async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.append("remoteip", ip);
  const r = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body },
  );
  const j = await r.json().catch(() => ({}));
  return !!j.success;
}

async function sendEmail(payload) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`Resend ${r.status}: ${t}`);
  }
  return r.json();
}

const row = (k, v) =>
  v
    ? `<tr><td style="padding:8px 12px;background:#f4f8fc;font-weight:600;color:#042f53;width:150px;vertical-align:top">${k}</td><td style="padding:8px 12px;border-bottom:1px solid #e2e9f0">${v}</td></tr>`
    : "";

const shell = (
  title,
  inner,
) => `<!doctype html><html><body style="margin:0;background:#f4f8fc;font-family:Arial,Helvetica,sans-serif;color:#10243a">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden">
<tr><td style="background:#042f53;padding:22px 28px;color:#fff;font-size:20px;font-weight:bold">${title}</td></tr>
<tr><td style="padding:24px 28px;font-size:15px;line-height:1.6">${inner}</td></tr>
<tr><td style="background:#f4f8fc;padding:16px 28px;font-size:12px;color:#6a7a8b">PlumbingBase · 66 Forester Road, Crawley RH10 6EG · ${PHONE}</td></tr>
</table></td></tr></table></body></html>`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  let b = req.body;
  if (typeof b === "string") {
    try {
      b = JSON.parse(b);
    } catch {
      b = {};
    }
  }
  b = b || {};

  // Honeypot: bots fill hidden fields — pretend success
  if (b.company_website) return res.status(200).json({ ok: true });

  const type = b.form === "callback" ? "callback" : "booking";
  const d = {
    name: clip(b.name, 100),
    phone: clip(b.phone, 30),
    email: clip(b.email, 120),
    postcode: clip(b.postcode, 12).toUpperCase(),
    address: clip(b.address, 200),
    service: clip(b.service, 80),
    urgency: clip(b.urgency, 60),
    date: clip(b.date, 10),
    time: clip(b.time, 40),
    details: clip(b.details, 3000),
  };

  // Validation
  const phoneDigits = d.phone.replace(/\D/g, "");
  if (!d.name || phoneDigits.length < 10)
    return res
      .status(400)
      .json({ error: "Please enter your name and a valid phone number." });
  if (b.consent !== "yes")
    return res.status(400).json({ error: "Please tick the consent box." });
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
    return res.status(400).json({ error: "Please check your email address." });
  if (
    type === "booking" &&
    (!d.postcode || !d.service || !d.urgency || !d.details)
  ) {
    return res
      .status(400)
      .json({ error: "Please complete all required fields." });
  }

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  if (!(await verifyTurnstile(b.turnstile, ip)))
    return res.status(400).json({ error: "Spam check failed." });

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return res
      .status(500)
      .json({ error: "Our booking system is temporarily unavailable." });
  }

  // Optional photo (base64 JPEG from the browser, already resized)
  const attachments = [];
  if (
    b.photo &&
    typeof b.photo.content === "string" &&
    b.photo.content.length < 4_000_000
  ) {
    attachments.push({
      filename: clip(b.photo.name, 80).replace(/[^\w.\- ]/g, "") || "photo.jpg",
      content: b.photo.content,
    });
  }

  const niceDate = d.date
    ? new Date(d.date + "T12:00:00Z").toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const urgent = /emergency/i.test(d.urgency);
  const telHref = `tel:${d.phone.replace(/[^\d+]/g, "")}`;
  const waHref = `https://wa.me/${phoneDigits.replace(/^0/, "44")}`;

  const subject =
    type === "callback"
      ? `📞 Call-back request: ${d.name}${d.service ? " – " + d.service : ""}`
      : `${urgent ? "🚨 URGENT " : ""}New booking: ${d.service} – ${d.name} (${d.postcode})`;

  const bizHtml = shell(
    type === "callback"
      ? "New call-back request"
      : urgent
        ? "🚨 Urgent booking request"
        : "New booking request",
    `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:18px">
      ${row("Name", esc(d.name))}
      ${row("Phone", `<a href="${esc(telHref)}">${esc(d.phone)}</a> · <a href="${esc(waHref)}">WhatsApp</a>`)}
      ${row("Email", d.email ? `<a href="mailto:${esc(d.email)}">${esc(d.email)}</a>` : "")}
      ${row("Postcode", esc(d.postcode))}
      ${row("Address", esc(d.address))}
      ${row("Service", esc(d.service))}
      ${row("Urgency", urgent ? `<b style="color:#e2463b">${esc(d.urgency)}</b>` : esc(d.urgency))}
      ${row("Preferred date", esc(niceDate))}
      ${row("Preferred time", esc(d.time))}
      ${row("Details", esc(d.details).replace(/\n/g, "<br>"))}
      ${row("Photo", attachments.length ? "Attached" : "")}
    </table>
    <p style="margin:0"><a href="${esc(telHref)}" style="display:inline-block;background:#087fd1;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:bold">Call ${esc(d.name.split(" ")[0])}</a>
    &nbsp;<a href="${esc(waHref)}" style="display:inline-block;background:#25d366;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:bold">WhatsApp</a></p>`,
  );

  try {
    await sendEmail({
      from: FROM,
      to: [TO],
      reply_to: d.email || undefined,
      subject,
      html: bizHtml,
      attachments: attachments.length ? attachments : undefined,
    });

    if (d.email) {
      const first = esc(d.name.split(" ")[0]);
      const custHtml = shell(
        "Thanks — we've received your request",
        `<p>Hi ${first},</p>
        <p>Thanks for contacting PlumbingBase. We've received your ${type === "callback" ? "call-back request" : "booking request"} and will be in touch shortly to confirm the details.</p>
                <p>As always, your quote is <b>free</b> and there's <b>no call-out charge</b>.</p>
        ${type === "booking" ? `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0">${row("Service", esc(d.service))}${row("Postcode", esc(d.postcode))}${row("Preferred date", esc(niceDate))}${row("Preferred time", esc(d.time))}</table>` : ""}
        <p>Our opening hours are <b>Monday to Friday 8am – 6pm, and Saturday 8am – 5pm</b>. If you've contacted us outside these hours, we'll reply first thing the next working morning.</p>
        <p><b>Urgent leak?</b> Turn off your stopcock and call us on <a href="tel:+447780330558">${PHONE}</a> or <a href="https://wa.me/${WA}">message us on WhatsApp</a>.</p>
        <p>Thanks,<br>The PlumbingBase team</p>`,
      );
      await sendEmail({
        from: FROM,
        to: [d.email],
        reply_to: TO,
        subject: "We've received your request – PlumbingBase",
        html: custHtml,
      }).catch((e) => console.error("Customer email failed:", e.message));
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res
      .status(502)
      .json({ error: "Sorry, we couldn't send your request." });
  }
}
