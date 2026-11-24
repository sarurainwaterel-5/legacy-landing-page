import Link from "next/link";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";

export const metadata = { title: "Activity log" };

const ACTIONS = {
  sign_in: "Signed in",
  document_upload: "Uploaded a document",
  document_view: "Opened a document",
  document_delete: "Deleted a document",
  agreement_send: "Sent an agreement",
  agreement_sign: "Signed an agreement",
  agreement_cancel: "Cancelled an agreement",
  agreement_withdraw: "Withdrew an agreement",
  lead_update: "Updated a lead",
  lead_convert: "Made a lead a client",
  client_create: "Created a client",
  client_update: "Edited a client",
  case_update: "Updated a case",
  dispute_add: "Added a dispute item",
  dispute_update: "Updated a dispute item",
};

// Security review page (see the Written Information Security Plan, section 6).
export default async function Activity({ searchParams }) {
  await requireStaff();
  const { action } = await searchParams;
  const where = ACTIONS[action] ? { action } : {};
  const entries = await prisma.auditLog.findMany({ where, orderBy: { createdAt: "desc" }, take: 300 });
  const actorIds = [...new Set(entries.map((e) => e.actorId).filter(Boolean))];
  const actors = Object.fromEntries((await prisma.user.findMany({ where: { id: { in: actorIds } }, select: { id: true, name: true, email: true } })).map((u) => [u.id, u]));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Activity log</h1>
        <form className="flex gap-2">
          <label htmlFor="action" className="sr-only">Filter</label>
          <select id="action" name="action" defaultValue={where.action || ""} className="pfield w-56">
            <option value="">All activity</option>
            {Object.entries(ACTIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button className="pbtn-light">Filter</button>
        </form>
      </div>
      <p className="text-sm text-zinc-600">Latest 300 entries. Look for sign-ins or document views you don't recognize, and follow the incident steps in the security plan if you find one.</p>
      <div className="panel overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500"><tr><th className="px-4 py-3">When (Central)</th><th>Who</th><th>What</th><th>Detail</th></tr></thead>
          <tbody className="divide-y divide-zinc-100">
            {entries.map((e) => {
              const who = actors[e.actorId];
              return (
                <tr key={e.id}>
                  <td className="whitespace-nowrap px-4 py-2">{formatDateTime(e.createdAt)}</td>
                  <td>{who ? <Link href={`/admin/clients/${who.id}`} className="underline">{who.name || who.email}</Link> : "—"}</td>
                  <td>{ACTIONS[e.action] || e.action}</td>
                  <td className="font-mono text-xs text-zinc-500">{e.target || ""}</td>
                </tr>
              );
            })}
            {entries.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-zinc-600">No activity yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
