// End-to-end tests (ADR-0009): production build served by `vite preview`. Run `pnpm build` first.
// Test titles start with the spec ID they verify (adapters/tests.md). The full three-engine +
// two-origin host/CSP suite is set up in QA (phase 5); this smoke runs on Chromium.
import { defineConfig, devices } from '@playwright/test';

const CI = !!process.env['CI'];
const PORT = 4173;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  timeout: 30_000,
  reporter: CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    permissions: ['clipboard-read', 'clipboard-write'],
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm preview',
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !CI,
    timeout: 60_000,
  },
});
