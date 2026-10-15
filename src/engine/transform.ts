// MOD-Engine — optional input transforms (pure, zero-dependency).
// Implements: RULE-11 (strip symbols), RULE-12 (remove accents).

/** Latin letters that have no NFD decomposition, mapped to an ASCII base (RULE-12). */
const FOLD_MAP: Record<string, string> = {
  đ: 'd',
  Đ: 'D',
  ø: 'o',
  Ø: 'O',
  ß: 'ss',
  æ: 'ae',
  Æ: 'AE',
  œ: 'oe',
  Œ: 'OE',
  ł: 'l',
  Ł: 'L',
};
const FOLD_RE = new RegExp(`[${Object.keys(FOLD_MAP).join('')}]`, 'g');

/**
 * Fold accented Latin letters to their ASCII base (RULE-12): Unicode canonical decomposition
 * (NFD) with combining marks removed, then the explicit map for letters that do not decompose.
 * Symbols, digits, whitespace and non-Latin scripts are left unchanged.
 */
export function removeAccents(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(FOLD_RE, (ch) => FOLD_MAP[ch] ?? ch);
}

/**
 * Reduce one token to ASCII letters and digits only (RULE-11): accents are folded first, then
 * every remaining non-ASCII-alphanumeric character is dropped. May return an empty string.
 */
export function toAsciiToken(token: string): string {
  return removeAccents(token).replace(/[^A-Za-z0-9]/g, '');
}
