// MOD-App — the result grid (CMP-ResultGrid): all eleven cases at once (PRN-02), in the active
// sort order with pins and the last-used badge (M-2).
// Implements: F-002.R1, F-003.R1, RULE-01 order, RULE-09, F-010 (RULE-13).
import type { JSX } from 'preact';
import { MESSAGES, t, type MessageId } from '../../copy';
import { type CaseId } from '../../engine';
import { copyText } from '../../io';
import {
  copiedCase,
  isEmpty,
  lastUsed,
  markCopied,
  markCopyFailed,
  orderedIds,
  pinned,
  results,
  togglePin,
} from '../state';
import { ResultRow } from './ResultRow';

const labelOf = (id: CaseId): string => MESSAGES[`case.${id}` as MessageId];

export function ResultGrid(): JSX.Element {
  const empty = isEmpty.value;
  const values = results.value;
  const copied = copiedCase.value;
  const ids = orderedIds.value;
  const last = lastUsed.value;
  const pins = pinned.value;
  return (
    <div class="grid" role="group" aria-label={t('label.results')}>
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
            pinned={pins.includes(id)}
            onCopy={() => {
              void copyText(values[id]).then((ok) =>
                ok ? markCopied(id, t('status.copied', { case: label })) : markCopyFailed(t('status.copy_failed')),
              );
            }}
            onPin={() => togglePin(id)}
          />
        );
      })}
    </div>
  );
}
