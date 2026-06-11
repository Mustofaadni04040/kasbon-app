import { Layers3 } from "lucide-react";
import { formatRupiah } from "@/lib/formatters/currency";
import type { DebtCounterpartGroup } from "@/types";

interface CounterpartGroupsProps {
  groups: DebtCounterpartGroup[];
}

export function CounterpartGroups({ groups }: CounterpartGroupsProps) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
          <Layers3 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-zinc-950 sm:text-lg">
            Grup orang dengan banyak catatan
          </h2>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <article
            key={group.counterpartName}
            className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-zinc-950">
                  {group.counterpartName}
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  {group.count} entry, total {formatRupiah(group.totalAmount)}
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-700">
                {group.unsettledCount} aktif
              </span>
            </div>

            <div className="mt-4 flex gap-2 text-xs text-zinc-500">
              <span className="rounded-full bg-white px-3 py-1">
                Belum lunas: {group.unsettledCount}
              </span>
              <span className="rounded-full bg-white px-3 py-1">
                Lunas: {group.settledCount}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
