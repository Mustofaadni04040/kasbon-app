import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/(auth)/actions";

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-2xl border cursor-pointer border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </form>
  );
}
