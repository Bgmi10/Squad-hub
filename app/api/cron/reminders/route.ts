import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBrevoEmail, reminderHtml } from "@/lib/brevo";

export const runtime = "nodejs";

// Call every 5-10 min (Vercel Cron, GitHub Actions, etc.) with: Authorization: Bearer $CRON_SECRET
export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const now = new Date();
  const candidates = await prisma.event.findMany({
    where: { remindedAt: null, startsAt: { gt: now } },
  });
  const due = candidates.filter((e) => e.startsAt.getTime() - e.remindMinutes * 60000 <= now.getTime());
  if (!due.length) return NextResponse.json({ sent: 0 });

  const recipients = (
    await prisma.player.findMany({ where: { email: { not: null } }, select: { email: true } })
  ).map((p) => ({ email: p.email! }));

  let sent = 0;
  const errors: string[] = [];
  for (const e of due) {
    try {
      await sendBrevoEmail({
        recipients, 
        subject: `${e.type === "MATCH" ? "Match" : e.type === "TRAINING" ? "Training" : "Club event"}: ${e.title}`,
        html: reminderHtml(e),
      });
      // Only mark as reminded after a successful send, so failures retry on the next run.
      await prisma.event.update({ where: { id: e.id }, data: { remindedAt: now } });
      sent++;
    } catch (err) {
      console.error("Reminder failed", e.id, err);
      errors.push(`${e.title}: ${(err as Error).message}`);
    }
  }
  return NextResponse.json({ sent, recipients: recipients.length, errors });
}