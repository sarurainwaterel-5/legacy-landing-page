"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";
import { notifyStaff } from "@/lib/notify";
import { normalizePhone } from "@/lib/leads";
import { SERVICES } from "@/lib/site";
import { AGREEMENTS, missingFields, sha256, withCancelDate } from "@/lib/agreements";
import { cancellationDeadline, formatDeadline } from "@/lib/business-days";

export async function saveProfile(prev, formData) {
  const session = await requireUser();
  const name = String(formData.get("name") || "").trim().replace(/\s+/g, " ");
  const phoneRaw = String(formData.get("phone") || "");
  const phone = phoneRaw ? normalizePhone(phoneRaw) : null;
  if (name.length < 2 || name.length > 100) return { error: "Enter your full legal name." };
  if (phoneRaw && !phone) return { error: "Enter a 10-digit US phone number." };
  await prisma.user.update({ where: { id: session.user.id }, data: { name, phone } });
  revalidatePath("/portal");
  return { ok: true };
}

export async function requestService(formData) {
  const session = await requireUser();
  const service = String(formData.get("service"));
  if (!SERVICES[service]) return;
  const existing = await prisma.case.findFirst({ where: { userId: session.user.id, service, status: { notIn: ["completed", "cancelled"] } } });
  if (!existing) {
    await prisma.case.create({
      data: { userId: session.user.id, service, title: SERVICES[service], updates: { create: { body: "Request received. We'll contact you shortly to get started." } } },
    });
    after(() => notifyStaff(`New ${SERVICES[service]} request in the client portal`, `/admin/clients/${session.user.id}`));
  }
  revalidatePath("/portal");
}

export async function sendClientMessage(prev, formData) {
  const session = await requireUser();
  const body = String(formData.get("body") || "").trim();
  if (!body) return { error: "Write a message first." };
  if (body.length > 5000) return { error: "Messages can be up to 5,000 characters." };
  await prisma.message.create({ data: { clientId: session.user.id, senderId: session.user.id, fromStaff: false, body } });
  after(() => notifyStaff("New client message in the portal", `/admin/clients/${session.user.id}#messages`));
  revalidatePath("/portal/messages");
  return { ok: true, at: Date.now() };
}

export async function signAgreement(prev, formData) {
  const session = await requireUser();
  const id = String(formData.get("id"));
  const signedName = String(formData.get("signedName") || "").trim().replace(/\s+/g, " ");
  const agreement = await prisma.agreement.findFirst({ where: { id, userId: session.user.id }, include: { user: true } });
  if (!agreement || agreement.status !== "sent") return { error: "This agreement isn't available to sign." };
  const def = AGREEMENTS[agreement.kind];
  if (missingFields(agreement.body).length) return { error: "This agreement is missing required details. We've been notified — please contact us." };
  if (def.needsDisclosure && formData.get("disclosureAck") !== "on") return { error: "Please confirm you have read your Consumer Credit File Rights." };
  if (formData.get("esignConsent") !== "on") return { error: "Please agree to sign electronically." };
  if (signedName.length < 4 || !signedName.includes(" ")) return { error: "Type your full legal name (first and last)." };
  if (sha256(agreement.body) !== agreement.bodyHash) return { error: "This agreement changed. Please reload the page." };

  const signedAt = new Date();
  const cancelBy = def.cancelable ? cancellationDeadline(signedAt) : null;
  const finalBody = cancelBy ? withCancelDate(agreement.body, formatDeadline(cancelBy)) : agreement.body;
  const h = await headers();
  const updated = await prisma.agreement.updateMany({
    where: { id, userId: session.user.id, status: "sent" },
    data: {
      status: "signed", signedName, signedAt, cancelBy,
      body: finalBody, bodyHash: sha256(finalBody),
      signedIp: (h.get("x-forwarded-for") || "").split(",")[0].trim() || null,
      signedAgent: (h.get("user-agent") || "").slice(0, 300),
      disclosureAckAt: def.needsDisclosure ? signedAt : null,
      esignConsentAt: signedAt,
    },
  });
  if (!updated.count) return { error: "This agreement was already signed." };
  await audit(session.user.id, "agreement_sign", id);
  after(() => notifyStaff(`${def.title} signed by ${signedName}`, `/admin/clients/${session.user.id}`));
  revalidatePath("/portal", "layout");
  return { ok: true, cancelBy: cancelBy ? formatDeadline(cancelBy) : null };
}

export async function cancelAgreement(prev, formData) {
  const session = await requireUser();
  const id = String(formData.get("id"));
  const agreement = await prisma.agreement.findFirst({ where: { id, userId: session.user.id } });
  if (!agreement || agreement.status !== "signed" || !agreement.cancelBy) return { error: "This agreement can't be cancelled online." };
  if (new Date() > agreement.cancelBy) return { error: "The 3-business-day cancellation period has ended. Contact us if you'd like to stop service." };
  await prisma.$transaction([
    prisma.agreement.update({ where: { id }, data: { status: "cancelled", cancelledAt: new Date() } }),
    ...(agreement.caseId
      ? [
          prisma.case.update({ where: { id: agreement.caseId }, data: { status: "cancelled" } }),
          prisma.caseUpdate.create({ data: { caseId: agreement.caseId, body: "You cancelled your agreement within the 3-business-day cancellation period. No fees are owed." } }),
        ]
      : []),
  ]);
  await audit(session.user.id, "agreement_cancel", id);
  after(() => notifyStaff("A client cancelled their credit repair agreement", `/admin/clients/${session.user.id}`));
  revalidatePath("/portal", "layout");
  return { ok: true };
}
