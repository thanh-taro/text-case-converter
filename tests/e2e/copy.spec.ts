// Copy uses the current input, even before the results settle (F-003.R6, RULE-07, RULE-08).
import { expect, test } from '@playwright/test';

test('F-003.AC7 copying before the results settle copies the result for the current input', async ({
  page,
  browserName,
}) => {
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
  await page.getByLabel('Text to convert').fill('user');
  await expect(page.locator('#tcc-val-snake')).toHaveText('user');
  // Type and copy in the same task, well inside the settle delay.
  await page.evaluate(() => {
    const ta = document.querySelector('textarea')!;
    ta.value = 'user id';
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector<HTMLButtonElement>('button[data-case="snake"][data-action="copy"]')!.click();
  });
  await expect(page.locator('[role="status"][aria-live="polite"]')).toHaveText('Copied snake_case');
  expect(await page.evaluate(() => (window as unknown as { __copied: string[] }).__copied)).toEqual(['user_id']);
  await expect(page.locator('#tcc-val-snake')).toHaveText('user_id');
});
