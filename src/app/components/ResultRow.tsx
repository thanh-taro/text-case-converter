// MOD-App — one result row (CMP-ResultRow). The whole row is the copy target.
// Implements: F-002 (label+value), F-003.R1/R2/R4 (copy, flash, empty inert), RULE-07, RULE-09.
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
  onCopy: () => void;
}

export function ResultRow({ id, label, value, empty, copied, onCopy }: Props): JSX.Element {
  const valueId = `tcc-val-${id}`;
  return (
    <button
      type="button"
      class={`row${empty ? ' row--inert' : ''}${copied ? ' row--copied' : ''}`}
      aria-label={empty ? `${label}: ${t('label.no_result')}` : t('action.copy_row', { case: label })}
      aria-describedby={valueId}
      aria-disabled={empty ? 'true' : undefined}
      disabled={empty}
      onClick={empty ? undefined : onCopy}
    >
      <span class="row__label">{label}</span>
      <span id={valueId} class={`row__val${empty ? ' row__val--empty' : ''}`}>
        {empty ? t('result.empty') : value}
      </span>
      {!empty && !copied && (
        <span class="row__copy">
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
  );
}
