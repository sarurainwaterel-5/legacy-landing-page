// Single source for business facts shown across the site. Fill the TODOs before launch.
export const SITE = {
  name: "Legacy Partners",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://legacypartners.agency",
  phone: "(214) 403-1712",
  phoneHref: "tel:+12144031712",
  agent: "Lashanae Johnson",
  agentTitle: "Licensed Life Insurance Agent",
  state: "Texas",
  // Texas Department of Insurance agent license (verify at https://www.tdi.texas.gov/agent/agentlookup.html).
  insuranceLicense: process.env.NEXT_PUBLIC_TDI_LICENSE || "3140432",
  // TODO(owner): Texas Secretary of State Credit Services Organization registration number (Tex. Fin. Code ch. 393).
  csoRegistration: process.env.NEXT_PUBLIC_CSO_REGISTRATION || "",
  // Principal business address — required in credit repair contracts and cancellation notices.
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || "302 Talty Rd, Terrell, TX 75160",
  postalAddress: { streetAddress: "302 Talty Rd", addressLocality: "Terrell", addressRegion: "TX", postalCode: "75160", addressCountry: "US" },
  calendly: "https://calendly.com/legacy-partners-agency/30min",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
};

// Credit repair stays closed until the Texas CSO registration and surety bond are in place (Tex. Fin. Code ch. 393).
// To open it: set NEXT_PUBLIC_CREDIT_REPAIR_OPEN=true and NEXT_PUBLIC_CSO_REGISTRATION on Vercel, then redeploy.
export const CREDIT_REPAIR_OPEN = process.env.NEXT_PUBLIC_CREDIT_REPAIR_OPEN === "true";

const ALL_SERVICES = {
  life_insurance: "Life Insurance",
  credit_repair: "Credit Repair",
  tax_prep: "Tax Preparation",
};

// Services we currently offer (what clients and staff can open).
export const SERVICES = Object.fromEntries(Object.entries(ALL_SERVICES).filter(([k]) => CREDIT_REPAIR_OPEN || k !== "credit_repair"));

// Plain-language list for page copy, e.g. "life insurance, credit repair and tax preparation".
export const SERVICE_LIST = CREDIT_REPAIR_OPEN ? "life insurance, credit repair and tax preparation" : "life insurance and tax preparation";

export const INTERESTS = [
  "Term Life",
  "Whole Life",
  "Mortgage Protection",
  "Final Expense",
  "Indexed Universal Life",
  "Credit Repair",
  "Tax Preparation",
  "Not Sure Yet",
].filter((i) => CREDIT_REPAIR_OPEN || i !== "Credit Repair");

export const AGE_RANGES = ["18-30", "31-45", "46-60", "60+"];
