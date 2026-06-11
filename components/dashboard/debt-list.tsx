import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Pencil,
  Trash2,
  WalletCards,
} from "lucide-react";
import { formatAbsoluteDate } from "@/lib/formatters/date";
import { formatRelativeDate } from "@/lib/formatters/date";
import { formatRupiah } from "@/lib/formatters/currency";
import type { DebtRecord } from "@/types";

interface DebtListProps {
  items: DebtRecord[];
  activeDebtId: string | null;
  onEdit: (item: DebtRecord) => void;
  onDelete: (item: DebtRecord) => void;
  onSettle: (item: DebtRecord) => void;
}

function getTypeLabel(type: DebtRecord["type"]): string {
  return type === "owed_to_me" ? "Saya dihutangi" : "Saya hutang";
}

function getTypeBadgeClassName(type: DebtRecord["type"]): string {
  return type === "owed_to_me"
    ? "bg-emerald-50 text-emerald-700"
    : "bg-amber-50 text-amber-700";
}

export function DebtList({
  items,
  activeDebtId,
  onDelete,
  onEdit,
  onSettle,
}: DebtListProps) {
  if (items.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
          <WalletCards className="h-5 w-5 text-zinc-500" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-zinc-900">
          Belum ada data yang cocok
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Coba ubah filter atau nanti tambahkan catatan kasbon baru.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {items.map((item) => {
        const isSettled = item.settledAt !== null;
        const isBusy = activeDebtId === item.id;

        return (
          <article
            key={item.id}
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-lg font-semibold text-zinc-950">
                    {item.counterpartName}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getTypeBadgeClassName(
                      item.type,
                    )}`}
                  >
                    {getTypeLabel(item.type)}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isSettled
                        ? "bg-sky-50 text-sky-700"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {isSettled ? "Lunas" : "Belum lunas"}
                  </span>
                </div>

                <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
                  {formatRupiah(item.amount)}
                </p>

                {item.note ? (
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    {item.note}
                  </p>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    Dicatat {formatRelativeDate(item.createdAt)}
                  </span>

                  {item.dueDate ? (
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Jatuh tempo {formatAbsoluteDate(item.dueDate)}
                    </span>
                  ) : null}

                  {item.settledAt ? (
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Dilunasi {formatRelativeDate(item.settledAt)}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                {!isSettled ? (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => onSettle(item)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 text-emerald-700 px-4 py-2 text-sm font-medium transition cursor-pointer hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Tandai lunas
                  </button>
                ) : null}

                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => onEdit(item)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-medium cursor-pointer text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>

                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => onDelete(item)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2 text-sm font-medium cursor-pointer text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
