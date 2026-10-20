// MOD-App — the status bar (CMP-StatusBar): line count + privacy statement + source-code link.
// Implements: F-004.R4 (line count), F-006.R1 (privacy statement always visible),
// F-006.R4 (link to the public source; new page, no opener, no referrer).
import type { JSX } from 'preact';
import { formatCount, t } from '../../copy';
import { lineCount } from '../state';
import { GitHubMark } from './Icon';

/** The tool's public source repository (specs/40-technical/platform-mapping.md). A constant, never built from input. */
export const SOURCE_URL = 'https://github.com/thanh-taro/text-case-converter';

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
      <a
        class="status__source"
        href={SOURCE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('link.source_a11y')}
      >
        <GitHubMark />
        <span class="status__source-text">{t('link.source')}</span>
      </a>
    </div>
  );
}
