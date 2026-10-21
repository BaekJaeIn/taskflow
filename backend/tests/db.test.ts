import { describe, test, expect, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createDb } from "../src/db";

describe("createDb", () => {
  let dir: string | undefined;

  afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
    dir = undefined;
  });

  test("DB 파일의 상위 디렉터리가 없으면 생성한 뒤 연다", () => {
    dir = mkdtempSync(join(tmpdir(), "taskflow-db-"));
    const filename = join(dir, "nested", "data", "taskflow.db");

    expect(() => createDb(filename)).not.toThrow();
    expect(existsSync(filename)).toBe(true);
  });

  test("파일 경로가 아닌 URL(예: postgres)이 주어지면 명확한 에러를 던진다", () => {
    expect(() => createDb("postgresql://user:pass@host:5432/db")).toThrow(/DATABASE_URL/);
  });
});
