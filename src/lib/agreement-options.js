import { CREDIT_REPAIR_OPEN } from "./site.js";

// Client-safe list (lib/agreements.js uses node:crypto).
const ALL = [
  ["credit_repair", "Credit Repair Services Agreement"],
  ["tax_prep", "Tax Preparation Engagement Letter"],
];
// Titles cover every kind, so older agreements still display.
export const AGREEMENT_TITLES = Object.fromEntries(ALL);
// Kinds staff can send now.
export const AGREEMENT_OPTIONS = ALL.filter(([k]) => CREDIT_REPAIR_OPEN || k !== "credit_repair");
