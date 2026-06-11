import { createErrorResponse } from "@/lib/api/responses";

export async function parseJsonBody(
  request: Request,
): Promise<{ body: unknown; error: Response | null }> {
  try {
    const body = (await request.json()) as unknown;

    return {
      body,
      error: null,
    };
  } catch {
    return {
      body: null,
      error: createErrorResponse("Invalid JSON request body.", 400),
    };
  }
}
