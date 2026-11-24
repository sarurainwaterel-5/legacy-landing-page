import { prisma } from "./prisma.js";

export async function audit(actorId, action, target) {
  try {
    await prisma.auditLog.create({ data: { actorId: actorId || null, action, target: target || null } });
  } catch (error) {
    console.error("[AUDIT] failed to record", action, error.message);
  }
}
