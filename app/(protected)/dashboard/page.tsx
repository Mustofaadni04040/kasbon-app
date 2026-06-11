import { ShieldCheck, Wallet } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
              <ShieldCheck className="h-4 w-4" />
              <span>Auth scaffold aktif</span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Selamat datang di dashboard Kasbon
            </h1>
            <p className="mt-3 text-sm leading-7 text-zinc-600 sm:text-base">
              Session Supabase sudah terbaca. Langkah berikutnya tinggal
              menyambungkan dashboard ini ke data utang piutang.
            </p>
          </div>
          <LogoutButton />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
            <Wallet className="h-4 w-4" />
            <span>User aktif</span>
          </div>
          <p className="mt-3 break-all text-lg font-semibold text-zinc-900">
            {user.email}
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            ID user ini nanti akan menjadi owner semua data di tabel `debts`.
          </p>
        </div>

        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold">Status fondasi</h2>
          <ul className="mt-4 space-y-3 text-sm text-zinc-600">
            <li>- Login dan signup sudah tersambung ke Supabase Auth</li>
            <li>- Session refresh sudah disiapkan via `proxy.ts`</li>
            <li>- Migration SQL debts + RLS siap dijalankan</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
