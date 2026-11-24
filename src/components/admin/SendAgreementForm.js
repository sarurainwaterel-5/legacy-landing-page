"use client";
import { useFormAction } from "@/components/useFormAction";
import { sendAgreement } from "@/app/admin/actions";
import { AGREEMENT_OPTIONS } from "@/lib/agreement-options";

export default function SendAgreementForm({ clientId, cases }) {
  const [state, onSubmit, pending] = useFormAction(sendAgreement);
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input type="hidden" name="clientId" value={clientId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium">Agreement
          <select name="kind" className="pfield mt-1">{AGREEMENT_OPTIONS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <label className="block text-sm font-medium">Case
          <select name="caseId" className="pfield mt-1"><option value="">None</option>{cases.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
      </div>
      <label className="block text-sm font-medium">Total fee and payment terms (shown in the contract)
        <textarea name="fee" rows={2} required className="pfield mt-1" placeholder="e.g. $99 per month, billed after each month's services are completed. Total for 6 months: $594." /></label>
      {state?.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      {state?.warning && <p role="status" className="text-sm text-amber-800">{state.warning}</p>}
      {state?.ok && <p role="status" className="text-sm text-green-700">Sent — the client has been emailed.</p>}
      <button disabled={pending} className="pbtn">{pending ? "Sending…" : "Send for signature"}</button>
    </form>
  );
}
