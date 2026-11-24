"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";
import { notifyClient } from "@/lib/notify";
import { normalizePhone } from "@/lib/leads";
import { SERVICES } from "@/lib/site";
import { AGREEMENTS, buildAgreement, missingFields } from "@/lib/agreements";
import { BUREAUS } from "@/lib/format";

const LEAD_STATUSES = ["new", "contacted", "booked", "won", "lost"];
const CASE_STATUSES = ["open", "waiting_on_client", "in_progress", "completed", "cancelled"];
const DISPUTE_STATUSES = ["pending", "disputed", "removed", "updated", "verified"];
const str = (fd, k, max = 500) => String(fd.get(k) || "").trim().slice(0, max);

export async function updateLead(formData) {
  const session = await requireStaff();
  const status = str(formData, "status");
  if (!LEAD_STATUSES.includes(status)) return;
  await prisma.lead.update({ where: { id: str(formData, "id") }, data: { status, notes: str(formData, "notes", 5000) || null } });
  await audit(session.user.id, "lead_update", str(formData, "id"));
  revalidatePath("/admin/leads");
}

async function findOrCreateClient({ email, name, phone }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (!existing.name && name) return prisma.user.update({ where: { id: existing.id }, data: { name, phone: existing.phone || phone } });
    return existing;
  }
  return prisma.user.create({ data: { email, name: name || null, phone: phone || null } });
}

async function openCase(userId, service) {
  const open = await prisma.case.findFirst({ where: { userId, service, status: { notIn: ["completed", "cancelled"] } } });
  return open || prisma.case.create({ data: { userId, service, title: SERVICES[service], updates: { create: { body: "Welcome! Your file is open. We'll post updates here." } } } });
}

export async function convertLead(formData) {
  const session = await requireStaff();
  const lead = await prisma.lead.findUnique({ where: { id: str(formData, "id") } });
  const service = str(formData, "service");
  if (!lead || !SERVICES[service]) return;
  const client = await findOrCreateClient({ email: lead.email, name: lead.fullName, phone: lead.phone });
  await openCase(client.id, service);
  await prisma.lead.update({ where: { id: lead.id }, data: { status: "won" } });
  await audit(session.user.id, "lead_convert", lead.id);
  if (formData.get("invite") === "on") after(() => notifyClient(client.email, "Your Legacy Partners client portal is ready", "We've set up your secure client portal. Sign in with this email address to upload documents, sign agreements and see updates."));
  redirect(`/admin/clients/${client.id}`);
}

export async function createClient(prev, formData) {
  const session = await requireStaff();
  const email = str(formData, "email", 200).toLowerCase();
  const name = str(formData, "name", 100);
  const phone = normalizePhone(str(formData, "phone"));
  const service = str(formData, "service");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: "Enter a valid email." };
  const client = await findOrCreateClient({ email, name, phone });
  if (SERVICES[service]) await openCase(client.id, service);
  await audit(session.user.id, "client_create", client.id);
  if (formData.get("invite") === "on") after(() => notifyClient(email, "Your Legacy Partners client portal is ready", "We've set up your secure client portal. Sign in with this email address to upload documents, sign agreements and see updates."));
  redirect(`/admin/clients/${client.id}`);
}

