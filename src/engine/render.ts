// MOD-Engine — case renderers (pure, zero-dependency).
// Implements: RULE-01 (token-based kinds), RULE-01b (character-based), RULE-04 (Title/Sentence),
// RULE-05 (locale-independent casing), RULE-06 (acronym normalization),
// RULE-11 (strip symbols), RULE-12 (remove accents).
import { tokenize } from './tokenize';
import { removeAccents, toAsciiToken } from './transform';

/** Optional input transforms (RULE-11, RULE-12); both default off (M-1 behavior). */
export interface ConvertOptions {
  stripSymbols?: boolean;
  removeAccents?: boolean;
}

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

/** Clean tokens of one line for strip-symbols mode (RULE-11): ASCII-alnum only, empties dropped. */
function asciiTokens(line: string): string[] {
  return tokenize(line)
    .map(toAsciiToken)
    .filter((t) => t.length > 0);
}

/** Per-line results for all eleven kinds under the given options (RULE-11/RULE-12). */
function renderLine(line: string, opts: ConvertOptions): Record<CaseId, string> {
  if (opts.stripSymbols) {
    // RULE-11: build every kind from ASCII-alnum tokens; char-based kinds join by one space.
    const toks = asciiTokens(line);
    const tokenBased = renderTokens(toks) as Record<string, string>;
    return {
      ...(tokenBased as Record<CaseId, string>),
      upper: toks.map(upper).join(' '),
      lower: toks.map(lower).join(' '),
    };
  }
  const src = opts.removeAccents ? removeAccents(line) : line; // RULE-12 keeps symbols/non-Latin
  const tokenBased = renderTokens(tokenize(src)) as Record<string, string>;
  return {
    ...(tokenBased as Record<CaseId, string>),
    upper: src.toUpperCase(),
    lower: src.toLowerCase(),
  };
}

/**
 * Convert the whole input to one case kind, line by line (RULE-03), honoring the transforms
 * (RULE-11, RULE-12). Deterministic for a given input and options (INV-02); line count preserved
 * (INV-03).
 */
export function convert(input: string, id: CaseId, opts: ConvertOptions = {}): string {
  return input
    .split('\n')
    .map((line) => renderLine(line, opts)[id] ?? '')
    .join('\n');
}

/** Convert the input to all eleven case kinds at once (F-002.R1), honoring the transforms. */
export function convertAll(input: string, opts: ConvertOptions = {}): Record<CaseId, string> {
  const perLine = input.split('\n').map((line) => renderLine(line, opts));
  const join = (id: CaseId) => perLine.map((r) => r[id] ?? '').join('\n');
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
    upper: join('upper'),
    lower: join('lower'),
  };
}
