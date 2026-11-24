import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";
import { canAccessClient } from "@/lib/documents";
import { deleteDocument, readDocument } from "@/lib/blob-store";

async function load(params) {
  const session = await getSession();
  if (!session?.user?.id) return { error: NextResponse.json({ error: "Please sign in." }, { status: 401 }) };
  const { id } = await params;
  const doc = await prisma.document.findUnique({ where: { id } });
  // Same 404 for "missing" and "not yours" so ids can't be probed.
  if (!doc || doc.deletedAt || !canAccessClient(session.user, doc.userId)) {
    return { error: NextResponse.json({ error: "Not found." }, { status: 404 }) };
  }
  return { session, doc };
}

export async function GET(request, { params }) {
  const { session, doc, error } = await load(params);
  if (error) return error;
  const blob = await readDocument(doc.pathname).catch(() => null);
  if (!blob?.stream || blob.statusCode !== 200) return NextResponse.json({ error: "File unavailable." }, { status: 404 });
  await audit(session.user.id, "document_view", doc.id);
  return new Response(blob.stream, {
    headers: {
      "Content-Type": doc.contentType,
      "Content-Length": String(doc.size),
      "Content-Disposition": `inline; filename="${doc.name.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function DELETE(request, { params }) {
  const { session, doc, error } = await load(params);
  if (error) return error;
  if (!session.user.isStaff && doc.uploadedBy !== session.user.id) {
    return NextResponse.json({ error: "Only Legacy Partners can remove documents we added." }, { status: 403 });
  }
  await prisma.document.update({ where: { id: doc.id }, data: { deletedAt: new Date() } });
  await deleteDocument(doc.pathname);
  await audit(session.user.id, "document_delete", doc.id);
  return NextResponse.json({ ok: true });
}
