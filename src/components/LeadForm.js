"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { AGE_RANGES, INTERESTS } from "@/lib/site";
import { LEAD_CONSENT } from "@/lib/leads";
import { track } from "./track";

export default function LeadForm({ defaultInterest = "", title = "Get Your Free Quote", subtitle = "Takes about 2 minutes. No obligation." }) {
  const router = useRouter();
  const [values, setValues] = useState({ fullName: "", email: "", phone: "", interest: defaultInterest, ageRange: "", consent: false, company: "" });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | sending | error
  const set = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setState("sending");
    setErrors({});
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, page: window.location.pathname }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 422) { setErrors(data.errors || {}); setState("idle"); return; }
      if (!res.ok || !data.success) throw new Error(data.error || "failed");
      // Count the lead only once it is actually saved.
      track("generate_lead", { event_category: "lead", event_label: values.interest, value: 1 });
      router.push(`/thank-you?interest=${encodeURIComponent(values.interest)}`);
    } catch {
      setState("error");
      track("exception", { description: "lead_submit_failed" });
    }
  }

  const err = (k) => errors[k] && <p id={`${k}-err`} className="mt-1 text-sm text-red-300">{errors[k]}</p>;
  const aria = (k) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `${k}-err` } : {});

  return (
    <form onSubmit={submit} noValidate className="space-y-4" aria-label="Free quote request">
      <div>
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
        <p className="mt-1 text-sm text-zinc-300">{subtitle}</p>
      </div>
      <div>
        <label htmlFor="fullName" className="label">Full name</label>
        <input id="fullName" name="fullName" autoComplete="name" required value={values.fullName} onChange={set} className="field" {...aria("fullName")} />
        {err("fullName")}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="label">Mobile phone</label>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required value={values.phone} onChange={set} className="field" {...aria("phone")} />
          {err("phone")}
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required value={values.email} onChange={set} className="field" {...aria("email")} />
          {err("email")}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="interest" className="label">I'm interested in</label>
          <select id="interest" name="interest" required value={values.interest} onChange={set} className="field" {...aria("interest")}>
            <option value="">Choose one</option>
            {INTERESTS.map((i) => <option key={i}>{i}</option>)}
          </select>
          {err("interest")}
        </div>
        <div>
          <label htmlFor="ageRange" className="label">Age range <span className="text-zinc-500">(optional)</span></label>
          <select id="ageRange" name="ageRange" value={values.ageRange} onChange={set} className="field">
            <option value="">Choose one</option>
            {AGE_RANGES.map((a) => <option key={a} value={a}>{a.replace("-", "–")}</option>)}
          </select>
        </div>
      </div>
      {/* Honeypot for bots; hidden from people and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>Company<input name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set} /></label>
      </div>
      <label className="flex items-start gap-3 text-xs leading-relaxed text-zinc-300">
        <input type="checkbox" name="consent" checked={values.consent} onChange={set} className="mt-0.5 h-5 w-5 shrink-0 accent-yellow-400" {...aria("consent")} />
        <span>{LEAD_CONSENT} See our <a href="/privacy" className="underline">Privacy Policy</a>.</span>
      </label>
      {err("consent")}
      <button type="submit" disabled={state === "sending"} className="btn-gold w-full py-4 text-lg">
        {state === "sending" ? "Sending…" : "Get My Free Quote"}
      </button>
      <div aria-live="polite">
        {state === "error" && (
          <p className="rounded-xl border border-red-400/50 bg-red-950/40 p-3 text-sm text-red-200">
            Something went wrong sending your request. Please try again, or call us at <a href="tel:+12144031712" className="underline">(214) 403-1712</a>.
          </p>
        )}
      </div>
      <p className="flex items-center justify-center gap-2 text-xs text-zinc-400"><Lock className="h-3.5 w-3.5" aria-hidden /> We never sell your information.</p>
    </form>
  );
}
