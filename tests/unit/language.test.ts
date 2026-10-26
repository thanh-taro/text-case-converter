// F-011 use the portal's language (RULE-15, RULE-10, ADR-0013): catalog, formatting, matching,
// resolution, settings messages, the copy generator and the boot script. Titles cite the spec.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CATALOG, LANGUAGES, MESSAGES, formatCount, language, t, type MessageId } from '../../src/copy';
import {
  acceptLanguageMessage,
  acceptThemeMessage,
  LANGUAGE_MESSAGE,
  matchLanguage,
  resolveLanguage,
} from '../../src/host/contract';
import { CASE_IDS } from '../../src/engine';
// @ts-expect-error — plain ESM build script without types
import { parseCopy } from '../../scripts/gen-copy.mjs';
// @ts-expect-error — plain ESM build script without types
import { readBootScript } from '../../scripts/lib/boot.mjs';

const PARENT = { id: 'parent' };
const ORIGINS = ['https://tarokit.app'];
const msg = (data: unknown, over: Partial<{ origin: string; source: unknown }> = {}) => ({
  origin: 'https://tarokit.app',
  source: PARENT,
  data,
  ...over,
});
const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

afterEach(() => {
  language.value = 'en-US';
});

describe('F-011 catalog', () => {
  it('F-011.AC11 every COPY ID has a text in every language with the same placeholders', () => {
    expect(LANGUAGES).toEqual(['en-US', 'vi-VN']);
    const ids = Object.keys(MESSAGES) as MessageId[];
    for (const lang of LANGUAGES) {
      expect(Object.keys(CATALOG[lang]).sort()).toEqual([...ids].sort());
      for (const id of ids) {
        expect(CATALOG[lang][id], `${lang} ${id}`).toBeTruthy();
        expect(placeholders(CATALOG[lang][id])).toEqual(placeholders(MESSAGES[id]));
      }
    }
  });

  it('F-011.AC11 the generator refuses a missing translation or mismatched placeholders', () => {
    const head = '| ID | en-US | vi-VN | Notes |\n| -- | -- | -- | -- |\n';
    expect(() => parseCopy(head + '| **COPY-a.b** | Copy {case} |  | |\n')).toThrow(/no vi-VN text/);
    expect(() => parseCopy(head + '| **COPY-a.b** | Copy {case} | Sao chép | |\n')).toThrow(/placeholders differ/);
    expect(parseCopy(head + '| **COPY-a.b** | Old | Cũ | deprecated |\n| **COPY-a.c** | X | Y | |\n')).toEqual({
      languages: ['en-US', 'vi-VN'],
      rows: [{ id: 'a.c', texts: { 'en-US': 'X', 'vi-VN': 'Y' }, params: [] }],
    });
  });

  it('F-011.AC1 t() returns the vi-VN text when the active language is vi-VN', () => {
    language.value = 'vi-VN';
    expect(t('label.input')).toBe('Văn bản cần chuyển đổi');
    expect(t('status.copied', { case: 'snake_case' })).toBe('Đã sao chép snake_case');
    language.value = 'en-US';
    expect(t('label.input')).toBe('Text to convert');
  });

  it('F-011.AC7 case labels are identical in every language (RULE-15)', () => {
    for (const id of CASE_IDS) {
      const key = `case.${id}` as MessageId;
      expect(CATALOG['vi-VN'][key]).toBe(CATALOG['en-US'][key]);
    }
  });

  it('F-011.AC8 counts use the active language digit grouping', () => {
    language.value = 'vi-VN';
    expect(t('status.lines', { n: formatCount(1234) })).toBe('1.234 dòng');
    language.value = 'en-US';
    expect(t('status.lines', { n: formatCount(1234) })).toBe('1,234 lines');
  });
});

describe('RULE-15 matchLanguage', () => {
  it('F-011 edge cases: exact ignoring case, else same primary language, else unsupported', () => {
    expect(matchLanguage('vi-VN')).toBe('vi-VN');
    expect(matchLanguage('vi-vn')).toBe('vi-VN');
    expect(matchLanguage('vi')).toBe('vi-VN');
    expect(matchLanguage('en-US')).toBe('en-US');
    expect(matchLanguage('en-GB')).toBe('en-US');
    expect(matchLanguage('fr-FR')).toBeNull();
    expect(matchLanguage('')).toBeNull();
    expect(matchLanguage(null)).toBeNull();
    expect(matchLanguage(42)).toBeNull();
  });
});

describe('RULE-15 resolveLanguage', () => {
  it('F-011.AC1/AC2 a supported address value wins over the browser', () => {
    expect(resolveLanguage({ message: null, address: 'vi-VN', browser: ['en-US'] })).toBe('vi-VN');
    expect(resolveLanguage({ message: null, address: 'en-US', browser: ['vi'] })).toBe('en-US');
  });
  it('F-011.AC3 the latest accepted host message wins over the address', () => {
    expect(resolveLanguage({ message: 'en-US', address: 'vi-VN', browser: [] })).toBe('en-US');
  });
  it('F-011.AC5 no address: first matching browser preference, else en-US', () => {
    const r = (browser: string[]) => resolveLanguage({ message: null, address: null, browser });
    expect(r(['vi'])).toBe('vi-VN');
    expect(r(['fr-FR', 'vi'])).toBe('vi-VN');
    expect(r(['fr-FR', 'en-GB', 'vi'])).toBe('en-US');
    expect(r(['fr-FR'])).toBe('en-US');
    expect(r([])).toBe('en-US');
  });
  it('F-011.AC6 an unsupported address value counts as absent', () => {
    expect(resolveLanguage({ message: null, address: 'fr-FR', browser: ['vi-VN'] })).toBe('vi-VN');
    expect(resolveLanguage({ message: null, address: 'fr-FR', browser: ['de'] })).toBe('en-US');
  });
});

