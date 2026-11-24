import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";
import { CREDIT_REPAIR_OPEN, SITE } from "@/lib/site";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-yellow-700/20 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Legacy Partners home">
          <Image src="/logo.webp" alt="" width={56} height={56} priority className="h-12 w-12 sm:h-14 sm:w-14" />
          <span className="leading-tight">
            <span className="block text-lg font-bold tracking-wide sm:text-xl">LEGACY</span>
            <span className="block text-xs tracking-[0.3em] text-yellow-400">PARTNERS</span>
          </span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 text-sm font-medium text-zinc-200 lg:flex">
          <Link href="/life-insurance" className="hover:text-yellow-400">Life Insurance</Link>
          {CREDIT_REPAIR_OPEN && <Link href="/credit-repair" className="hover:text-yellow-400">Credit Repair</Link>}
          <Link href="/tax-preparation" className="hover:text-yellow-400">Tax Preparation</Link>
          <Link href="/about" className="hover:text-yellow-400">About</Link>
          <Link href="/login" className="hover:text-yellow-400">Client Login</Link>
        </nav>
        <div className="flex items-center gap-2">
          <a href={SITE.phoneHref} className="btn-ghost whitespace-nowrap px-3 sm:px-4" aria-label={`Call ${SITE.phone}`}>
            <Phone className="h-4 w-4 text-yellow-400" aria-hidden />
            <span className="hidden sm:inline">{SITE.phone}</span>
          </a>
          <Link href="/#quote" className="btn-gold hidden whitespace-nowrap px-4 sm:inline-flex">Free Quote</Link>
        </div>
      </div>
      <nav aria-label="Services" className="flex justify-center gap-5 overflow-x-auto border-t border-yellow-700/10 px-4 py-2 text-xs text-zinc-300 lg:hidden">
        <Link href="/life-insurance">Life Insurance</Link>
        {CREDIT_REPAIR_OPEN && <Link href="/credit-repair">Credit Repair</Link>}
        <Link href="/tax-preparation">Tax Prep</Link>
        <Link href="/login">Client Login</Link>
      </nav>
    </header>
  );
}
