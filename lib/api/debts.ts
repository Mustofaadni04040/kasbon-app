import type { DebtListQuery, DebtRecord } from "@/types";

export interface DebtListResponse {
  data: DebtRecord[];
  meta: {
    count: number;
    filters: DebtListQuery;
  };
}

interface ApiErrorBody {
  error?: {
    message?: string;
  };
}

export async function fetchDebts(
  query: DebtListQuery,
): Promise<DebtListResponse> {
  const searchParams = new URLSearchParams({
    status: query.status,
    type: query.type,
    search: query.search,
    sort: query.sort,
  });

  const response = await fetch(`/api/debts?${searchParams.toString()}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch debts.";

    try {
      const errorBody = (await response.json()) as ApiErrorBody;
      if (errorBody.error?.message) {
        errorMessage = errorBody.error.message;
      }
    } catch {
      errorMessage = "Failed to fetch debts.";
    }

    throw new Error(errorMessage);
  }

  return (await response.json()) as DebtListResponse;
}
