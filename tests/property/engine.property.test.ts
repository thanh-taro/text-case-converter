// MOD-Engine property tests (INV-02, INV-03, RULE-05). Titles cite the spec (adapters/tests.md).
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { convert, convertAll, CASE_IDS, TOKEN_BASED } from '../../src/engine';

const anyText = fc.string({ maxLength: 200 });
// Full Unicode strings, built from code points (version-robust across fast-check releases).
const codePoint = fc
  .integer({ min: 0, max: 0x10ffff })
  .filter((c) => c < 0xd800 || c > 0xdfff)
  .map((c) => String.fromCodePoint(c));
const unicodeText = fc.array(codePoint, { maxLength: 120 }).map((a) => a.join(''));

describe('engine properties', () => {
  it('INV-02 conversion is deterministic', () => {
    fc.assert(
      fc.property(anyText, (s) => {
        expect(convertAll(s)).toEqual(convertAll(s));
      }),
    );
  });

  it('INV-03 token-based kinds preserve the line count', () => {
    fc.assert(
      fc.property(anyText, (s) => {
        const lines = s.split('\n').length;
        for (const id of CASE_IDS) {
          if (TOKEN_BASED.has(id)) expect(convert(s, id).split('\n').length).toBe(lines);
        }
      }),
    );
  });

  it('RULE-01b upper/lower are idempotent and preserve length structure', () => {
    fc.assert(
      fc.property(anyText, (s) => {
        expect(convert(convert(s, 'lower'), 'lower')).toBe(convert(s, 'lower'));
        expect(convert(convert(s, 'upper'), 'upper')).toBe(convert(s, 'upper'));
        // character-based kinds keep every line break in place
        expect(convert(s, 'upper').split('\n').length).toBe(s.split('\n').length);
      }),
    );
  });

  it('RULE-05 never throws on arbitrary unicode (full code-point range)', () => {
    fc.assert(
      fc.property(unicodeText, (s) => {
        for (const id of CASE_IDS) expect(() => convert(s, id)).not.toThrow();
      }),
    );
  });
});
