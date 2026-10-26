// F-011 use the portal's language (RULE-15, RULE-10, ADR-0013): address language from first
// display, live switches, fallbacks, identical results, number format, fonts, 320 px fit, and no
// font request after load — against the production build and the stub host. Three engines.
import { expect, test, type Browser, type Frame, type Page } from '@playwright/test';

const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env;
const BASE = Number(env?.['E2E_PORT_BASE'] ?? 4500);
const HOST = `http://localhost:${BASE + 1}`;
const TOOL = `http://localhost:${BASE}`;

declare global {
  interface Window {
    setLang?: (value: unknown) => void;
    postRaw?: (data: unknown) => void;
    resizeTool?: (w: number | string, h: number | string) => void;
    __sawEnglish?: boolean;
  }
}

const VI = { input: 'Văn bản cần chuyển đổi', results: 'Kết quả chuyển đổi', sort: 'Sắp xếp' };
const EN = { input: 'Text to convert', results: 'Converted cases', sort: 'Sort' };

/** Open the stub host with `query` and return the tool frame once it shows `results`. */
async function embed(page: Page, query: string, results: string): Promise<Frame> {
  await page.goto(`${HOST}/host.html${query}`);
  await expect(page.frameLocator('iframe[name="tool"]').getByRole('group', { name: results })).toBeVisible();
  return page.frame({ name: 'tool' })!;
}

/** A standalone page in a browser context whose preferred language is `locale`. */
async function standalone(browser: Browser, locale: string, path = '/') {
  const context = await browser.newContext({ locale });
  const page = await context.newPage();
  await page.goto(`${TOOL}${path}`);
  return { context, page };
}

test('F-011.AC1 vi-VN in the address: Vietnamese from first display, page language vi-VN', async ({ page }) => {
  // Record, in every frame, whether English UI text ever reached the DOM before the check.
  // Every text that ever reached the DOM is checked, including values replaced later in the same
  // task (characterDataOldValue), so a synchronous English-then-Vietnamese render is caught.
  await page.addInitScript(() => {
    window.__sawEnglish = false;
    const english = /Text to convert|Converted cases|Strip symbols|Private — nothing/;
    new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === 'characterData' && english.test(r.oldValue ?? '')) window.__sawEnglish = true;
        for (const n of r.addedNodes) if (english.test(n.textContent ?? '')) window.__sawEnglish = true;
      }
    }).observe(document, { subtree: true, childList: true, characterData: true, characterDataOldValue: true });
  });
  const frame = await embed(page, '?theme=dark&lang=vi-VN', VI.results);
  await expect(frame.locator('html')).toHaveAttribute('lang', 'vi-VN');
  await expect(frame.getByLabel(VI.input)).toBeVisible();
  await expect(frame.getByText('Riêng tư — không có dữ liệu nào rời khỏi trình duyệt')).toBeVisible();
  expect(await frame.evaluate(() => window.__sawEnglish)).toBe(false);
  // Title: both languages use the same text; set/updated by language.ts (unit: language.test.ts).
  expect(await frame.evaluate(() => document.title)).toBe('Text Case Converter');
});

test('F-011.AC2 en-US in the address: English, page language en-US', async ({ page }) => {
  const frame = await embed(page, '?lang=en-US', EN.results);
  await expect(frame.locator('html')).toHaveAttribute('lang', 'en-US');
  await expect(frame.getByLabel(EN.input)).toBeVisible();
});

test('F-011.AC3 a language message switches live; input, results and preferences kept', async ({ page }) => {
  const frame = await embed(page, '?lang=vi-VN', VI.results);
  await frame.getByLabel(VI.input).fill('getUserID');
  const strip = frame.getByRole('switch', { name: 'Xóa ký tự đặc biệt' });
  const before = await strip.getAttribute('aria-checked');
  await strip.click();
  const after = before === 'true' ? 'false' : 'true';
  await page.evaluate(() => window.setLang!('en-US'));
  await expect(frame.locator('html')).toHaveAttribute('lang', 'en-US');
  await expect(frame.getByLabel(EN.input)).toHaveValue('getUserID');
  await expect(frame.getByRole('switch', { name: 'Strip symbols' })).toHaveAttribute('aria-checked', after);
  await expect(frame.getByRole('button', { name: 'Copy snake_case' })).toContainText('get_user_id');
  expect(await frame.evaluate(() => document.title)).toBe('Text Case Converter');
  expect(await page.evaluate(() => window.__host!.loads)).toBe(1); // not reloaded
});

test('F-011.AC4 unsupported language messages are ignored', async ({ page }) => {
  const frame = await embed(page, '?lang=vi-VN', VI.results);
  await page.evaluate(() => {
    window.setLang!('fr-FR');
    window.setLang!(42);
    window.postRaw!({ type: 'taro:language' });
  });
  await page.waitForTimeout(200);
  await expect(frame.locator('html')).toHaveAttribute('lang', 'vi-VN');
  await expect(frame.getByLabel(VI.input)).toBeVisible();
  // Origin and source checks: unit tests (language.test.ts, F-011.AC4).
});

test('F-011.AC5 no language in the address follows the browser, else en-US', async ({ browser }) => {
  for (const [locale, expected, label] of [
    ['vi-VN', 'vi-VN', VI.input],
    ['fr-FR', 'en-US', EN.input],
  ] as const) {
    const { context, page } = await standalone(browser, locale);
    await expect(page.locator('html')).toHaveAttribute('lang', expected);
    await expect(page.getByLabel(label)).toBeVisible();
    await context.close();
  }
  // Multi-entry preference lists ([fr-FR, vi] …): unit tests (language.test.ts, F-011.AC5).
});

