import { AGE_RANGES, INTERESTS, SITE } from "./site.js";

// Shown under the form and stored with every lead. Have compliance approve the wording.
export const LEAD_CONSENT = `By submitting, you agree that ${SITE.name} may contact you at the number and email you provided, including by call, text message (message and data rates may apply) and email, about insurance, credit repair and tax services. Consent is not a condition of purchase. Reply STOP to opt out of texts.`;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizePhone(input) {
  const digits = String(input || "").replace(/\D/g, "");
  const ten = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(ten) ? `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}` : null;
}

// Returns { lead } or { errors: { field: message } }.
export function validateLead(input = {}) {
  const errors = {};
  const fullName = String(input.fullName || "").trim().replace(/\s+/g, " ");
  const email = String(input.email || "").trim().toLowerCase();
  const phone = normalizePhone(input.phone);
  const interest = String(input.interest || "");
  const ageRange = input.ageRange ? String(input.ageRange) : null;

  if (fullName.length < 2 || fullName.length > 100) errors.fullName = "Enter your full name.";
  if (!EMAIL.test(email) || email.length > 200) errors.email = "Enter a valid email address.";
  if (!phone) errors.phone = "Enter a 10-digit US phone number.";
  if (!INTERESTS.includes(interest)) errors.interest = "Choose what you're interested in.";
  if (ageRange && !AGE_RANGES.includes(ageRange)) errors.ageRange = "Choose an age range.";
  if (input.consent !== true) errors.consent = "Please confirm we may contact you.";

  if (Object.keys(errors).length) return { errors };
  return {
    lead: {
      fullName, email, phone, interest, ageRange,
      page: String(input.page || "").slice(0, 200) || null,
      source: "website",
      consentText: LEAD_CONSENT,
    },
  };
}

export function leadEmailText(lead) {
  return `New lead from legacypartners.agency

Name: ${lead.fullName}
Phone: ${lead.phone}
Email: ${lead.email}
Interested in: ${lead.interest}
Age range: ${lead.ageRange || "—"}
Page: ${lead.page || "—"}
Received: ${new Date(lead.createdAt).toLocaleString("en-US", { timeZone: "America/Chicago" })} Central

Open the dashboard: ${SITE.url}/admin/leads`;
}
