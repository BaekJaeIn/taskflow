import { Hono } from "hono";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { tasks, TASK_STATUSES, type Db } from "../db";
import { AppError, parseBody } from "../lib/errors";
import { requireAuth, type AuthEnv } from "../middleware/auth";

const createSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
});

const updateSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    description: z.string().max(2000).nullable(),
    status: z.enum(TASK_STATUSES),
  })
  .partial()
  .refine((v) => Object.keys(v).length > 0, "At least one field is required");

export function createTaskRoutes(db: Db, jwtSecret: string) {
  const app = new Hono<AuthEnv>();
  app.use("*", requireAuth(jwtSecret));

  // 본인 소유 태스크만 조회합니다. 타인의 태스크는 존재 여부를 숨기기 위해 404 처리합니다.
  const findOwned = (id: string, userId: string) =>
    db.select().from(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId))).get();

  app.get("/", (c) => {
    const rows = db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, c.var.userId))
      .orderBy(desc(tasks.createdAt))
      .all();
    return c.json(rows);
  });

  app.post("/", async (c) => {
    const body = await parseBody(c, createSchema);
    const task = db.insert(tasks).values({ ...body, userId: c.var.userId }).returning().get();
    return c.json(task, 201);
  });

  app.patch("/:id", async (c) => {
    const id = c.req.param("id");
    const body = await parseBody(c, updateSchema);
    if (!findOwned(id, c.var.userId)) throw new AppError(404, "Task not found");

    const updated = db
      .update(tasks)
      .set(body)
      .where(and(eq(tasks.id, id), eq(tasks.userId, c.var.userId)))
      .returning()
      .get();
    return c.json(updated);
  });

  app.delete("/:id", (c) => {
    const id = c.req.param("id");
    const deleted = db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, c.var.userId)))
      .returning({ id: tasks.id })
      .get();
    if (!deleted) throw new AppError(404, "Task not found");
    return c.body(null, 204);
  });

  return app;
}
