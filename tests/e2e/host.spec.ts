// F-005 host integration (RULE-10, ADR-0008, NFR-06/07): theme, sizing, messages, embedding
// refusal — against the production build and a stub host on a second origin. Three engines.
import { expect, test, type Frame, type Page } from '@playwright/test';

// Matches playwright.config.ts / server.mjs (E2E_PORT_BASE, default 4500).
const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env;
const BASE = Number(env?.['E2E_PORT_BASE'] ?? 4500);
const PORTS = { host: BASE + 1, unlisted: BASE + 2 };

declare global {
  interface Window {
    __host?: { received: { origin: string; data: unknown; fromTool: boolean }[]; loads: number };
    setTheme?: (value: unknown) => void;
    postRaw?: (data: unknown) => void;
    resizeTool?: (w: number | string, h: number | string) => void;
  }
}

const HOST = `http://localhost:${PORTS.host}`;
const UNLISTED = `http://localhost:${PORTS.unlisted}`;

/** Open the stub host and return the tool frame once it has rendered. */
async function embed(page: Page, query = ''): Promise<Frame> {
  await page.goto(`${HOST}/host.html${query}`);
  const toolFrame = page.frameLocator('iframe[name="tool"]');
  await expect(toolFrame.getByRole('grid', { name: 'Converted cases' })).toBeVisible();
  const frame = page.frame({ name: 'tool' });
  expect(frame).not.toBeNull();
  return frame!;
}

test('F-005.AC2 host switches theme via a settings message, no reload, input kept', async ({ page }) => {
  const frame = await embed(page, '?theme=light');
  await expect(frame.locator('html')).toHaveAttribute('data-theme', 'light');
  await frame.getByLabel('Text to convert').fill('getUserID');
  await page.evaluate(() => window.setTheme!('dark'));
  await expect(frame.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(frame.getByLabel('Text to convert')).toHaveValue('getUserID'); // not reloaded
});

test('F-005.AC9 unknown theme value keeps the current theme (no flash)', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' }); // device preference is the fallback
  // host embeds with ?theme=purple (invalid) → tool keeps device/default (dark)
  const frame = await embed(page, '?theme=bad');
  await expect(frame.locator('html')).toHaveAttribute('data-theme', 'dark');
  // an invalid settings message is ignored too
  await page.evaluate(() => window.setTheme!('chartreuse'));
  await expect(frame.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('F-005.AC9 missing theme follows the device preference', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  const frame = await embed(page, ''); // no theme in the address
  await expect(frame.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('F-005.AC3 standalone follows the device light/dark preference', async ({ browser, browserName, playwright }) => {
  for (const scheme of ['dark', 'light'] as const) {
    // Playwright's emulated colour scheme does not survive on the tool page in Firefox, so there
    // the preference is set the way a user sets it: Firefox's "Website appearance" pref (0 = dark,
    // 1 = light). Verified against the live site in CI: real prefs are followed in both schemes.
    const ff =
      browserName === 'firefox'
        ? await playwright.firefox.launch({
            firefoxUserPrefs: { 'layout.css.prefers-color-scheme.content-override': scheme === 'dark' ? 0 : 1 },
          })
        : null;
    const context = ff ? await ff.newContext({ colorScheme: null }) : await browser.newContext({ colorScheme: scheme });
    const page = await context.newPage();
    await page.goto(`http://localhost:${BASE}/`);
    await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);
    await context.close();
    await ff?.close();
  }
});

test('F-005.AC4 fills the host area at 320px with no horizontal scroll of its own', async ({ page }) => {
  const frame = await embed(page, '?theme=dark');
  await page.evaluate(() => window.resizeTool!(320, 640));
  await frame.getByLabel('Text to convert').fill('getUserID');
  const overflow = await frame.evaluate(() => {
    const d = document.documentElement;
    return d.scrollWidth - d.clientWidth;
  });
  expect(overflow).toBeLessThanOrEqual(1);
});

test('F-005.AC6 the only message the tool sends the host is the ready signal, no user text', async ({ page }) => {
  const frame = await embed(page, '?theme=dark');
  await frame.getByLabel('Text to convert').fill('SECRET_getUserID');
  await frame.getByRole('button', { name: 'Copy snake_case' }).click();
  await page.waitForTimeout(200);
  const fromTool = await page.evaluate(() => window.__host!.received.filter((m) => m.fromTool));
  expect(fromTool).toHaveLength(1);
  expect(fromTool[0]!.data).toEqual({ type: 'taro:ready' });
  expect(JSON.stringify(fromTool)).not.toContain('SECRET');
});

test('F-005.AC7 a non-allow-listed origin cannot embed the tool', async ({ page }) => {
  // frame-ancestors makes the browser refuse the tool's document inside the unlisted origin, so
  // it is never parsed and never fetches its script or stylesheet. Checked through requests
  // because Firefox does not let the test look inside the refused frame.
  const toolAssets: string[] = [];
  page.on('request', (r) => {
    if (r.url().startsWith(`http://localhost:${BASE}/assets/`)) toolAssets.push(r.url());
  });
  await page.goto(`${UNLISTED}/host.html?theme=dark`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  expect(toolAssets).toEqual([]);
  const fromTool = await page.evaluate(() => window.__host!.received.filter((m) => m.fromTool));
  expect(fromTool).toEqual([]);
});

test('F-005.AC8 standalone: every M-1 feature works', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Text to convert').fill('first name\nlast_name');
  await expect(page.getByRole('button', { name: 'Copy camelCase' })).toContainText('firstName');
  await expect(page.getByText('2 lines')).toBeVisible();
  await page.getByRole('button', { name: 'Copy kebab-case' }).click();
  await expect(page.locator('.row--copied')).toBeVisible();
  await page.getByRole('button', { name: 'Clear' }).click();
  await expect(page.getByLabel('Text to convert')).toHaveValue('');
});

// F-005.AC5 (settings message from a non-allowed origin ignored) and F-005.AC10 (empty allow-list
// → standalone only) are covered by unit tests: host-contract.test.ts (acceptThemeMessage rejects
// non-allowed origins) and headers.test.ts / host-contract (empty allow-list → no listener, no
// ready, frame-ancestors 'none'). They need a separate build permutation to exercise end-to-end.

test('F-006.AC5 source-code link is shown when embedded too', async ({ page }) => {
  const frame = await embed(page, '?theme=light');
  const link = frame.getByRole('link', { name: 'Source code (opens in a new tab)' });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('href', 'https://github.com/thanh-taro/text-case-converter');
});
