import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { ZodType } from "zod";

export type ErrorBody = {
  error: string;
  details?: { path: string; message: string }[];
};

export class AppError extends Error {
  constructor(
    public status: ContentfulStatusCode,
    message: string,
    public details?: ErrorBody["details"],
  ) {
    super(message);
  }
}

// 모든 에러 응답은 { error, details? } 형식으로 통일합니다.
export function errorHandler(err: Error, c: Context) {
  if (err instanceof AppError) {
    const body: ErrorBody = { error: err.message, details: err.details };
    return c.json(body, err.status);
  }
  if (err instanceof HTTPException) {
    return c.json({ error: err.message } satisfies ErrorBody, err.status as ContentfulStatusCode);
  }
  console.error(err);
  return c.json({ error: "Internal Server Error" } satisfies ErrorBody, 500);
}

export function notFoundHandler(c: Context) {
  return c.json({ error: "Not Found" } satisfies ErrorBody, 404);
}

// JSON 본문을 파싱하고 Zod 스키마로 검증합니다. 실패 시 400 AppError.
export async function parseBody<T>(c: Context, schema: ZodType<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await c.req.json();
  } catch {
    throw new AppError(400, "Invalid JSON body");
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new AppError(
      400,
      "Validation failed",
      result.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    );
  }
  return result.data;
}
