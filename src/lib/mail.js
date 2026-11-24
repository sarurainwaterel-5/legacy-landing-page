import nodemailer from "nodemailer";

let transport;
function getTransport() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  transport ||= nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
  return transport;
}

// Sends mail through SMTP. Without credentials, development logs the message instead; production throws.
export async function sendMail({ to, subject, text, html }) {
  const t = getTransport();
  if (!t) {
    if (process.env.NODE_ENV === "production") throw new Error("EMAIL_USER / EMAIL_PASS are not configured");
    console.log(`[MAIL:dev] to=${to} subject=${subject}\n${text}`);
    globalThis.__devOutbox = [...(globalThis.__devOutbox || []).slice(-49), { to, subject, text, at: Date.now() }];
    return { dev: true };
  }
  return t.sendMail({ from: `"Legacy Partners" <${process.env.EMAIL_USER}>`, to, subject, text, html });
}
