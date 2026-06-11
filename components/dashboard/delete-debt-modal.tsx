"use client";

import { AlertTriangle, X } from "lucide-react";
import { formatRupiah } from "@/lib/formatters/currency";
import type { DebtRecord } from "@/types";

interface DeleteDebtModalProps {
  debt: DebtRecord | null;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteDebtModal({
  debt,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteDebtModalProps) {
  if (!isOpen || !debt) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-red-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-950">
                Hapus catatan kasbon
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Tindakan ini tidak bisa dibatalkan. Pastikan catatan yang mau
                dihapus sudah benar.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-2xl p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm font-semibold text-zinc-950">
            {debt.counterpartName}
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            {debt.type === "owed_to_me" ? "Saya dihutangi" : "Saya hutang"} ·{" "}
            {formatRupiah(debt.amount)}
          </p>
          {debt.note ? (
            <p className="mt-3 text-sm leading-6 text-zinc-600">{debt.note}</p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              void onConfirm();
            }}
            disabled={isDeleting}
            className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting ? "Menghapus..." : "Ya, hapus catatan"}
          </button>
        </div>
      </div>
    </div>
  );
}
