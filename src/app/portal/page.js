import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SERVICES } from "@/lib/site";
import { AGREEMENTS } from "@/lib/agreements";
import { formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import ProfileForm from "@/components/portal/ProfileForm";
import { requestService } from "./actions";

export default async function PortalHome() {
  const session = await requireUser();
  const [user, cases, pendingAgreements] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.case.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, include: { updates: { orderBy: { createdAt: "desc" }, take: 1 } } }),
    prisma.agreement.findMany({ where: { userId: session.user.id, status: "sent" } }),
  ]);
  const activeServices = new Set(cases.filter((c) => !["completed", "cancelled"].includes(c.status)).map((c) => c.service));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome{user.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>

      {!user.name && (
        <section className="panel border-amber-300 bg-amber-50">
          <h2 className="mb-1 font-semibold">Finish setting up your account</h2>
          <p className="mb-4 text-sm text-zinc-600">We need your full legal name for your agreements.</p>
          <ProfileForm name={user.name} phone={user.phone} />
        </section>
      )}

      {pendingAgreements.length > 0 && (
        <section className="panel border-amber-300 bg-amber-50" aria-labelledby="todo-h">
          <h2 id="todo-h" className="mb-3 font-semibold">Ready for your signature</h2>
          <ul className="space-y-2">
            {pendingAgreements.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3">
                <span>{AGREEMENTS[a.kind]?.title}</span>
                <Link href={`/portal/agreements/${a.id}`} className="pbtn">Review & sign</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="panel" aria-labelledby="services-h">
        <h2 id="services-h" className="mb-4 text-lg font-semibold">Your services</h2>
        {cases.length === 0 ? (
          <p className="text-zinc-600">You don't have any services yet. Choose one below to get started.</p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {cases.map((c) => (
              <li key={c.id} className="py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold">{c.title}</span>
                  <StatusBadge status={c.status} />
                </div>
                {c.updates[0] && <p className="mt-1 text-sm text-zinc-600">{formatDate(c.updates[0].createdAt)} — {c.updates[0].body}</p>}
                {c.service === "credit_repair" && <Link href="/portal/credit" className="mt-2 inline-block text-sm font-medium text-wine-800 underline">See dispute progress</Link>}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 border-t border-zinc-100 pt-4">
          <p className="mb-3 text-sm font-medium text-zinc-700">Start a service</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SERVICES).filter(([k]) => !activeServices.has(k)).map(([key, label]) => (
              <form key={key} action={requestService}><input type="hidden" name="service" value={key} /><button className="pbtn-light">{label}</button></form>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/portal/documents" className="panel hover:border-yellow-500"><h2 className="font-semibold">Upload documents</h2><p className="text-sm text-zinc-600">W-2s, 1099s, ID, credit bureau letters — securely.</p></Link>
        <Link href="/portal/messages" className="panel hover:border-yellow-500"><h2 className="font-semibold">Message us</h2><p className="text-sm text-zinc-600">Questions? Send a secure message instead of email or text.</p></Link>
      </div>

      {user.name && (
        <details className="panel">
          <summary className="cursor-pointer font-semibold">Your details</summary>
          <div className="mt-4"><ProfileForm name={user.name} phone={user.phone} /></div>
        </details>
      )}
    </div>
  );
}
