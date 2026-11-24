"use client";
import { useFormAction } from "@/components/useFormAction";
import { signAgreement } from "@/app/portal/actions";

export default function SignAgreementForm({ id, needsDisclosure, esignText, defaultName }) {
  const [state, onSubmit, pending] = useFormAction(signAgreement);
  if (state?.ok) {
    return (
      <div role="status" className="rounded-xl border border-green-300 bg-green-50 p-4 text-green-900">
        <p className="font-semibold">Signed. A copy is saved in your portal.</p>
        {state.cancelBy && <p className="mt-1 text-sm">You can cancel without penalty until {state.cancelBy}.</p>}
      </div>
    );
  }
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      {needsDisclosure && (
        <label className="flex items-start gap-3 text-sm"><input type="checkbox" name="disclosureAck" required className="mt-1 h-4 w-4" />
          <span>I have received and read the separate <strong>Consumer Credit File Rights Under State and Federal Law</strong> statement shown above, before signing this contract.</span></label>
      )}
      <label className="flex items-start gap-3 text-sm"><input type="checkbox" name="esignConsent" required className="mt-1 h-4 w-4" /><span>{esignText}</span></label>
      <div>
        <label htmlFor="signedName" className="mb-1 block text-sm font-medium">Type your full legal name to sign</label>
        <input id="signedName" name="signedName" required defaultValue={defaultName || ""} autoComplete="name" className="pfield font-serif text-lg italic" />
      </div>
      {state?.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} className="pbtn w-full sm:w-auto">{pending ? "Signing…" : "Sign agreement"}</button>
    </form>
  );
}
