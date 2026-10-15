// MOD-App — the notice bar (CMP-Notice), between input and grid (reading order).
// Implements: F-001.R5 (large input), F-003.R5 (copy failed), RULE-08.
import type { JSX } from 'preact';
import { t } from '../../copy';
import { copyFailed, dismissCopyFailed, dismissLargeNotice, largeNotice } from '../state';
import { Icon } from './Icon';

function Notice({
  kind,
  message,
  onDismiss,
}: {
  kind: 'info' | 'error';
  message: string;
  onDismiss: () => void;
}): JSX.Element {
  return (
    <div class={`notice notice--${kind}`}>
      <Icon name={kind === 'info' ? 'info' : 'alert'} />
      <span class="notice__msg">{message}</span>
      <button type="button" class="notice__x" onClick={onDismiss} aria-label={t('action.dismiss')}>
        <Icon name="x" />
      </button>
    </div>
  );
}

export function Notices(): JSX.Element | null {
  return (
    <>
      {largeNotice.value && <Notice kind="info" message={t('notice.large')} onDismiss={dismissLargeNotice} />}
      {copyFailed.value && <Notice kind="error" message={t('status.copy_failed')} onDismiss={dismissCopyFailed} />}
    </>
  );
}
