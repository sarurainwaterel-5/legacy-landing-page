// Client-safe list (lib/agreements.js uses node:crypto).
export const AGREEMENT_OPTIONS = [
  ["credit_repair", "Credit Repair Services Agreement"],
  ["tax_prep", "Tax Preparation Engagement Letter"],
];
export const AGREEMENT_TITLES = Object.fromEntries(AGREEMENT_OPTIONS);
