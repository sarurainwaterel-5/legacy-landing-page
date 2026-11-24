"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { DOCUMENT_CATEGORIES, DOCUMENT_MAX_BYTES, DOCUMENT_TYPES, documentPath, extensionOf } from "@/lib/documents";

export default function DocumentUploader({ clientId, cases = [] }) {
  const router = useRouter();
  const input = useRef(null);
  const [category, setCategory] = useState("other");
  const [caseId, setCaseId] = useState(cases.length === 1 ? cases[0].id : "");
  const [items, setItems] = useState([]);
  const update = (i, patch) => setItems((all) => all.map((it, j) => (j === i ? { ...it, ...patch } : it)));

  async function onFiles(files) {
    const list = [...files];
    const start = items.length;
    setItems((all) => [...all, ...list.map((f) => ({ name: f.name, state: "waiting", pct: 0 }))]);
    for (const [k, file] of list.entries()) {
      const i = start + k;
      const ext = extensionOf(file.name);
      if (!DOCUMENT_TYPES[ext]) { update(i, { state: "error", error: "Use PDF, JPG, PNG, WEBP or HEIC." }); continue; }
      if (file.size > DOCUMENT_MAX_BYTES) { update(i, { state: "error", error: "Too large — 25 MB max." }); continue; }
      if (!file.size) { update(i, { state: "error", error: "The file is empty." }); continue; }
      try {
        update(i, { state: "uploading" });
        const blob = await upload(documentPath(clientId, crypto.randomUUID(), ext), file, {
          access: "private",
          handleUploadUrl: "/api/documents/upload",
          contentType: DOCUMENT_TYPES[ext],
          multipart: file.size > 5 * 1024 * 1024,
          onUploadProgress: (p) => update(i, { pct: Math.round(p.percentage) }),
        });
        const res = await fetch("/api/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pathname: blob.pathname, name: file.name, category, caseId: caseId || null }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Upload failed.");
        update(i, { state: "done", pct: 100 });
      } catch (error) {
        update(i, { state: "error", error: error.message?.replace(/^Vercel Blob: /, "") || "Upload failed." });
      }
    }
    if (input.current) input.current.value = "";
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="doc-category" className="mb-1 block text-sm font-medium">What is it?</label>
          <select id="doc-category" value={category} onChange={(e) => setCategory(e.target.value)} className="pfield">
            {Object.entries(DOCUMENT_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        {cases.length > 0 && (
          <div>
            <label htmlFor="doc-case" className="mb-1 block text-sm font-medium">For which service?</label>
            <select id="doc-case" value={caseId} onChange={(e) => setCaseId(e.target.value)} className="pfield">
              <option value="">General</option>
              {cases.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
        )}
      </div>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-8 text-center hover:border-yellow-500">
        <span className="font-semibold">Choose files or take a photo</span>
        <span className="text-sm text-zinc-500">PDF, JPG, PNG, WEBP or HEIC · up to 25 MB each</span>
        <input ref={input} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,application/pdf,image/*" className="sr-only" onChange={(e) => e.target.files?.length && onFiles(e.target.files)} />
      </label>
      {items.length > 0 && (
        <ul className="space-y-2 text-sm" aria-live="polite">
          {items.map((it, i) => (
            <li key={i} className="flex items-center justify-between gap-3 rounded-lg bg-zinc-50 px-3 py-2">
              <span className="truncate">{it.name}</span>
              <span className={it.state === "error" ? "text-red-700" : it.state === "done" ? "text-green-700" : "text-zinc-600"}>
                {it.state === "error" ? it.error : it.state === "done" ? "Uploaded ✓" : it.state === "uploading" ? `${it.pct}%` : "Waiting…"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
