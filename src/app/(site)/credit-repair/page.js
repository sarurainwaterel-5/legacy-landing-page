import ServicePage from "@/components/ServicePage";

export const metadata = {
  title: "Credit Repair in Texas — Dispute Inaccurate Credit Report Items",
  description: "Legacy Partners helps you dispute inaccurate, incomplete or unverifiable items with Equifax, Experian and TransUnion, and track every dispute in a secure client portal.",
  alternates: { canonical: "/credit-repair" },
};

export default function Page() {
  return (
    <ServicePage
      eyebrow="Credit Repair"
      title="Challenge the errors holding your credit back"
      intro="Mistakes on credit reports are common. We help you find items that are inaccurate, incomplete or can't be verified, dispute them with the credit bureaus, and follow up — and you can watch every step in your client portal."
      interest="Credit Repair"
      sections={[
        { heading: "How it works", bullets: [
          "Free consultation: we review your goals and explain your rights.",
          "You sign the agreement online — you can cancel within 3 business days, no penalty.",
          "We review your reports from all three bureaus with you.",
          "We prepare and send disputes for the items you identify as inaccurate.",
          "Bureaus generally respond within 30 days; we post each result to your portal.",
          "We repeat dispute rounds as needed and help you build positive credit habits.",
        ] },
        { heading: "What we can and can't do", body: "No one can legally remove accurate, current and verifiable information from your credit report. We don't promise specific score increases. What we do is make sure the bureaus investigate items that are wrong, incomplete or unverifiable — and keep you informed." },
        { heading: "Fees", body: "You will see the total cost in writing before you sign. By law, we don't charge for credit repair services until they have been performed." },
      ]}
      faqs={[
        ["Can I do this myself?", "Yes. You have the right to dispute inaccurate information directly with the credit bureaus for free. Many people hire help because of the time, paperwork and follow-up involved."],
        ["How long does it take?", "Bureaus generally have 30 days to respond to each dispute. Most clients need several months and multiple rounds. Results vary."],
        ["Can I cancel?", "Yes. You can cancel within 3 business days of signing without any penalty or obligation — right from your client portal."],
      ]}
      note="Credit repair services are provided under the federal Credit Repair Organizations Act and Texas Finance Code chapter 393. You have a right to dispute inaccurate information in your credit report by contacting the credit bureau directly at no cost."
    />
  );
}
