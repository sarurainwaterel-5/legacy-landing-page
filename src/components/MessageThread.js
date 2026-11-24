import { formatDateTime } from "@/lib/format";

export default function MessageThread({ messages, viewerIsStaff }) {
  if (!messages.length) return <p className="text-sm text-zinc-600">No messages yet.</p>;
  return (
    <ol className="space-y-3">
      {messages.map((m) => {
        const mine = m.fromStaff === viewerIsStaff;
        return (
          <li key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${mine ? "bg-wine-800 text-white" : "bg-zinc-100 text-zinc-900"}`}>
              <p className="whitespace-pre-wrap break-words text-sm">{m.body}</p>
              <p className={`mt-1 text-[11px] ${mine ? "text-zinc-300" : "text-zinc-500"}`}>{m.fromStaff ? "Legacy Partners" : "Client"} · {formatDateTime(m.createdAt)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
