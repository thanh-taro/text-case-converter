// MOD-Prefs validation (RULE-14, ENT-Preferences). Titles cite the spec (adapters/tests.md).
import { describe, expect, it } from 'vitest';
import { coercePrefs, DEFAULTS } from '../../src/prefs';

describe('F-013 Keep acronyms preference', () => {
  it('F-013.AC7 defaults to off on a new device', () => {
    expect(DEFAULTS.keepAcronyms).toBe(false);
    expect(coercePrefs(undefined).keepAcronyms).toBe(false);
  });
  it('F-013.AC8 a remembered value is restored', () => {
    expect(coercePrefs({ keepAcronyms: true }).keepAcronyms).toBe(true);
  });
  it('F-013.AC12 pre-M-3 preferences keep every stored field and default the new one', () => {
    const v120 = {
      stripSymbols: false,
      removeAccents: true,
      sortMode: 'recent',
      pinned: ['snake', 'bogus'],
      recent: ['kebab', 'camel'],
    };
    expect(coercePrefs(v120)).toEqual({
      stripSymbols: false,
      removeAccents: true,
      keepAcronyms: false,
      sortMode: 'recent',
      pinned: ['snake'], // unknown id dropped on its own
      recent: ['kebab', 'camel'],
    });
  });
  it('F-015 edge case: the new case ids are valid in pins and recent order', () => {
    expect(coercePrefs({ pinned: ['train', 'cobol'] }).pinned).toEqual(['train', 'cobol']);
  });
});