export async function addCase(formData) {
  await requireStaff();
  const clientId = str(formData, "clientId");
  const service = str(formData, "service");
  if (!SERVICES[service]) return;
  await openCase(clientId, service);
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function updateCase(formData) {
  const session = await requireStaff();
  const c = await prisma.case.findUnique({ where: { id: str(formData, "caseId") }, include: { user: { select: { email: true } } } });
  if (!c) return;
  const status = str(formData, "status");
  const note = str(formData, "update", 2000);
  await prisma.case.update({ where: { id: c.id }, data: { status: CASE_STATUSES.includes(status) ? status : c.status, ...(note ? { updates: { create: { body: note } } } : {}) } });
  await audit(session.user.id, "case_update", c.id);
  if (note && formData.get("notify") === "on") after(() => notifyClient(c.user.email, `Update on your ${c.title}`, "There's a new update on your file."));
  revalidatePath(`/admin/clients/${c.userId}`);
}

export async function addDispute(formData) {
  const session = await requireStaff();
  const c = await prisma.case.findUnique({ where: { id: str(formData, "caseId") } });
  const bureau = str(formData, "bureau");
  const creditor = str(formData, "creditor", 120);
  const reason = str(formData, "reason", 200);
  const accountEnd = str(formData, "accountEnd", 4).replace(/\D/g, "") || null;
  if (!c || c.service !== "credit_repair" || !BUREAUS[bureau] || !creditor || !reason) return;
  await prisma.disputeItem.create({ data: { caseId: c.id, bureau, creditor, reason, accountEnd, round: Math.max(1, Number(formData.get("round")) || 1) } });
  await audit(session.user.id, "dispute_add", c.id);
  revalidatePath(`/admin/clients/${c.userId}`);
}

export async function updateDispute(formData) {
  const session = await requireStaff();
  const d = await prisma.disputeItem.findUnique({ where: { id: str(formData, "id") }, include: { case: true } });
  const status = str(formData, "status");
  if (!d || !DISPUTE_STATUSES.includes(status)) return;
  await prisma.disputeItem.update({ where: { id: d.id }, data: { status, round: Math.max(1, Number(formData.get("round")) || d.round) } });
  await audit(session.user.id, "dispute_update", d.id);
  revalidatePath(`/admin/clients/${d.case.userId}`);
}

export async function sendAgreement(prev, formData) {
  const session = await requireStaff();
  const kind = str(formData, "kind");
  const caseId = str(formData, "caseId") || null;
  const fee = str(formData, "fee", 1000);
  const client = await prisma.user.findUnique({ where: { id: str(formData, "clientId") } });
  if (!client || !AGREEMENTS[kind]) return { error: "Choose an agreement." };
  if (!client.name) return { error: "Add the client's full legal name first (they can also add it in their portal)." };
  if (caseId && !(await prisma.case.findFirst({ where: { id: caseId, userId: client.id } }))) return { error: "Unknown case." };
  const built = buildAgreement(kind, { clientName: client.name, fee });
  const missing = missingFields(built.body);
  await prisma.agreement.create({ data: { userId: client.id, caseId, kind, version: built.version, body: built.body, bodyHash: built.bodyHash, fee: fee || null } });
  await audit(session.user.id, "agreement_send", client.id);
  revalidatePath(`/admin/clients/${client.id}`);
  if (missing.length) return { warning: `Saved, but the client can't sign until these are filled in: ${missing.join(", ")}.` };
  after(() => notifyClient(client.email, `Please review and sign your ${AGREEMENTS[kind].title}`, "Your agreement is ready to review and sign."));
  return { ok: true };
}

export async function withdrawAgreement(formData) {
  const session = await requireStaff();
  const a = await prisma.agreement.findUnique({ where: { id: str(formData, "id") } });
  if (!a || a.status !== "sent") return;
  await prisma.agreement.delete({ where: { id: a.id } });
  await audit(session.user.id, "agreement_withdraw", a.id);
  revalidatePath(`/admin/clients/${a.userId}`);
}

export async function staffMessage(prev, formData) {
  const session = await requireStaff();
  const clientId = str(formData, "clientId");
  const body = String(formData.get("body") || "").trim();
  if (!body) return { error: "Write a message first." };
  if (body.length > 5000) return { error: "Messages can be up to 5,000 characters." };
  const client = await prisma.user.findUnique({ where: { id: clientId }, select: { email: true } });
  if (!client) return { error: "Unknown client." };
  await prisma.message.create({ data: { clientId, senderId: session.user.id, fromStaff: true, body } });
  await prisma.message.updateMany({ where: { clientId, fromStaff: false, readAt: null }, data: { readAt: new Date() } });
  after(() => notifyClient(client.email, "New message from Legacy Partners", "You have a new secure message."));
  revalidatePath(`/admin/clients/${clientId}`);
  return { ok: true, at: Date.now() };
}

export async function updateClient(prev, formData) {
  const session = await requireStaff();
  const id = str(formData, "id");
  const name = str(formData, "name", 100);
  const phoneRaw = str(formData, "phone");
  const phone = phoneRaw ? normalizePhone(phoneRaw) : null;
  if (phoneRaw && !phone) return { error: "Enter a 10-digit US phone number." };
  await prisma.user.update({ where: { id }, data: { name: name || null, phone } });
  await audit(session.user.id, "client_update", id);
  revalidatePath(`/admin/clients/${id}`);
  return { ok: true };
}
