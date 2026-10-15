// MOD-Host offline policy (F-007, NFR-01, PRN-01). Titles cite the spec (adapters/tests.md).
import { describe, expect, it } from 'vitest';
import { cacheKey, isAssetPath, routeOf, seedPlan, CACHE_PREFIX } from '../../src/host/offline-policy';

const O = 'https://text-case-converter.tarokit.app';

describe('F-007.R2 only the tool’s own files are storable (PRN-01)', () => {
  it('maps the page and hashed assets to keys, rejects everything else', () => {
    expect(cacheKey(new URL(`${O}/`), O)).toBe(`${O}/`);
    expect(cacheKey(new URL(`${O}/assets/index-abc.js`), O)).toBe(`${O}/assets/index-abc.js`);
    expect(cacheKey(new URL(`${O}/secret.txt`), O)).toBeNull();
    expect(cacheKey(new URL('https://evil.example/assets/x.js'), O)).toBeNull();
    expect(cacheKey(new URL(`${O}/assets/x.js?token=1`), O)).toBeNull();
  });
  it('isAssetPath rejects traversal', () => {
    expect(isAssetPath('/assets/a.js')).toBe(true);
    expect(isAssetPath('/assets/../x')).toBe(false);
  });
  it('seedPlan drops off-allow-list urls', () => {
    const plan = seedPlan(
      { type: 'seed', urls: [`${O}/`, `${O}/assets/a.js`, 'data:text/js,x', 'https://evil/x.js'] },
      O,
    );
    expect(plan.page?.key).toBe(`${O}/`);
    expect(plan.assets.map((a) => a.key)).toEqual([`${O}/assets/a.js`]);
  });
});

describe('F-007 routing', () => {
  it('navigations to the page are page-routed; asset GETs asset-routed; others ignored', () => {
    expect(routeOf({ method: 'GET', url: `${O}/`, mode: 'navigate' }, O)).toBe('page');
    expect(routeOf({ method: 'GET', url: `${O}/assets/a.js`, mode: 'cors' }, O)).toBe('asset');
    expect(routeOf({ method: 'POST', url: `${O}/`, mode: 'navigate' }, O)).toBeNull();
  });
  it('cache prefix is the tool’s own', () => expect(CACHE_PREFIX).toBe('text-case-converter-'));
});
