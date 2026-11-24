import test from "node:test";
import assert from "node:assert/strict";
import { buildAgreement, missingFields, withCancelDate, sha256, CREDIT_RIGHTS_DISCLOSURE } from "../src/lib/agreements.js";

test("credit repair contract contains the required CROA elements", () => {
  const { body } = buildAgreement("credit_repair", { clientName: "Jane Doe", fee: "$99 per month after services are performed." });
  assert.match(body, /You may cancel this contract without penalty or obligation at any time before midnight of the 3rd business day/);
  assert.match(body, /NOTICE OF CANCELLATION/);
  assert.match(body, /\$99 per month/);
  assert.match(body, /will not charge or receive any money for these services before they are fully performed/);
  assert.match(body, /Time to achieve results/);
  assert.match(body, /Jane Doe/);
});

test("contracts cannot be signed while required details are missing", () => {
  const { body } = buildAgreement("credit_repair", { clientName: "Jane Doe", fee: "" });
  const missing = missingFields(body);
  assert.ok(missing.includes("TOTAL FEE AND PAYMENT TERMS REQUIRED"));
  assert.ok(missing.some((m) => /CSO/.test(m)), "Texas CSO registration still required");
  assert.ok(!missing.some((m) => /ADDRESS/.test(m)));
  assert.match(body, /302 Talty Rd, Terrell, TX 75160/);
});

test("cancel date is written into the signed copy and the hash changes", () => {
  const { body, bodyHash } = buildAgreement("credit_repair", { clientName: "Jane Doe", fee: "x" });
  const signed = withCancelDate(body, "Saturday, November 28, 2026 at 11:59 PM Central");
  assert.ok(!signed.includes("{{CANCEL_BY}}"));
  assert.match(signed, /before midnight on Saturday, November 28, 2026/);
  assert.notEqual(sha256(signed), bodyHash);
  assert.equal(sha256(body), bodyHash);
});

test("tax engagement letter includes the § 7216 limit on use of tax information", () => {
  const { body } = buildAgreement("tax_prep", { clientName: "Jane Doe", fee: "$150" });
  assert.match(body, /7216/);
  assert.deepEqual(missingFields(body), []);
  assert.match(body, /302 Talty Rd, Terrell, TX 75160/);
});

test("rights disclosure is the separate federal statement", () => {
  assert.match(CREDIT_RIGHTS_DISCLOSURE, /^Consumer Credit File Rights Under State and Federal Law/);
  assert.match(CREDIT_RIGHTS_DISCLOSURE, /right to cancel your contract with any credit repair organization for any reason within 3 business days/);
});
