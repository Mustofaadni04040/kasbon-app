import { createClient } from "@/lib/supabase/server";
import { getApiAuth } from "@/lib/api/auth";
import { parseJsonBody } from "@/lib/api/request";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api/responses";
import { applyDebtListSort, mapDebtRow } from "@/lib/debts";
import type { Database } from "@/types";
import { createDebtSchema, debtListQuerySchema } from "@/validations";

export async function GET(request: Request): Promise<Response> {
  const { user, authError, status } = await getApiAuth();

  if (!user) {
    return createErrorResponse(authError ?? "Authentication required.", status);
  }

  const searchParams = new URL(request.url).searchParams;
  const parsedQuery = debtListQuerySchema.safeParse({
    status: searchParams.get("status") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
  });

  if (!parsedQuery.success) {
    return createErrorResponse("Invalid query parameters.", 400, {
      fieldErrors: parsedQuery.error.flatten().fieldErrors,
      formErrors: parsedQuery.error.flatten().formErrors,
    });
  }

  const supabase = await createClient();
  let query = supabase
    .from("debts")
    .select("*")
    .eq("user_id", user.id);

  if (parsedQuery.data.status === "unsettled") {
    query = query.is("settled_at", null);
  }

  if (parsedQuery.data.status === "settled") {
    query = query.not("settled_at", "is", null);
  }

  if (parsedQuery.data.type !== "all") {
    query = query.eq("type", parsedQuery.data.type);
  }

  if (parsedQuery.data.search !== "") {
    query = query.ilike("counterpart_name", `%${parsedQuery.data.search}%`);
  }

  const sortedQuery = applyDebtListSort(query, parsedQuery.data.sort);
  const { data, error } = await sortedQuery;

  if (error) {
    return createErrorResponse("Failed to fetch debts.", 500);
  }

  return createSuccessResponse({
    data: (data ?? []).map(mapDebtRow),
    meta: {
      count: data?.length ?? 0,
      filters: parsedQuery.data,
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  const { user, authError, status } = await getApiAuth();

  if (!user) {
    return createErrorResponse(authError ?? "Authentication required.", status);
  }

  const { body, error: bodyError } = await parseJsonBody(request);

  if (bodyError) {
    return bodyError;
  }

  const parsedBody = createDebtSchema.safeParse(body);

  if (!parsedBody.success) {
    return createErrorResponse("Invalid request body.", 422, {
      fieldErrors: parsedBody.error.flatten().fieldErrors,
      formErrors: parsedBody.error.flatten().formErrors,
    });
  }

  const insertPayload: Database["public"]["Tables"]["debts"]["Insert"] = {
    user_id: user.id,
    type: parsedBody.data.type,
    counterpart_name: parsedBody.data.counterpartName,
    amount: parsedBody.data.amount,
    note: parsedBody.data.note,
    due_date: parsedBody.data.dueDate,
  };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("debts")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    return createErrorResponse("Failed to create debt.", 500);
  }

  return createSuccessResponse(
    {
      data: mapDebtRow(data),
    },
    { status: 201 },
  );
}
