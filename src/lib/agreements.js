import { createHash } from "node:crypto";
import { SITE } from "./site.js";

// IMPORTANT: draft wording for attorney review before first use. The rights disclosure follows
// 15 U.S.C. § 1679c(a) and must be checked word-for-word against the statute; the contract terms
// follow § 1679d(b) and the cancellation notice § 1679e(b). Texas Finance Code ch. 393 adds state
// requirements (registration, surety bond, disclosure) — fill SITE.csoRegistration and SITE.address.

export const CREDIT_RIGHTS_DISCLOSURE = `Consumer Credit File Rights Under State and Federal Law

You have a right to dispute inaccurate information in your credit report by contacting the credit bureau directly. However, neither you nor any "credit repair" company or credit repair organization has the right to have accurate, current, and verifiable information removed from your credit report. The credit bureau must remove accurate, negative information from your report only if it is over 7 years old. Bankruptcy information can be reported for 10 years.

You have a right to obtain a copy of your credit report from a credit bureau. You may be charged a reasonable fee. There is no fee, however, if you have been turned down for credit, employment, insurance, or a rental dwelling because of information in your credit report within the preceding 60 days. The credit bureau must provide someone to help you interpret the information in your credit file. You are entitled to receive a free copy of your credit report if you are unemployed and intend to apply for employment in the next 60 days, if you are a recipient of public welfare assistance, or if you have reason to believe that there is inaccurate information in your credit report due to fraud.

You have a right to sue a credit repair organization that violates the Credit Repair Organizations Act. This law prohibits deceptive practices by credit repair organizations.

You have the right to cancel your contract with any credit repair organization for any reason within 3 business days from the date you signed it.

Credit bureaus are required to follow reasonable procedures to ensure that the information they report is accurate. However, mistakes may occur.

You may, on your own, notify a credit bureau in writing that you dispute the accuracy of information in your credit file. The credit bureau must then reinvestigate and modify or remove inaccurate or incomplete information. The credit bureau may not charge any fee for this service. Any pertinent information and copies of all documents you have concerning an error should be given to the credit bureau.

If the credit bureau's reinvestigation does not resolve the dispute to your satisfaction, you may send a brief statement to the credit bureau, to be kept in your file, explaining why you think the record is inaccurate. The credit bureau must include a summary of your statement about disputed information with any report it issues about you.

The Federal Trade Commission regulates credit bureaus and credit repair organizations. For more information contact:

The Public Reference Branch
Federal Trade Commission
Washington, D.C. 20580`;

export const ESIGN_CONSENT = `I agree to receive this agreement and related notices electronically and to sign it electronically. I understand I can ask for a paper copy at no charge, and can withdraw this consent by contacting ${SITE.name} at ${SITE.phone}. I can view and save PDF/HTML documents on this device.`;

const business = () => `${SITE.name}${SITE.address ? `, ${SITE.address}` : " [BUSINESS ADDRESS REQUIRED]"}`;

function creditRepairBody({ clientName, fee }) {
  return `CREDIT REPAIR SERVICES AGREEMENT
Version ${AGREEMENTS.credit_repair.version}

Between: ${business()}${SITE.csoRegistration ? ` (Texas Credit Services Organization registration no. ${SITE.csoRegistration})` : " [TEXAS CSO REGISTRATION NO. REQUIRED]"}
And: ${clientName}

1. Services. ${SITE.name} will review your credit reports from Equifax, Experian and TransUnion with you, identify items you believe are inaccurate, incomplete or unverifiable, prepare and send dispute letters on your behalf, track the bureaus' responses, and report progress to you in your client portal. We cannot remove accurate, current and verifiable information, and we do not promise any particular result or score change.

2. Time to achieve results. Credit bureaus generally must respond to a dispute within 30 days (up to 45 days in some cases). Most clients need 3 to 6 months (about 3 to 6 dispute rounds). Results vary.

3. Payment terms. ${fee || "[TOTAL FEE AND PAYMENT TERMS REQUIRED]"}
Under federal law, we will not charge or receive any money for these services before they are fully performed.

4. Your responsibilities. You will provide accurate information, copies of your credit reports and identification, and forward any letters you receive from the credit bureaus or creditors.

5. YOUR RIGHT TO CANCEL. You may cancel this contract without penalty or obligation at any time before midnight of the 3rd business day after the date on which you signed the contract. See the attached notice of cancellation form for an explanation of this right.

NOTICE OF CANCELLATION
You may cancel this contract, without any penalty or obligation, at any time before midnight of the 3rd day which begins after the date the contract is signed by you.
To cancel this contract, mail or deliver a signed, dated copy of this cancellation notice, or any other written notice, to ${business()}, or use the "Cancel this agreement" button in your client portal, before midnight on {{CANCEL_BY}}.
I hereby cancel this transaction.
Date: ____________  Signature: ______________________

6. Electronic signature. Typing your full legal name and selecting "Sign agreement" is your legal signature on this agreement.`;
}

function taxPrepBody({ clientName, fee }) {
  return `TAX PREPARATION ENGAGEMENT LETTER
Version ${AGREEMENTS.tax_prep.version}

Between: ${business()}
And: ${clientName}

1. Scope. We will prepare your federal individual income tax return (and any state return you ask for) from the information and documents you provide. We do not audit or independently verify your information.

2. Your responsibilities. You are responsible for giving us complete and accurate information, keeping records that support your return, and reviewing the return before it is filed. You are responsible for any tax, penalties and interest owed.

3. Fees. ${fee || "[FEE REQUIRED]"}

4. Privacy of your tax information. We use your tax return information only to prepare and file your return. We will not use or disclose it for any other purpose — including offering you insurance or credit services — unless you sign a separate written consent as required by Internal Revenue Code § 7216.

5. Records. Documents you upload are stored encrypted, are visible only to you and our staff, and are kept for at least 3 years after filing unless you ask us to delete them earlier where the law allows.

6. Electronic signature. Typing your full legal name and selecting "Sign agreement" is your legal signature on this letter.`;
}

export const AGREEMENTS = {
  credit_repair: { version: "2026-11-24", title: "Credit Repair Services Agreement", build: creditRepairBody, cancelable: true, needsDisclosure: true },
  tax_prep: { version: "2026-11-24", title: "Tax Preparation Engagement Letter", build: taxPrepBody, cancelable: false, needsDisclosure: false },
};

export const sha256 = (text) => createHash("sha256").update(text, "utf8").digest("hex");

export function buildAgreement(kind, { clientName, fee }) {
  const def = AGREEMENTS[kind];
  if (!def) throw new Error("Unknown agreement type");
  const body = def.build({ clientName: clientName || "[CLIENT NAME]", fee: fee?.trim() });
  return { version: def.version, body, bodyHash: sha256(body) };
}

// Placeholders that must be filled before a client can sign.
export function missingFields(body) {
  return [...body.matchAll(/\[([A-Z .\-]+REQUIRED)\]/g)].map((m) => m[1]);
}

// The signed record shows the actual cancellation date in place of the placeholder.
export function withCancelDate(body, text) {
  return body.replace("{{CANCEL_BY}}", text);
}
