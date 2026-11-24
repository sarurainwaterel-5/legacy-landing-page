import Link from "next/link";
import { after } from "next/server";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SERVICES } from "@/lib/site";
import { AGREEMENT_TITLES } from "@/lib/agreement-options";
import { BUREAUS, STATUS_LABELS, formatDate, formatDateTime } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import DocumentUploader from "@/components/DocumentUploader";
import DocumentList from "@/components/DocumentList";
import MessageThread from "@/components/MessageThread";
import MessageComposer from "@/components/MessageComposer";
import SendAgreementForm from "@/components/admin/SendAgreementForm";
import ClientDetailsForm from "@/components/admin/ClientDetailsForm";
import { addCase, addDispute, staffMessage, updateCase, updateDispute, withdrawAgreement } from "../../actions";

const CASE_STATUSES = ["open", "waiting_on_client", "in_progress", "completed", "cancelled"];
const DISPUTE_STATUSES = ["pending", "disputed", "removed", "updated", "verified"];

export default async function ClientPage({ params }) {
  const session = await requireStaff();
  const { id } = await params;
  const client = await prisma.user.findUnique({
    where: { id },
    include: {
      cases: { orderBy: { createdAt: "desc" }, include: { updates: { orderBy: { createdAt: "desc" }, take: 5 }, disputes: { orderBy: [{ round: "desc" }, { bureau: "asc" }] } } },
      documents: { where: { deletedAt: null }, orderBy: { createdAt: "desc" }, include: { case: { select: { title: true } } } },
      agreements: { orderBy: { createdAt: "desc" } },
      messages: { orderBy: { createdAt: "asc" }, take: 200 },
    },
  });
  if (!client) notFound();
  after(() => prisma.message.updateMany({ where: { clientId: id, fromStaff: false, readAt: null }, data: { readAt: new Date() } }));
  const openCases = client.cases.filter((c) => !["completed", "cancelled"].includes(c.status));
  const missingServices = Object.entries(SERVICES).filter(([k]) => !openCases.some((c) => c.service === k));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/clients" className="text-sm underline">← Clients</Link>
        <h1 className="mt-2 text-2xl font-bold">{client.name || "(no name yet)"}</h1>
        <p className="text-zinc-600"><a href={`mailto:${client.email}`} className="underline">{client.email}</a>{client.phone && <> · <a href={`tel:${client.phone.replace(/\D/g, "")}`} className="underline">{client.phone}</a></>} · client since {formatDate(client.createdAt)}</p>
      </div>
      <section className="panel"><h2 className="mb-3 font-semibold">Details</h2><ClientDetailsForm client={client} /></section>

      <section className="space-y-4" aria-labelledby="cases-h">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="cases-h" className="text-xl font-bold">Cases</h2>
          {missingServices.length > 0 && (
            <form action={addCase} className="flex gap-2"><input type="hidden" name="clientId" value={client.id} />
              <select name="service" className="pfield w-48">{missingServices.map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select><button className="pbtn-light">Open case</button></form>
          )}
        </div>
        {client.cases.length === 0 && <p className="panel text-zinc-600">No cases yet.</p>}
        {client.cases.map((c) => (
          <article key={c.id} className="panel space-y-4">
            <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">{c.title}</h3><StatusBadge status={c.status} /></div>
            <form action={updateCase} className="grid gap-3 md:grid-cols-[200px_1fr_auto] md:items-end">
              <input type="hidden" name="caseId" value={c.id} />
              <label className="block text-sm font-medium">Status<select name="status" defaultValue={c.status} className="pfield mt-1">{CASE_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}</select></label>
              <label className="block text-sm font-medium">Post an update the client will see<input name="update" className="pfield mt-1" placeholder="e.g. Round 1 dispute letters mailed to all three bureaus." /></label>
              <div className="space-y-1"><label className="flex items-center gap-2 text-xs"><input type="checkbox" name="notify" defaultChecked /> Email client</label><button className="pbtn">Save</button></div>
            </form>
            {c.updates.length > 0 && <ol className="space-y-1 text-sm text-zinc-700">{c.updates.map((u) => <li key={u.id}><span className="text-zinc-500">{formatDate(u.createdAt)}</span> — {u.body}</li>)}</ol>}

            {c.service === "credit_repair" && (
              <div className="space-y-3 border-t border-zinc-100 pt-4">
                <h4 className="font-semibold">Dispute items</h4>
                {c.disputes.length > 0 && (
                  <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm">
                    <thead className="text-zinc-500"><tr><th className="py-1">Bureau</th><th>Item</th><th>Reason</th><th>Round / status</th></tr></thead>
                    <tbody className="divide-y divide-zinc-100">{c.disputes.map((d) => (
                      <tr key={d.id}><td className="py-2">{BUREAUS[d.bureau]}</td><td>{d.creditor}{d.accountEnd ? ` ••${d.accountEnd}` : ""}</td><td>{d.reason}</td>
                        <td><form action={updateDispute} className="flex items-center gap-2"><input type="hidden" name="id" value={d.id} />
                          <input name="round" type="number" min="1" defaultValue={d.round} aria-label="Round" className="pfield w-16" />
                          <select name="status" defaultValue={d.status} aria-label="Status" className="pfield w-40">{DISPUTE_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}</select>
                          <button className="pbtn-light text-xs">Save</button></form></td></tr>
                    ))}</tbody></table></div>
                )}
                <form action={addDispute} className="grid gap-2 rounded-lg bg-zinc-50 p-3 md:grid-cols-[140px_1fr_90px_1fr_70px_auto] md:items-end">
                  <input type="hidden" name="caseId" value={c.id} />
                  <label className="text-xs font-medium">Bureau<select name="bureau" className="pfield mt-1">{Object.entries(BUREAUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
                  <label className="text-xs font-medium">Creditor / item<input name="creditor" required className="pfield mt-1" placeholder="e.g. Capital One" /></label>
                  <label className="text-xs font-medium">Acct last 4<input name="accountEnd" maxLength={4} inputMode="numeric" className="pfield mt-1" /></label>
                  <label className="text-xs font-medium">Reason<input name="reason" required className="pfield mt-1" placeholder="e.g. Late payment reported in error" /></label>
                  <label className="text-xs font-medium">Round<input name="round" type="number" min="1" defaultValue={1} className="pfield mt-1" /></label>
                  <button className="pbtn">Add</button>
                </form>
              </div>
            )}
          </article>
        ))}
      </section>

      <section className="panel space-y-4" aria-labelledby="agreements-h">
        <h2 id="agreements-h" className="text-xl font-bold">Agreements</h2>
        {client.agreements.length > 0 && (
          <ul className="divide-y divide-zinc-100 text-sm">{client.agreements.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-2">
              <span>{AGREEMENT_TITLES[a.kind]} · v{a.version} · {a.signedAt ? `signed ${formatDateTime(a.signedAt)} by ${a.signedName}${a.signedIp ? ` (IP ${a.signedIp})` : ""}` : `sent ${formatDate(a.createdAt)}`}{a.cancelledAt ? ` · cancelled ${formatDateTime(a.cancelledAt)}` : ""}</span>
              <span className="flex items-center gap-2"><StatusBadge status={a.status} />
                {a.status === "sent" && <form action={withdrawAgreement}><input type="hidden" name="id" value={a.id} /><button className="text-xs text-red-700 underline">Withdraw</button></form>}</span>
            </li>))}</ul>
        )}
        <SendAgreementForm clientId={client.id} cases={openCases.map((c) => ({ id: c.id, title: c.title }))} />
      </section>

      <section className="panel space-y-4" aria-labelledby="docs-h">
        <h2 id="docs-h" className="text-xl font-bold">Documents</h2>
        <DocumentList documents={client.documents} viewerId={session.user.id} isStaff />
        <details><summary className="cursor-pointer text-sm font-medium">Upload a document for this client</summary><div className="mt-3"><DocumentUploader clientId={client.id} cases={openCases.map((c) => ({ id: c.id, title: c.title }))} /></div></details>
      </section>

      <section id="messages" className="panel scroll-mt-24 space-y-4" aria-labelledby="msg-h">
        <h2 id="msg-h" className="text-xl font-bold">Messages</h2>
        <MessageThread messages={client.messages} viewerIsStaff />
        <MessageComposer action={staffMessage} hidden={{ clientId: client.id }} />
      </section>
    </div>
  );
}
