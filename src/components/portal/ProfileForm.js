"use client";
import { useFormAction } from "@/components/useFormAction";
import { saveProfile } from "@/app/portal/actions";

export default function ProfileForm({ name, phone }) {
  const [state, onSubmit, pending] = useFormAction(saveProfile);
  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <div><label htmlFor="name" className="mb-1 block text-sm font-medium">Full legal name</label><input id="name" name="name" defaultValue={name || ""} required autoComplete="name" className="pfield" /></div>
      <div><label htmlFor="phone" className="mb-1 block text-sm font-medium">Mobile phone</label><input id="phone" name="phone" defaultValue={phone || ""} type="tel" autoComplete="tel" className="pfield" /></div>
      <button disabled={pending} className="pbtn">{pending ? "Saving…" : "Save"}</button>
      {state?.error && <p role="alert" className="text-sm text-red-700 sm:col-span-3">{state.error}</p>}
      {state?.ok && <p role="status" className="text-sm text-green-700 sm:col-span-3">Saved.</p>}
    </form>
  );
}
