// Automated accessibility audit on the running app (NFR-04, WCAG 2.2 AA), axe-core. Chromium is
// the audit engine; manual screen-reader and keyboard passes are tracked in the matrix.
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.skip(({ browserName }) => browserName !== 'chromium', 'axe audit on Chromium');

const scan = (page: import('@playwright/test').Page) =>
  new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();

for (const theme of ['dark', 'light'] as const) {
  test(`NFR-04 no axe violations — default, ${theme}`, async ({ page }) => {
    await page.goto(`/?theme=${theme}`);
    await page.getByLabel('Text to convert').fill('getUserID\nHTTPResponse');
    await expect(page.getByRole('button', { name: 'Copy snake_case' })).toContainText('get_user_id');
    const results = await scan(page);
    expect(results.violations).toEqual([]);
  });

  test(`NFR-04 no axe violations — empty, ${theme}`, async ({ page }) => {
    await page.goto(`/?theme=${theme}`);
    const results = await scan(page);
    expect(results.violations).toEqual([]);
  });
}
