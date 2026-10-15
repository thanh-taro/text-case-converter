// MOD-Prefs — the one place that touches localStorage (ENT-Preferences, RULE-14).
// Stores only non-content preferences under a single key; never user text (PRN-01, INV-01).
// All access is try/catch guarded so the tool works when storage is unavailable (RULE-14).
import { CASE_IDS, type CaseId } from '../engine';

export type SortMode = 'default' | 'recent' | 'alphabetical';
const SORT_MODES: ReadonlySet<string> = new Set(['default', 'recent', 'alphabetical']);

/** ENT-Preferences (10-domain/model.md). */
export interface Preferences {
  stripSymbols: boolean;
  removeAccents: boolean;
  sortMode: SortMode;
  pinned: CaseId[];
  recent: CaseId[]; // most-recent first; head is the last-used case
}

// Strip symbols and Remove accents default ON (RULE-11, RULE-12): clean ASCII identifiers out of
// the box. The choice is remembered per device (RULE-14).
export const DEFAULTS: Preferences = {
  stripSymbols: true,
  removeAccents: true,
  sortMode: 'default',
  pinned: [],
  recent: [],
};

const KEY = 'tcc.prefs';
const VALID_ID = new Set<string>(CASE_IDS);
const asIds = (v: unknown): CaseId[] =>
  Array.isArray(v) ? (v.filter((x) => typeof x === 'string' && VALID_ID.has(x)) as CaseId[]) : [];

/** Parse and validate stored preferences, ignoring anything malformed (RULE-14). */
function coerce(raw: unknown): Preferences {
  const o = (raw ?? {}) as Record<string, unknown>;
  const sortMode = (typeof o.sortMode === 'string' && SORT_MODES.has(o.sortMode) ? o.sortMode : 'default') as SortMode;
  // de-duplicate id lists, keeping first occurrence
  const uniq = (ids: CaseId[]) => [...new Set(ids)];
  return {
    stripSymbols: typeof o.stripSymbols === 'boolean' ? o.stripSymbols : DEFAULTS.stripSymbols,
    removeAccents: typeof o.removeAccents === 'boolean' ? o.removeAccents : DEFAULTS.removeAccents,
    sortMode,
    pinned: uniq(asIds(o.pinned)),
    recent: uniq(asIds(o.recent)),
  };
}

/** Load preferences from per-device storage; defaults if unavailable or malformed (RULE-14). */
export function loadPrefs(): Preferences {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    return coerce(JSON.parse(raw));
  } catch {
    return { ...DEFAULTS };
  }
}

/** Save preferences (non-content only). Silently no-ops if storage is unavailable (RULE-14). */
export function savePrefs(prefs: Preferences): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    /* storage unavailable — session-only (RULE-14) */
  }
}

export const PREFS_KEY = KEY;
