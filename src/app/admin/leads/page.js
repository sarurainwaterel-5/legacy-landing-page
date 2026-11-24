import { requireStaff } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SERVICES } from "@/lib/site";
import { formatDateTime } from "@/lib/format";
import { convertLead, updateLead } from "../actions";

const STATUSES = ["new", "contacted", "booked", "won", "lost"];
const guessService = (interest) => (interest === "Credit Repair" ? "credit_repair" : interest === "Tax Preparation" ? "tax_prep" : "life_insurance");

export default async function Leads({ searchParams }) {
  await requireStaff();
  const { status } = await searchParams;
  const where = STATUSES.includes(status) ? { status } : {};
  const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Leads</h1>
        <nav className="flex gap-1 text-sm">
          <Link href="/admin/leads" className={`rounded-lg px-3 py-1.5 ${!where.status ? "bg-wine-800 text-white" : "bg-white"}`}>All</Link>
          {STATUSES.map((s) => <Link key={s} href={`/admin/leads?status=${s}`} className={`rounded-lg px-3 py-1.5 capitalize ${where.status === s ? "bg-wine-800 text-white" : "bg-white"}`}>{s}</Link>)}
        </nav>
      </div>
      {leads.length === 0 ? <p className="panel text-zinc-600">No leads here yet.</p> : leads.map((l) => (
        <article key={l.id} className="panel grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="text-lg font-semibold">{l.fullName}</p>
            <p className="text-sm"><a href={`tel:${l.phone.replace(/\D/g, "")}`} className="underline">{l.phone}</a> · <a href={`mailto:${l.email}`} className="underline">{l.email}</a></p>
            <p className="mt-1 text-sm text-zinc-600">{l.interest}{l.ageRange ? ` · age ${l.ageRange}` : ""} · {formatDateTime(l.createdAt)}{l.page ? ` · from ${l.page}` : ""}</p>
            {!l.emailedAt && <p className="mt-1 text-xs text-amber-700">Email notification not sent</p>}
          </div>
          <form action={updateLead} className="space-y-2">
            <input type="hidden" name="id" value={l.id} />
            <label className="block text-xs font-medium text-zinc-600">Status
              <select name="status" defaultValue={l.status} className="pfield mt-1 capitalize">{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></label>
            <label className="block text-xs font-medium text-zinc-600">Notes<textarea name="notes" defaultValue={l.notes || ""} rows={2} className="pfield mt-1" /></label>
            <button className="pbtn-light text-sm">Save</button>
          </form>
          <form action={convertLead} className="space-y-2">
            <input type="hidden" name="id" value={l.id} />
            <label className="block text-xs font-medium text-zinc-600">Make a client for
              <select name="service" defaultValue={guessService(l.interest)} className="pfield mt-1">{Object.entries(SERVICES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="invite" defaultChecked /> Email them a portal invite</label>
            <button className="pbtn text-sm">Create client</button>
          </form>
        </article>
      ))}
    </div>
  );
}
