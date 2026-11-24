import { CREDIT_REPAIR_OPEN, SERVICE_LIST, SITE } from "@/lib/site";

export const metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };
const UPDATED = "November 24, 2026";

// Draft for review by the owner's attorney/compliance contact before launch.
export default function Privacy() {
  const contact = <>{SITE.phone}{SITE.email ? ` or ${SITE.email}` : ""}</>;
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 leading-relaxed text-zinc-300 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-4">
      <h1 className="mb-2 text-4xl font-black text-white">Privacy Policy</h1>
      <p className="text-sm text-zinc-500">Last updated {UPDATED}</p>
      <p>This policy explains how {SITE.name} ("we") collects, uses and protects your information when you use legacypartners.agency, our client portal, and our {SERVICE_LIST} services.</p>

      <h2>Information we collect</h2>
      <ul>
        <li><strong>Contact requests:</strong> your name, email, phone number, the service you're interested in and your age range.</li>
        <li><strong>Client portal:</strong> your account email, documents you upload (such as identification, tax forms and credit reports), messages, signed agreements, and the time and IP address of signatures.</li>
        <li><strong>Automatically:</strong> basic usage data through Google Analytics (pages visited, device type, approximate location) and security logs of sign-ins and document views.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To contact you about the services you asked about, including by phone, text and email with your consent.</li>
        <li>To provide the insurance{CREDIT_REPAIR_OPEN ? ", credit repair" : ""} and tax preparation services you sign up for.</li>
        <li>To keep the portal secure and meet our legal and record-keeping obligations.</li>
      </ul>
      <p><strong>Tax information:</strong> information from your tax return is used only to prepare and file your return. We will not use or share it for any other purpose — including offering you insurance or credit services — without your separate written consent, as required by Internal Revenue Code § 7216.</p>

      <h2>When we share information</h2>
      <p>We do not sell or rent your personal information. We share it only as needed to provide your services — for example with insurance carriers when you apply for a policy, with credit bureaus when we send disputes you have authorized, with the IRS and state agencies when filing your return — with service providers that host our website, database, files and email under confidentiality obligations, or when required by law.</p>

      <h2>Texts and calls</h2>
      <p>If you agree, we may call or text you about your request. Message and data rates may apply. Reply STOP to stop texts at any time, or tell us on a call. Consent is not a condition of purchase.</p>

      <h2>How we protect it</h2>
      <p>Portal sign-in uses one-time codes or Google. Documents are stored encrypted and are visible only to you and our authorized staff, and every document view is logged. We maintain administrative, technical and physical safeguards designed to protect your information.</p>

      <h2>How long we keep it</h2>
      <p>We keep tax records for at least 3 years after filing, credit repair records for the period required by law, and contact requests for up to 3 years. You can ask us to delete information we're not required to keep.</p>

      <h2>Your choices</h2>
      <p>You can ask to see, correct or delete your information, or stop marketing contact, by calling {contact}.</p>

      <h2>Children</h2>
      <p>Our services are for adults. We don't knowingly collect information from children under 13.</p>

      <h2>Changes</h2>
      <p>We'll post any changes on this page and update the date above.</p>
    </article>
  );
}
