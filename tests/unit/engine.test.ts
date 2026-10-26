// MOD-Engine corpus + unit tests. Titles cite the spec they verify (adapters/tests.md).
import { describe, expect, it } from 'vitest';
import { convert, convertAll, tokenize, CASE_IDS } from '../../src/engine';

describe('F-002.AC1 getUserID — every case (RULE-01)', () => {
  const r = convertAll('getUserID');
  const expected = {
    camel: 'getUserId',
    pascal: 'GetUserId',
    snake: 'get_user_id',
    kebab: 'get-user-id',
    train: 'Get-User-Id',
    constant: 'GET_USER_ID',
    cobol: 'GET-USER-ID',
    dot: 'get.user.id',
    path: 'get/user/id',
    title: 'Get User Id',
    sentence: 'Get user id',
    upper: 'GETUSERID',
    lower: 'getuserid',
  };
  for (const id of CASE_IDS) it(id, () => expect(r[id]).toBe(expected[id]));
});

describe('F-002 tokenization corpus (acronyms, numbers, delimiters, unicode)', () => {
  const cases: [string, string, Partial<Record<(typeof CASE_IDS)[number], string>>][] = [
    ['F-002.AC2', 'HTTPResponse', { snake: 'http_response', camel: 'httpResponse', pascal: 'HttpResponse' }],
    ['F-002.AC3', 'parseURLToString', { snake: 'parse_url_to_string' }],
    ['F-002.AC4', 'userID2', { snake: 'user_id2' }],
    ['F-002.AC5', 'v2Point5', { snake: 'v2_point5', camel: 'v2Point5' }],
    ['F-002.AC6', 'utf8Decode', { snake: 'utf8_decode', kebab: 'utf8-decode' }],
    [
      'F-002.AC7',
      'already_snake_case',
      { camel: 'alreadySnakeCase', kebab: 'already-snake-case', title: 'Already Snake Case' },
    ],
    [
      'F-002.AC8',
      'Hello, World!',
      { snake: 'hello_world', camel: 'helloWorld', upper: 'HELLO, WORLD!', lower: 'hello, world!' },
    ],
    ['F-002.AC9', 'caféCrème', { snake: 'café_crème', title: 'Café Crème' }],
    ['F-002.AC10', '日本語', { snake: '日本語', camel: '日本語', title: '日本語', upper: '日本語', lower: '日本語' }],
    ['F-002.AC14', 'the lord of the rings', { title: 'The Lord Of The Rings', sentence: 'The lord of the rings' }],
    ['F-002.AC15', 'BIG', { lower: 'big' }], // locale-independent, not Turkish bıg
    ['F-002.AC16', '日Foo', { snake: '日foo', camel: '日foo' }], // single token, no script-change boundary
    ['F-002.edge', 'XMLHTTPRequest', { snake: 'xmlhttp_request', kebab: 'xmlhttp-request' }], // consecutive acronyms (known limit)
    ['F-002.edge', '__foo--bar__', { snake: 'foo_bar', upper: '__FOO--BAR__' }], // leading/trailing/repeated separators
    ['F-002.edge', '2024', { snake: '2024', title: '2024' }], // digit-only
    ['F-002.edge', 'foo', { camel: 'foo', pascal: 'Foo', constant: 'FOO' }], // single token
  ];
  for (const [ac, input, expected] of cases) {
    describe(`${ac} ${JSON.stringify(input)}`, () => {
      const r = convertAll(input);
      for (const [id, value] of Object.entries(expected)) {
        it(id, () => expect(r[id as (typeof CASE_IDS)[number]]).toBe(value));
      }
    });
  }
});

describe('RULE-03 / F-004 per-line batch', () => {
  it('F-004.AC1 converts each line independently to camelCase', () => {
    expect(convert('first name\nlast_name\nEmailAddress', 'camel')).toBe('firstName\nlastName\nemailAddress');
  });
  it('F-004.AC2 preserves blank lines and line count (snake)', () => {
    expect(convert('a\n\nb', 'snake')).toBe('a\n\nb');
  });
  it('F-004.AC7 a line with no word chars is empty for token-based, kept for character-based', () => {
    expect(convert('foo\n---\nbar', 'snake')).toBe('foo\n\nbar');
    expect(convert('foo\n---\nbar', 'upper')).toBe('FOO\n---\nBAR');
  });
  it('F-004.AC6 UPPERCASE preserves the line count and per-line structure', () => {
    expect(convert('alpha\nbeta\ngamma', 'upper')).toBe('ALPHA\nBETA\nGAMMA');
  });
});

describe('F-002.AC11 / RULE-09 empty input', () => {
  it('every case is empty', () => {
    const r = convertAll('');
    for (const id of CASE_IDS) expect(r[id]).toBe('');
  });
});

describe('RULE-02 tokenize', () => {
  it('splits acronyms and attaches digits', () => {
    expect(tokenize('getHTTPResponseCode')).toEqual(['get', 'HTTP', 'Response', 'Code']);
    expect(tokenize('a1b2')).toEqual(['a1b2']);
    expect(tokenize('__a--b__')).toEqual(['a', 'b']);
  });
});
