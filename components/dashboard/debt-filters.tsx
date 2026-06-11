"use client";

import { useRef, useState } from "react";
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
  const [searchDraft, setSearchDraft] = useState<string>(filters.search);
  const debounceTimeoutRef = useRef<number | null>(null);

  function handleSearchChange(value: string): void {
    setSearchDraft(value);

    if (debounceTimeoutRef.current !== null) {
      window.clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
      onSearchChange(value);
    }, 400);
  }

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="block sm:col-span-2 xl:col-span-1">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Cari nama orang
          </span>
          <input
            value={searchDraft}
            onChange={(event) => handleSearchChange(event.target.value)}
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
