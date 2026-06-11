import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-zinc-500">Dashboard Kasbon</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
              Ringkasan utang piutang pribadi
            </h1>
          </div>
        </div>
      </section>

      <DashboardClient />
    </div>
  );
}
