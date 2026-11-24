"use client";
import { useFormAction } from "@/components/useFormAction";
import { useEffect, useRef } from "react";

export default function MessageComposer({ action: serverAction, hidden = {} }) {
  const [state, onSubmit, pending] = useFormAction(serverAction);
  const form = useRef(null);
  useEffect(() => { if (state?.ok) form.current?.reset(); }, [state]);
  return (
    <form ref={form} onSubmit={onSubmit} className="space-y-2">
      {Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <label htmlFor="msg-body" className="sr-only">Message</label>
      <textarea id="msg-body" name="body" rows={3} maxLength={5000} required className="pfield" placeholder="Write a message…" />
      {state?.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} className="pbtn">{pending ? "Sending…" : "Send"}</button>
    </form>
  );
}
