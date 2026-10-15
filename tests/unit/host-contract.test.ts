// MOD-Host contract (F-005, RULE-10, NFR-07). Titles cite the spec (adapters/tests.md).
import { describe, expect, it } from 'vitest';
import {
  acceptThemeMessage,
  parseTheme,
  readyMessage,
  readyTargets,
  resolveTheme,
  THEME_MESSAGE,
  READY_MESSAGE,
} from '../../src/host/contract';

const PARENT = { id: 'parent' };
const ORIGINS = ['https://tarokit.app'];
const msg = (over: Partial<{ origin: string; source: unknown; data: unknown }>) => ({
  origin: 'https://tarokit.app',
  source: PARENT,
  data: { type: THEME_MESSAGE, value: 'dark' },
  ...over,
});

describe('RULE-10 parseTheme', () => {
  it('accepts light/dark, rejects anything else', () => {
    expect(parseTheme('light')).toBe('light');
    expect(parseTheme('dark')).toBe('dark');
    expect(parseTheme('neon')).toBeNull();
    expect(parseTheme(null)).toBeNull();
  });
});

describe('F-005.AC5 acceptThemeMessage', () => {
  it('accepts a valid message from an allowed origin and the parent', () => {
    expect(acceptThemeMessage(msg({}), ORIGINS, PARENT)).toBe('dark');
  });
  it('F-005.AC5 ignores a message from a non-allowed origin', () => {
    expect(acceptThemeMessage(msg({ origin: 'https://evil.example' }), ORIGINS, PARENT)).toBeNull();
  });
  it('ignores a message not from the parent window', () => {
    expect(acceptThemeMessage(msg({ source: { id: 'other' } }), ORIGINS, PARENT)).toBeNull();
  });
  it('ignores a wrong message type or value (RULE-10)', () => {
    expect(acceptThemeMessage(msg({ data: { type: 'x', value: 'dark' } }), ORIGINS, PARENT)).toBeNull();
    expect(acceptThemeMessage(msg({ data: { type: THEME_MESSAGE, value: 'neon' } }), ORIGINS, PARENT)).toBeNull();
  });
});

describe('F-005.R1 / R2 resolveTheme precedence', () => {
  it('message > address > device', () => {
    expect(resolveTheme({ message: 'light', address: 'dark', device: 'dark' })).toBe('light');
    expect(resolveTheme({ message: null, address: 'dark', device: 'light' })).toBe('dark');
    expect(resolveTheme({ message: null, address: null, device: 'light' })).toBe('light');
  });
});

describe('F-005.AC6 ready signal', () => {
  it('is only the ready type, with no content (INV-01)', () => {
    expect(readyMessage()).toEqual({ type: READY_MESSAGE });
  });
  it('targets the referrer origin when allowed, else all allowed (never *)', () => {
    expect(readyTargets('https://tarokit.app/tools', ORIGINS)).toEqual(['https://tarokit.app']);
    expect(readyTargets('', ORIGINS)).toEqual(ORIGINS);
    expect(readyTargets('https://other.example/', ORIGINS)).toEqual(ORIGINS);
  });
});
