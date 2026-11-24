import Link from "next/link";
import { notFound } from "next/navigation";
import { CREDIT_REPAIR_OPEN } from "@/lib/site";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BUREAUS, formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";

export const metadata = { title: "Credit repair progress" };

export default async function Credit() {
  const session = await requireUser("/portal/credit");
  if (!CREDIT_REPAIR_OPEN) notFound();
  const cases = await prisma.case.findMany({
    where: { userId: session.user.id, service: "credit_repair" },
    orderBy: { createdAt: "desc" },
    include: { disputes: { orderBy: [{ round: "desc" }, { bureau: "asc" }] }, updates: { orderBy: { createdAt: "desc" }, take: 10 } },
  });
  if (!cases.length) {
    return (
      <div className="panel">
        <h1 className="mb-2 text-2xl font-bold">Credit repair</h1>
        <p className="text-zinc-600">You haven't started credit repair yet. <Link href="/portal" className="underline">Start it from your overview</Link> or call us.</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Credit repair progress</h1>
      {cases.map((c) => {
        const counts = c.disputes.reduce((acc, d) => ({ ...acc, [d.status]: (acc[d.status] || 0) + 1 }), {});
        return (
          <section key={c.id} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-4">
              {[["Items tracked", c.disputes.length], ["In dispute", (counts.disputed || 0) + (counts.pending || 0)], ["Removed", counts.removed || 0], ["Updated", counts.updated || 0]].map(([label, n]) => (
                <div key={label} className="panel py-4 text-center"><p className="text-3xl font-bold">{n}</p><p className="text-sm text-zinc-600">{label}</p></div>
              ))}
            </div>
            <div className="panel overflow-x-auto">
              <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">Disputed items</h2><StatusBadge status={c.status} /></div>
              {c.disputes.length === 0 ? <p className="text-zinc-600">We'll list each item here once we've reviewed your reports together.</p> : (
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="text-zinc-500"><tr><th className="py-2">Bureau</th><th>Creditor / item</th><th>Reason</th><th>Round</th><th>Status</th><th>Updated</th></tr></thead>
                  <tbody className="divide-y divide-zinc-100">
                    {c.disputes.map((d) => (
                      <tr key={d.id}><td className="py-2">{BUREAUS[d.bureau]}</td><td>{d.creditor}{d.accountEnd ? ` ••${d.accountEnd}` : ""}</td><td>{d.reason}</td><td>{d.round}</td><td><StatusBadge status={d.status} /></td><td>{formatDate(d.updatedAt)}</td></tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="panel">
              <h2 className="mb-3 text-lg font-semibold">Updates</h2>
              <ol className="space-y-3">{c.updates.map((u) => <li key={u.id} className="text-sm"><span className="text-zinc-500">{formatDate(u.createdAt)}</span> — {u.body}</li>)}</ol>
            </div>
          </section>
        );
      })}
      <p className="text-xs text-zinc-500">"Verified" means the bureau confirmed the item as reported. Accurate, current and verifiable information can't be removed. You can also dispute items with the bureaus directly at no cost.</p>
    </div>
  );
}
