import { defineConfig, devices } from "@playwright/test";

// E2E 전용 포트: 개발 서버(3000/5173)와 DB·프록시가 섞이지 않도록 분리합니다.
const BACKEND_PORT = 3100;
const FRONTEND_PORT = 5174;
const FRONTEND_URL = `http://localhost:${FRONTEND_PORT}`;

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./e2e/test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never", outputFolder: "e2e/playwright-report" }]]
    : [["list"], ["html", { open: "never", outputFolder: "e2e/playwright-report" }]],
  use: {
    baseURL: FRONTEND_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "npm run dev",
      cwd: "./backend",
      // 인메모리 DB: 실행할 때마다 깨끗한 상태에서 시작합니다 (고정 이메일 가입이 재실행에도 성공).
      env: { PORT: String(BACKEND_PORT), DATABASE_URL: ":memory:", JWT_SECRET: "e2e-secret" },
      url: `http://localhost:${BACKEND_PORT}/api/health`,
      reuseExistingServer: false,
    },
    {
      command: `npm run dev -- --port ${FRONTEND_PORT} --strictPort`,
      cwd: "./frontend",
      env: { VITE_API_TARGET: `http://localhost:${BACKEND_PORT}` },
      url: FRONTEND_URL,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
