import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DOCUMENT_MAX_BYTES, DOCUMENT_TYPES, canAccessClient, extensionOf, validateUpload } from "@/lib/documents";
import { registerDocument } from "@/lib/document-service";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Bad request." }, { status: 400 });
  try {
    const result = await handleUpload({
      body,
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname) => {
        const session = await getSession();
        if (!session?.user?.id) throw new Error("Please sign in again.");
        const shape = validateUpload({ pathname });
        if (!shape.ok) throw new Error(shape.error);
        if (!canAccessClient(session.user, shape.clientId)) throw new Error("Not allowed.");
        if (session.user.isStaff && shape.clientId !== session.user.id) {
          const client = await prisma.user.findUnique({ where: { id: shape.clientId }, select: { id: true } });
          if (!client) throw new Error("Unknown client.");
        }
        return {
          allowedContentTypes: [DOCUMENT_TYPES[extensionOf(pathname)]],
          maximumSizeInBytes: DOCUMENT_MAX_BYTES,
          addRandomSuffix: false,
          allowOverwrite: false,
          validUntil: Date.now() + 15 * 60 * 1000,
          tokenPayload: JSON.stringify({ actorId: session.user.id, isStaff: Boolean(session.user.isStaff) }),
        };
      },
      // Production only (Blob cannot call back to localhost); the browser also registers via POST /api/documents.
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = JSON.parse(tokenPayload || "{}");
        await registerDocument({ pathname: blob.pathname, actor: { id: payload.actorId, isStaff: payload.isStaff } }).catch(
          (error) => console.error("[DOCUMENTS] completion", error.message),
        );
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message || "Upload failed." }, { status: 400 });
  }
}
