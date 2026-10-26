// MOD-Host — theme, origin-checked host messages, ready signal (ADR-0008); offline worker
// (ADR-0010, F-007) in ./offline.ts (page side) and ./sw.ts (/sw.js).
// Implements: F-005.R1, F-005.R2, F-005.R4 (message side), F-005.R5, F-005.R6, RULE-10, INV-01,
// NFR-07 (message-origin side); F-011.R2, F-011.R4 (language messages, ADR-0013).
import { acceptLanguageMessage, acceptThemeMessage, readyMessage, readyTargets } from './contract';
import { setHostLanguage } from './language';
import { setHostTheme, startTheme } from './theme';

export { theme } from './theme';
export type { Theme } from './contract';

/** Origins allowed to embed the tool and send settings messages (deploy setting HOST_ORIGINS). */
export const ALLOWED_HOST_ORIGINS: readonly string[] = __HOST_ORIGINS__;

/** True when the tool runs inside a host frame (a cross-origin `top` that throws counts). */
export function isEmbedded(): boolean {
  try {
    return window.top !== window.self;
  } catch {
    return true;
  }
}

let started = false;

/**
 * Starts the host relationship once: theme controller, and — only when embedded with a
 * non-empty allow-list (RULE-10) — the settings listener and a single ready signal sent after
 * the first render. Call after the first `render()`.
 */
export function startHost({
  allowedOrigins = ALLOWED_HOST_ORIGINS,
}: { allowedOrigins?: readonly string[] } = {}): void {
  if (started) return;
  started = true;
  startTheme();
  if (!isEmbedded() || allowedOrigins.length === 0) return; // standalone only (F-005.R6)

  // Implements: F-005.R4 / AC5, F-011.R4 / AC4 — allow-listed origin and the parent window, and a
  // supported value, else ignored silently.
  window.addEventListener('message', (event) => {
    const message = { origin: event.origin, source: event.source, data: event.data };
    const theme = acceptThemeMessage(message, allowedOrigins, window.parent);
    if (theme) setHostTheme(theme);
    const lang = acceptLanguageMessage(message, allowedOrigins, window.parent);
    if (lang) setHostLanguage(lang);
  });

  // Implements: F-005.R5 / AC6 — one ready signal after the first paint, explicit targets only.
  requestAnimationFrame(() =>
    setTimeout(() => {
      for (const target of readyTargets(document.referrer, allowedOrigins)) {
        window.parent.postMessage(readyMessage(), target);
      }
    }, 0),
  );
}
