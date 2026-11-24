import ServicePage from "@/components/ServicePage";

export const metadata = {
  title: "Tax Preparation in Texas — Upload Documents Securely Online",
  description: "Individual tax preparation with secure document upload. Send your W-2s and 1099s from your phone and track your return in the Legacy Partners client portal.",
  alternates: { canonical: "/tax-preparation" },
};

export default function Page() {
  return (
    <ServicePage
      eyebrow="Tax Preparation"
      title="Taxes done right, without the paperwork runaround"
      intro="Snap a photo of your W-2 or 1099, upload it to your secure client portal, and we'll take it from there. You'll see updates and can message us any time."
      interest="Tax Preparation"
      sections={[
        { heading: "How it works", bullets: [
          "Book a free consultation or fill in the form.",
          "Create your client account and sign the engagement letter online.",
          "Upload your documents — PDF or photos — to your secure portal.",
          "We prepare your return and go over it with you before filing.",
          "Track the status and message us from your portal.",
        ] },
        { heading: "Documents to gather", bullets: ["Photo ID for you (and your spouse, if filing jointly)", "Social Security cards or ITIN letters for everyone on the return", "W-2s, 1099s and any other income forms", "Last year's tax return", "Records of deductions or credits (childcare, education, mortgage interest, etc.)"] },
        { heading: "Your information stays private", body: "Your documents are encrypted and visible only to you and our staff. We use your tax information only to prepare your return, and never for marketing without your separate written consent." },
      ]}
      faqs={[
        ["Is it safe to upload my documents?", "Yes. Your portal uses one-time sign-in codes, files are stored encrypted, and every view of a document is logged. Please don't send tax documents by regular email or text."],
        ["What does it cost?", "It depends on your situation. You'll see the fee in your engagement letter before we start."],
      ]}
    />
  );
}
