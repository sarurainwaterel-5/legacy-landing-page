// Pure rules for client document uploads (unit-tested in tests/documents.test.mjs).
export const DOCUMENT_MAX_BYTES = 25 * 1024 * 1024;

export const DOCUMENT_TYPES = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
};

export const DOCUMENT_CATEGORIES = {
  id: "Photo ID",
  w2: "W-2",
  "1099": "1099",
  tax_return: "Prior tax return",
  tax_other: "Other tax document",
  credit_report: "Credit report",
  bureau_letter: "Letter from a credit bureau",
  proof_of_address: "Proof of address",
  agreement: "Signed agreement",
  other: "Other",
};

const PATH = /^clients\/([a-z0-9]{20,40})\/[0-9a-f-]{36}\.(pdf|jpg|jpeg|png|webp|heic)$/;

export function extensionOf(name) {
  const m = /\.([a-z0-9]+)$/i.exec(String(name || ""));
  return m ? m[1].toLowerCase() : "";
}

export function documentPath(clientId, uuid, ext) {
  return `clients/${clientId}/${uuid}.${ext}`;
}

// Returns the owning client id if `pathname` is a well-formed document path, else null.
export function clientIdFromPath(pathname) {
  const m = PATH.exec(String(pathname || ""));
  return m ? m[1] : null;
}

// May `actor` ({ id, isStaff }) write or read files belonging to `clientId`?
export function canAccessClient(actor, clientId) {
  return Boolean(actor?.id && clientId && (actor.isStaff || actor.id === clientId));
}

export function validateUpload({ pathname, contentType, size }) {
  const clientId = clientIdFromPath(pathname);
  if (!clientId) return { ok: false, error: "Unsupported file. Upload a PDF, JPG, PNG, WEBP or HEIC." };
  const ext = extensionOf(pathname);
  if (contentType && DOCUMENT_TYPES[ext] !== contentType) return { ok: false, error: "The file type doesn't match its extension." };
  if (size !== undefined && (!Number.isFinite(size) || size <= 0)) return { ok: false, error: "The file is empty." };
  if (size > DOCUMENT_MAX_BYTES) return { ok: false, error: "Files can be up to 25 MB." };
  return { ok: true, clientId, ext };
}

export function cleanFileName(name) {
  const base = String(name || "document").split(/[\\/]/).pop();
  return base.replace(/[^\w .()-]/g, "_").slice(0, 120) || "document";
}
