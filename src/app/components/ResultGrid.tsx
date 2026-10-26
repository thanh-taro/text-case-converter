// MOD-App — the result grid (CMP-ResultGrid): every case at once (PRN-02), in the active sort order
// with pins and badges (M-2, M-3), and keyboard navigation as one Tab stop (M-3, F-014).
// Implements: F-002.R1, F-003.R1, RULE-01 order, RULE-09, F-010 (RULE-13), F-012.R1 (badge),
// F-014.R1–R9 (ARIA grid pattern + roving tabindex, platform-mapping.md).
import { signal } from '@preact/signals';
import type { JSX } from 'preact';
import { useRef } from 'preact/hooks';
import { MESSAGES, t, type MessageId } from '../../copy';
import { type CaseId } from '../../engine';
import { copyText } from '../../io';
import {
  copiedCase,
  isEmpty,
  matches,
  lastUsed,
  markCopied,
  markCopyFailed,
  orderedIds,
  pinned,
  results,
  settleNow,
  togglePin,
} from '../state';
import { ResultRow, type Action } from './ResultRow';

const labelOf = (id: CaseId): string => MESSAGES[`case.${id}` as MessageId];

/** The remembered focus position inside the grid: a case (not a row index) and an action. */
const focusCase = signal<CaseId | null>(null);
const focusAction = signal<Action>('copy');

const NAV_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End']);

export function ResultGrid(): JSX.Element {
  const gridRef = useRef<HTMLDivElement>(null);
  const empty = isEmpty.value;
  const values = results.value;
  const copied = copiedCase.value;
  const ids = orderedIds.value;
  const last = lastUsed.value;
  const pins = pinned.value;
  const matched = matches.value;

  // F-014.R2/R7: the one Tab stop is the remembered case (first row the first time), on its pin
  // action while copy actions are unavailable (empty input).
  const activeCase = focusCase.value && ids.includes(focusCase.value) ? focusCase.value : ids[0];
  // F-012.R3 (below): an empty input shows no matches-input badge, even before it settles.
  const activeAction: Action = empty ? 'pin' : focusAction.value;

  const button = (id: CaseId, action: Action): HTMLButtonElement | null =>
    gridRef.current?.querySelector<HTMLButtonElement>(`button[data-case="${id}"][data-action="${action}"]`) ?? null;

  /** Whether this case's action has focus now (checked before its row can move). */
  const hasFocus = (id: CaseId, action: Action): boolean => {
    const el = button(id, action);
    return el !== null && el === document.activeElement;
  };

  /** F-014.R6: keep focus on a case's action after its row moved (pin, copy in recent sort) —
   *  only when it had focus before and the move dropped it (never steals focus after a mouse click). */
  const keepFocus = (id: CaseId, action: Action, hadFocus: boolean) => {
    if (!hadFocus) return;
    requestAnimationFrame(() => {
      const el = button(id, action);
      const active = document.activeElement;
      if (el && el !== active && (active === null || active === document.body)) el.focus();
    });
  };

  const onFocusIn = (e: FocusEvent) => {
    const el = e.target as HTMLElement;
    const id = el.dataset['case'] as CaseId | undefined;
    const action = el.dataset['action'] as Action | undefined;
    if (!id || !action) return;
    focusCase.value = id;
    // F-014.R7: pin-only focus while empty is temporary; the remembered action stays copy (AC1).
    if (!empty) focusAction.value = action;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (!NAV_KEYS.has(e.key) || e.altKey || e.ctrlKey || e.metaKey) return;
    const el = e.target as HTMLElement;
    const id = el.dataset['case'] as CaseId | undefined;
    const action = el.dataset['action'] as Action | undefined;
    if (!id || !action) return;
    e.preventDefault(); // only for the navigation keys (F-014.R8: nothing else is intercepted)
    const i = ids.indexOf(id);
    let nextIndex = i;
    let nextAction: Action = action;
    if (e.key === 'ArrowDown')
      nextIndex = Math.min(i + 1, ids.length - 1); // F-014.R3: no wrap
    else if (e.key === 'ArrowUp') nextIndex = Math.max(i - 1, 0);
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = ids.length - 1;
    else if (e.key === 'ArrowRight')
      nextAction = 'pin'; // F-014.R4; R9: no-op on pin
    else if (e.key === 'ArrowLeft' && !empty) nextAction = 'copy'; // R9: no-op on copy; R7
    button(ids[nextIndex]!, nextAction)?.focus();
  };

  return (
    // Roving tabindex (ARIA grid pattern): the focusable elements are the cells' buttons, one of
    // which always has tabIndex 0, so the container itself must not take focus.
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div
      ref={gridRef}
      class="grid"
      role="grid"
      aria-label={t('label.results')}
      onFocusIn={onFocusIn}
      onKeyDown={onKeyDown}
    >
      {ids.map((id) => {
        const label = labelOf(id);
        return (
          <ResultRow
            key={id}
            id={id}
            label={label}
            value={values[id]}
            empty={empty}
            copied={copied === id}
            lastUsed={last === id}
            matchesInput={!empty && matched.has(id)}
            pinned={pins.includes(id)}
            tabStop={id === activeCase ? activeAction : null}
            onCopy={() => {
              const hadFocus = hasFocus(id, 'copy');
              settleNow(); // F-003.R6: copy the result for the current input, not a stale one
              void copyText(results.peek()[id]).then((ok) => {
                if (ok) {
                  markCopied(id, t('status.copied', { case: label }));
                  keepFocus(id, 'copy', hadFocus);
                } else markCopyFailed(t('status.copy_failed'));
              });
            }}
            onPin={() => {
              const hadFocus = hasFocus(id, 'pin');
              togglePin(id);
              keepFocus(id, 'pin', hadFocus);
            }}
          />
        );
      })}
    </div>
  );
}
