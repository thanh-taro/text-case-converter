// M-3 e2e: input match badge (F-012), keep acronyms (F-013), keyboard navigation (F-014),
// Train-Case + COBOL-CASE (F-015) — against the production build. Titles cite ACs.
import { expect, test, type Page } from '@playwright/test';

const input = (p: Page) => p.getByLabel('Text to convert');
const copyBtn = (p: Page, label: string) => p.getByRole('button', { name: `Copy ${label}`, exact: true });
const pinBtn = (p: Page, label: string) => p.getByRole('button', { name: `Pin ${label}`, exact: true });
const acronyms = (p: Page) => p.getByRole('switch', { name: 'Keep acronyms' });
/** Labels of the rows that show the matches-input badge, in row order. */
const matched = (p: Page) => p.locator('.row:has(.row__badge--match) .row__label [lang]').allInnerTexts();
/** Case label of the focused element's row, and which action it is. */
const focused = (p: Page) =>
  p.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    return { case: el?.dataset['case'] ?? null, action: el?.dataset['action'] ?? null, tag: el?.tagName ?? null };
  });
const rowIds = (p: Page) =>
  p.locator('.row button[data-action="copy"]').evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset['case']));

test.describe('F-012 input match', () => {
  test('F-012.AC1 F-012.AC2 get_user_id marks snake_case only; user marks six rows', async ({ page }) => {
    await page.goto('/');
    await input(page).fill('get_user_id');
    await expect.poll(() => matched(page)).toEqual(['snake_case']);
    await input(page).fill('user');
    await expect
      .poll(() => matched(page))
      .toEqual(['camelCase', 'snake_case', 'kebab-case', 'dot.case', 'path/case', 'lowercase']);
  });

  test('F-012.AC4 F-013.AC6 the badge follows the Keep acronyms toggle live', async ({ page }) => {
    await page.goto('/');
    await input(page).fill('getUserID');
    await expect.poll(() => matched(page)).toEqual([]);
    await acronyms(page).click();
    await expect.poll(() => matched(page)).toEqual(['camelCase']);
    await expect(copyBtn(page, 'camelCase')).toContainText('getUserID');
    await acronyms(page).click(); // F-013.AC6: back to getUserId, input unchanged
    await expect(copyBtn(page, 'camelCase')).toContainText('getUserId');
    await expect(input(page)).toHaveValue('getUserID');
  });

  test('F-012.AC5 F-012.AC6 the badge goes when the input stops matching or is cleared', async ({ page }) => {
    await page.goto('/');
    await input(page).fill('get_user_id');
    await expect.poll(() => matched(page)).toEqual(['snake_case']);
    await input(page).press('End');
    await input(page).pressSequentially('-x');
    await expect.poll(() => matched(page)).toEqual([]);
    await input(page).fill('');
    await expect(page.locator('.row__badge--match')).toHaveCount(0);
  });

  test('F-012.AC8 both badges in every sort mode; results unchanged', async ({ page }) => {
    await page.goto('/');
    await input(page).fill('get_user_id');
    await expect(copyBtn(page, 'snake_case')).toContainText('get_user_id'); // settled
    await copyBtn(page, 'snake_case').click();
    const value = () => page.locator('#tcc-val-snake').textContent();
    const before = await value();
    for (const mode of ['default', 'recent', 'alphabetical']) {
      await page.getByLabel('Sort').selectOption(mode);
      const row = page.locator('.row', { has: copyBtn(page, 'snake_case') });
      await expect(row.locator('.row__badge--match')).toBeVisible();
      await expect(row.locator('.row__badge:not(.row__badge--match)')).toBeVisible();
      expect(await value()).toBe(before);
    }
  });

  test('F-012.AC9 the badge is part of the copy action description', async ({ page }) => {
    await page.goto('/');
    await input(page).fill('get_user_id');
    await expect(copyBtn(page, 'snake_case')).toHaveAccessibleDescription(/Matches input/);
    await expect(copyBtn(page, 'kebab-case')).not.toHaveAccessibleDescription(/Matches input/);
  });

  test('F-012.AC10 F-011.AC10 both badges fit at 320 px in en-US and vi-VN', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    for (const lang of ['en-US', 'vi-VN']) {
      await page.goto(`/?lang=${lang}`);
      await page.locator('textarea').fill('get_user_id');
      await page.locator('.row button[data-case="snake"][data-action="copy"]').click();
      await page.waitForTimeout(1800); // past the copied flash: both badges visible
      const m = await page.evaluate(() => {
        const row = document.querySelector('button[data-case="snake"]')!.closest('.row')!;
        const badges = [...row.querySelectorAll('.row__badge')];
        const clipped = badges.filter((b) => b.scrollWidth > b.clientWidth + 1).length;
        const rects = badges.map((b) => b.getBoundingClientRect());
        const overlap =
          rects.length === 2 &&
          rects[0]!.right > rects[1]!.left &&
          rects[0]!.left < rects[1]!.right &&
          rects[0]!.bottom > rects[1]!.top &&
          rects[0]!.top < rects[1]!.bottom;
        const d = document.documentElement;
        return { count: badges.length, clipped, overlap, overflow: d.scrollWidth - d.clientWidth };
      });
      expect(m, lang).toEqual({ count: 2, clipped: 0, overlap: false, overflow: 0 });
    }
  });
});

