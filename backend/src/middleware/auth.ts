import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { AppError } from "../lib/errors";

export type AuthEnv = { Variables: { userId: string } };

// Authorization: Bearer <token> 을 검증하고 c.var.userId 를 설정합니다.
export const requireAuth = (jwtSecret: string) =>
  createMiddleware<AuthEnv>(async (c, next) => {
    const [scheme, token] = (c.req.header("Authorization") ?? "").split(" ");
    if (scheme !== "Bearer" || !token) throw new AppError(401, "Missing or malformed Authorization header");

    try {
      const payload = await verify(token, jwtSecret, "HS256");
      if (typeof payload.sub !== "string") throw new Error("no sub");
      c.set("userId", payload.sub);
    } catch {
      throw new AppError(401, "Invalid or expired token");
    }
    await next();
  });
