import { DOCUMENT_CATEGORIES } from "@/lib/documents";
import { formatBytes, formatDate } from "@/lib/format";
import DeleteDocumentButton from "./DeleteDocumentButton";

export default function DocumentList({ documents, viewerId, isStaff = false }) {
  if (!documents.length) return <p className="text-zinc-600">No documents yet.</p>;
  return (
    <ul className="divide-y divide-zinc-100">
      {documents.map((d) => (
        <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <a href={`/api/documents/${d.id}`} target="_blank" rel="noopener" className="block truncate font-medium text-wine-800 hover:underline">{d.name}</a>
            <p className="text-xs text-zinc-500">
              {DOCUMENT_CATEGORIES[d.category] || "Other"} · {formatBytes(d.size)} · {formatDate(d.createdAt)}{d.case ? ` · ${d.case.title}` : ""}
              {d.uploadedBy !== d.userId ? " · added by Legacy Partners" : ""}
            </p>
          </div>
          {(isStaff || d.uploadedBy === viewerId) && <DeleteDocumentButton id={d.id} name={d.name} />}
        </li>
      ))}
    </ul>
  );
}
