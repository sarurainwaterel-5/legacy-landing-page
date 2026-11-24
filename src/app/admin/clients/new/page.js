import { requireStaff } from "@/lib/auth";
import NewClientForm from "@/components/admin/NewClientForm";

export default async function NewClient() {
  await requireStaff();
  return <div className="space-y-4"><h1 className="text-2xl font-bold">New client</h1><NewClientForm /></div>;
}