describe('RULE-10 language settings messages', () => {
  it('F-011.AC3 accepts a supported language from the allowed parent', () => {
    expect(acceptLanguageMessage(msg({ type: LANGUAGE_MESSAGE, value: 'en-US' }), ORIGINS, PARENT)).toBe('en-US');
    expect(acceptLanguageMessage(msg({ type: LANGUAGE_MESSAGE, value: 'vi' }), ORIGINS, PARENT)).toBe('vi-VN');
  });
  it('F-011.AC4 ignores other origins, other sources and unsupported values', () => {
    const data = { type: LANGUAGE_MESSAGE, value: 'en-US' };
    expect(acceptLanguageMessage(msg(data, { origin: 'https://evil.example' }), ORIGINS, PARENT)).toBeNull();
    expect(acceptLanguageMessage(msg(data, { source: { id: 'sibling' } }), ORIGINS, PARENT)).toBeNull();
    expect(acceptLanguageMessage(msg(data, { source: null }), ORIGINS, PARENT)).toBeNull();
    expect(acceptLanguageMessage(msg({ type: LANGUAGE_MESSAGE, value: 'fr-FR' }), ORIGINS, PARENT)).toBeNull();
    expect(acceptLanguageMessage(msg('taro:language'), ORIGINS, PARENT)).toBeNull();
  });
  it('F-011 edge case: theme and language messages are independent', () => {
    const lang = msg({ type: LANGUAGE_MESSAGE, value: 'vi-VN' });
    const theme = msg({ type: 'taro:theme', value: 'dark' });
    expect(acceptThemeMessage(lang, ORIGINS, PARENT)).toBeNull();
    expect(acceptLanguageMessage(theme, ORIGINS, PARENT)).toBeNull();
    expect(acceptThemeMessage(theme, ORIGINS, PARENT)).toBe('dark');
  });
});

describe('F-011 boot script (page language before first paint)', () => {
  /** Runs the inlined boot script against a fake page and returns the attributes it set. */
  function boot(search: string, languages: string[]): Record<string, string> {
    const attrs: Record<string, string> = {};
    const fakeDocument = { documentElement: { setAttribute: (k: string, v: string) => (attrs[k] = v) } };
    const run = new Function('location', 'navigator', 'document', 'matchMedia', readBootScript() as string);
    run({ search }, { languages, language: languages[0] }, fakeDocument, () => ({ matches: false }));
    return attrs;
  }
  it('F-011.AC1/AC2 sets the page language from the address', () => {
    expect(boot('?lang=vi-VN', ['en-US']).lang).toBe('vi-VN');
    expect(boot('?theme=dark&lang=en-US', ['vi']).lang).toBe('en-US');
  });
  it('F-011.AC5/AC6 falls back to the browser preferences, then en-US, like resolveLanguage', () => {
    const cases: [string, string[]][] = [
      ['', ['fr-FR', 'vi']],
      ['?lang=fr-FR', ['vi-VN']],
      ['?lang=vi-vn', []],
      ['', ['fr-FR', 'en-GB', 'vi']],
      ['', ['de']],
    ];
    for (const [search, browser] of cases) {
      const address = new URLSearchParams(search).get('lang');
      expect(boot(search, browser).lang).toBe(resolveLanguage({ message: null, address, browser }));
    }
  });
  it('F-011.AC11 the boot script supports exactly the catalog languages', () => {
    for (const l of LANGUAGES) expect(boot(`?lang=${l}`, []).lang).toBe(l);
    expect(boot('', []).lang).toBe(LANGUAGES[0]);
  });
  it('F-011 boot script keeps the theme behaviour (F-005.R1)', () => {
    expect(boot('?theme=light&lang=vi-VN', [])['data-theme']).toBe('light');
  });
});

describe('F-011 runtime language controller (src/host/language.ts)', () => {
  it('F-011.AC1/AC3 sets the language, page language and title at start and on a host message', async () => {
    const attrs: Record<string, string> = {};
    const fakeDocument = {
      title: '',
      documentElement: {
        getAttribute: (k: string) => attrs[k] ?? null,
        setAttribute: (k: string, v: string) => (attrs[k] = v),
      },
    };
    vi.stubGlobal('location', { search: '?lang=vi-VN' });
    vi.stubGlobal('navigator', { languages: ['en-US'], language: 'en-US' });
    vi.stubGlobal('document', fakeDocument);
    try {
      const { setHostLanguage } = await import('../../src/host/language');
      expect(language.value).toBe('vi-VN');
      expect(attrs.lang).toBe('vi-VN');
      expect(fakeDocument.title).toBe(CATALOG['vi-VN']['app.title']);
      setHostLanguage('en-US');
      expect(language.value).toBe('en-US');
      expect(attrs.lang).toBe('en-US');
      expect(fakeDocument.title).toBe(CATALOG['en-US']['app.title']);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
