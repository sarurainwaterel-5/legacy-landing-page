import { after } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MessageThread from "@/components/MessageThread";
import MessageComposer from "@/components/MessageComposer";
import { sendClientMessage } from "../actions";

export const metadata = { title: "Messages" };

export default async function Messages() {
  const session = await requireUser("/portal/messages");
  const messages = await prisma.message.findMany({ where: { clientId: session.user.id }, orderBy: { createdAt: "asc" }, take: 200 });
  after(() => prisma.message.updateMany({ where: { clientId: session.user.id, fromStaff: true, readAt: null }, data: { readAt: new Date() } }));
  return (
    <div className="panel space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-sm text-zinc-600">Secure messages with Legacy Partners. We usually reply within one business day. For urgent matters call (214) 403-1712.</p>
      </div>
      <MessageThread messages={messages} viewerIsStaff={false} />
      <MessageComposer action={sendClientMessage} />
    </div>
  );
}
