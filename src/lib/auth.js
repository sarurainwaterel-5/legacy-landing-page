import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "./prisma.js";
import { sendMail } from "./mail.js";
import { isStaffEmail } from "./roles.js";
import { audit } from "./audit.js";
import { CODE_TTL_SECONDS, formatLoginCode, generateLoginCode } from "./login-code.js";

const providers = [
  EmailProvider({
    maxAge: CODE_TTL_SECONDS,
    generateVerificationToken: generateLoginCode,
    async sendVerificationRequest({ identifier, url, token }) {
      // Throttle: at most one code per address per 60 s (stops the form being used to spam inboxes).
      const recent = await prisma.verificationToken.count({
        where: { identifier, expires: { gt: new Date(Date.now() + (CODE_TTL_SECONDS - 60) * 1000) } },
      });
      if (recent > 1) throw new Error("Too many sign-in codes requested. Wait a minute and try again.");
      const code = formatLoginCode(token);
      await sendMail({
        to: identifier,
        subject: `Your Legacy Partners sign-in code: ${code}`,
        text: `Your sign-in code is ${code}\n\nIt expires in 10 minutes. Or open this link on the same device:\n${url}\n\nIf you didn't ask for this, ignore this email — nobody can sign in without the code.\n\nLegacy Partners`,
        html: `<p>Your Legacy Partners sign-in code is</p><p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p><p>It expires in 10 minutes. Or <a href="${url}">sign in with this link</a> on the same device.</p><p style="color:#666">If you didn't ask for this, ignore this email — nobody can sign in without the code.</p>`,
      });
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Google only returns verified addresses, so linking to an existing email-code account is safe.
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: { strategy: "database", maxAge: 7 * 24 * 60 * 60, updateAge: 24 * 60 * 60 },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.isStaff = isStaffEmail(user.email);
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      await audit(user.id, "sign_in", account?.provider);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login", verifyRequest: "/login", error: "/login" },
};

export const googleEnabled = providers.some((p) => p.id === "google");

export async function getSession() {
  return getServerSession(authOptions);
}

// For pages: send signed-out visitors to /login and return the session.
export async function requireUser(callbackUrl = "/portal") {
  const session = await getSession();
  if (!session?.user?.id) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  return session;
}

export async function requireStaff() {
  const session = await requireUser("/admin");
  if (!session.user.isStaff) redirect("/portal");
  return session;
}
