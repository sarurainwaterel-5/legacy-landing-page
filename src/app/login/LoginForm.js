"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { normalizeLoginCode, CODE_LENGTH } from "@/lib/login-code";

export default function LoginForm({ callbackUrl, google, initialError }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);

  async function sendCode(e) {
    e?.preventDefault();
    setBusy(true);
    setError(null);
    const res = await signIn("email", { email: email.trim().toLowerCase(), redirect: false, callbackUrl });
    setBusy(false);
    if (res?.error) setError("We couldn't send the code. Check the address, wait a minute and try again.");
    else setStep("code");
  }

  function verify(e) {
    e.preventDefault();
    const token = normalizeLoginCode(code);
    if (token.length !== CODE_LENGTH) return setError(`Enter the ${CODE_LENGTH}-character code from the email.`);
    setBusy(true);
    const q = new URLSearchParams({ email: email.trim().toLowerCase(), token, callbackUrl });
    // Full navigation on purpose: the auth callback sets the session cookie and redirects.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `/api/auth/callback/email?${q}`;
  }

  return (
    <div className="space-y-5">
      {error && <p role="alert" className="rounded-xl border border-red-400/50 bg-red-950/40 p-3 text-sm text-red-200">{error}</p>}
      {step === "email" ? (
        <form onSubmit={sendCode} className="space-y-4">
          <div>
            <label htmlFor="email" className="label">Email address</label>
            <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
          </div>
          <button disabled={busy} className="btn-gold w-full">{busy ? "Sending…" : "Email me a sign-in code"}</button>
          <p className="text-center text-xs text-zinc-500">New here? The same step creates your account.</p>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-4">
          <p className="text-sm text-zinc-300">We sent an 8-character code to <strong className="text-white">{email}</strong>. It expires in 10 minutes.</p>
          <div>
            <label htmlFor="code" className="label">Sign-in code</label>
            <input id="code" required autoFocus autoComplete="one-time-code" autoCapitalize="characters" spellCheck={false} placeholder="ABCD-EFGH"
              value={code} onChange={(e) => setCode(e.target.value)} className="field text-center font-mono text-2xl tracking-[0.3em] uppercase" />
          </div>
          <button disabled={busy} className="btn-gold w-full">{busy ? "Signing in…" : "Sign in"}</button>
          <div className="flex justify-between text-sm">
            <button type="button" onClick={() => { setStep("email"); setCode(""); setError(null); }} className="text-zinc-400 hover:text-white">Use a different email</button>
            <button type="button" disabled={busy} onClick={sendCode} className="text-yellow-400 hover:underline">Send a new code</button>
          </div>
        </form>
      )}
      {google && step === "email" && (
        <>
          <div className="flex items-center gap-3 text-xs text-zinc-500"><span className="h-px flex-1 bg-zinc-700" />or<span className="h-px flex-1 bg-zinc-700" /></div>
          <button type="button" onClick={() => signIn("google", { callbackUrl })} className="btn-ghost w-full">Continue with Google</button>
        </>
      )}
    </div>
  );
}
