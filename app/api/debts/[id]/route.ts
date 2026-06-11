import { createClient } from "@/lib/supabase/server";
import { getApiAuth } from "@/lib/api/auth";
import { parseJsonBody } from "@/lib/api/request";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api/responses";
import { mapDebtRow } from "@/lib/debts";
import type { Database } from "@/types";
import { debtIdParamSchema, updateDebtSchema } from "@/validations";

interface DebtRouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: Request,
  context: DebtRouteContext,
): Promise<Response> {
  const { user, authError, status } = await getApiAuth();

  if (!user) {
    return createErrorResponse(authError ?? "Authentication required.", status);
  }

  const routeParams = await context.params;
  const parsedParams = debtIdParamSchema.safeParse(routeParams);

  if (!parsedParams.success) {
    return createErrorResponse("Invalid debt id.", 400, {
      fieldErrors: parsedParams.error.flatten().fieldErrors,
      formErrors: parsedParams.error.flatten().formErrors,
    });
  }

  const { body, error: bodyError } = await parseJsonBody(request);

  if (bodyError) {
    return bodyError;
  }

  const parsedBody = updateDebtSchema.safeParse(body);

  if (!parsedBody.success) {
    return createErrorResponse("Invalid request body.", 422, {
      fieldErrors: parsedBody.error.flatten().fieldErrors,
      formErrors: parsedBody.error.flatten().formErrors,
    });
  }

  const supabase = await createClient();
  const { data: existingDebt, error: existingDebtError } = await supabase
    .from("debts")
    .select("*")
    .eq("id", parsedParams.data.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingDebtError) {
    return createErrorResponse("Failed to fetch debt.", 500);
  }

  if (!existingDebt) {
    return createErrorResponse("Debt not found.", 404);
  }

  const updatePayload: Database["public"]["Tables"]["debts"]["Update"] = {};

  if (parsedBody.data.type !== undefined) {
    updatePayload.type = parsedBody.data.type;
  }

  if (parsedBody.data.counterpartName !== undefined) {
    updatePayload.counterpart_name = parsedBody.data.counterpartName;
  }

  if (parsedBody.data.amount !== undefined) {
    updatePayload.amount = parsedBody.data.amount;
  }

  if (parsedBody.data.note !== undefined) {
    updatePayload.note = parsedBody.data.note;
  }

  if (parsedBody.data.dueDate !== undefined) {
    updatePayload.due_date = parsedBody.data.dueDate;
  }

  if (parsedBody.data.settled !== undefined) {
    updatePayload.settled_at = parsedBody.data.settled
      ? existingDebt.settled_at ?? new Date().toISOString()
      : null;
  }

  const { data, error } = await supabase
    .from("debts")
    .update(updatePayload)
    .eq("id", parsedParams.data.id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    return createErrorResponse("Failed to update debt.", 500);
  }

  return createSuccessResponse({
    data: mapDebtRow(data),
  });
}

export async function DELETE(
  _request: Request,
  context: DebtRouteContext,
): Promise<Response> {
  const { user, authError, status } = await getApiAuth();

  if (!user) {
    return createErrorResponse(authError ?? "Authentication required.", status);
  }

  const routeParams = await context.params;
  const parsedParams = debtIdParamSchema.safeParse(routeParams);

  if (!parsedParams.success) {
    return createErrorResponse("Invalid debt id.", 400, {
      fieldErrors: parsedParams.error.flatten().fieldErrors,
      formErrors: parsedParams.error.flatten().formErrors,
    });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("debts")
    .delete()
    .eq("id", parsedParams.data.id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return createErrorResponse("Failed to delete debt.", 500);
  }

  if (!data) {
    return createErrorResponse("Debt not found.", 404);
  }

  return createSuccessResponse({
    message: "Debt deleted successfully.",
  });
}
