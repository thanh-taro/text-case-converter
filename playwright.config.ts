// End-to-end tests (ADR-0009). The production build is served by tests/e2e/server.mjs, which
// applies the generated _headers (CSP, frame-ancestors) and runs a stub portal host on a second
// origin plus an unlisted origin for the embedding-refusal test. The dist is built with
// HOST_ORIGINS pointing at the stub host so both the frame-ancestors header and the compiled-in
// allow-list (__HOST_ORIGINS__) target it. Three engines (NFR-06). Titles start with the spec ID.
import { defineConfig, devices } from '@playwright/test';

const CI = !!process.env['CI'];
const BASE = Number(process.env['E2E_PORT_BASE'] ?? 4173);
export const PORTS = { tool: BASE, host: BASE + 1, unlisted: BASE + 2, admin: BASE + 6 };

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  timeout: 30_000,
  reporter: CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${PORTS.tool}`,
    trace: 'retain-on-failure',
  },
  projects: [
    // Clipboard permissions are Chromium-only names; Firefox and WebKit reject them and allow
    // writeText on a user click without a grant.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], permissions: ['clipboard-read', 'clipboard-write'] },
    },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    // Build the dist against the stub host origin, then serve it with the real _headers.
    command: `HOST_ORIGINS="http://localhost:${PORTS.host}" pnpm build && node tests/e2e/server.mjs`,
    url: `http://localhost:${PORTS.admin}/health`,
    reuseExistingServer: !CI,
    timeout: 120_000,
  },
});
