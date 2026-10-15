// MOD-App — the status bar (CMP-StatusBar): line count + privacy statement.
// Implements: F-004.R4 (line count), F-006.R1 (privacy statement always visible).
import type { JSX } from 'preact';
import { formatCount, t } from '../../copy';
import { lineCount } from '../state';

export function StatusBar(): JSX.Element {
  const lines = lineCount.value;
  return (
    <div class="status">
      {lines > 1 && <span class="status__lines">{t('status.lines', { n: formatCount(lines) })}</span>}
      <span class="status__spacer" />
      <span class="status__privacy">
        <span class="status__dot" aria-hidden="true" />
        {t('label.privacy')}
      </span>
    </div>
  );
}
