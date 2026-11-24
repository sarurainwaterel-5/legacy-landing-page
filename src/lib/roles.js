// Staff are identified by verified email. ADMIN_EMAILS is a comma-separated list (env var, not code).
export function staffEmails(env = process.env) {
  return String(env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isStaffEmail(email, env = process.env) {
  return Boolean(email) && staffEmails(env).includes(String(email).toLowerCase());
}
