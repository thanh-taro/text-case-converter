// MOD-Engine transforms (F-008 strip symbols, F-009 remove accents). Titles cite the spec.
import { describe, expect, it } from 'vitest';
import { convertAll, removeAccents, toAsciiToken } from '../../src/engine';

describe('RULE-12 removeAccents', () => {
  it('folds Vietnamese and đ (F-009.AC1)', () => expect(removeAccents('Nguyễn Đặng')).toBe('Nguyen Dang'));
  it('ß→ss (F-009.AC3)', () => expect(removeAccents('straße')).toBe('strasse'));
  it('keeps non-Latin and symbols (F-009.AC4)', () => expect(removeAccents('日本 café, v2!')).toBe('日本 cafe, v2!'));
  it('maps ø/æ/œ/ł', () => expect(removeAccents('øæœł ØÆŒŁ')).toBe('oaeoel OAEOEL'));
});

describe('RULE-11 toAsciiToken', () => {
  it('folds then drops non-ASCII-alnum', () => expect(toAsciiToken('café')).toBe('cafe'));
  it('drops non-Latin entirely', () => expect(toAsciiToken('日本')).toBe(''));
  it('keeps digits', () => expect(toAsciiToken('v2')).toBe('v2'));
});

describe('F-009 Remove accents — convertAll', () => {
  it('F-009.AC1 Nguyễn Đặng', () => {
    const r = convertAll('Nguyễn Đặng', { removeAccents: true });
    expect(r.snake).toBe('nguyen_dang');
    expect(r.title).toBe('Nguyen Dang');
    expect(r.camel).toBe('nguyenDang');
  });
  it('F-009.AC2 café, v2! keeps symbols in char-based', () => {
    const r = convertAll('café, v2!', { removeAccents: true });
    expect(r.snake).toBe('cafe_v2');
    expect(r.upper).toBe('CAFE, V2!');
  });
  it('F-009.AC3 straße → strasse', () => {
    expect(convertAll('straße', { removeAccents: true }).lower).toBe('strasse');
  });
  it('F-009.AC4 日本 café', () => {
    expect(convertAll('日本 café', { removeAccents: true }).snake).toBe('日本_cafe');
  });
  it('F-009.AC5 toggling off returns the accented form (same input)', () => {
    expect(convertAll('café').snake).toBe('café');
    expect(convertAll('café', { removeAccents: true }).snake).toBe('cafe');
  });
  it('F-009.AC7 default (off) leaves accents: snake café = café', () => {
    expect(convertAll('café').snake).toBe('café');
  });
});

describe('F-008 Strip symbols — convertAll', () => {
  it('F-008.AC1 café, v2!', () => {
    const r = convertAll('café, v2!', { stripSymbols: true });
    expect(r.snake).toBe('cafe_v2');
    expect(r.kebab).toBe('cafe-v2');
    expect(r.upper).toBe('CAFE V2');
    expect(r.lower).toBe('cafe v2');
  });
  it('F-008.AC2 off keeps accents+punctuation in UPPERCASE', () => {
    expect(convertAll('café, v2!').upper).toBe('CAFÉ, V2!');
  });
  it('F-008.AC3 Nguyễn 日本 → nguyen (CJK dropped)', () => {
    expect(convertAll('Nguyễn 日本', { stripSymbols: true }).snake).toBe('nguyen');
  });
  it('F-008.AC4 toggling off returns the un-stripped form (same input)', () => {
    expect(convertAll('café, v2!', { stripSymbols: true }).snake).toBe('cafe_v2');
    expect(convertAll('café, v2!').snake).toBe('café_v2');
  });
  it('F-008.AC6 symbols-only input → empty', () => {
    const r = convertAll('  !!!  ', { stripSymbols: true });
    for (const v of Object.values(r)) expect(v).toBe('');
  });
  it('F-008.AC7 default (off): UPPERCASE café = CAFÉ', () => {
    expect(convertAll('café').upper).toBe('CAFÉ');
  });
  it('strip governs when both on (edge)', () => {
    const both = convertAll('café, v2!', { stripSymbols: true, removeAccents: true });
    expect(both.upper).toBe('CAFE V2');
  });
  it('INV-03 line count preserved under strip', () => {
    expect(convertAll('a b\n日本\nc', { stripSymbols: true }).snake.split('\n')).toHaveLength(3);
  });
});

describe('INV-02 defaults unchanged (M-1 behavior with no options)', () => {
  it('café, v2! default UPPERCASE keeps everything', () => {
    expect(convertAll('café, v2!').upper).toBe('CAFÉ, V2!');
    expect(convertAll('café, v2!').snake).toBe('café_v2');
  });
});
