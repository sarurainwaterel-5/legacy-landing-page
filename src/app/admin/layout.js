import Link from "next/link";
import Image from "next/image";
import { requireStaff } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

export const metadata = { title: "Admin", robots: { index: false } };

export default async function AdminLayout({ children }) {
  const session = await requireStaff();
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <header className="bg-wine-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/admin" className="flex items-center gap-3"><Image src="/logo.webp" alt="" width={36} height={36} /><span className="font-semibold">Legacy Partners <span className="font-normal text-yellow-400">Admin</span></span></Link>
          <nav aria-label="Admin" className="flex items-center gap-1 text-sm">
            {[["/admin", "Overview"], ["/admin/leads", "Leads"], ["/admin/clients", "Clients"], ["/admin/activity", "Activity"], ["/portal", "My portal"]].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-lg px-3 py-1.5 hover:bg-white/10">{label}</Link>
            ))}
            <span className="ml-2 hidden text-zinc-400 md:inline">{session.user.email}</span>
            <span className="ml-2"><SignOutButton /></span>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
