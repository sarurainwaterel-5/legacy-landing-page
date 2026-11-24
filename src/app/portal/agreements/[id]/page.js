import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AGREEMENTS, CREDIT_RIGHTS_DISCLOSURE, ESIGN_CONSENT, missingFields } from "@/lib/agreements";
import { formatDeadline } from "@/lib/business-days";
import { formatDateTime } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import SignAgreementForm from "@/components/portal/SignAgreementForm";
import CancelAgreementForm from "@/components/portal/CancelAgreementForm";

export const metadata = { title: "Agreement" };

export default async function AgreementPage({ params }) {
  const { id } = await params;
  const session = await requireUser(`/portal/agreements/${id}`);
  const a = await prisma.agreement.findFirst({ where: { id, userId: session.user.id }, include: { user: { select: { name: true } } } });
  if (!a) notFound();
  const def = AGREEMENTS[a.kind];
  const body = a.status === "sent" ? a.body.replace("{{CANCEL_BY}}", "[midnight of the 3rd business day after you sign — shown once signed]") : a.body;
  const canCancel = a.status === "signed" && a.cancelBy && new Date() < a.cancelBy;
  const incomplete = a.status === "sent" && missingFields(a.body).length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{def?.title}</h1>
        <StatusBadge status={a.status} />
      </div>

      {def?.needsDisclosure && (
        <section className="panel" aria-labelledby="rights-h">
          <h2 id="rights-h" className="mb-1 text-lg font-semibold">Step 1 — Your credit file rights</h2>
          <p className="mb-3 text-sm text-zinc-600">Federal law requires us to give you this statement separately, before you sign.</p>
          <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 font-sans text-sm leading-relaxed">{CREDIT_RIGHTS_DISCLOSURE}</pre>
        </section>
      )}

      <section className="panel" aria-labelledby="body-h">
        <h2 id="body-h" className="mb-3 text-lg font-semibold">{def?.needsDisclosure ? "Step 2 — " : ""}The agreement</h2>
        <pre className="max-h-[32rem] overflow-y-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 font-sans text-sm leading-relaxed">{body}</pre>
        <p className="mt-2 text-xs text-zinc-500">Want a paper copy? Ask us any time at no charge. Use your browser's Print to save a PDF.</p>
      </section>

      {a.status === "sent" && (
        <section className="panel">
          <h2 className="mb-3 text-lg font-semibold">{def?.needsDisclosure ? "Step 3 — " : ""}Sign</h2>
          {incomplete
            ? <p className="text-sm text-amber-800">This agreement is still being finalized. We'll let you know when it's ready to sign.</p>
            : <SignAgreementForm id={a.id} needsDisclosure={def?.needsDisclosure} esignText={ESIGN_CONSENT} defaultName={a.user.name} />}
        </section>
      )}

      {a.status === "signed" && (
        <section className="panel space-y-3">
          <p className="text-sm">Signed by <strong>{a.signedName}</strong> on {formatDateTime(a.signedAt)} Central.</p>
          <p className="break-all text-xs text-zinc-500">Document fingerprint (SHA-256): {a.bodyHash}</p>
          {canCancel && <CancelAgreementForm id={a.id} deadline={formatDeadline(a.cancelBy)} />}
        </section>
      )}
      {a.status === "cancelled" && <p className="panel">Cancelled on {formatDateTime(a.cancelledAt)} Central. No fees are owed.</p>}
    </div>
  );
}
