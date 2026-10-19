import { defineConfig, devices } from '@playwright/test'

const FRONTEND_URL = 'http://localhost:5173'

export default defineConfig({
  testDir: './e2e/tests',
  outputDir: './e2e/test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never', outputFolder: 'e2e/playwright-report' }]] : [['list'], ['html', { open: 'never', outputFolder: 'e2e/playwright-report' }]],
  use: {
    baseURL: FRONTEND_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // TODO: 백엔드 서버 엔트리와 프론트 /api 프록시가 준비되면 백엔드 webServer 추가
  webServer: {
    command: 'npm run dev',
    cwd: './frontend',
    url: FRONTEND_URL,
    reuseExistingServer: !process.env.CI,
  },
})
