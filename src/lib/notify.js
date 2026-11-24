import { sendMail } from "./mail.js";
import { SITE } from "./site.js";

// Staff alerts never include document contents or message text — only a pointer to the dashboard.
export async function notifyStaff(subject, path = "/admin") {
  const to = process.env.NOTIFY_EMAIL;
  if (!to) return;
  try {
    await sendMail({ to, subject, text: `${subject}\n\nOpen the dashboard: ${SITE.url}${path}` });
  } catch (error) {
    console.error("[NOTIFY] failed", subject, error.message);
  }
}

export async function notifyClient(email, subject, line) {
  if (!email) return;
  try {
    await sendMail({ to: email, subject, text: `${line}\n\nSign in to your portal to see it: ${SITE.url}/portal\n\n${SITE.name} · ${SITE.phone}` });
  } catch (error) {
    console.error("[NOTIFY] client email failed", error.message);
  }
}
