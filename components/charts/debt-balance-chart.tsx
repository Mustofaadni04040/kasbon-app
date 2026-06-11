"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { EChartsOption } from "echarts";
import { AlertCircle, BarChart3 } from "lucide-react";
import { fetchDebts } from "@/lib/api/debts";
import { calculateDebtSummary } from "@/lib/debts";
import { formatRupiah } from "@/lib/formatters/currency";
import type { DebtListQuery, DebtRecord } from "@/types";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
});

const chartQuery: DebtListQuery = {
  status: "unsettled",
  type: "all",
  search: "",
  sort: "newest",
};

export function DebtBalanceChart() {
  const [items, setItems] = useState<DebtRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadChartData(): Promise<void> {
      try {
        const response = await fetchDebts(chartQuery);

        if (isCancelled) {
          return;
        }

        setItems(response.data);
        setErrorMessage(null);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load chart data.",
        );
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadChartData();

    return () => {
      isCancelled = true;
    };
  }, []);

  const summary = useMemo(() => calculateDebtSummary(items), [items]);

  const chartOption = useMemo<EChartsOption>(
    () => ({
      animationDuration: 500,
      grid: {
        top: 16,
        right: 16,
        bottom: 32,
        left: 16,
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params) => {
          const normalizedParams = Array.isArray(params) ? params : [params];
          return normalizedParams
            .map((param) => {
              const value =
                typeof param.value === "number" ? param.value : Number(param.value);
              return `${param.marker}${param.name}: ${formatRupiah(value)}`;
            })
            .join("<br/>");
        },
      },
      xAxis: {
        type: "category",
        data: ["Saya dihutangi", "Saya hutang"],
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (value: number) => formatRupiah(value),
        },
        splitLine: {
          lineStyle: {
            color: "#e4e4e7",
          },
        },
      },
      series: [
        {
          type: "bar",
          data: [
            {
              value: summary.totalOwedToMe,
              itemStyle: {
                color: "#10b981",
                borderRadius: [12, 12, 0, 0],
              },
            },
            {
              value: summary.totalIOwe,
              itemStyle: {
                color: "#f59e0b",
                borderRadius: [12, 12, 0, 0],
              },
            },
          ],
          barMaxWidth: 120,
          label: {
            show: true,
            position: "top",
            formatter: ({ value }) =>
              formatRupiah(typeof value === "number" ? value : Number(value)),
          },
        },
      ],
    }),
    [summary.totalIOwe, summary.totalOwedToMe],
  );

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="space-y-4">
          <div className="h-5 w-48 animate-pulse rounded-full bg-zinc-200" />
          <div className="h-80 animate-pulse rounded-3xl bg-zinc-100" />
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <h2 className="text-sm font-semibold">Gagal memuat chart</h2>
            <p className="mt-1 text-sm leading-6">{errorMessage}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-zinc-950 sm:text-lg">
            Bar chart total kasbon aktif
          </h2>
          <p className="text-sm text-zinc-600">
            Membandingkan total belum lunas yang harus dibayar ke kamu vs yang
            harus kamu bayar.
          </p>
        </div>
      </div>

      <div className="mt-6 h-80 w-full overflow-hidden rounded-3xl bg-zinc-50 p-3 sm:h-96">
        <ReactECharts option={chartOption} style={{ height: "100%", width: "100%" }} />
      </div>
    </section>
  );
}
