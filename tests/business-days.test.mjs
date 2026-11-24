import test from "node:test";
import assert from "node:assert/strict";
import { cancellationDeadline, federalHolidays, isBusinessDay } from "../src/lib/business-days.js";

const chicago = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(d);

test("Sundays and federal holidays are not business days; Saturdays are", () => {
  assert.ok(!isBusinessDay(2026, 10, 29)); // Sun Nov 29 2026
  assert.ok(isBusinessDay(2026, 10, 28));  // Sat Nov 28 2026
  assert.ok(!isBusinessDay(2026, 10, 26)); // Thanksgiving 2026
  assert.ok(federalHolidays(2026).has("2026-07-03")); // July 4 2026 is Saturday -> observed Friday
});

test("signed Tuesday before Thanksgiving: Wed, (Thu holiday), Fri, Sat -> ends Saturday midnight", () => {
  const signed = new Date("2026-11-24T21:00:00Z"); // Tue 3pm Central
  assert.equal(chicago(cancellationDeadline(signed)), "2026-11-28, 23:59");
});

test("signed Friday night: Sat, (Sun), Mon, Tue", () => {
  const signed = new Date("2026-12-05T04:30:00Z"); // Fri Dec 4 10:30pm Central
  assert.equal(chicago(cancellationDeadline(signed)), "2026-12-08, 23:59");
});

test("uses Central time, not UTC, to decide the signing day", () => {
  const lateMonday = new Date("2026-03-10T04:00:00Z"); // Mon Mar 9 11pm CDT (already Tue in UTC)
  assert.equal(chicago(cancellationDeadline(lateMonday)), "2026-03-12, 23:59");
});

test("Christmas week", () => {
  const signed = new Date("2026-12-23T18:00:00Z"); // Wed Dec 23
  // Thu 24, (Fri 25 Christmas), Sat 26, (Sun 27), Mon 28
  assert.equal(chicago(cancellationDeadline(signed)), "2026-12-28, 23:59");
});
