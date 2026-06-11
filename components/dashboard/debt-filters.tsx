"use client";

import type {
  DebtListQuery,
  DebtSortOption,
  DebtStatusFilter,
  DebtTypeFilter,
} from "@/types";

interface DebtFiltersProps {
  filters: DebtListQuery;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: DebtStatusFilter) => void;
  onTypeChange: (value: DebtTypeFilter) => void;
  onSortChange: (value: DebtSortOption) => void;
}

export function DebtFilters({
  filters,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onSortChange,
}: DebtFiltersProps) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Cari nama orang
          </span>
          <input
            value={filters.search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Cari berdasarkan nama..."
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Status
          </span>
          <select
            value={filters.status}
            onChange={(event) =>
              onStatusChange(event.target.value as DebtStatusFilter)
            }
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
          >
            <option value="all">Semua</option>
            <option value="unsettled">Belum lunas</option>
            <option value="settled">Lunas</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Tipe
          </span>
          <select
            value={filters.type}
            onChange={(event) =>
              onTypeChange(event.target.value as DebtTypeFilter)
            }
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
          >
            <option value="all">Semua</option>
            <option value="owed_to_me">Saya dihutangi</option>
            <option value="i_owe">Saya hutang</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Urutkan
          </span>
          <select
            value={filters.sort}
            onChange={(event) =>
              onSortChange(event.target.value as DebtSortOption)
            }
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="amount_high">Nominal tertinggi</option>
            <option value="amount_low">Nominal terendah</option>
          </select>
        </label>
      </div>
    </section>
  );
}
