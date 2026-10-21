import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import * as schema from "./schema";

export function createDb(filename = process.env.DATABASE_URL ?? "taskflow.db") {
  // postgres:// 같은 접속 URL은 SQLite 파일 경로로 쓸 수 없습니다.
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(filename)) {
    throw new Error(`DATABASE_URL must be a SQLite file path, got a URL: ${filename.split(":")[0]}://...`);
  }
  // 볼륨 경로(/data/taskflow.db 등)의 상위 디렉터리가 없으면 SQLITE_CANTOPEN이 나므로 미리 만듭니다.
  if (filename !== ":memory:") mkdirSync(dirname(filename), { recursive: true });

  const sqlite = new Database(filename);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder: "./drizzle" });
  return db;
}

export type Db = ReturnType<typeof createDb>;
export * from "./schema";
