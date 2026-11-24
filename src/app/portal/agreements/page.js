import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AGREEMENTS } from "@/lib/agreements";
import { formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";

export const metadata = { title: "Agreements" };

export default async function Agreements() {
  const session = await requireUser("/portal/agreements");
  const agreements = await prisma.agreement.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });
  return (
    <div className="panel">
      <h1 className="mb-4 text-2xl font-bold">Agreements</h1>
      {agreements.length === 0 ? <p className="text-zinc-600">No agreements yet. We'll send one here when you start a service.</p> : (
        <ul className="divide-y divide-zinc-100">
          {agreements.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div><Link href={`/portal/agreements/${a.id}`} className="font-medium text-wine-800 hover:underline">{AGREEMENTS[a.kind]?.title}</Link>
                <p className="text-xs text-zinc-500">{a.signedAt ? `Signed ${formatDate(a.signedAt)}` : `Sent ${formatDate(a.createdAt)}`}</p></div>
              <StatusBadge status={a.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
