import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { DocumentError, registerDocument } from "@/lib/document-service";

export async function POST(request) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  try {
    const doc = await registerDocument({ ...body, actor: session.user });
    return NextResponse.json({ id: doc.id, name: doc.name, size: doc.size });
  } catch (error) {
    const status = error instanceof DocumentError ? error.status : 500;
    if (status === 500) console.error("[DOCUMENTS] register", error);
    return NextResponse.json({ error: status === 500 ? "Could not save the document." : error.message }, { status });
  }
}
