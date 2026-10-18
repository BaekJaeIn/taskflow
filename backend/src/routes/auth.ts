import { Hono } from "hono";
import { sign } from "hono/jwt";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { users, type Db } from "../db";
import { AppError, parseBody } from "../lib/errors";

const TOKEN_TTL_SECONDS = 60 * 60 * 24;

const emailSchema = z.string().trim().toLowerCase().pipe(z.email());

const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export function createAuthRoutes(db: Db, jwtSecret: string) {
  const issueToken = (userId: string) =>
    sign({ sub: userId, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS }, jwtSecret, "HS256");

  const app = new Hono();

  app.post("/register", async (c) => {
    const { email, password } = await parseBody(c, registerSchema);

    const existing = db.select({ id: users.id }).from(users).where(eq(users.email, email)).get();
    if (existing) throw new AppError(409, "Email already registered");

    const hash = await bcrypt.hash(password, 10);
    const user = db.insert(users).values({ email, password: hash }).returning().get();

    return c.json({ token: await issueToken(user.id), user: { id: user.id, email: user.email } }, 201);
  });

  app.post("/login", async (c) => {
    const { email, password } = await parseBody(c, loginSchema);

    const user = db.select().from(users).where(eq(users.email, email)).get();
    // 이메일 존재 여부가 노출되지 않도록 동일한 메시지를 사용합니다.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError(401, "Invalid email or password");
    }

    return c.json({ token: await issueToken(user.id), user: { id: user.id, email: user.email } });
  });

  return app;
}
