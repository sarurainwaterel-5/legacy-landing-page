import ServicePage from "@/components/ServicePage";

export const metadata = {
  title: "Life Insurance in Texas — Term, Whole, Final Expense & More",
  description: "Term life, whole life, mortgage protection, final expense and IUL for Texas families. Talk to licensed agent Lashane Johnson for a free consultation.",
  alternates: { canonical: "/life-insurance" },
};

export default function Page() {
  return (
    <ServicePage
      eyebrow="Life Insurance"
      title="Life insurance that fits your family and your budget"
      intro="Whether you want to replace your income, pay off the house, or cover final expenses, we'll help you choose the right type and amount of coverage — and explain it in plain English."
      interest="Not Sure Yet"
      sections={[
        { heading: "Term life insurance", body: "Coverage for a set period — usually 10, 20 or 30 years. It's typically the lowest-cost way to get a large amount of protection while your children are young or your mortgage is open." },
        { heading: "Whole life insurance", body: "Permanent coverage that lasts your whole life, with premiums that don't go up and cash value that grows over time." },
        { heading: "Mortgage protection", body: "A policy sized to your mortgage so your family can stay in the home if you pass away. Some policies also include living benefits." },
        { heading: "Final expense (burial) insurance", body: "Smaller whole life policies — often $5,000 to $50,000 — to cover funeral costs and final bills, usually with simple health questions instead of an exam." },
        { heading: "Indexed universal life (IUL)", body: "Permanent coverage with cash value linked to a market index. It includes a floor so your cash value isn't reduced by index losses, but returns are capped and fees apply — we'll go through the details with you." },
        { heading: "What to have ready", bullets: ["Your date of birth and general health", "Any medications you take", "How much coverage you think you need (we can help work it out)", "Your monthly budget"] },
      ]}
      faqs={[
        ["How much life insurance do I need?", "A common starting point is 10–15 times your yearly income, plus your mortgage and any debts, minus savings. We'll work out a number that fits your family on the call."],
        ["Do I need a medical exam?", "Not always. Some policies only ask health questions. Whether you qualify without an exam depends on the carrier, your age, the amount of coverage and your health."],
        ["How long does it take?", "The consultation takes about 30 minutes. Approval can be the same day for some policies and a few weeks for others."],
      ]}
      note="Insurance products are subject to underwriting and policy approval. Coverage options and availability vary by carrier and state."
    />
  );
}
