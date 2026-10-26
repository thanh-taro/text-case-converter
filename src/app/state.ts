// MOD-App — UI state (signals). Wiring around MOD-Engine and MOD-Prefs; no network; the only
// storage is ENT-Preferences via MOD-Prefs (RULE-14, non-content).
// Implements: F-001 (input/clear), F-002.R2 (live results), RULE-08 (settle delay + cap),
// RULE-09 (empty), F-004.R4 (line count), F-003 (copy feedback),
// F-008 (strip symbols), F-009 (remove accents), F-010 (sort/pin/recent/last-used), RULE-11..14;
// M-3: F-013 (keep acronyms, RULE-16), F-012 (input match, RULE-17); F-003.R6 (copy settles first).
import { batch, computed, effect, signal } from '@preact/signals';
import { CASE_IDS, convertAll, matchingCases, type CaseId } from '../engine';
import { MESSAGES, language, type MessageId } from '../copy';
import { loadPrefs, savePrefs, type Preferences, type SortMode } from '../prefs';

/** Responsiveness cap (RULE-08): above this, results update only after the input settles. */
export const LARGE_INPUT = 100_000;
/** Settle delay in ms (RULE-08, NFR-02). */
export const SETTLE_MS = 150;

/** The text in the input area (updates on every keystroke). */
export const input = signal('');
/** The input the results are computed from (updated once the input settles). */
const settled = signal('');

// ----- M-2 preferences (ENT-Preferences, RULE-14): loaded once, persisted on change -----
const initial: Preferences = loadPrefs();
/** Strip-symbols transform (F-008, RULE-11). */
export const stripSymbols = signal(initial.stripSymbols);
/** Remove-accents transform (F-009, RULE-12). */
export const removeAccents = signal(initial.removeAccents);
/** Keep-acronyms transform (F-013, RULE-16); default off. */
export const keepAcronyms = signal(initial.keepAcronyms);
/** Result sort mode (F-010, RULE-13). */
export const sortMode = signal<SortMode>(initial.sortMode);
/** Pinned case kinds, floated to the top (F-010, RULE-13). */
export const pinned = signal<CaseId[]>(initial.pinned);
/** Case kinds in most-recently-copied order; head is the last-used (F-010, RULE-13). */
export const recent = signal<CaseId[]>(initial.recent);
/** The last-used case (gets the badge), or null (RULE-13). */
export const lastUsed = computed<CaseId | null>(() => recent.value[0] ?? null);

/** Persist the current preferences (non-content only, RULE-14). */
function persist(): void {
  savePrefs({
    stripSymbols: stripSymbols.value,
    removeAccents: removeAccents.value,
    keepAcronyms: keepAcronyms.value,
    sortMode: sortMode.value,
    pinned: pinned.value,
    recent: recent.value,
  });
}

/** Results for every case of the settled input and the active transforms (F-002.R1, RULE-03,
 * RULE-11, RULE-12, RULE-16). */
export const results = computed<Record<CaseId, string>>(() =>
  convertAll(settled.value, {
    stripSymbols: stripSymbols.value,
    removeAccents: removeAccents.value,
    keepAcronyms: keepAcronyms.value,
  }),
);

/** Case kinds whose result equals the settled input (RULE-17, F-012.R1/R2); empty when empty. */
export const matches = computed<ReadonlySet<CaseId>>(() => new Set(matchingCases(settled.value, results.value)));

const labelOf = (id: CaseId): string => MESSAGES[`case.${id}` as MessageId];

/** The case ids in display order for the active sort mode and pins (RULE-13). */
export const orderedIds = computed<CaseId[]>(() => {
  let order: CaseId[];
  if (sortMode.value === 'alphabetical') {
    order = [...CASE_IDS].sort((a, b) => {
      const la = labelOf(a).toLowerCase();
      const lb = labelOf(b).toLowerCase();
      return la < lb ? -1 : la > lb ? 1 : 0;
    });
  } else if (sortMode.value === 'recent') {
    const inRecent = recent.value.filter((id) => (CASE_IDS as readonly CaseId[]).includes(id));
    order = [...inRecent, ...CASE_IDS.filter((id) => !inRecent.includes(id))];
  } else {
    order = [...CASE_IDS];
  }
  const pins = pinned.value;
  if (pins.length === 0) return order;
  return [...order.filter((id) => pins.includes(id)), ...order.filter((id) => !pins.includes(id))];
});

