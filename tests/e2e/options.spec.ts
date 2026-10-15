// M-2 options & ordering e2e (F-008 strip, F-009 accents, F-010 sort/pin/badge). Titles cite ACs.
import { test, expect } from '@playwright/test';

const strip = (p: import('@playwright/test').Page) => p.getByRole('switch', { name: 'Strip symbols' });
const accents = (p: import('@playwright/test').Page) => p.getByRole('switch', { name: 'Remove accents' });
const snakeVal = (p: import('@playwright/test').Page) => p.getByRole('button', { name: 'Copy snake_case' });

test('F-008.AC1 F-008.AC7 strip on by default → cafe_v2 / CAFE V2; toggling off keeps symbols', async ({ page }) => {
  await page.goto('/');
  await expect(strip(page)).toHaveAttribute('aria-checked', 'true'); // AC7: default ON
  await page.getByLabel('Text to convert').fill('café, v2!');
  await expect(snakeVal(page)).toContainText('cafe_v2');
  await expect(page.getByRole('button', { name: 'Copy UPPERCASE' })).toContainText('CAFE V2');
  await strip(page).click(); // off; accents still on → symbols come back in UPPERCASE
  await expect(page.getByRole('button', { name: 'Copy UPPERCASE' })).toContainText('CAFE, V2!');
});

test('F-009.AC1 F-009.AC2 F-009.AC7 remove accents on by default; keeps symbols when strip is off', async ({
  page,
}) => {
  await page.goto('/');
  await expect(accents(page)).toHaveAttribute('aria-checked', 'true'); // AC7: default ON
  await strip(page).click(); // strip off so accents-only behavior (keep symbols) is visible
  await page.getByLabel('Text to convert').fill('Nguyễn Đặng');
  await expect(snakeVal(page)).toContainText('nguyen_dang');
  await page.getByLabel('Text to convert').fill('café, v2!');
  await expect(page.getByRole('button', { name: 'Copy UPPERCASE' })).toContainText('CAFE, V2!');
});

test('F-008.AC5 strip state persists across reload (RULE-14)', async ({ page }) => {
  await page.goto('/');
  await strip(page).click(); // ON (default) → OFF
  await expect(strip(page)).toHaveAttribute('aria-checked', 'false');
  await page.reload();
  await expect(strip(page)).toHaveAttribute('aria-checked', 'false'); // remembered
});

test('F-009.AC6 remove-accents state persists across reload (RULE-14)', async ({ page }) => {
  await page.goto('/');
  await accents(page).click(); // ON (default) → OFF
  await expect(accents(page)).toHaveAttribute('aria-checked', 'false');
  await page.reload();
  await expect(accents(page)).toHaveAttribute('aria-checked', 'false'); // remembered
});

test('F-010.AC6 sorting never changes a result’s text', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Text to convert').fill('getUserID');
  await expect(snakeVal(page)).toContainText('get_user_id');
  await page.getByLabel('Sort').selectOption('alphabetical');
  await expect(snakeVal(page)).toContainText('get_user_id'); // unchanged after reorder
  await expect(page.getByRole('button', { name: /Copy / })).toHaveCount(11); // all eleven still present
});

test('F-010.AC1 alphabetical sort order', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Text to convert').fill('getUserID');
  await page.getByLabel('Sort').selectOption('alphabetical');
  const labels = await page.locator('.row__label').allInnerTexts();
  const names = labels.map((l) => l.replace(/Last used/i, '').trim());
  expect(names).toEqual([
    'camelCase',
    'CONSTANT_CASE',
    'dot.case',
    'kebab-case',
    'lowercase',
    'PascalCase',
    'path/case',
    'Sentence case',
    'snake_case',
    'Title Case',
    'UPPERCASE',
  ]);
});

test('F-010.AC2 F-010.AC3 F-010.AC4 recent sort + last-used badge moves, restored after reload', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Text to convert').fill('getUserID');
  await page.getByLabel('Sort').selectOption('recent');
  await page.getByRole('button', { name: 'Copy snake_case' }).click();
  await page.getByRole('button', { name: 'Copy kebab-case' }).click();
  // kebab is now first, snake second (F-010.AC2)
  const first = page.locator('.row').first();
  await expect(first).toContainText('kebab-case');
  // last-used badge is on kebab-case only (F-010.AC3/AC4)
  await expect(page.locator('.row__badge')).toHaveCount(1);
  await expect(first.locator('.row__badge')).toBeVisible();
  // restored after reload (F-010.AC7 / RULE-14)
  await page.reload();
  await expect(page.locator('.row').first()).toContainText('kebab-case');
  await expect(page.locator('.row').first().locator('.row__badge')).toBeVisible();
});

test('F-010.AC5 pin floats a case to the top', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Text to convert').fill('getUserID');
  await page.getByRole('button', { name: 'Pin path/case' }).click();
  await expect(page.locator('.row').first()).toContainText('path/case');
});

test('F-008.AC8 storage-unavailable fallback: defaults, session-only', async ({ page, context }) => {
  // Make localStorage throw (RULE-14 fallback).
  await context.addInitScript(() => {
    const block = () => {
      throw new Error('blocked');
    };
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        return { getItem: block, setItem: block, removeItem: block };
      },
    });
  });
  await page.goto('/');
  // starts with defaults (strip ON) and still works, session-only
  await expect(strip(page)).toHaveAttribute('aria-checked', 'true');
  await page.getByLabel('Text to convert').fill('café, v2!');
  await expect(snakeVal(page)).toContainText('cafe_v2');
  await strip(page).click(); // turn off this session
  await expect(strip(page)).toHaveAttribute('aria-checked', 'false');
  await page.reload();
  await expect(strip(page)).toHaveAttribute('aria-checked', 'true'); // not persisted (storage blocked) → back to default
});
