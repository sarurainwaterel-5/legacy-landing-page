import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSession, googleEnabled } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Client Login", robots: { index: false } };

const ERRORS = {
  Verification: "That code is wrong or has expired. Request a new one.",
  EmailSignin: "We couldn't send the code. Wait a minute and try again.",
  OAuthAccountNotLinked: "Sign in with your email code instead.",
};

function safeCallback(url) {
  return typeof url === "string" && url.startsWith("/") && !url.startsWith("//") ? url : "/portal";
}

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const callbackUrl = safeCallback(params.callbackUrl);
  const session = await getSession();
  if (session?.user) redirect(session.user.isStaff && callbackUrl === "/portal" ? "/admin" : callbackUrl);
  const error = params.error ? ERRORS[params.error] || "Sign-in failed. Please try again." : null;
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-wine-800 via-wine-950 to-[#24060d] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-yellow-500/30 bg-wine-900/80 p-8 shadow-2xl">
        <Link href="/" className="mb-6 flex flex-col items-center gap-2">
          <Image src="/logo.webp" alt="" width={72} height={72} />
          <span className="text-sm tracking-[0.3em] text-yellow-400">LEGACY PARTNERS</span>
        </Link>
        <h1 className="mb-1 text-center text-2xl font-bold">Client portal</h1>
        <p className="mb-6 text-center text-sm text-zinc-400">Documents, agreements, credit repair progress and messages — all in one secure place.</p>
        <LoginForm callbackUrl={callbackUrl} google={googleEnabled} initialError={error} />
      </div>
    </main>
  );
}
