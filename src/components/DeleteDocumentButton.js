"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteDocumentButton({ id, name }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function remove() {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    setBusy(true);
    const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) router.refresh(); else alert("Could not delete the document.");
  }
  return <button onClick={remove} disabled={busy} className="text-sm text-red-700 hover:underline disabled:opacity-50">Delete</button>;
}