/** Toggle Strip symbols (F-008.R1). */
export function setStripSymbols(on: boolean): void {
  stripSymbols.value = on;
  persist();
}
/** Toggle Remove accents (F-009.R1). */
export function setRemoveAccents(on: boolean): void {
  removeAccents.value = on;
  persist();
}
/** Toggle Keep acronyms (F-013.R1). */
export function setKeepAcronyms(on: boolean): void {
  keepAcronyms.value = on;
  persist();
}
/** Choose the sort mode (F-010.R1). */
export function setSortMode(mode: SortMode): void {
  sortMode.value = mode;
  persist();
}
/** Pin or unpin a case (F-010.R4). */
export function togglePin(id: CaseId): void {
  pinned.value = pinned.value.includes(id) ? pinned.value.filter((x) => x !== id) : [...pinned.value, id];
  persist();
}
/** Line count of the current input (F-004.R4); shown only when > 1. */
export const lineCount = computed(() => (input.value === '' ? 0 : input.value.split('\n').length));
/** Whether the input is empty (RULE-09). */
export const isEmpty = computed(() => input.value.length === 0);

/** The case id just copied (for the brief flash), or null. */
export const copiedCase = signal<CaseId | null>(null);
/** Text announced politely after a copy / failure (aria-live). */
export const announcement = signal('');
/** Whether the copy-failed notice is showing. */
export const copyFailed = signal(false);
/** Whether the large-input notice is showing (once per session until dismissed). */
export const largeNotice = signal(false);
let largeNoticeSeen = false;

let settleTimer: ReturnType<typeof setTimeout> | undefined;
let copiedTimer: ReturnType<typeof setTimeout> | undefined;

/** Update the input and schedule a settled recompute (RULE-08). */
export function setInput(value: string): void {
  input.value = value;
  if (settleTimer) clearTimeout(settleTimer);
  const commit = () => {
    settled.value = value;
  };
  if (value.length > LARGE_INPUT) {
    if (!largeNoticeSeen) {
      largeNoticeSeen = true;
      largeNotice.value = true;
    }
    settleTimer = setTimeout(commit, SETTLE_MS * 2);
  } else {
    settleTimer = setTimeout(commit, SETTLE_MS);
  }
}

/** Settle a pending input now, so results match the current input (F-003.R6, RULE-07). */
export function settleNow(): void {
  if (settleTimer) clearTimeout(settleTimer);
  settleTimer = undefined;
  settled.value = input.value;
}

/** Clear the input and return to the empty state (F-001.R2, RULE-09). */
export function clearInput(): void {
  if (settleTimer) clearTimeout(settleTimer);
  batch(() => {
    input.value = '';
    settled.value = '';
  });
}

// Implements: F-011.R2 — a live language switch clears the last announcement, so the live region
// never keeps text in the previous language.
let announcedLanguage = language.peek();
effect(() => {
  const now = language.value;
  if (now === announcedLanguage) return;
  announcedLanguage = now;
  announcement.value = '';
});

/** Record a successful copy: flash the row, announce it, and mark it most-recently-used
 * (F-003.R2, NFR-04, F-010.R2/R3, RULE-13/RULE-14). */
export function markCopied(id: CaseId, announceText: string): void {
  copyFailed.value = false;
  copiedCase.value = id;
  announcement.value = ''; // reset so the same message re-announces
  announcement.value = announceText;
  recent.value = [id, ...recent.value.filter((x) => x !== id)];
  persist();
  if (copiedTimer) clearTimeout(copiedTimer);
  copiedTimer = setTimeout(() => {
    copiedCase.value = null;
  }, 1600);
}

/** Record a failed copy (F-003.R5). */
export function markCopyFailed(announceText: string): void {
  copyFailed.value = true;
  announcement.value = '';
  announcement.value = announceText;
}

export function dismissLargeNotice(): void {
  largeNotice.value = false;
}
export function dismissCopyFailed(): void {
  copyFailed.value = false;
}
