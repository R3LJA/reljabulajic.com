// Newsletter signup for /indie. Adds the email as a Resend contact.
// .env.local: RESEND_API_KEY (full access, needed to create contacts) and
// optionally RESEND_SEGMENT_ID to put signups in one segment.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: { email?: unknown; company?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.company === "string" && body.company.length > 0) {
    return Response.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const segmentId = process.env.RESEND_SEGMENT_ID;
  try {
    const res = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        unsubscribed: false,
        ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
      }),
      cache: "no-store",
    });
    // 409: already on the list, which is fine for the visitor.
    if (res.ok || res.status === 409) return Response.json({ ok: true });
    return Response.json({ error: "upstream_error" }, { status: 502 });
  } catch {
    return Response.json({ error: "upstream_error" }, { status: 502 });
  }
}
