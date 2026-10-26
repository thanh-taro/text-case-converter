// MOD-App — one result row (CMP-ResultRow). M-2: a group holding a copy button and a separate
// pin button (the pin is not nested inside a button), plus the last-used badge.
// Implements: F-002 (label+value), F-003.R1/R2/R4 (copy, flash, empty inert), RULE-07, RULE-09,
// F-010.R3 (last-used badge), F-010.R4 (pin), F-012.R1/R5 (matches-input badge), NFR-04/NFR-08;
// F-014: a grid row with two cells (copy, pin); only the grid's one tab stop has tabIndex 0.
import type { JSX } from 'preact';
import { t } from '../../copy';
import type { CaseId } from '../../engine';
import { Icon } from './Icon';

/** The two actions of a row (grid columns, F-014.R4). */
export type Action = 'copy' | 'pin';

interface Props {
  id: CaseId;
  label: string;
  value: string;
  empty: boolean;
  copied: boolean;
  lastUsed: boolean;
  matchesInput: boolean;
  pinned: boolean;
  /** Which of this row's actions is the grid's Tab stop, if any (F-014.R1). */
  tabStop: Action | null;
  onCopy: () => void;
  onPin: () => void;
}

export function ResultRow({
  id,
  label,
  value,
  empty,
  copied,
  lastUsed,
  matchesInput,
  pinned,
  tabStop,
  onCopy,
  onPin,
}: Props): JSX.Element {
  const valueId = `tcc-val-${id}`;
  const matchId = `tcc-match-${id}`;
  const lastId = `tcc-last-${id}`;
  // F-012.R5 / F-010: the badges are part of the copy action's accessible description.
  const describedBy = [valueId, matchesInput && matchId, lastUsed && lastId].filter(Boolean).join(' ');
  return (
    <div class={`row${copied ? ' row--copied' : ''}${pinned ? ' row--pinned' : ''}`} role="row" aria-label={label}>
      <div class="row__cell row__cell--copy" role="gridcell">
        <button
          data-case={id}
          data-action="copy"
          tabIndex={tabStop === 'copy' ? 0 : -1}
          type="button"
          class={`row__copy-btn${empty ? ' row--inert' : ''}`}
          aria-label={empty ? `${label}: ${t('label.no_result')}` : t('action.copy_row', { case: label })}
          aria-describedby={describedBy}
          aria-disabled={empty ? 'true' : undefined}
          disabled={empty}
          onClick={empty ? undefined : onCopy}
        >
          <span class="row__label">
            {/* Case labels are English in every language (RULE-15, F-011 UX notes, WCAG 3.1.2). */}
            <span lang="en">{label}</span>
            {matchesInput && (
              <span id={matchId} class="row__badge row__badge--match">
                {t('badge.matches_input')}
              </span>
            )}
            {lastUsed && (
              <span id={lastId} class="row__badge">
                {t('badge.last_used')}
              </span>
            )}
          </span>
          <span id={valueId} class={`row__val${empty ? ' row__val--empty' : ''}`}>
            {empty ? t('result.empty') : value}
          </span>
          {!empty && !copied && (
            <span class="row__copy" aria-hidden="true">
              <Icon name="copy" />
            </span>
          )}
          {copied && (
            <span class="row__copied">
              <Icon name="check" />
              {t('status.copied_short')}
            </span>
          )}
        </button>
      </div>
      <div class="row__cell row__cell--pin" role="gridcell">
        <button
          type="button"
          data-case={id}
          data-action="pin"
          tabIndex={tabStop === 'pin' ? 0 : -1}
          class={`row__pin${pinned ? ' row__pin--on' : ''}`}
          aria-pressed={pinned ? 'true' : 'false'}
          aria-label={pinned ? t('action.unpin', { case: label }) : t('action.pin', { case: label })}
          onClick={onPin}
        >
          <Icon name="pin" />
        </button>
      </div>
    </div>
  );
}
