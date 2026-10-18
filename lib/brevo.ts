type Recipient = { email: string };

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Sends one email to many players using BCC so nobody sees each other's address.
export async function sendBrevoEmail(opts: {
  recipients: Recipient[];
  subject: string;
  html: string;
}) {
  const key = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!key || !senderEmail) throw new Error("BREVO_API_KEY / BREVO_SENDER_EMAIL not set");
  if (!opts.recipients.length) return;

  const sender = { email: senderEmail };

  // Brevo caps recipients per call, so send in chunks of 50.
  for (let i = 0; i < opts.recipients.length; i += 50) {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": key, "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender,
        to: [{ email: senderEmail }],
        bcc: opts.recipients.slice(i, i + 50),
        subject: opts.subject,
        htmlContent: opts.html,
      }),
    });
    if (!res.ok) throw new Error(`Brevo ${res.status}: ${await res.text()}`);
  }
}

export function reminderHtml(e: { title: string; type: string; startsAt: Date; location: string | null; notes: string | null }) {
  const when = e.startsAt.toLocaleString("en-GB", {
    weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
    timeZone: process.env.TEAM_TIMEZONE || "UTC",
  });
  return `
    <div style="font-family:Arial,sans-serif;max-width:480px">
      <h2 style="color:#166534;margin:0 0 8px">${esc(e.type)} reminder</h2>
      <p style="font-size:18px;margin:0"><b>${esc(e.title)}</b></p>
      <p style="margin:4px 0">🕒 ${esc(when)}</p>
      ${e.location ? `<p style="margin:4px 0">📍 ${esc(e.location)}</p>` : ""}
      ${e.notes ? `<p style="margin:8px 0">${esc(e.notes)}</p>` : ""}
    </div>`;
}