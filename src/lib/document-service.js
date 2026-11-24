import { prisma } from "./prisma.js";
import { audit } from "./audit.js";
import { headDocument, deleteDocument } from "./blob-store.js";
import { DOCUMENT_CATEGORIES, canAccessClient, cleanFileName, validateUpload } from "./documents.js";

export class DocumentError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

// Records an uploaded blob as a Document after checking ownership and the stored size/type.
// Idempotent: the browser and the Blob completion callback may both call it.
export async function registerDocument({ pathname, actor, name, category, caseId }) {
  const shape = validateUpload({ pathname });
  if (!shape.ok) throw new DocumentError(shape.error);
  if (!canAccessClient(actor, shape.clientId)) throw new DocumentError("Not allowed.", 403);

  const existing = await prisma.document.findUnique({ where: { pathname } });
  if (existing) return existing;

  let stored;
  try {
    stored = await headDocument(pathname);
  } catch {
    throw new DocumentError("Upload not found. Please try again.", 404);
  }
  const check = validateUpload({ pathname, contentType: stored.contentType?.split(";")[0], size: stored.size });
  if (!check.ok) {
    await deleteDocument(pathname); // Blob does not enforce size limits on multipart uploads.
    throw new DocumentError(check.error, 413);
  }

  let validCase = null;
  if (caseId) {
    validCase = await prisma.case.findFirst({ where: { id: caseId, userId: shape.clientId }, select: { id: true } });
    if (!validCase) throw new DocumentError("Unknown case.");
  }

  const doc = await prisma.document.upsert({
    where: { pathname },
    update: {},
    create: {
      pathname,
      userId: shape.clientId,
      caseId: validCase?.id || null,
      name: cleanFileName(name || pathname),
      size: stored.size,
      contentType: stored.contentType.split(";")[0],
      category: DOCUMENT_CATEGORIES[category] ? category : "other",
      uploadedBy: actor.id,
    },
  });
  await audit(actor.id, "document_upload", doc.id);
  return doc;
}
