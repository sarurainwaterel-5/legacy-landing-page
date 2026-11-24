import test from "node:test";
import assert from "node:assert/strict";
import { validateLead, normalizePhone, LEAD_CONSENT } from "../src/lib/leads.js";

const good = { fullName: "  Jane   Doe ", email: "Jane@Example.com ", phone: "214-403-1712", interest: "Term Life", ageRange: "31-45", consent: true, page: "/" };

test("valid lead is normalized and stores the consent text", () => {
  const { lead, errors } = validateLead(good);
  assert.equal(errors, undefined);
  assert.equal(lead.fullName, "Jane Doe");
  assert.equal(lead.email, "jane@example.com");
  assert.equal(lead.phone, "(214) 403-1712");
  assert.equal(lead.consentText, LEAD_CONSENT);
});

test("consent must be an explicit true", () => {
  for (const consent of [undefined, false, "true", "on"]) assert.ok(validateLead({ ...good, consent }).errors.consent);
});

test("bad fields are reported individually", () => {
  const { errors } = validateLead({ fullName: "J", email: "nope", phone: "123", interest: "Lottery", ageRange: "200", consent: true });
  assert.deepEqual(Object.keys(errors).sort(), ["ageRange", "email", "fullName", "interest", "phone"]);
});

test("phone normalization accepts +1 and rejects invalid area codes", () => {
  assert.equal(normalizePhone("+1 (214) 403-1712"), "(214) 403-1712");
  assert.equal(normalizePhone("114-403-1712"), null);
  assert.equal(normalizePhone("214-403-171"), null);
});

test("tax prep is a valid interest; age range optional", () => {
  assert.ok(validateLead({ ...good, interest: "Tax Preparation", ageRange: "" }).lead);
  assert.ok(validateLead({ ...good, interest: "Tax Preparation", ageRange: undefined }).lead);
});

test("credit repair leads are refused while credit repair is closed", () => {
  assert.equal(process.env.NEXT_PUBLIC_CREDIT_REPAIR_OPEN, undefined);
  assert.ok(validateLead({ ...good, interest: "Credit Repair" }).errors.interest);
});
