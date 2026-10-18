import { Hono } from "hono";
import { createDb } from "./db";
import { createAuthRoutes } from "./routes/auth";
import { createTaskRoutes } from "./routes/tasks";
import { errorHandler, notFoundHandler } from "./lib/errors";

// 테스트(NODE_ENV=test)에서는 파일마다 독립된 인메모리 DB를 사용합니다.
const db = createDb(process.env.NODE_ENV === "test" ? ":memory:" : undefined);

const jwtSecret = process.env.JWT_SECRET ?? (process.env.NODE_ENV === "production" ? "" : "dev-secret-change-me");
if (!jwtSecret) throw new Error("JWT_SECRET must be set in production");

const app = new Hono();

app.route("/api/auth", createAuthRoutes(db, jwtSecret));
app.route("/api/tasks", createTaskRoutes(db, jwtSecret));
app.onError(errorHandler);
app.notFound(notFoundHandler);

export default app;
