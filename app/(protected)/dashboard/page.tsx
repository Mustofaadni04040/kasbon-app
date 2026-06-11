import { LogoutButton } from "@/components/auth/logout-button";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">
              Dashboard Kasflow
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
              Ringkasan utang piutang pribadi
            </h1>
          </div>

          <LogoutButton />
        </div>
      </section>

      <DashboardClient userEmail={user.email} />
    </div>
  );
}