test.describe('F-013 keep acronyms', () => {
  test('F-013.AC1 F-013.AC7 F-013.AC8 off by default; on keeps acronyms and is remembered', async ({ page }) => {
    await page.goto('/');
    await expect(acronyms(page)).toHaveAttribute('aria-checked', 'false');
    await input(page).fill('getUserID');
    await expect(copyBtn(page, 'PascalCase')).toContainText('GetUserId');
    await acronyms(page).click();
    await expect(copyBtn(page, 'PascalCase')).toContainText('GetUserID');
    await expect(copyBtn(page, 'Train-Case')).toContainText('Get-User-ID');
    await page.reload();
    await expect(acronyms(page)).toHaveAttribute('aria-checked', 'true');
  });

  test('F-013.AC12 preferences saved by v1.2.0 keep their fields and default Keep acronyms off', async ({ page }) => {
    await page.addInitScript(() => {
      if (!sessionStorage.getItem('seeded')) {
        sessionStorage.setItem('seeded', '1');
        localStorage.setItem(
          'tcc.prefs',
          JSON.stringify({
            stripSymbols: false,
            removeAccents: true,
            sortMode: 'recent',
            pinned: ['path'],
            recent: [],
          }),
        );
      }
    });
    await page.goto('/');
    await expect(acronyms(page)).toHaveAttribute('aria-checked', 'false');
    await expect(page.getByRole('switch', { name: 'Strip symbols' })).toHaveAttribute('aria-checked', 'false');
    await expect(page.getByLabel('Sort')).toHaveValue('recent');
    expect((await rowIds(page))[0]).toBe('path');
  });
});

