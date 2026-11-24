"use client";
import { useFormAction } from "@/components/useFormAction";
import { updateClient } from "@/app/admin/actions";

export default function ClientDetailsForm({ client }) {
  const [state, onSubmit, pending] = useFormAction(updateClient);
  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <input type="hidden" name="id" value={client.id} />
      <label className="block text-sm font-medium">Full legal name<input name="name" defaultValue={client.name || ""} className="pfield mt-1" /></label>
      <label className="block text-sm font-medium">Phone<input name="phone" defaultValue={client.phone || ""} className="pfield mt-1" /></label>
      <button disabled={pending} className="pbtn-light">{pending ? "Saving…" : "Save"}</button>
      {state?.error && <p role="alert" className="text-sm text-red-700 sm:col-span-3">{state.error}</p>}
    </form>
  );
}
