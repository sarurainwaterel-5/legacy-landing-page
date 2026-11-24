import test from "node:test";
import assert from "node:assert/strict";
import { validateUpload, clientIdFromPath, canAccessClient, documentPath, cleanFileName, DOCUMENT_MAX_BYTES } from "../src/lib/documents.js";

const client = "cmabc123def456ghi789jkl0";
const uuid = "3f2b8c1e-9d4a-4b6e-8f1a-2c3d4e5f6a7b";

test("well-formed paths resolve to their client", () => {
  assert.equal(clientIdFromPath(documentPath(client, uuid, "pdf")), client);
  for (const bad of [`clients/${client}/../x/${uuid}.pdf`, `clients/${client}/${uuid}.exe`, `clients/${client}/${uuid}.pdf.html`, `other/${client}/${uuid}.pdf`, `clients/${client}/nested/${uuid}.pdf`, ""]) {
    assert.equal(clientIdFromPath(bad), null, bad);
  }
});

test("clients can only reach their own files; staff can reach anyone's", () => {
  assert.ok(canAccessClient({ id: client }, client));
  assert.ok(!canAccessClient({ id: "someoneelse000000000000" }, client));
  assert.ok(canAccessClient({ id: "staff0000000000000000000", isStaff: true }, client));
  assert.ok(!canAccessClient(null, client));
  assert.ok(!canAccessClient({ id: client }, null));
});

test("size and type limits", () => {
  const p = documentPath(client, uuid, "pdf");
  assert.ok(validateUpload({ pathname: p, contentType: "application/pdf", size: 1000 }).ok);
  assert.ok(!validateUpload({ pathname: p, contentType: "application/pdf", size: DOCUMENT_MAX_BYTES + 1 }).ok);
  assert.ok(!validateUpload({ pathname: p, contentType: "text/html", size: 1000 }).ok);
  assert.ok(!validateUpload({ pathname: p, contentType: "application/pdf", size: 0 }).ok);
  assert.ok(validateUpload({ pathname: documentPath(client, uuid, "heic"), contentType: "image/heic", size: 5 }).ok);
});

test("file names are cleaned", () => {
  assert.equal(cleanFileName("C:\\Users\\me\\W2 <2025>.pdf"), "W2 _2025_.pdf");
  assert.equal(cleanFileName("../../etc/passwd"), "passwd");
  assert.equal(cleanFileName(""), "document");
});
