// M-3 engine: Train-Case + COBOL-CASE (F-015, RULE-01), keep acronyms (F-013, RULE-16), input match
// (F-012, RULE-17). Titles cite the spec (adapters/tests.md).
import { describe, expect, it } from 'vitest';
import { CASE_IDS, convertAll, matchingCases, type CaseId, type ConvertOptions } from '../../src/engine';

/** The shipped defaults (ENT-Preferences): Strip and Accents on, Keep acronyms off. */
const DEFAULTS: ConvertOptions = { stripSymbols: true, removeAccents: true, keepAcronyms: false };
const KEEP: ConvertOptions = { ...DEFAULTS, keepAcronyms: true };
const match = (input: string, opts: ConvertOptions = DEFAULTS) => matchingCases(input, convertAll(input, opts));

describe('F-015 Train-Case and COBOL-CASE (RULE-01)', () => {
  it('F-015.AC1 content type → Content-Type / CONTENT-TYPE', () => {
    const r = convertAll('content type', DEFAULTS);
    expect(r.train).toBe('Content-Type');
    expect(r.cobol).toBe('CONTENT-TYPE');
  });
  it('F-015.AC2 getHTTPResponse2, keep acronyms off and on', () => {
    const r = convertAll('getHTTPResponse2', DEFAULTS);
    expect(r.train).toBe('Get-Http-Response2');
    expect(r.cobol).toBe('GET-HTTP-RESPONSE2');
    expect(convertAll('getHTTPResponse2', KEEP).train).toBe('Get-HTTP-Response2');
  });
  it('F-015.AC3 per line', () => {
    expect(convertAll('first name\nlast name', DEFAULTS).train).toBe('First-Name\nLast-Name');
  });
  it('F-015.AC5 default order (RULE-01)', () => {
    expect(CASE_IDS).toEqual([
      'camel',
      'pascal',
      'snake',
      'kebab',
      'train',
      'constant',
      'cobol',
      'dot',
      'path',
      'title',
      'sentence',
      'upper',
      'lower',
    ]);
  });
  it('F-015 both kinds honour strip symbols and remove accents (R3)', () => {
    const r = convertAll('café, v2!', DEFAULTS);
    expect(r.train).toBe('Cafe-V2');
    expect(r.cobol).toBe('CAFE-V2');
    expect(convertAll('', DEFAULTS).train).toBe('');
  });
});

describe('F-013 Keep acronyms (RULE-16)', () => {
  it('F-013.AC1 getUserID', () => {
    const r = convertAll('getUserID', KEEP);
    expect([r.camel, r.pascal, r.train, r.title, r.snake]).toEqual([
      'getUserID',
      'GetUserID',
      'Get-User-ID',
      'Get User ID',
      'get_user_id',
    ]);
  });
  it('F-013.AC2 parseHTTPResponse — Sentence case and camelCase', () => {
    const r = convertAll('parseHTTPResponse', KEEP);
    expect(r.sentence).toBe('Parse HTTP response');
    expect(r.camel).toBe('parseHTTPResponse');
  });
  it('F-013.AC3 URLParser — the first camelCase token is lowercased', () => {
    const r = convertAll('URLParser', KEEP);
    expect(r.camel).toBe('urlParser');
    expect(r.pascal).toBe('URLParser');
  });
  it('F-013.AC4 USER_ID (all caps) behaves as if off', () => {
    const r = convertAll('USER_ID', KEEP);
    expect(r.camel).toBe('userId');
    expect(r.pascal).toBe('UserId');
  });
  it('F-013.AC5 digits: utf8 is not an acronym as written, ID2 is', () => {
    expect(convertAll('utf8Encoder ID2', KEEP).pascal).toBe('Utf8EncoderID2');
  });
  it('F-013.AC9 after strip symbols and remove accents', () => {
    expect(convertAll('Café ID', KEEP).pascal).toBe('CafeID');
  });
  it('F-013.AC11 all-caps lines with digits or a lone acronym behave as if off', () => {
    const r = convertAll('MAX_RETRIES_3', KEEP);
    expect(r.camel).toBe('maxRetries3');
    expect(r.pascal).toBe('MaxRetries3');
    expect(convertAll('URL', KEEP).pascal).toBe('Url');
  });
  it('F-013.R4 uniform kinds are identical on and off', () => {
    const uniform: CaseId[] = ['snake', 'kebab', 'dot', 'path', 'constant', 'cobol', 'upper', 'lower'];
    for (const input of ['getUserID', 'parseHTTPResponse2 ID', 'a B cD']) {
      const off = convertAll(input, DEFAULTS);
      const on = convertAll(input, KEEP);
      for (const id of uniform) expect(on[id], `${input} ${id}`).toBe(off[id]);
    }
  });
  it('F-013.AC10 / F-013.R6 keep acronyms off = pre-M-3 results (spot check of the corpus)', () => {
    const r = convertAll('getUserID', { keepAcronyms: false });
    expect([r.camel, r.pascal, r.title, r.sentence]).toEqual(['getUserId', 'GetUserId', 'Get User Id', 'Get user id']);
    expect(convertAll('getUserID').camel).toBe('getUserId'); // default options unchanged
  });
  it('F-013 edge cases: one capital is never an acronym; non-cased tokens pass through', () => {
    expect(convertAll('aB xA', KEEP)).toEqual(convertAll('aB xA', DEFAULTS));
    expect(convertAll('日本 ID x', { keepAcronyms: true }).pascal).toBe('日本IDX');
  });
});

describe('F-012 input match (RULE-17)', () => {
  it('F-012.AC1 get_user_id matches snake_case only (Strip symbols on)', () => {
    expect(match('get_user_id')).toEqual(['snake']);
  });
  it('F-012.AC2 user matches six kinds', () => {
    expect(match('user').sort()).toEqual(['camel', 'dot', 'kebab', 'lower', 'path', 'snake']);
  });
  it('F-012.AC3 Hello there, World! matches nothing with Strip on', () => {
    expect(match('Hello there, World!')).toEqual([]);
  });
  it('F-012.AC4 getUserID matches camelCase only with Keep acronyms on', () => {
    expect(match('getUserID')).toEqual([]);
    expect(match('getUserID', KEEP)).toEqual(['camel']);
  });
  it('F-012.AC6 empty input matches nothing', () => {
    expect(match('')).toEqual([]);
  });
  it('F-012.AC7 every line must match', () => {
    expect(match('first_name\nlast_name')).toEqual(['snake']);
    expect(match('first_name\nlastName')).toEqual([]);
  });
  it('F-012.AC11 a trailing line break keeps the match', () => {
    expect(match('user\n')).toContain('snake');
  });
  it('F-012 edge cases: Strip off adds lowercase; digits match every kind', () => {
    expect(match('get_user_id', { stripSymbols: false }).sort()).toEqual(['lower', 'snake']);
    expect(match('123')).toHaveLength(CASE_IDS.length);
  });
  it('F-015.AC4 Content-Type matches Train-Case', () => {
    expect(match('Content-Type')).toEqual(['train']);
  });
});
