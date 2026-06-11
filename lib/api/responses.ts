export function createSuccessResponse<T>(
  data: T,
  init?: {
    status?: number;
  },
): Response {
  return Response.json(data, {
    status: init?.status ?? 200,
  });
}

export function createErrorResponse(
  message: string,
  status: number,
  details?: Record<string, unknown>,
): Response {
  return Response.json(
    {
      error: {
        message,
        ...(details ? { details } : {}),
      },
    },
    {
      status,
    },
  );
}
