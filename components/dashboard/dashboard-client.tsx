"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeftRight,
  Plus,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { CounterpartGroups } from "@/components/dashboard/counterpart-groups";
import { DebtFormModal } from "@/components/dashboard/debt-form-modal";
import { DebtFilters } from "@/components/dashboard/debt-filters";
import { DebtList } from "@/components/dashboard/debt-list";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { createDebt, deleteDebt, updateDebt } from "@/lib/api/debts";
import { fetchDebts } from "@/lib/api/debts";
import { calculateDebtSummary, groupDebtsByCounterpart } from "@/lib/debts";
import { formatRupiah } from "@/lib/formatters/currency";
import type {
  CreateDebtPayload,
  DebtListQuery,
  DebtRecord,
  UpdateDebtPayload,
} from "@/types";

const defaultFilters: DebtListQuery = {
  status: "all",
  type: "all",
  search: "",
  sort: "newest",
};

const summaryQuery: DebtListQuery = {
  status: "unsettled",
  type: "all",
  search: "",
  sort: "newest",
};

export function DashboardClient() {
  const [filters, setFilters] = useState<DebtListQuery>(defaultFilters);
  const [items, setItems] = useState<DebtRecord[]>([]);
  const [summaryItems, setSummaryItems] = useState<DebtRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState<number>(0);
  const [activeDebtId, setActiveDebtId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedDebt, setSelectedDebt] = useState<DebtRecord | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadDashboardData(): Promise<void> {
      try {
        const [listResponse, summaryResponse] = await Promise.all([
          fetchDebts(filters),
          fetchDebts(summaryQuery),
        ]);

        if (isCancelled) {
          return;
        }

        setItems(listResponse.data);
        setSummaryItems(summaryResponse.data);
        setErrorMessage(null);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data.",
        );
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboardData();

    return () => {
      isCancelled = true;
    };
  }, [filters, refreshIndex]);

  useEffect(() => {
    if (!feedbackMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [feedbackMessage]);

  const summary = useMemo(
    () => calculateDebtSummary(summaryItems),
    [summaryItems],
  );
  const groupedCounterparts = useMemo(
    () => groupDebtsByCounterpart(items),
    [items],
  );

  function refreshDashboard(): void {
    setErrorMessage(null);
    setIsLoading(true);
    setRefreshIndex((currentValue) => currentValue + 1);
  }

  function openCreateForm(): void {
    setFormMode("create");
    setSelectedDebt(null);
    setFormError(null);
    setFeedbackMessage(null);
    setIsFormOpen(true);
  }

  function openEditForm(item: DebtRecord): void {
    setFormMode("edit");
    setSelectedDebt(item);
    setFormError(null);
    setFeedbackMessage(null);
    setIsFormOpen(true);
  }

  function closeForm(): void {
    if (isSubmittingForm) {
      return;
    }

    setIsFormOpen(false);
    setSelectedDebt(null);
    setFormError(null);
  }

  async function handleFormSubmit(
    payload: CreateDebtPayload | UpdateDebtPayload,
  ): Promise<void> {
    setIsSubmittingForm(true);
    setFormError(null);
    setErrorMessage(null);

    try {
      if (formMode === "create") {
        await createDebt(payload as CreateDebtPayload);
        setFeedbackMessage("Catatan kasbon berhasil ditambahkan.");
      } else if (selectedDebt) {
        await updateDebt(selectedDebt.id, payload);
        setFeedbackMessage("Catatan kasbon berhasil diperbarui.");
      }

      setIsFormOpen(false);
      setSelectedDebt(null);
      refreshDashboard();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan catatan kasbon.",
      );
    } finally {
      setIsSubmittingForm(false);
    }
  }

  async function handleSettle(item: DebtRecord): Promise<void> {
    setActiveDebtId(item.id);
    setErrorMessage(null);
    setFeedbackMessage(null);

    try {
      await updateDebt(item.id, {
        settled: true,
      });
      setFeedbackMessage("Catatan berhasil ditandai lunas.");
      refreshDashboard();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal menandai catatan lunas.",
      );
    } finally {
      setActiveDebtId(null);
    }
  }

  async function handleDelete(item: DebtRecord): Promise<void> {
    const isConfirmed = window.confirm(
      `Hapus catatan untuk ${item.counterpartName}?`,
    );

    if (!isConfirmed) {
      return;
    }

    setActiveDebtId(item.id);
    setErrorMessage(null);
    setFeedbackMessage(null);

    try {
      await deleteDebt(item.id);
      setFeedbackMessage("Catatan kasbon berhasil dihapus.");
      refreshDashboard();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal menghapus catatan kasbon.",
      );
    } finally {
      setActiveDebtId(null);
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
            >
              <Plus className="h-4 w-4" />
              Catat baru
            </button>

            <button
              type="button"
              onClick={refreshDashboard}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Total dihutangi"
          value={formatRupiah(summary.totalOwedToMe)}
          description="Akumulasi kasbon aktif yang harus dibayar ke kamu."
          accentClassName="bg-emerald-50 text-emerald-700"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <SummaryCard
          title="Total saya hutang"
          value={formatRupiah(summary.totalIOwe)}
          description="Akumulasi kasbon aktif yang masih harus kamu bayar."
          accentClassName="bg-amber-50 text-amber-700"
          icon={<TrendingDown className="h-5 w-5" />}
        />
        <SummaryCard
          title="Net"
          value={formatRupiah(summary.net)}
          description="Selisih total dihutangi dikurangi total saya hutang."
          accentClassName={
            summary.net >= 0
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }
          icon={<ArrowLeftRight className="h-5 w-5" />}
        />
      </section>

      <DebtFilters
        filters={filters}
        onSearchChange={(value) => {
          setIsLoading(true);
          setFeedbackMessage(null);
          setFilters((currentValue) => ({
            ...currentValue,
            search: value,
          }));
        }}
        onStatusChange={(value) => {
          setIsLoading(true);
          setFeedbackMessage(null);
          setFilters((currentValue) => ({
            ...currentValue,
            status: value,
          }));
        }}
        onTypeChange={(value) => {
          setIsLoading(true);
          setFeedbackMessage(null);
          setFilters((currentValue) => ({
            ...currentValue,
            type: value,
          }));
        }}
        onSortChange={(value) => {
          setIsLoading(true);
          setFeedbackMessage(null);
          setFilters((currentValue) => ({
            ...currentValue,
            sort: value,
          }));
        }}
      />

      <CounterpartGroups groups={groupedCounterparts} />

      {errorMessage ? (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <h2 className="text-sm font-semibold">Gagal memuat dashboard</h2>
              <p className="mt-1 text-sm leading-6">{errorMessage}</p>
            </div>
          </div>
        </section>
      ) : null}

      {feedbackMessage ? (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-700 shadow-sm">
          <p className="text-sm font-medium">{feedbackMessage}</p>
        </section>
      ) : null}

      {isLoading ? (
        <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="space-y-4">
            <div className="h-5 w-40 animate-pulse rounded-full bg-zinc-200" />
            <div className="h-20 animate-pulse rounded-3xl bg-zinc-100" />
            <div className="h-20 animate-pulse rounded-3xl bg-zinc-100" />
            <div className="h-20 animate-pulse rounded-3xl bg-zinc-100" />
          </div>
        </section>
      ) : (
        <DebtList
          items={items}
          activeDebtId={activeDebtId}
          onEdit={openEditForm}
          onDelete={(item) => {
            void handleDelete(item);
          }}
          onSettle={(item) => {
            void handleSettle(item);
          }}
        />
      )}

      {isFormOpen ? (
        <DebtFormModal
          key={selectedDebt?.id ?? "create"}
          mode={formMode}
          initialDebt={selectedDebt}
          isOpen={isFormOpen}
          isSubmitting={isSubmittingForm}
          serverError={formError}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      ) : null}
    </div>
  );
}
