// MOD-Engine — tokenization (pure, zero-dependency).
// Implements: RULE-02 (word boundaries), RULE-05 (caseless characters), RULE-03 (per line).

const WORD = /\p{L}|\p{N}/u;

/** A cased letter currently in upper form (has a distinct lower form). */
function isUpper(ch: string): boolean {
  return ch !== ch.toLowerCase() && ch === ch.toUpperCase();
}
/** A cased letter currently in lower form (has a distinct upper form). */
function isLower(ch: string): boolean {
  return ch !== ch.toUpperCase() && ch === ch.toLowerCase();
}
/** A Unicode decimal digit (RULE-02: digits stay attached to their token). */
function isDigit(ch: string): boolean {
  return /\p{N}/u.test(ch);
}

/**
 * Split one chunk of word characters into tokens at letter-case and acronym boundaries
 * (RULE-02 b and c). Separators have already been removed by {@link tokenize}.
 */
function splitChunk(chunk: string): string[] {
  const chars = [...chunk];
  const tokens: string[] = [];
  let cur = chars.length ? chars[0]! : '';
  for (let i = 1; i < chars.length; i++) {
    const prev = chars[i - 1]!;
    const ch = chars[i]!;
    const next = chars[i + 1];
    // (b) before an uppercase that follows a lowercase letter or a digit: fooBar, v2Point.
    const lowerToUpper = isUpper(ch) && (isLower(prev) || isDigit(prev));
    // (c) end of an acronym run: the last uppercase of 2+ uppercase before a lowercase (HTTPResponse).
    const acronymEnd = isUpper(ch) && isUpper(prev) && next !== undefined && isLower(next);
    if (lowerToUpper || acronymEnd) {
      tokens.push(cur);
      cur = ch;
    } else {
      cur += ch;
    }
  }
  if (cur) tokens.push(cur);
  return tokens;
}

/**
 * Split a single line into tokens (RULE-02): separators (any non-letter, non-digit character)
 * are dropped, then each run of word characters is split at case and acronym boundaries. Digits
 * stay attached; empty tokens are dropped.
 */
export function tokenize(line: string): string[] {
  const chunks: string[] = [];
  let cur = '';
  for (const ch of line) {
    if (WORD.test(ch)) cur += ch;
    else if (cur) {
      chunks.push(cur);
      cur = '';
    }
  }
  if (cur) chunks.push(cur);
  return chunks.flatMap(splitChunk);
}
