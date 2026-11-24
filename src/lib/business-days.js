// "Business day" under the Credit Repair Organizations Act: any day except Sunday and legal public holidays.
// To stay on the customer's side, both a holiday and its observed weekday are treated as non-business days.
const TZ = "America/Chicago";

function nthWeekday(year, month, weekday, n) {
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
  return 1 + ((weekday - first + 7) % 7) + (n - 1) * 7;
}
function lastWeekday(year, month, weekday) {
  const last = new Date(Date.UTC(year, month + 1, 0));
  return last.getUTCDate() - ((last.getUTCDay() - weekday + 7) % 7);
}
const key = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

export function federalHolidays(year) {
  const fixed = [[0, 1], [5, 19], [6, 4], [10, 11], [11, 25]];
  const days = new Set();
  for (const [m, d] of fixed) {
    days.add(key(year, m, d));
    const dow = new Date(Date.UTC(year, m, d)).getUTCDay();
    if (dow === 0) days.add(key(year, m, d + 1)); // observed Monday
    if (dow === 6) { const f = new Date(Date.UTC(year, m, d - 1)); days.add(key(f.getUTCFullYear(), f.getUTCMonth(), f.getUTCDate())); }
  }
  days.add(key(year, 0, nthWeekday(year, 0, 1, 3)));  // MLK Day
  days.add(key(year, 1, nthWeekday(year, 1, 1, 3)));  // Washington's Birthday
  days.add(key(year, 4, lastWeekday(year, 4, 1)));    // Memorial Day
  days.add(key(year, 8, nthWeekday(year, 8, 1, 1)));  // Labor Day
  days.add(key(year, 9, nthWeekday(year, 9, 1, 2)));  // Columbus Day
  days.add(key(year, 10, nthWeekday(year, 10, 4, 4))); // Thanksgiving
  return days;
}

function localDate(instant) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: TZ, year: "numeric", month: "numeric", day: "numeric" })
    .formatToParts(instant).map((p) => [p.type, Number(p.value)]));
  return { y: parts.year, m: parts.month - 1, d: parts.day };
}

// UTC instant of the given Chicago wall-clock time.
function chicagoInstant(y, m, d, hh, mm, ss, ms) {
  const guess = Date.UTC(y, m, d, hh, mm, ss); // whole seconds: toLocaleString drops milliseconds
  const asLocal = new Date(guess).toLocaleString("en-US", { timeZone: TZ, hourCycle: "h23" });
  const shown = new Date(`${asLocal} UTC`).getTime();
  return new Date(guess + (guess - shown) + ms);
}

export function isBusinessDay(y, m, d) {
  const dow = new Date(Date.UTC(y, m, d)).getUTCDay();
  return dow !== 0 && !federalHolidays(y).has(key(y, m, d));
}

// Midnight (end) of the 3rd business day that begins after `signedAt`, Central time.
export function cancellationDeadline(signedAt, businessDays = 3) {
  let { y, m, d } = localDate(signedAt);
  let count = 0;
  while (count < businessDays) {
    const next = new Date(Date.UTC(y, m, d + 1));
    y = next.getUTCFullYear(); m = next.getUTCMonth(); d = next.getUTCDate();
    if (isBusinessDay(y, m, d)) count++;
  }
  return chicagoInstant(y, m, d, 23, 59, 59, 999);
}

export function formatDeadline(date) {
  return new Intl.DateTimeFormat("en-US", { timeZone: TZ, dateStyle: "full", timeStyle: "short" }).format(date) + " Central";
}
