import { NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";
import { leadEmailText, validateLead } from "@/lib/leads";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Bad request." }, { status: 400 });
  // Honeypot: real visitors never see or fill "company".
  if (body.company) return NextResponse.json({ success: true });

  const { lead, errors } = validateLead(body);
  if (errors) return NextResponse.json({ errors }, { status: 422 });

  // Drop exact duplicates (double clicks / retries) within 10 minutes.
  const duplicate = await prisma.lead.findFirst({
    where: { email: lead.email, phone: lead.phone, interest: lead.interest, createdAt: { gt: new Date(Date.now() - 10 * 60 * 1000) } },
    select: { id: true },
  });
  if (duplicate) return NextResponse.json({ success: true, id: duplicate.id });

  const saved = await prisma.lead.create({ data: lead });

  after(async () => {
    const to = process.env.NOTIFY_EMAIL;
    if (!to) return console.warn("[LEADS] NOTIFY_EMAIL not set; lead saved without email", saved.id);
    try {
      await sendMail({ to, subject: `New lead: ${saved.fullName} — ${saved.interest}`, text: leadEmailText(saved) });
      await prisma.lead.update({ where: { id: saved.id }, data: { emailedAt: new Date() } });
    } catch (error) {
      console.error("[LEADS] notification email failed; lead is saved", saved.id, error.message);
    }
  });

  return NextResponse.json({ success: true, id: saved.id }, { status: 201 });
}
