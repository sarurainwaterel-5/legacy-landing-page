"use client";
import { useFormAction } from "@/components/useFormAction";
import { createClient } from "@/app/admin/actions";
import { SERVICES } from "@/lib/site";

export default function NewClientForm() {
  const [state, onSubmit, pending] = useFormAction(createClient);
  return (
    <form onSubmit={onSubmit} className="panel max-w-xl space-y-4">
      <div><label htmlFor="email" className="mb-1 block text-sm font-medium">Email (they sign in with this)</label><input id="email" name="email" type="email" required className="pfield" /></div>
      <div><label htmlFor="name" className="mb-1 block text-sm font-medium">Full legal name</label><input id="name" name="name" className="pfield" /></div>
      <div><label htmlFor="phone" className="mb-1 block text-sm font-medium">Phone</label><input id="phone" name="phone" type="tel" className="pfield" /></div>
      <div><label htmlFor="service" className="mb-1 block text-sm font-medium">Open a case for</label>
        <select id="service" name="service" className="pfield"><option value="">No case yet</option>{Object.entries(SERVICES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="invite" defaultChecked /> Email them a portal invite</label>
      {state?.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} className="pbtn">{pending ? "Creating…" : "Create client"}</button>
    </form>
  );
}
