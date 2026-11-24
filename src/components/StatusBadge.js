import { STATUS_LABELS } from "@/lib/format";

const COLORS = {
  completed: "bg-green-100 text-green-800", removed: "bg-green-100 text-green-800", signed: "bg-green-100 text-green-800", updated: "bg-emerald-100 text-emerald-800",
  in_progress: "bg-blue-100 text-blue-800", disputed: "bg-blue-100 text-blue-800",
  waiting_on_client: "bg-amber-100 text-amber-900", sent: "bg-amber-100 text-amber-900",
  cancelled: "bg-zinc-200 text-zinc-700", verified: "bg-zinc-200 text-zinc-700",
};

export default function StatusBadge({ status }) {
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${COLORS[status] || "bg-zinc-100 text-zinc-700"}`}>{STATUS_LABELS[status] || status}</span>;
}
