import { CREDIT_REPAIR_OPEN, SERVICE_LIST, SITE } from "@/lib/site";

export const metadata = { title: "Terms of Use", alternates: { canonical: "/terms" } };

export default function Terms() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 leading-relaxed text-zinc-300 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_p]:mb-4">
      <h1 className="mb-6 text-4xl font-black text-white">Terms of Use</h1>
      <p>By using legacypartners.agency and the {SITE.name} client portal you agree to these terms.</p>
      <h2>Information only</h2>
      <p>Content on this site is general information, not legal, tax or financial advice for your situation. Insurance coverage is subject to underwriting and the terms of the policy issued by the carrier. {CREDIT_REPAIR_OPEN ? "Credit repair and tax preparation" : "Tax preparation"} services are governed by the written agreement you sign with us.</p>
      <h2>Your account</h2>
      <p>Keep access to your email account secure — it is how you sign in. Tell us right away if you think someone else has accessed your portal. Upload only documents you are entitled to share.</p>
      <h2>No guarantees</h2>
      <p>We don't guarantee insurance approval, specific premiums, credit score changes or tax refund amounts.</p>
      <h2>Contact</h2>
      <p>Questions? Call {SITE.phone}.</p>
    </article>
  );
}
