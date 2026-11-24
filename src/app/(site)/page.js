import Image from "next/image";
import Link from "next/link";
import { CalendarDays, CreditCard, FileText, HeartHandshake, Phone, ShieldCheck, Users } from "lucide-react";
import LeadForm from "@/components/LeadForm";
import { CREDIT_REPAIR_OPEN, SERVICE_LIST, SITE } from "@/lib/site";

export const metadata = { alternates: { canonical: "/" } };

const services = [
  { href: "/life-insurance", icon: ShieldCheck, title: "Life Insurance", text: "Term, whole life, mortgage protection, final expense and indexed universal life — matched to your budget." },
  CREDIT_REPAIR_OPEN && { href: "/credit-repair", icon: CreditCard, title: "Credit Repair", text: "We help you challenge inaccurate, incomplete or unverifiable items with Equifax, Experian and TransUnion, and track every dispute in your portal." },
  { href: "/tax-preparation", icon: FileText, title: "Tax Preparation", text: "Upload your W-2s and 1099s securely from your phone. We prepare and file your return and keep you updated." },
].filter(Boolean);

const products = [
  ["Term Life", "Covers you for 10–30 years while the kids are young or the mortgage is open. Usually the lowest-cost way to get a large amount of coverage."],
  ["Whole Life", "Lifetime coverage with fixed premiums and cash value that grows over time."],
  ["Mortgage Protection", "Helps your family keep the house if something happens to you."],
  ["Final Expense", "Smaller policies that cover funeral and end-of-life costs, often with simple health questions."],
  ["Indexed Universal Life", "Permanent coverage with cash value linked to a market index, with a floor against losses."],
];

const steps = [
  ["Tell us about you", "Fill in the short form or call us. It takes about 2 minutes."],
  ["Talk with Lashanae", "A free, no-pressure 30-minute call to understand your goals and budget."],
  ["Get your options", "We walk you through the options that fit, in plain English."],
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo.webp`,
    telephone: "+1-214-403-1712",
    areaServed: { "@type": "State", name: "Texas" },
    employee: { "@type": "Person", name: SITE.agent, jobTitle: SITE.agentTitle },
    address: { "@type": "PostalAddress", ...SITE.postalAddress },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="mb-6 inline-flex rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 text-xs text-yellow-300 sm:text-sm">
            Licensed in Texas · Life insurance{CREDIT_REPAIR_OPEN ? " · Credit repair" : ""} · Tax preparation
          </p>
          <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Protect your family. <span className="block text-yellow-400">{CREDIT_REPAIR_OPEN ? "Build the credit and finances to match." : "Keep your finances in order."}</span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Work with one local agent — {SITE.agent} — for {SERVICE_LIST}. Some life policies are available without a medical exam, and your first consultation is free.
          </p>
          <ul className="mb-10 space-y-4 text-lg">
            <li className="flex items-center gap-4"><ShieldCheck className="h-7 w-7 shrink-0 text-yellow-400" aria-hidden /> Coverage matched to your budget and goals</li>
            <li className="flex items-center gap-4"><HeartHandshake className="h-7 w-7 shrink-0 text-yellow-400" aria-hidden /> A real person you can call, not a call center</li>
            <li className="flex items-center gap-4"><Users className="h-7 w-7 shrink-0 text-yellow-400" aria-hidden /> A secure client portal for documents and updates</li>
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={SITE.calendly} target="_blank" rel="noopener noreferrer" className="btn-gold px-8 py-4"><CalendarDays className="h-5 w-5" aria-hidden /> Book a Free Consultation</a>
            <a href={SITE.phoneHref} className="btn-ghost px-8 py-4"><Phone className="h-5 w-5 text-yellow-400" aria-hidden /> Call {SITE.phone}</a>
          </div>
        </div>
        <div id="quote" className="relative scroll-mt-28">
          <div className="absolute inset-0 rounded-full bg-yellow-500/10 blur-3xl" aria-hidden />
          <div className="relative rounded-[2rem] border border-yellow-500/30 bg-gradient-to-b from-wine-700 to-wine-900 p-6 shadow-[0_0_80px_rgba(255,215,0,0.12)] sm:p-10">
            <LeadForm />
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 text-ink" aria-labelledby="services-h">
        <div className="mx-auto max-w-7xl px-6">
          <h2 id="services-h" className="mb-4 text-center text-3xl font-black sm:text-5xl">Three ways we help</h2>
          <p className="mx-auto mb-12 max-w-3xl text-center text-lg text-ink-soft">{CREDIT_REPAIR_OPEN ? "Protection today, stronger credit tomorrow, and taxes done right" : "Protection today and taxes done right"} — with one team that already knows you.</p>
          <div className={`grid gap-8 ${services.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {services.map(({ href, icon: Icon, title, text }) => (
              <Link key={href} href={href} className="group rounded-3xl border border-yellow-200 bg-white p-8 shadow-xl transition hover:-translate-y-1">
                <Icon className="mb-5 h-10 w-10 text-yellow-600" aria-hidden />
                <h3 className="mb-3 text-2xl font-bold">{title}</h3>
                <p className="leading-relaxed text-ink-soft">{text}</p>
                <span className="mt-5 inline-block font-semibold text-ink group-hover:underline">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="solutions" className="bg-wine-900 py-20" aria-labelledby="solutions-h">
        <div className="mx-auto max-w-7xl px-6">
          <h2 id="solutions-h" className="mb-4 text-center text-3xl font-black text-yellow-400 sm:text-5xl">Life insurance options</h2>
          <p className="mx-auto mb-12 max-w-3xl text-center text-lg text-zinc-300">Not sure which you need? That's what the free consultation is for.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {products.map(([title, text]) => (
              <div key={title} className="card">
                <h3 className="mb-3 text-xl font-bold">{title}</h3>
                <p className="text-zinc-400">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center"><Link href="/life-insurance" className="btn-gold px-10 py-4">Compare Life Insurance Options</Link></div>
        </div>
      </section>

      <section className="py-20" aria-labelledby="how-h">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <Image src="/family-opt.jpg" alt="A family smiling together at home" width={612} height={408} className="w-full rounded-[2rem] border border-yellow-500/20 shadow-2xl" />
          <div>
            <h2 id="how-h" className="mb-8 text-4xl font-black leading-tight text-yellow-400 sm:text-5xl">Building legacies. <span className="block text-white">Securing tomorrows.</span></h2>
            <ol className="mb-10 space-y-6">
              {steps.map(([title, text], i) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400 font-bold text-black">{i + 1}</span>
                  <span><span className="block text-xl font-bold">{title}</span><span className="text-zinc-300">{text}</span></span>
                </li>
              ))}
            </ol>
            <Link href="/#quote" className="btn-gold px-10 py-4">Start My Free Quote</Link>
          </div>
        </div>
      </section>
    </>
  );
}
