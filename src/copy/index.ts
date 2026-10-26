// MOD-Copy — the only home of user-facing strings (ADR-0007, ADR-0013). Strings are generated from
// specs/30-experience/copy.md into messages.gen.ts; IDs and parameters are type-checked.
// Implements: F-011.R1 (strings in the active language), F-011.R6 (counts per language), RULE-15.
import { signal } from '@preact/signals';
import { CATALOG, LANGUAGES, MESSAGES, type Language, type MessageId, type MessageParams } from './messages.gen';

export { CATALOG, LANGUAGES, MESSAGES, type Language, type MessageId, type MessageParams };

/** The default language (RULE-15): the first column of copy.md, en-US. */
export const DEFAULT_LANGUAGE: Language = LANGUAGES[0];

/** The active language. Set by MOD-Host (address, host messages, browser); read by `t()`. */
export const language = signal<Language>(DEFAULT_LANGUAGE);

type Args<Id extends MessageId> = MessageParams[Id] extends undefined ? [] : [params: MessageParams[Id]];

/** The text of a COPY ID in the active language, with its `{placeholders}` filled in. */
export function t<Id extends MessageId>(id: Id, ...args: Args<Id>): string {
  const text: string = CATALOG[language.value][id];
  const params = args[0] as Record<string, string | number> | undefined;
  if (!params) return text;
  return text.replace(/\{([a-zA-Z]\w*)\}/g, (whole, name: string) => (name in params ? String(params[name]) : whole));
}

/** Counts with the active language's digit grouping (COPY-status.lines, F-011.R6). */
export function formatCount(n: number): string {
  return new Intl.NumberFormat(language.value).format(n);
}
