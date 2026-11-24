import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata = { title: "About Legacy Partners", description: `Meet ${SITE.agent}, licensed life insurance agent in Texas and founder of Legacy Partners.`, alternates: { canonical: "/about" } };

export default function About() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <Image src="/logo.webp" alt="Legacy Partners logo" width={120} height={120} className="mb-8" />
      <h1 className="mb-6 text-4xl font-black sm:text-5xl">About Legacy Partners</h1>
      <p className="mb-5 text-lg leading-relaxed text-zinc-300">
        Legacy Partners helps families protect what matters, strengthen their credit and keep their finances in order. {SITE.agent} leads our team as a {SITE.agentTitle.toLowerCase()} in {SITE.state}.
      </p>
      {/* TODO(owner): replace with Lashanae's own story and a photo (public/lashanae.jpg). */}
      <p className="mb-5 text-lg leading-relaxed text-zinc-300">
        We believe financial protection shouldn't be confusing. We explain your options in plain English, never pressure you, and stay with you after the paperwork is done.
      </p>
      <dl className="card mb-10 grid gap-4 sm:grid-cols-2">
        <div><dt className="text-sm text-zinc-400">Lead agent</dt><dd className="font-semibold">{SITE.agent}</dd></div>
        <div><dt className="text-sm text-zinc-400">Licensed in</dt><dd className="font-semibold">{SITE.state}{SITE.insuranceLicense ? ` (TDI #${SITE.insuranceLicense})` : ""}</dd></div>
        <div><dt className="text-sm text-zinc-400">Phone</dt><dd><a href={SITE.phoneHref} className="font-semibold text-yellow-400">{SITE.phone}</a></dd></div>
        <div><dt className="text-sm text-zinc-400">Services</dt><dd className="font-semibold">Life insurance · Credit repair · Tax preparation</dd></div>
      </dl>
      <Link href="/#quote" className="btn-gold px-8 py-4">Get a Free Quote</Link>
    </section>
  );
}
