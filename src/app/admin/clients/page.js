import Link from "next/link";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { staffEmails } from "@/lib/roles";
import StatusBadge from "@/components/StatusBadge";

export default async function Clients({ searchParams }) {
  await requireStaff();
  const { q = "" } = await searchParams;
  const term = String(q).trim();
  const clients = await prisma.user.findMany({
    where: {
      email: { notIn: staffEmails() },
      ...(term ? { OR: [{ name: { contains: term, mode: "insensitive" } }, { email: { contains: term, mode: "insensitive" } }, { phone: { contains: term } }] } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      cases: { select: { title: true, status: true } },
      _count: { select: { messages: { where: { fromStaff: false, readAt: null } }, documents: { where: { deletedAt: null } } } },
    },
  });
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Clients</h1>
        <div className="flex gap-2">
          <form className="flex gap-2"><label htmlFor="q" className="sr-only">Search</label><input id="q" name="q" defaultValue={term} placeholder="Name, email or phone" className="pfield w-56" /><button className="pbtn-light">Search</button></form>
          <Link href="/admin/clients/new" className="pbtn">New client</Link>
        </div>
      </div>
      <div className="panel overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500"><tr><th className="px-4 py-3">Client</th><th>Services</th><th>Docs</th><th>Unread</th><th>Joined</th></tr></thead>
          <tbody className="divide-y divide-zinc-100">
            {clients.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3"><Link href={`/admin/clients/${c.id}`} className="font-semibold text-wine-800 underline">{c.name || "(no name yet)"}</Link><p className="text-zinc-500">{c.email}{c.phone ? ` · ${c.phone}` : ""}</p></td>
                <td><div className="flex flex-wrap gap-1">{c.cases.map((k, i) => <span key={i} className="flex items-center gap-1">{k.title} <StatusBadge status={k.status} /></span>)}</div></td>
                <td>{c._count.documents}</td>
                <td>{c._count.messages ? <span className="font-bold text-red-700">{c._count.messages}</span> : "—"}</td>
                <td>{formatDate(c.createdAt)}</td>
              </tr>
            ))}
            {clients.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-zinc-600">No clients found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
