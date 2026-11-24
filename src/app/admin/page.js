import { requireStaff } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { daysAgo, formatDateTime } from "@/lib/format";

export default async function AdminHome() {
  await requireStaff();
  const weekAgo = daysAgo(7);
  const [newLeads, weekLeads, clients, openCases, unread, toSign, recentLeads, recentMessages] = await Promise.all([
    prisma.lead.count({ where: { status: "new" } }),
    prisma.lead.count({ where: { createdAt: { gt: weekAgo } } }),
    prisma.user.count({ where: { cases: { some: {} } } }),
    prisma.case.count({ where: { status: { notIn: ["completed", "cancelled"] } } }),
    prisma.message.count({ where: { fromStaff: false, readAt: null } }),
    prisma.agreement.count({ where: { status: "sent" } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.message.findMany({ where: { fromStaff: false, readAt: null }, orderBy: { createdAt: "desc" }, take: 5, include: { client: { select: { id: true, name: true, email: true } } } }),
  ]);
  const tiles = [["New leads", newLeads, "/admin/leads?status=new"], ["Leads this week", weekLeads, "/admin/leads"], ["Clients", clients, "/admin/clients"], ["Open cases", openCases, "/admin/clients"], ["Unread messages", unread, "/admin/clients"], ["Awaiting signature", toSign, "/admin/clients"]];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {tiles.map(([label, n, href]) => <Link key={label} href={href} className="panel py-4 hover:border-yellow-500"><p className="text-3xl font-bold">{n}</p><p className="text-sm text-zinc-600">{label}</p></Link>)}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel">
          <div className="mb-3 flex justify-between"><h2 className="font-semibold">Latest leads</h2><Link href="/admin/leads" className="text-sm underline">All leads</Link></div>
          {recentLeads.length === 0 ? <p className="text-sm text-zinc-600">No leads yet.</p> : (
            <ul className="divide-y divide-zinc-100 text-sm">{recentLeads.map((l) => <li key={l.id} className="flex justify-between gap-3 py-2"><span><strong>{l.fullName}</strong> · {l.interest}</span><span className="text-zinc-500">{formatDateTime(l.createdAt)}</span></li>)}</ul>
          )}
        </section>
        <section className="panel">
          <h2 className="mb-3 font-semibold">Unread client messages</h2>
          {recentMessages.length === 0 ? <p className="text-sm text-zinc-600">You're all caught up.</p> : (
            <ul className="divide-y divide-zinc-100 text-sm">{recentMessages.map((m) => <li key={m.id} className="py-2"><Link href={`/admin/clients/${m.client.id}#messages`} className="font-semibold underline">{m.client.name || m.client.email}</Link><p className="truncate text-zinc-600">{m.body}</p></li>)}</ul>
          )}
        </section>
      </div>
    </div>
  );
}
