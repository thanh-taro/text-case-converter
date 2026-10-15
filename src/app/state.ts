// MOD-App — UI state (signals). Pure wiring around MOD-Engine; no network, no storage (PRN-01).
// Implements: F-001 (input/clear), F-002.R2 (live results), RULE-08 (settle delay + cap),
// RULE-09 (empty), F-004.R4 (line count), F-003 (copy feedback).
import { batch, computed, signal } from '@preact/signals';
import { convertAll, type CaseId } from '../engine';

/** Responsiveness cap (RULE-08): above this, results update only after the input settles. */
export const LARGE_INPUT = 100_000;
/** Settle delay in ms (RULE-08, NFR-02). */
export const SETTLE_MS = 150;

/** The text in the input area (updates on every keystroke). */
export const input = signal('');
/** The input the results are computed from (updated once the input settles). */
const settled = signal('');

/** Results for all eleven cases of the settled input (F-002.R1, RULE-03). */
export const results = computed<Record<CaseId, string>>(() => convertAll(settled.value));
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

/** Clear the input and return to the empty state (F-001.R2, RULE-09). */
export function clearInput(): void {
  if (settleTimer) clearTimeout(settleTimer);
  batch(() => {
    input.value = '';
    settled.value = '';
  });
}

/** Record a successful copy: flash the row and announce it (F-003.R2, NFR-04). */
export function markCopied(id: CaseId, announceText: string): void {
  copyFailed.value = false;
  copiedCase.value = id;
  announcement.value = ''; // reset so the same message re-announces
  announcement.value = announceText;
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
