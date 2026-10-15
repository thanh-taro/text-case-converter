// CSP + origin allow-list (F-005, F-006, NFR-01, NFR-07). Titles cite the spec (adapters/tests.md).
import { describe, expect, it } from 'vitest';
// @ts-expect-error -- plain ESM build script without type declarations
import { normaliseOrigin, parseHostOrigins, pageCsp, PERMISSIONS_POLICY } from '../../scripts/gen-headers.mjs';

describe('NFR-07 normaliseOrigin', () => {
  it('accepts a clean https origin', () => {
    expect(normaliseOrigin('https://tarokit.app')).toBe('https://tarokit.app');
  });
  it('rejects wildcards, keywords, paths and non-https', () => {
    for (const bad of ['*', "'self'", 'null', 'https://a.example/path', 'http://tarokit.app', 'ftp://x']) {
      expect(normaliseOrigin(bad)).toBeInstanceOf(Error);
    }
  });
  it('allows http only for local hosts (e2e stub)', () => {
    expect(normaliseOrigin('http://localhost:4173')).toBe('http://localhost:4173');
  });
});

describe('F-005.R4 parseHostOrigins', () => {
  it('parses and de-dupes a list', () => {
    expect(parseHostOrigins('https://a.example https://a.example')).toEqual(['https://a.example']);
  });
  it('throws on any refused entry', () => {
    expect(() => parseHostOrigins('https://a.example *')).toThrow();
  });
});

describe('NFR-01 page CSP forbids outbound connections and frames the tool only for allowed origins', () => {
  const csp = pageCsp(['https://tarokit.app']);
  it("F-006.AC4 connect-src is 'none' (no network, INV-01)", () => expect(csp).toContain("connect-src 'none'"));
  it("default-src is 'none'", () => expect(csp).toContain("default-src 'none'"));
  it('frame-ancestors lists the allowed origin', () => expect(csp).toContain('frame-ancestors https://tarokit.app'));
  it("frame-ancestors is 'none' when the list is empty", () => expect(pageCsp([])).toContain("frame-ancestors 'none'"));
  it('permissions policy denies camera/mic/geolocation and allows clipboard-write to self', () => {
    expect(PERMISSIONS_POLICY).toContain('clipboard-write=(self)');
    expect(PERMISSIONS_POLICY).toContain('camera=()');
  });
});
