// MOD-Host runtime language controller (ADR-0013 §1–2, §6).
// Implements: F-011.R1 (address language from first render, page language, document title),
// F-011.R2 (host messages switch live), F-011.R3 (browser preference, then the default), RULE-15.
// The boot script has already set `<html lang>` before first paint; this module resolves the same
// language when it is imported — before the app's first render — and on every accepted message.
import { language, t, type Language } from '../copy';
import { resolveLanguage } from './contract';

function readAddressLanguage(): string | null {
  try {
    return new URLSearchParams(location.search).get('lang');
  } catch {
    return null;
  }
}

function browserLanguages(): readonly string[] {
  try {
    return navigator.languages?.length ? navigator.languages : [navigator.language];
  } catch {
    return [];
  }
}

const sources: { message: Language | null; address: string | null; browser: readonly string[] } = {
  message: null,
  address: readAddressLanguage(),
  browser: browserLanguages(),
};

function apply(): void {
  const next = resolveLanguage(sources);
  language.value = next;
  const root = document.documentElement;
  if (root.getAttribute('lang') !== next) root.setAttribute('lang', next);
  document.title = t('app.title');
}

/** A supported language from an accepted host settings message (highest precedence). */
export function setHostLanguage(value: Language): void {
  sources.message = value;
  apply();
}

// Resolve at import, so the first render already uses the right strings (F-011.AC1).
apply();
