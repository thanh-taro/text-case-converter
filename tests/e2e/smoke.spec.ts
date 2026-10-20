// End-to-end smoke (chromium). Titles cite the spec they verify (adapters/tests.md).
import { expect, test } from '@playwright/test';

test('F-005.AC1 opens with the host theme from the address, no light flash', async ({ page }) => {
  await page.goto('/?theme=dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('F-002.AC1 F-002.AC12 shows all eleven cases of getUserID at once', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Text to convert').fill('getUserID');
  const grid = page.getByRole('group', { name: 'Converted cases' });
  await expect(grid.getByRole('button', { name: 'Copy snake_case' })).toContainText('get_user_id');
  await expect(grid.getByRole('button', { name: 'Copy camelCase' })).toContainText('getUserId');
  await expect(grid.getByRole('button', { name: 'Copy CONSTANT_CASE' })).toContainText('GET_USER_ID');
  // F-002.AC12: all eleven shown at once, no target-case picker.
  await expect(grid.getByRole('button', { name: /Copy/ })).toHaveCount(11);
});

test('F-002.AC13 results update live as the input changes', async ({ page }) => {
  await page.goto('/');
  const box = page.getByLabel('Text to convert');
  await box.fill('hello');
  await expect(page.getByRole('button', { name: 'Copy snake_case' })).toContainText('hello');
  await box.fill('hello world');
  await expect(page.getByRole('button', { name: 'Copy snake_case' })).toContainText('hello_world');
});

test('F-003.AC2 F-004.AC3 copying a multi-line result keeps every converted line', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Text to convert').fill('first name\nlast_name\nEmailAddress');
  const snake = page.getByRole('button', { name: 'Copy snake_case' });
  await expect(snake).toContainText('first_name');
  await expect(snake).toContainText('email_address');
  await snake.click();
  await expect(page.locator('.row--copied .row__val')).toHaveText('first_name\nlast_name\nemail_address');
});

test('F-006.AC3 nothing is persisted: reload returns an empty input', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Text to convert').fill('getUserID');
  await page.reload();
  await expect(page.getByLabel('Text to convert')).toHaveValue('');
});

test('F-003.AC1 F-003.AC5 clicking a result copies it, flashes Copied, and announces it', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Text to convert').fill('getUserID');
  await page.getByRole('button', { name: 'Copy snake_case' }).click();
  // The copied flash overlays the row without reflowing the value (CMP-ResultRow).
  await expect(page.locator('.row--copied .row__copied')).toHaveText(/Copied/);
  // The value is still fully present under the overlay (F-003.R1 copies the whole value).
  await expect(page.locator('.row--copied .row__val')).toHaveText('get_user_id');
  // The copy is announced with the case name (F-003.R2, NFR-04).
  await expect(page.locator('[role="status"][aria-live="polite"]')).toHaveText('Copied snake_case');
});

test('F-001.AC2 / F-003.AC4 / RULE-09 clear returns to the empty state', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Text to convert').fill('getUserID');
  await page.getByRole('button', { name: 'Clear' }).click();
  await expect(page.getByLabel('Text to convert')).toHaveValue('');
  // every result row is inert and shows the empty marker
  const snake = page.getByRole('button', { name: /snake_case: No result/ });
  await expect(snake).toBeDisabled();
});

test('F-004.AC1 F-004.AC4 per-line batch + line count', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Text to convert').fill('first name\nlast_name\nEmailAddress');
  await expect(page.getByRole('button', { name: 'Copy camelCase' })).toContainText('firstName');
  await expect(page.getByRole('button', { name: 'Copy camelCase' })).toContainText('emailAddress');
  await expect(page.getByText('3 lines')).toBeVisible();
});

test('F-006.AC2 F-003.AC3 / NFR-01 no network requests of its own after load', async ({ page }) => {
  const external: string[] = [];
  await page.goto('/');
  const origin = new URL(page.url()).origin;
  page.on('request', (r) => {
    if (!r.url().startsWith(origin) && !r.url().startsWith('data:')) external.push(r.url());
  });
  await page.getByLabel('Text to convert').fill('getUserID\nHTTPResponse');
  await page.getByRole('button', { name: 'Copy kebab-case' }).click();
  await page.waitForTimeout(300);
  expect(external).toEqual([]);
  // F-003.AC3 / RULE-14: the only local write is the non-content preferences key — never user text.
  const storage = await page.evaluate(() => ({ ...localStorage }));
  expect(Object.keys(storage)).toEqual(['tcc.prefs']);
  expect(JSON.stringify(storage)).not.toContain('HTTPResponse');
  expect(JSON.stringify(storage)).not.toContain('getUserID');
});

test('F-006.AC1 privacy statement is always visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Private — nothing leaves your browser')).toBeVisible();
});

test('F-006.AC5 source-code link is visible, points to the public source and is keyboard-reachable', async ({
  page,
}) => {
  await page.goto('/');
  const link = page.getByRole('link', { name: 'Source code (opens in a new tab)' });
  await expect(link).toBeVisible();
  await expect(link).toHaveText('Source code');
  await expect(link).toHaveAttribute('href', 'https://github.com/thanh-taro/text-case-converter');
  // CMP-StatusBar / DEP-43: led by the GitHub mark, decorative (the accessible name carries the meaning).
  const mark = link.locator('svg');
  await expect(mark).toBeVisible();
  await expect(mark).toHaveAttribute('aria-hidden', 'true');
  await link.focus();
  await expect(link).toBeFocused();
});

test('F-006.AC6 source link opens a new page, keeps the tool and input, and leaks nothing', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Text to convert').fill('getUserID');
  const link = page.getByRole('link', { name: 'Source code (opens in a new tab)' });
  await expect(link).toHaveAttribute('target', '_blank');
  const rel = (await link.getAttribute('rel')) ?? '';
  expect(rel.split(/\s+/)).toEqual(expect.arrayContaining(['noopener', 'noreferrer']));
  expect(await link.getAttribute('href')).not.toContain('getUserID');
  // Stop the new page at the network so the test stays offline.
  await page.context().route('https://github.com/**', (route) => route.abort());
  const popup = page.context().waitForEvent('page');
  await link.click();
  await popup;
  await expect(page).toHaveURL(/^http:\/\/[^/]+\/(\?.*)?$/);
  await expect(page.getByLabel('Text to convert')).toHaveValue('getUserID');
});
