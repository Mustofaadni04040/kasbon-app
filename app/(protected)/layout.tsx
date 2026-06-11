import type { ReactNode } from "react";
import { ProtectedSidebar } from "@/components/navigation/protected-sidebar";
import { requireUser } from "@/lib/auth";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const user = await requireUser();

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-start md:gap-6">
        <ProtectedSidebar userEmail={user.email} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </main>
  );
}
