export const STATUS_LABELS = {
  open: "Open",
  waiting_on_client: "Waiting on you",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  pending: "Pending",
  disputed: "Disputed",
  removed: "Removed",
  updated: "Updated",
  verified: "Verified (unchanged)",
  sent: "Ready to sign",
  signed: "Signed",
};

export const BUREAUS = { equifax: "Equifax", experian: "Experian", transunion: "TransUnion" };

export function formatDate(d, opts = { dateStyle: "medium" }) {
  return d ? new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", ...opts }).format(new Date(d)) : "—";
}
export const formatDateTime = (d) => formatDate(d, { dateStyle: "medium", timeStyle: "short" });

export function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
export const daysAgo = (n) => new Date(Date.now() - n * 864e5);
