"use client";

import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/(auth)/actions";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className={`inline-flex items-center gap-2 rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 ${className ?? ""}`}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </form>
  );
}
