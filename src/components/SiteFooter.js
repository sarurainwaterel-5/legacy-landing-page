import Link from "next/link";
import { SITE } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-yellow-700/20 bg-black/40 py-12 text-sm text-zinc-400">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
        <div>
          <p className="font-semibold text-white">{SITE.name}</p>
          <p className="mt-2">{SITE.agent}, {SITE.agentTitle}</p>
          <p>Licensed in {SITE.state}{SITE.insuranceLicense ? ` · TDI License #${SITE.insuranceLicense}` : ""}</p>
          {SITE.address && <p className="mt-2">{SITE.address}</p>}
          <p className="mt-2"><a href={SITE.phoneHref} className="text-yellow-400 hover:underline">{SITE.phone}</a></p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-2">
          <Link href="/life-insurance" className="hover:text-white">Life Insurance</Link>
          <Link href="/credit-repair" className="hover:text-white">Credit Repair</Link>
          <Link href="/tax-preparation" className="hover:text-white">Tax Preparation</Link>
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms of Use</Link>
          <Link href="/login" className="hover:text-white">Client Login</Link>
        </nav>
        <div className="space-y-2 text-xs leading-relaxed">
          <p>Insurance products are subject to underwriting and policy approval. Coverage options vary by carrier and state.</p>
          <p>Credit repair: we cannot remove accurate, current and verifiable information, and no particular result is guaranteed. You may dispute credit report errors yourself with the credit bureaus at no cost.</p>
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