test.describe('F-014 keyboard navigation', () => {
  test('F-014.AC1 F-014.AC5 the grid is one Tab stop and remembers the row', async ({ page }) => {
    await page.goto('/');
    await input(page).fill('getUserID');
    await page.getByLabel('Sort').focus();
    await page.keyboard.press('Tab');
    expect(await focused(page)).toMatchObject({ case: 'camel', action: 'copy' });
    await page.keyboard.press('Tab');
    expect((await focused(page)).case).toBeNull(); // left the grid in one step
    await page.getByLabel('Sort').focus();
    await page.keyboard.press('Tab');
    for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Tab'); // leave from the fifth row
    await page.keyboard.press('Shift+Tab'); // come back
    expect(await focused(page)).toMatchObject({ case: (await rowIds(page))[4], action: 'copy' });
  });

  test('F-014.AC2 F-014.AC3 F-014.AC4 F-014.AC12 arrows, Home/End, no wrap, dead ends', async ({ page }) => {
    await page.goto('/');
    await input(page).fill('getUserID');
    const ids = await rowIds(page);
    await copyBtn(page, 'camelCase').focus();
    for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowDown');
    expect(await focused(page)).toMatchObject({ case: ids[3], action: 'copy' });
    await page.keyboard.press('ArrowUp');
    expect((await focused(page)).case).toBe(ids[2]);
    await page.keyboard.press('ArrowLeft'); // AC12: nothing left of copy
    expect(await focused(page)).toMatchObject({ case: ids[2], action: 'copy' });
    await page.keyboard.press('ArrowRight');
    expect(await focused(page)).toMatchObject({ case: ids[2], action: 'pin' });
    await page.keyboard.press('ArrowRight'); // AC12: nothing right of pin
    expect(await focused(page)).toMatchObject({ case: ids[2], action: 'pin' });
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowDown');
    expect(await focused(page)).toMatchObject({ case: ids[3], action: 'copy' });
    await page.keyboard.press('End');
    expect((await focused(page)).case).toBe(ids[ids.length - 1]);
    await page.keyboard.press('ArrowDown'); // no wrap
    expect((await focused(page)).case).toBe(ids[ids.length - 1]);
    await page.keyboard.press('Home');
    expect((await focused(page)).case).toBe(ids[0]);
  });

  test('F-014.AC6 Enter on a copy action copies it', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard permissions are Chromium-only in tests');
    await page.context().grantPermissions(['clipboard-write']);
    await page.addInitScript(() => {
      const w = window as unknown as { __copied: string[] };
      w.__copied = [];
      const original = navigator.clipboard.writeText.bind(navigator.clipboard);
      navigator.clipboard.writeText = (text: string) => {
        w.__copied.push(text);
        return original(text);
      };
    });
    await page.goto('/');
    await input(page).fill('getUserID');
    await expect(copyBtn(page, 'snake_case')).toContainText('get_user_id'); // settled
    await copyBtn(page, 'snake_case').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[role="status"][aria-live="polite"]')).toHaveText('Copied snake_case');
    expect(await page.evaluate(() => (window as unknown as { __copied: string[] }).__copied)).toEqual(['get_user_id']);
  });

  test('F-014.AC7 pinning with Space keeps focus on the moved row', async ({ page }) => {
    await page.goto('/');
    await input(page).fill('getUserID');
    const seventh = (await rowIds(page))[6]!;
    await page.locator(`button[data-case="${seventh}"][data-action="pin"]`).focus();
    await page.keyboard.press('Space');
    await expect.poll(async () => (await rowIds(page))[0]).toBe(seventh);
    await expect.poll(() => focused(page)).toMatchObject({ case: seventh, action: 'pin' });
  });

  test('F-014.AC11 copying in recent sort keeps focus on the moved row', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard permissions are Chromium-only in tests');
    await page.context().grantPermissions(['clipboard-write']);
    await page.goto('/');
    await input(page).fill('getUserID');
    await page.getByLabel('Sort').selectOption('recent');
    const fifth = (await rowIds(page))[4]!;
    await page.locator(`button[data-case="${fifth}"][data-action="copy"]`).focus();
    await page.keyboard.press('Enter');
    await expect.poll(async () => (await rowIds(page))[0]).toBe(fifth);
    await expect.poll(() => focused(page)).toMatchObject({ case: fifth, action: 'copy' });
  });

  test('F-014.AC8 empty input: arrows move between pin actions', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Sort').focus();
    await page.keyboard.press('Tab');
    expect(await focused(page)).toMatchObject({ case: 'camel', action: 'pin' });
    await page.keyboard.press('ArrowDown');
    expect(await focused(page)).toMatchObject({ case: 'pascal', action: 'pin' });
  });

  test('F-014.AC9 arrows in the input keep their normal behaviour', async ({ page }) => {
    await page.goto('/');
    await input(page).fill('one\ntwo');
    await input(page).press('ArrowUp');
    expect(await focused(page)).toMatchObject({ tag: 'TEXTAREA' });
    expect(await input(page).evaluate((el) => (el as HTMLTextAreaElement).selectionStart)).toBeLessThanOrEqual(3);
  });

  test('F-014.AC10 the grid exposes the ARIA grid pattern with named actions', async ({ page }) => {
    // Screen-reader announcement itself is a manual check (traceability matrix); this verifies the
    // roles and names a screen reader relies on.
    await page.goto('/');
    await input(page).fill('getUserID');
    const grid = page.getByRole('grid', { name: 'Converted cases' });
    await expect(grid.getByRole('row')).toHaveCount(13);
    await expect(grid.getByRole('gridcell')).toHaveCount(26);
    await expect(copyBtn(page, 'snake_case')).toHaveAccessibleDescription(/get_user_id/);
  });
});

