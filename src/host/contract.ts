// MOD-Host — the host settings contract as pure functions (no DOM), ADR-0008 §1 and §3.
// Implements: RULE-10, F-005.R1, F-005.R2, F-005.R4 (message side), F-005.R5, INV-01, NFR-07;
// RULE-15, F-011.R2–R4 (language, ADR-0013).
import { LANGUAGES, type Language } from '../copy';

export type Theme = 'light' | 'dark';

/** Inbound settings message types (portal → tool). */
export const THEME_MESSAGE = 'taro:theme';
export const LANGUAGE_MESSAGE = 'taro:lang';
/** The only outbound message type (tool → portal). */
export const READY_MESSAGE = 'taro:ready';

/** `light` or `dark`; anything else is not a theme (RULE-10: unknown values are ignored). */
export function parseTheme(value: unknown): Theme | null {
  return value === 'light' || value === 'dark' ? value : null;
}

export interface InboundMessage {
  readonly origin: string;
  readonly source: unknown;
  readonly data: unknown;
}

/** The `{ type, value }` of a settings message, or null when it must be ignored (F-005.R4). */
function acceptSettings(
  message: InboundMessage,
  allowedOrigins: readonly string[],
  parent: unknown,
): { type: unknown; value: unknown } | null {
  if (!allowedOrigins.includes(message.origin)) return null;
  if (message.source === null || message.source !== parent) return null;
  const data = message.data;
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return null;
  const { type, value } = data as { type?: unknown; value?: unknown };
  return { type, value };
}

/**
 * The theme carried by a settings message, or null when the message must be ignored.
 * Implements: F-005.R4 / F-005.AC5 — accepted only from an allow-listed origin and only from the
 * parent window (a sibling frame can reach the tool through `parent.frames`, SP-iframe).
 */
export function acceptThemeMessage(
  message: InboundMessage,
  allowedOrigins: readonly string[],
  parent: unknown,
): Theme | null {
  const settings = acceptSettings(message, allowedOrigins, parent);
  return settings?.type === THEME_MESSAGE ? parseTheme(settings.value) : null;
}

/**
 * The language carried by a settings message, or null when it must be ignored: same origin and
 * parent checks as the theme; an unsupported value is ignored. Implements: F-011.R2, F-011.R4.
 */
export function acceptLanguageMessage(
  message: InboundMessage,
  allowedOrigins: readonly string[],
  parent: unknown,
): Language | null {
  const settings = acceptSettings(message, allowedOrigins, parent);
  return settings?.type === LANGUAGE_MESSAGE ? matchLanguage(settings.value) : null;
}

/**
 * RULE-15 matching: equal to a supported language ignoring letter case, else the supported
 * language with the same primary subtag (`vi` → vi-VN, `en-GB` → en-US); anything else is null.
 */
export function matchLanguage(value: unknown): Language | null {
  if (typeof value !== 'string') return null;
  const v = value.trim().toLowerCase();
  if (v === '') return null;
  const exact = LANGUAGES.find((l) => l.toLowerCase() === v);
  if (exact) return exact;
  const primary = v.split(/[-_]/)[0];
  return LANGUAGES.find((l) => l.toLowerCase().split('-')[0] === primary) ?? null;
}

/**
 * Language precedence (RULE-15): latest accepted host message, then a supported address value,
 * then the first matching browser preference, then the default. Implements: F-011.R1, F-011.R3.
 */
export function resolveLanguage(input: {
  message: Language | null;
  address: string | null;
  browser: readonly string[];
}): Language {
  if (input.message) return input.message;
  const fromAddress = matchLanguage(input.address);
  if (fromAddress) return fromAddress;
  for (const pref of input.browser) {
    const match = matchLanguage(pref);
    if (match) return match;
  }
  return LANGUAGES[0];
}

/**
 * Theme precedence (ADR-0008 §1): latest valid host message, then the address parameter, then
 * the device preference. Implements: F-005.R1, F-005.R2.
 */
export function resolveTheme(input: { message: Theme | null; address: Theme | null; device: Theme }): Theme {
  return input.message ?? input.address ?? input.device;
}

/** The ready signal: its type only, never any content (F-005.R5, INV-01). */
export function readyMessage(): { readonly type: typeof READY_MESSAGE } {
  return { type: READY_MESSAGE };
}

/**
 * Explicit target origins for the ready signal, never `*` (ADR-0008 §3): the allowed origin
 * matching `document.referrer`, otherwise every allowed origin (the browser drops the others).
 */
export function readyTargets(referrer: string, allowedOrigins: readonly string[]): string[] {
  let origin: string | null = null;
  try {
    origin = referrer ? new URL(referrer).origin : null;
  } catch {
    origin = null;
  }
  // Defence in depth: the build refuses wildcards in HOST_ORIGINS, and none is ever a target.
  const allowed = allowedOrigins.filter((o) => o !== '*');
  return origin !== null && allowed.includes(origin) ? [origin] : allowed;
}
