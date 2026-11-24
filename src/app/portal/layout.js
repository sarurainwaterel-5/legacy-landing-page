import Link from "next/link";
import Image from "next/image";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/SignOutButton";

export const metadata = { title: "Client Portal", robots: { index: false } };

export default async function PortalLayout({ children }) {
  const session = await requireUser("/portal");
  const unread = await prisma.message.count({ where: { clientId: session.user.id, fromStaff: true, readAt: null } });
  const nav = [
    ["/portal", "Overview"],
    ["/portal/documents", "Documents"],
    ["/portal/credit", "Credit repair"],
    ["/portal/agreements", "Agreements"],
    ["/portal/messages", unread ? `Messages (${unread})` : "Messages"],
  ];
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-wine-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/portal" className="flex items-center gap-3">
            <Image src="/logo.webp" alt="" width={40} height={40} />
            <span className="font-semibold">Legacy Partners <span className="font-normal text-yellow-400">Client Portal</span></span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            {session.user.isStaff && <Link href="/admin" className="text-yellow-400 hover:underline">Admin</Link>}
            <span className="hidden text-zinc-300 sm:inline">{session.user.email}</span>
            <SignOutButton />
          </div>
        </div>
        <nav aria-label="Portal" className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2 text-sm">
          {nav.map(([href, label]) => <Link key={href} href={href} className="whitespace-nowrap rounded-lg px-3 py-1.5 text-zinc-200 hover:bg-white/10">{label}</Link>)}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
