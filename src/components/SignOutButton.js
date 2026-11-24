"use client";
import { signOut } from "next-auth/react";
export default function SignOutButton() {
  return <button onClick={() => signOut({ callbackUrl: "/login" })} className="rounded-lg border border-white/20 px-3 py-1.5 hover:bg-white/10">Sign out</button>;
}
