import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration — Sprint 1 E2E Tests
 * Tests run in offline/mock mode against a mock API handler.
 * No live readdly-api-gateway is required.
 */
export default defineConfig({
  testDir: './test',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  timeout: 30000,

  use: {
    // Base URL can be pointed at a real dev server; for offline mocked tests we use page.route()
    baseURL: 'http://localhost:3003',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
