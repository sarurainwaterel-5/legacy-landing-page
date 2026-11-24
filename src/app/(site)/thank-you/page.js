import Link from "next/link";
import { CheckCircle2, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

export const metadata = { title: "Thank you", robots: { index: false } };

export default async function ThankYou({ searchParams }) {
  const { interest } = await searchParams;
  const portal = interest === "Credit Repair" || interest === "Tax Preparation";
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 text-center">
      <CheckCircle2 className="mx-auto mb-6 h-16 w-16 text-green-400" aria-hidden />
      <h1 className="mb-4 text-4xl font-black">Thank you — we've got your request</h1>
      <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-300">
        {SITE.agent} will reach out soon. Want to skip the wait? Pick a time for your free 30-minute consultation below, or call {SITE.phone}.
      </p>
      <div className="overflow-hidden rounded-2xl border border-yellow-500/30 bg-white">
        <iframe title="Schedule your free consultation" src={`${SITE.calendly}?hide_gdpr_banner=1`} className="h-[700px] w-full" loading="lazy" />
      </div>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <a href={SITE.phoneHref} className="btn-ghost"><Phone className="h-5 w-5 text-yellow-400" aria-hidden /> Call {SITE.phone}</a>
        {portal && <Link href="/login?callbackUrl=/portal" className="btn-gold">Create your client portal account</Link>}
      </div>
    </section>
  );
}
