// MOD-App — the result grid (CMP-ResultGrid): all eleven cases at once (PRN-02).
// Implements: F-002.R1, F-003.R1, RULE-01 order, RULE-09.
import type { JSX } from 'preact';
import { MESSAGES, t, type MessageId } from '../../copy';
import { CASE_IDS, type CaseId } from '../../engine';
import { copyText } from '../../io';
import { copiedCase, isEmpty, markCopied, markCopyFailed, results } from '../state';
import { ResultRow } from './ResultRow';

const labelOf = (id: CaseId): string => MESSAGES[`case.${id}` as MessageId];

export function ResultGrid(): JSX.Element {
  const empty = isEmpty.value;
  const values = results.value;
  const copied = copiedCase.value;
  return (
    <div class="grid" role="group" aria-label={t('label.results')}>
      {CASE_IDS.map((id) => {
        const label = labelOf(id);
        return (
          <ResultRow
            key={id}
            id={id}
            label={label}
            value={values[id]}
            empty={empty}
            copied={copied === id}
            onCopy={() => {
              void copyText(values[id]).then((ok) =>
                ok ? markCopied(id, t('status.copied', { case: label })) : markCopyFailed(t('status.copy_failed')),
              );
            }}
          />
        );
      })}
    </div>
  );
}
