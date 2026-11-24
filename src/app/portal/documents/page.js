import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DocumentUploader from "@/components/DocumentUploader";
import DocumentList from "@/components/DocumentList";

export const metadata = { title: "Documents" };

export default async function Documents() {
  const session = await requireUser("/portal/documents");
  const [documents, cases] = await Promise.all([
    prisma.document.findMany({ where: { userId: session.user.id, deletedAt: null }, orderBy: { createdAt: "desc" }, include: { case: { select: { title: true } } } }),
    prisma.case.findMany({ where: { userId: session.user.id, status: { notIn: ["completed", "cancelled"] } }, select: { id: true, title: true } }),
  ]);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Documents</h1>
      <section className="panel">
        <h2 className="mb-1 text-lg font-semibold">Upload</h2>
        <p className="mb-4 text-sm text-zinc-600">Files are encrypted and only you and Legacy Partners staff can see them. Please don't send tax or credit documents by email or text.</p>
        <DocumentUploader clientId={session.user.id} cases={cases} />
      </section>
      <section className="panel">
        <h2 className="mb-3 text-lg font-semibold">Your files</h2>
        <DocumentList documents={documents} viewerId={session.user.id} />
      </section>
    </div>
  );
}
