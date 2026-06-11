"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { z } from "zod";
import type { CreateDebtPayload, DebtRecord, UpdateDebtPayload } from "@/types";
import { createDebtSchema } from "@/validations";

const formSchema = createDebtSchema.extend({
  amount: z.coerce
    .number({
      error: "Jumlah harus berupa angka.",
    })
    .int("Jumlah harus bilangan bulat.")
    .positive("Jumlah harus lebih besar dari nol."),
});

type DebtFormValues = {
  type: CreateDebtPayload["type"];
  counterpartName: string;
  amount: string;
  note: string;
  dueDate: string;
};

interface DebtFormModalProps {
  mode: "create" | "edit";
  initialDebt: DebtRecord | null;
  isOpen: boolean;
  isSubmitting: boolean;
  serverError: string | null;
  onClose: () => void;
  onSubmit: (payload: CreateDebtPayload | UpdateDebtPayload) => Promise<void>;
}

interface FieldErrors {
  counterpartName?: string;
  amount?: string;
  note?: string;
  dueDate?: string;
  type?: string;
}

function buildInitialValues(debt: DebtRecord | null): DebtFormValues {
  return {
    type: debt?.type ?? "owed_to_me",
    counterpartName: debt?.counterpartName ?? "",
    amount: debt ? String(debt.amount) : "",
    note: debt?.note ?? "",
    dueDate: debt?.dueDate ?? "",
  };
}

export function DebtFormModal({
  mode,
  initialDebt,
  isOpen,
  isSubmitting,
  serverError,
  onClose,
  onSubmit,
}: DebtFormModalProps) {
  const [values, setValues] = useState<DebtFormValues>(
    buildInitialValues(initialDebt),
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const parsedValues = formSchema.safeParse({
      type: values.type,
      counterpartName: values.counterpartName,
      amount: values.amount,
      note: values.note,
      dueDate: values.dueDate,
    });

    if (!parsedValues.success) {
      const flattenedErrors = parsedValues.error.flatten().fieldErrors;

      setFieldErrors({
        type: flattenedErrors.type?.[0],
        counterpartName: flattenedErrors.counterpartName?.[0],
        amount: flattenedErrors.amount?.[0],
        note: flattenedErrors.note?.[0],
        dueDate: flattenedErrors.dueDate?.[0],
      });
      return;
    }

    setFieldErrors({});

    const payload: CreateDebtPayload = {
      type: parsedValues.data.type,
      counterpartName: parsedValues.data.counterpartName,
      amount: parsedValues.data.amount,
      note: parsedValues.data.note,
      dueDate: parsedValues.data.dueDate,
    };

    await onSubmit(payload);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-zinc-950">
              {mode === "create"
                ? "Tambah catatan kasbon"
                : "Edit catatan kasbon"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {mode === "create"
                ? "Isi data kasbon baru dengan lengkap."
                : "Perbarui data kasbon yang sudah ada."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl p-2 text-zinc-500 transition cursor-pointer hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-700">
              Tipe
            </span>
            <select
              value={values.type}
              onChange={(event) =>
                setValues((currentValue) => ({
                  ...currentValue,
                  type: event.target.value as CreateDebtPayload["type"],
                }))
              }
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
            >
              <option value="owed_to_me">Saya dihutangi</option>
              <option value="i_owe">Saya hutang</option>
            </select>
            {fieldErrors.type ? (
              <p className="mt-2 text-sm text-red-600">{fieldErrors.type}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-700">
              Nama orang
            </span>
            <input
              value={values.counterpartName}
              onChange={(event) =>
                setValues((currentValue) => ({
                  ...currentValue,
                  counterpartName: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
              placeholder="Contoh: Budi"
            />
            {fieldErrors.counterpartName ? (
              <p className="mt-2 text-sm text-red-600">
                {fieldErrors.counterpartName}
              </p>
            ) : null}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">
                Jumlah
              </span>
              <input
                inputMode="numeric"
                value={values.amount}
                onChange={(event) =>
                  setValues((currentValue) => ({
                    ...currentValue,
                    amount: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                placeholder="Contoh: 125000"
              />
              {fieldErrors.amount ? (
                <p className="mt-2 text-sm text-red-600">
                  {fieldErrors.amount}
                </p>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">
                Tanggal
              </span>
              <input
                type="date"
                value={values.dueDate}
                onChange={(event) =>
                  setValues((currentValue) => ({
                    ...currentValue,
                    dueDate: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
              />
              {fieldErrors.dueDate ? (
                <p className="mt-2 text-sm text-red-600">
                  {fieldErrors.dueDate}
                </p>
              ) : null}
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-700">
              Catatan
            </span>
            <textarea
              value={values.note}
              onChange={(event) =>
                setValues((currentValue) => ({
                  ...currentValue,
                  note: event.target.value,
                }))
              }
              rows={4}
              maxLength={200}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
              placeholder="Opsional, maksimal 200 karakter"
            />
            <div className="mt-2 flex items-center justify-between">
              {fieldErrors.note ? (
                <p className="text-sm text-red-600">{fieldErrors.note}</p>
              ) : (
                <span className="text-xs text-zinc-400">
                  {values.note.length}/200 karakter
                </span>
              )}
            </div>
          </label>

          {serverError ? (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-zinc-200 px-5 py-3 text-sm cursor-pointer font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold cursor-pointer text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? "Menyimpan..."
                : mode === "create"
                  ? "Simpan catatan"
                  : "Update catatan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
