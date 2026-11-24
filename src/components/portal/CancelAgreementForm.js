"use client";
import { useFormAction } from "@/components/useFormAction";
import { cancelAgreement } from "@/app/portal/actions";

export default function CancelAgreementForm({ id, deadline }) {
  const [state, onSubmit, pending] = useFormAction(cancelAgreement);
  if (state?.ok) return <p role="status" className="rounded-xl bg-zinc-100 p-4">Your agreement is cancelled. No fees are owed.</p>;
  return (
    <form onSubmit={(e) => { if (confirm("Cancel this agreement? We'll stop all work and no fees will be owed.")) onSubmit(e); else e.preventDefault(); }} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <input type="hidden" name="id" value={id} />
      <p className="mb-3 text-sm">You can cancel this agreement without penalty or obligation until <strong>{deadline}</strong>.</p>
      {state?.error && <p role="alert" className="mb-2 text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} className="pbtn-light border-red-300 text-red-700">{pending ? "Cancelling…" : "Cancel this agreement"}</button>
    </form>
  );
}
