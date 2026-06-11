import { DebtBalanceChart } from "@/components/charts/debt-balance-chart";

export default function ChartsPage() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
              Perbandingan kasbon aktif
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
              Halaman untuk menampilkan visual perbandingan total dihutangi dan
              total saya hutang.
            </p>
          </div>
        </div>
      </section>

      <DebtBalanceChart />
    </div>
  );
}