test.describe('F-015 Train-Case and COBOL-CASE', () => {
  test('F-015.AC1 F-015.AC5 new rows in the default order', async ({ page }) => {
    await page.goto('/');
    await input(page).fill('content type');
    await expect(copyBtn(page, 'Train-Case')).toContainText('Content-Type');
    await expect(copyBtn(page, 'COBOL-CASE')).toContainText('CONTENT-TYPE');
    expect(await rowIds(page)).toEqual([
      'camel',
      'pascal',
      'snake',
      'kebab',
      'train',
      'constant',
      'cobol',
      'dot',
      'path',
      'title',
      'sentence',
      'upper',
      'lower',
    ]);
  });

  test('F-015.AC4 F-015.AC7 Content-Type matches Train-Case; copying marks it last used', async ({ page }) => {
    await page.goto('/');
    await input(page).fill('Content-Type');
    await expect.poll(() => matched(page)).toEqual(['Train-Case']);
    await copyBtn(page, 'Train-Case').click();
    const row = page.locator('.row', { has: copyBtn(page, 'Train-Case') });
    await expect(row.locator('.row__badge:not(.row__badge--match)')).toBeVisible({ timeout: 3000 });
  });

  test('F-015.AC2 pin works for the new kinds', async ({ page }) => {
    await page.goto('/');
    await input(page).fill('getHTTPResponse2');
    await expect(copyBtn(page, 'Train-Case')).toContainText('Get-Http-Response2');
    await pinBtn(page, 'COBOL-CASE').click();
    expect((await rowIds(page))[0]).toBe('cobol');
  });
});

test.describe('M-3 review regressions', () => {
  test('F-012.AC6 deleting the input hides every badge at once, before results settle (F-012.R3)', async ({ page }) => {
    await page.goto('/');
    await input(page).fill('user');
    await expect.poll(() => matched(page)).toHaveLength(6);
    // Delete without the Clear action, then look within the settle delay (two frames, well under 150 ms).
    const badges = await page.evaluate(async () => {
      const ta = document.querySelector('textarea')!;
      ta.value = '';
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return document.querySelectorAll('.row__badge--match').length;
    });
    expect(badges).toBe(0);
  });

  test('F-014.AC1 F-014.AC8 tabbing through an empty grid still enters on copy once input is typed', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByLabel('Sort').focus();
    await page.keyboard.press('Tab'); // empty: lands on the first row's pin action (R7)
    expect(await focused(page)).toMatchObject({ case: 'camel', action: 'pin' });
    await input(page).fill('getUserID');
    await expect(copyBtn(page, 'camelCase')).toContainText('getUserId');
    await page.getByLabel('Sort').focus();
    await page.keyboard.press('Tab');
    expect(await focused(page)).toMatchObject({ case: 'camel', action: 'copy' });
  });

  test('F-014.AC7 a mouse pin does not pull focus into the grid when focus was elsewhere', async ({ page }) => {
    await page.goto('/');
    await input(page).fill('getUserID');
    await expect(copyBtn(page, 'path/case')).toContainText('get/user/id');
    await pinBtn(page, 'path/case').dispatchEvent('click'); // a click that does not move focus (as in Safari)
    await expect(page.locator('.row').first()).toContainText('path/case');
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    expect((await focused(page)).action).toBeNull();
  });
});
