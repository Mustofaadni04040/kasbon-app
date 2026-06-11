import type {
  CreateDebtPayload,
  DebtListQuery,
  DebtRecord,
  UpdateDebtPayload,
} from "@/types";

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

interface DebtMutationResponse {
  data: DebtRecord;
}

function getErrorMessage(
  errorBody: ApiErrorBody | null,
  fallback: string,
): string {
  if (errorBody?.error?.message) {
    return errorBody.error.message;
  }

  return fallback;
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
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
    let errorMessage = "Gagal mengambil daftar kasbon.";

    try {
      const errorBody = await parseJsonResponse<ApiErrorBody>(response);
      errorMessage = getErrorMessage(errorBody, errorMessage);
    } catch {
      errorMessage = "Gagal mengambil daftar kasbon.";
    }

    throw new Error(errorMessage);
  }

  return parseJsonResponse<DebtListResponse>(response);
}

export async function createDebt(
  payload: CreateDebtPayload,
): Promise<DebtRecord> {
  const response = await fetch("/api/debts", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Gagal membuat catatan kasbon.";

    try {
      const errorBody = await parseJsonResponse<ApiErrorBody>(response);
      errorMessage = getErrorMessage(errorBody, errorMessage);
    } catch {
      errorMessage = "Gagal membuat catatan kasbon.";
    }

    throw new Error(errorMessage);
  }

  const responseBody = await parseJsonResponse<DebtMutationResponse>(response);
  return responseBody.data;
}

export async function updateDebt(
  debtId: string,
  payload: UpdateDebtPayload,
): Promise<DebtRecord> {
  const response = await fetch(`/api/debts/${debtId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Gagal memperbarui catatan kasbon.";

    try {
      const errorBody = await parseJsonResponse<ApiErrorBody>(response);
      errorMessage = getErrorMessage(errorBody, errorMessage);
    } catch {
      errorMessage = "Gagal memperbarui catatan kasbon.";
    }

    throw new Error(errorMessage);
  }

  const responseBody = await parseJsonResponse<DebtMutationResponse>(response);
  return responseBody.data;
}

export async function deleteDebt(debtId: string): Promise<void> {
  const response = await fetch(`/api/debts/${debtId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    let errorMessage = "Gagal menghapus catatan kasbon.";

    try {
      const errorBody = await parseJsonResponse<ApiErrorBody>(response);
      errorMessage = getErrorMessage(errorBody, errorMessage);
    } catch {
      errorMessage = "Gagal menghapus catatan kasbon.";
    }

    throw new Error(errorMessage);
  }
}
