// F-007 work offline (ADR-0010, NFR-01): after first load the tool runs with no network; the
// cache holds only the tool's own files; a newer version is picked up on a later online open.
// Service-worker automation is reliable on Chromium; WebKit and Firefox offline is a manual check
// (recorded in the traceability matrix).
import { expect, test, type Page } from '@playwright/test';

// Fixture admin port: E2E_PORT_BASE + 6 (playwright.config.ts / server.mjs, default 4506).
const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env;
const ADMIN = `http://localhost:${Number(env?.['E2E_PORT_BASE'] ?? 4500) + 6}`;

const CACHE_PREFIX = 'text-case-converter-';

test.describe('F-007 offline', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'SW offline verified on Chromium; others manual');

  /** Load the tool and wait until the worker has seeded its cache. */
  async function loadAndSeed(page: Page): Promise<void> {
    await page.goto('/');
    await expect(page.getByRole('grid', { name: 'Converted cases' })).toBeVisible();
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    // Wait for the seed to populate the cache (assets then page).
    await expect
      .poll(
        () =>
          page.evaluate(async (prefix) => {
            const name = (await caches.keys()).find((n) => n.startsWith(prefix));
            if (!name) return 0;
            return (await (await caches.open(name)).keys()).length;
          }, CACHE_PREFIX),
        { timeout: 10_000 },
      )
      .toBeGreaterThan(1);
  }

  test('F-007.AC1 works offline after the first load', async ({ page, context }) => {
    await loadAndSeed(page);
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole('grid', { name: 'Converted cases' })).toBeVisible();
    await page.getByLabel('Text to convert').fill('getUserID');
    await expect(page.getByRole('button', { name: 'Copy snake_case' })).toContainText('get_user_id');
    await context.setOffline(false);
  });

  test('F-007.AC2 the cache holds only the tool’s own files, never user text', async ({ page }) => {
    await loadAndSeed(page);
    // Enter sensitive text; it must never reach the cache.
    await page.getByLabel('Text to convert').fill('SECRET_TOKEN_abc');
    await page.waitForTimeout(300);
    const { names, urls } = await page.evaluate(async (prefix) => {
      const names = (await caches.keys()).filter((n) => n.startsWith(prefix));
      const urls: string[] = [];
      for (const n of names) for (const req of await (await caches.open(n)).keys()) urls.push(req.url);
      return { names, urls };
    }, CACHE_PREFIX);
    expect(names.length).toBe(1); // one owned cache
    const origin = new URL(page.url()).origin;
    for (const u of urls) {
      expect(u.startsWith(origin)).toBe(true); // only same-origin tool files
      expect(/\/(index\.html|sw\.js)?$|\/assets\//.test(new URL(u).pathname)).toBe(true);
    }
    expect(JSON.stringify(urls)).not.toContain('SECRET');
  });

  test('F-011.AC12 first opened in en-US, reopened offline in vi-VN: Vietnamese UI face', async ({ page, context }) => {
    await loadAndSeed(page); // en-US (the default browser language)
    // The seed itself must hold the Vietnamese face (not just the browser's HTTP/memory cache).
    await expect
      .poll(
        () =>
          page.evaluate(async (prefix) => {
            const name = (await caches.keys()).find((n) => n.startsWith(prefix));
            const keys = name ? await (await caches.open(name)).keys() : [];
            return keys.some((r) => /manrope-vietnamese.*\.woff2$/.test(r.url));
          }, CACHE_PREFIX),
        { timeout: 10_000 },
      )
      .toBe(true);
    await context.setOffline(true);
    await page.goto('/?lang=vi-VN');
    await expect(page.getByLabel('Văn bản cần chuyển đổi')).toBeVisible();
    const fonts = await page.evaluate(async () => {
      await document.fonts.ready;
      return {
        check: document.fonts.check('400 16px Manrope', 'ễộưđ'),
        loaded: [...document.fonts].filter((f) => f.family.replace(/["']/g, '') === 'Manrope' && f.status === 'loaded')
          .length,
      };
    });
    expect(fonts).toEqual({ check: true, loaded: 2 });
    await context.setOffline(false);
  });

  test('F-007.AC3 a newer version is picked up on a later online open', async ({ page, request }) => {
    await loadAndSeed(page);
    await request.get(`${ADMIN}/publish?on=1`); // server now serves v2
    await page.reload(); // network-first page fetch gets the new HTML
    await expect(page.locator('meta[name="tk-test-version"]')).toHaveCount(1);
    await request.get(`${ADMIN}/publish?on=0`);
  });
});