test('F-011.AC6 an unsupported address language behaves as if none was passed', async ({ browser }) => {
  for (const [locale, expected] of [
    ['vi-VN', 'vi-VN'],
    ['en-US', 'en-US'],
  ] as const) {
    const { context, page } = await standalone(browser, locale, '/?lang=fr-FR');
    await expect(page.locator('html')).toHaveAttribute('lang', expected);
    await context.close();
  }
});

test('F-011.AC7 labels, results and A–Z order are identical in vi-VN and en-US', async ({ page }) => {
  const snapshot = async (lang: string, names: typeof EN) => {
    const frame = await embed(page, `?lang=${lang}`, names.results);
    await frame.getByLabel(names.input).fill('parse HTTPResponse v2');
    await frame.getByLabel(names.sort).selectOption('alphabetical');
    const rows = frame.locator('.row__copy-btn');
    await expect(rows.first()).not.toHaveClass(/row--inert/);
    return rows.evaluateAll((els) =>
      els.map((el) => [
        el.querySelector('.row__label [lang="en"]')?.textContent,
        el.querySelector('.row__val')?.textContent,
      ]),
    );
  };
  const vi = await snapshot('vi-VN', VI);
  const en = await snapshot('en-US', EN);
  expect(vi).toHaveLength(11);
  expect(vi).toEqual(en);
});

test('F-011.AC8 the line count uses the language digit grouping', async ({ page }) => {
  const text = Array.from({ length: 1234 }, (_, i) => `line ${i}`).join('\n');
  const vi = await embed(page, '?lang=vi-VN', VI.results);
  await vi.getByLabel(VI.input).fill(text);
  await expect(vi.getByText('1.234 dòng')).toBeVisible();
  const en = await embed(page, '?lang=en-US', EN.results);
  await en.getByLabel(EN.input).fill(text);
  await expect(en.getByText('1,234 lines')).toBeVisible();
});

test('F-011.AC9 Vietnamese UI text renders in the UI typeface', async ({ page }) => {
  const frame = await embed(page, '?lang=vi-VN', VI.results);
  const ok = await frame.evaluate(async () => {
    await document.fonts.ready;
    const faces = [...document.fonts].filter((f) => f.family.replace(/["']/g, '') === 'Manrope');
    return {
      check: document.fonts.check('400 16px Manrope', 'ễộưđ'),
      loaded: faces.filter((f) => f.status === 'loaded').length,
      family: getComputedStyle(document.querySelector('label')!).fontFamily,
    };
  });
  expect(ok.family).toContain('Manrope');
  expect(ok.check).toBe(true);
  expect(ok.loaded).toBe(2); // Latin and Vietnamese faces
});

test('F-011.AC10 vi-VN fits 320 px: no horizontal scroll, no clipped label', async ({ page }) => {
  const frame = await embed(page, '?lang=vi-VN', VI.results);
  await page.evaluate(() => window.resizeTool!(320, 900));
  const measure = () =>
    frame.evaluate(() => {
      const d = document.documentElement;
      const clipped = [...document.querySelectorAll('.switch, .sort__label, .row__badge, .row__copied, .status *')]
        .filter((el) => (el as HTMLElement).offsetParent !== null)
        .filter((el) => el.scrollWidth > el.clientWidth + 1)
        .map((el) => el.className || el.textContent);
      // The copied flash is an overlay: it must not cover the badge or the case label.
      const flash = document.querySelector('.row__copied')?.getBoundingClientRect();
      const row = document.querySelector('.row__copied')?.closest('.row');
      for (const el of flash && row ? row.querySelectorAll('.row__badge, .row__label [lang]') : []) {
        if (getComputedStyle(el).visibility === 'hidden') continue;
        const r = el.getBoundingClientRect();
        const covered =
          r.right > flash!.left && r.left < flash!.right && r.bottom > flash!.top && r.top < flash!.bottom;
        if (covered) clipped.push(`covered by flash: ${el.textContent}`);
      }
      return { overflow: d.scrollWidth - d.clientWidth, clipped };
    });
  const states: Record<string, Awaited<ReturnType<typeof measure>>> = {};
  states.empty = await measure();
  await frame.getByLabel(VI.input).fill('getUserID\nparse HTTPResponse');
  states.multiline = await measure();
  await frame.getByRole('button', { name: 'Sao chép camelCase' }).click();
  states.copied = await measure(); // copied flash + last-used badge
  await frame.getByLabel(VI.sort).selectOption('recent');
  states.sorted = await measure();
  for (const [name, m] of Object.entries(states)) {
    expect(m.clipped, name).toEqual([]);
    expect(m.overflow, name).toBeLessThanOrEqual(1);
  }
});

test('F-011.AC12 no font request after the initial load, whatever is typed or switched', async ({ page }) => {
  const frame = await embed(page, '?lang=en-US', EN.results);
  await frame.evaluate(() => document.fonts.ready);
  const late: string[] = [];
  page.on('request', (r) => {
    if (/\.woff2?(\?|$)/.test(r.url())) late.push(r.url());
  });
  await frame.getByLabel(EN.input).fill('Nguyễn Đặng ộ ư ơ');
  await page.evaluate(() => window.setLang!('vi-VN'));
  await expect(frame.locator('html')).toHaveAttribute('lang', 'vi-VN');
  await page.waitForTimeout(500);
  expect(late).toEqual([]);
});
