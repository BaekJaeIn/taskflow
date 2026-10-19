import { randomUUID } from "node:crypto";
import { test, expect } from "@playwright/test";

test.describe("Task CRUD", () => {
  test.beforeEach(async ({ page, request }) => {
    // 테스트마다 고유한 사용자를 API로 가입시켜 서로의 태스크와 auth.spec의 계정에 영향을 주지 않는다.
    const email = `tasks-${randomUUID()}@test.com`;
    const res = await request.post("/api/auth/register", { data: { email, password: "password123" } });
    expect(res.status()).toBe(201);

    // 로그인
    await page.goto("/login");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
  });

  test("새 태스크를 생성할 수 있다", async ({ page }) => {
    // Arrange (이미 로그인된 상태)

    // Act
    await page.click('button:has-text("새 태스크 추가")');
    // 모달에서 폼 작성
    await page.fill('input[name="taskTitle"]', "새 태스크");
    await page.fill('textarea[name="taskDescription"]', "태스크 설명입니다.");
    await page.click('button[type="submit"]');
    // Assert
    await expect(page.locator('.task-item:has-text("새 태스크")')).toBeVisible();
  });
  test("태스크 상태를 변경할 수 있다", async ({ page }) => {
    // Arrange
    // 태스크 먼저 생성
    await page.click('button:has-text("새 태스크 추가")');
    await page.fill('input[name="taskTitle"]', "상태 변경 태스크");
    await page.fill('textarea[name="taskDescription"]', "상태 변경 태스크입니다.");
    await page.click('button[type="submit"]');
    // 태스크가 '대기중' 상태에 있는지 확인
    await page.click('[data-testid="status-pending"] >> nth=0'); // 첫 번째 대기중 태스크 선택
    await page.click("text=진행중");
    // Act
    // 선택한 태스크의 상태가 '진행중'으로 변경되었는지 확인
    await expect(page.locator(".task-item >> text=진행중")).toBeVisible();
  });
  test("태스크를 삭제할 수 있다", async ({ page }) => {
    // Arrange
    // 태스크 먼저 생성
    await page.click('button:has-text("새 태스크 추가")');
    await page.fill('input[name="taskTitle"]', "삭제할 태스크");
    await page.fill('textarea[name="taskDescription"]', "삭제할 태스크입니다.");
    await page.click('button[type="submit"]');
    // 태스크가 목록에 있는지 확인
    const taskItem = page.locator('.task-item:has-text("삭제할 태스크")');
    await expect(taskItem).toBeVisible();
    // Act
    await taskItem.locator('[data-testid="delete-task"] >> nth=-1').click();
    // 확인 다이얼로그
    await page.click('button:has-text("확인")');
    // Assert
    await expect(taskItem).toHaveCount(0);
  });
});
