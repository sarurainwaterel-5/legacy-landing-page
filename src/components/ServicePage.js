import { CalendarDays, Check, Phone } from "lucide-react";
import LeadForm from "./LeadForm";
import { SITE } from "@/lib/site";

export default function ServicePage({ eyebrow, title, intro, interest, sections = [], faqs = [], note }) {
  const faqLd = faqs.length
    ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }
    : null;
  return (
    <>
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:py-20">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-yellow-400">{eyebrow}</p>
          <h1 className="mb-6 text-4xl font-black leading-tight sm:text-5xl">{title}</h1>
          <p className="mb-8 text-lg leading-relaxed text-zinc-300">{intro}</p>
          <div className="mb-12 flex flex-col gap-3 sm:flex-row">
            <a href={SITE.calendly} target="_blank" rel="noopener noreferrer" className="btn-gold"><CalendarDays className="h-5 w-5" aria-hidden /> Book a Free Consultation</a>
            <a href={SITE.phoneHref} className="btn-ghost"><Phone className="h-5 w-5 text-yellow-400" aria-hidden /> {SITE.phone}</a>
          </div>
          {sections.map(({ heading, body, bullets }) => (
            <section key={heading} className="mb-10">
              <h2 className="mb-3 text-2xl font-bold text-yellow-400">{heading}</h2>
              {body && <p className="mb-3 leading-relaxed text-zinc-300">{body}</p>}
              {bullets && (
                <ul className="space-y-2">
                  {bullets.map((b) => <li key={b} className="flex gap-3 text-zinc-200"><Check className="mt-1 h-4 w-4 shrink-0 text-yellow-400" aria-hidden />{b}</li>)}
                </ul>
              )}
            </section>
          ))}
          {faqs.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-bold text-yellow-400">Common questions</h2>
              <div className="space-y-3">
                {faqs.map(([q, a]) => (
                  <details key={q} className="card">
                    <summary className="cursor-pointer font-semibold">{q}</summary>
                    <p className="mt-3 leading-relaxed text-zinc-300">{a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
          {note && <p className="mt-10 text-xs leading-relaxed text-zinc-500">{note}</p>}
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[2rem] border border-yellow-500/30 bg-gradient-to-b from-wine-700 to-wine-900 p-6 sm:p-8">
            <LeadForm defaultInterest={interest} />
          </div>
        </aside>
      </section>
    </>
  );
}
