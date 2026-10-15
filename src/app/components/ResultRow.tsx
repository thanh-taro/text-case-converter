// MOD-App — one result row (CMP-ResultRow). M-2: a group holding a copy button and a separate
// pin button (the pin is not nested inside a button), plus the last-used badge.
// Implements: F-002 (label+value), F-003.R1/R2/R4 (copy, flash, empty inert), RULE-07, RULE-09,
// F-010.R3 (last-used badge), F-010.R4 (pin), NFR-04/NFR-08.
import type { JSX } from 'preact';
import { t } from '../../copy';
import type { CaseId } from '../../engine';
import { Icon } from './Icon';

interface Props {
  id: CaseId;
  label: string;
  value: string;
  empty: boolean;
  copied: boolean;
  lastUsed: boolean;
  pinned: boolean;
  onCopy: () => void;
  onPin: () => void;
}

export function ResultRow({ id, label, value, empty, copied, lastUsed, pinned, onCopy, onPin }: Props): JSX.Element {
  const valueId = `tcc-val-${id}`;
  return (
    <div class={`row${copied ? ' row--copied' : ''}${pinned ? ' row--pinned' : ''}`} role="group" aria-label={label}>
      <button
        type="button"
        class={`row__copy-btn${empty ? ' row--inert' : ''}`}
        aria-label={empty ? `${label}: ${t('label.no_result')}` : t('action.copy_row', { case: label })}
        aria-describedby={valueId}
        aria-disabled={empty ? 'true' : undefined}
        disabled={empty}
        onClick={empty ? undefined : onCopy}
      >
        <span class="row__label">
          {label}
          {lastUsed && <span class="row__badge">{t('badge.last_used')}</span>}
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
      <button
        type="button"
        class={`row__pin${pinned ? ' row__pin--on' : ''}`}
        aria-pressed={pinned ? 'true' : 'false'}
        aria-label={pinned ? t('action.unpin', { case: label }) : t('action.pin', { case: label })}
        onClick={onPin}
      >
        <Icon name="pin" />
      </button>
    </div>
  );
}
