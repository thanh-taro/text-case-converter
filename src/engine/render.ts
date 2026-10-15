// MOD-Engine — case renderers (pure, zero-dependency).
// Implements: RULE-01 (token-based kinds), RULE-01b (character-based), RULE-04 (Title/Sentence),
// RULE-05 (locale-independent casing), RULE-06 (acronym normalization).
import { tokenize } from './tokenize';

/** Lowercase every letter (locale-independent, RULE-05). */
const lower = (s: string): string => s.toLowerCase();
/** Uppercase every letter (locale-independent, RULE-05). */
const upper = (s: string): string => s.toUpperCase();

/**
 * First cased letter uppercased, every other letter lowercased, caseless characters unchanged
 * (RULE-01 word form, RULE-06 acronym normalization: `ID` → `Id`). The first cased letter need
 * not be at index 0 (e.g. a leading caseless character).
 */
function capitalize(token: string): string {
  const chars = [...token.toLowerCase()];
  for (let i = 0; i < chars.length; i++) {
    const up = chars[i]!.toUpperCase();
    if (up !== chars[i]!) {
      chars[i] = up;
      break;
    }
  }
  return chars.join('');
}

/** All nine token-based case kinds for one already-tokenized line. */
function renderTokens(tokens: readonly string[]): Record<string, string> {
  return {
    camel: tokens.map((t, i) => (i === 0 ? lower(t) : capitalize(t))).join(''),
    pascal: tokens.map(capitalize).join(''),
    snake: tokens.map(lower).join('_'),
    kebab: tokens.map(lower).join('-'),
    constant: tokens.map(upper).join('_'),
    dot: tokens.map(lower).join('.'),
    path: tokens.map(lower).join('/'),
    title: tokens.map(capitalize).join(' '),
    sentence: tokens.map((t, i) => (i === 0 ? capitalize(t) : lower(t))).join(' '),
  };
}

/** The eleven case-kind ids, in display order (RULE-01). */
export const CASE_IDS = [
  'camel',
  'pascal',
  'snake',
  'kebab',
  'constant',
  'dot',
  'path',
  'title',
  'sentence',
  'upper',
  'lower',
] as const;

export type CaseId = (typeof CASE_IDS)[number];

/** Which kinds tokenize (RULE-01) versus fold characters directly (RULE-01b). */
export const TOKEN_BASED: ReadonlySet<CaseId> = new Set<CaseId>([
  'camel',
  'pascal',
  'snake',
  'kebab',
  'constant',
  'dot',
  'path',
  'title',
  'sentence',
]);

/**
 * Convert the whole input to one case kind, line by line (RULE-03). Token-based kinds tokenize
 * each line; the two character-based kinds (RULE-01b) fold the whole input, preserving every
 * separator and the line structure. Deterministic (INV-02); line count preserved (INV-03).
 */
export function convert(input: string, id: CaseId): string {
  if (id === 'upper') return input.toUpperCase();
  if (id === 'lower') return input.toLowerCase();
  return input
    .split('\n')
    .map((line) => renderTokens(tokenize(line))[id] ?? '')
    .join('\n');
}

/** Convert the input to all eleven case kinds at once (F-002.R1). */
export function convertAll(input: string): Record<CaseId, string> {
  const upperAll = input.toUpperCase();
  const lowerAll = input.toLowerCase();
  const perLine = input.split('\n').map((line) => renderTokens(tokenize(line)));
  const join = (key: string) => perLine.map((r) => r[key] ?? '').join('\n');
  return {
    camel: join('camel'),
    pascal: join('pascal'),
    snake: join('snake'),
    kebab: join('kebab'),
    constant: join('constant'),
    dot: join('dot'),
    path: join('path'),
    title: join('title'),
    sentence: join('sentence'),
    upper: upperAll,
    lower: lowerAll,
  };
}
