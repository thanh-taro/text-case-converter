// MOD-Engine — case renderers (pure, zero-dependency).
// Implements: RULE-01 (token-based kinds), RULE-01b (character-based), RULE-04 (Title/Sentence),
// RULE-05 (locale-independent casing), RULE-06 (acronym normalization),
// RULE-11 (strip symbols), RULE-12 (remove accents); M-3: F-015 (Train-Case, COBOL-CASE),
// RULE-16 / F-013 (keep acronyms), RULE-17 / F-012 (input match).
import { tokenize } from './tokenize';
import { removeAccents, toAsciiToken } from './transform';

/** Optional transforms (RULE-11, RULE-12, RULE-16); all default off (M-1 behavior). */
export interface ConvertOptions {
  stripSymbols?: boolean;
  removeAccents?: boolean;
  keepAcronyms?: boolean;
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

const isCased = (c: string): boolean => c.toLowerCase() !== c.toUpperCase();

/** RULE-16: at least two cased letters, all uppercase as written (`ID`, `HTTP`, `UTF8`, `ID2`). */
function isAcronym(token: string): boolean {
  const cased = [...token].filter(isCased);
  return cased.length >= 2 && cased.every((c) => c === c.toUpperCase());
}

/** RULE-16: a line with no lowercase letter (all-caps input) has no acronyms. */
const hasLowercase = (tokens: readonly string[]): boolean =>
  tokens.some((t) => [...t].some((c) => isCased(c) && c === c.toLowerCase()));

/** All eleven token-based case kinds for one already-tokenized line (RULE-01, RULE-16). */
function renderTokens(tokens: readonly string[], keepAcronyms = false): Record<string, string> {
  const keep = keepAcronyms && hasLowercase(tokens) ? new Set(tokens.filter(isAcronym)) : null;
  /** Per-word form: capitalised, or the acronym as written when kept (RULE-16). */
  const word = (t: string): string => (keep?.has(t) ? t : capitalize(t));
  /** Lowercased, or the acronym as written when kept (Sentence case's later words). */
  const quiet = (t: string): string => (keep?.has(t) ? t : lower(t));
  return {
    camel: tokens.map((t, i) => (i === 0 ? lower(t) : word(t))).join(''),
    pascal: tokens.map(word).join(''),
    snake: tokens.map(lower).join('_'),
    kebab: tokens.map(lower).join('-'),
    train: tokens.map(word).join('-'),
    constant: tokens.map(upper).join('_'),
    cobol: tokens.map(upper).join('-'),
    dot: tokens.map(lower).join('.'),
    path: tokens.map(lower).join('/'),
    title: tokens.map(word).join(' '),
    sentence: tokens.map((t, i) => (i === 0 ? word(t) : quiet(t))).join(' '),
  };
}

/** The case-kind ids, in default display order (RULE-01). */
export const CASE_IDS = [
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
] as const;

export type CaseId = (typeof CASE_IDS)[number];

/** Which kinds tokenize (RULE-01) versus fold characters directly (RULE-01b). */
export const TOKEN_BASED: ReadonlySet<CaseId> = new Set<CaseId>([
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
]);

/** Clean tokens of one line for strip-symbols mode (RULE-11): ASCII-alnum only, empties dropped. */
function asciiTokens(line: string): string[] {
  return tokenize(line)
    .map(toAsciiToken)
    .filter((t) => t.length > 0);
}

/** Per-line results for every kind under the given options (RULE-11/RULE-12/RULE-16). */
function renderLine(line: string, opts: ConvertOptions): Record<CaseId, string> {
  if (opts.stripSymbols) {
    // RULE-11: build every kind from ASCII-alnum tokens; char-based kinds join by one space.
    const toks = asciiTokens(line);
    const tokenBased = renderTokens(toks, opts.keepAcronyms) as Record<string, string>;
    return {
      ...(tokenBased as Record<CaseId, string>),
      upper: toks.map(upper).join(' '),
      lower: toks.map(lower).join(' '),
    };
  }
  const src = opts.removeAccents ? removeAccents(line) : line; // RULE-12 keeps symbols/non-Latin
  const tokenBased = renderTokens(tokenize(src), opts.keepAcronyms) as Record<string, string>;
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

/** Convert the input to every case kind at once (F-002.R1), honoring the transforms. */
export function convertAll(input: string, opts: ConvertOptions = {}): Record<CaseId, string> {
  const perLine = input.split('\n').map((line) => renderLine(line, opts));
  const out = {} as Record<CaseId, string>;
  for (const id of CASE_IDS) out[id] = perLine.map((r) => r[id] ?? '').join('\n');
  return out;
}

/**
 * The case kinds whose result equals the whole input (RULE-17, F-012.R1), in RULE-01 order;
 * empty for an empty input (F-012.R3). Takes the already-computed results so the grid does not
 * convert twice.
 */
export function matchingCases(input: string, results: Readonly<Record<CaseId, string>>): CaseId[] {
  if (input === '') return [];
  return CASE_IDS.filter((id) => results[id] === input);
}
