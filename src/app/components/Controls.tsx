// MOD-App — the options bar (CMP-Controls): strip/accents switches + sort selector (M-2).
// Implements: F-008.R1, F-009.R1, F-010.R1, F-013.R1; RULE-11/12/13/16; NFR-04/NFR-08.
import type { JSX } from 'preact';
import { t } from '../../copy';
import type { SortMode } from '../../prefs';
import {
  keepAcronyms,
  removeAccents,
  setKeepAcronyms,
  setRemoveAccents,
  setSortMode,
  setStripSymbols,
  sortMode,
  stripSymbols,
} from '../state';

const SORTS: { mode: SortMode; id: 'sort.default' | 'sort.recent' | 'sort.alpha' }[] = [
  { mode: 'default', id: 'sort.default' },
  { mode: 'recent', id: 'sort.recent' },
  { mode: 'alphabetical', id: 'sort.alpha' },
];

function Switch({ label, on, onChange }: { label: string; on: boolean; onChange: (on: boolean) => void }): JSX.Element {
  return (
    <button
      type="button"
      class={`switch${on ? ' switch--on' : ''}`}
      role="switch"
      aria-checked={on ? 'true' : 'false'}
      onClick={() => onChange(!on)}
    >
      <span class="switch__track" aria-hidden="true">
        <span class="switch__thumb" />
      </span>
      {label}
    </button>
  );
}

export function Controls(): JSX.Element {
  return (
    <div class="controls" role="group" aria-label={t('label.options')}>
      <Switch label={t('action.strip')} on={stripSymbols.value} onChange={setStripSymbols} />
      <Switch label={t('action.accents')} on={removeAccents.value} onChange={setRemoveAccents} />
      <Switch label={t('action.acronyms')} on={keepAcronyms.value} onChange={setKeepAcronyms} />
      <label class="sort">
        <span class="sort__label">{t('label.sort')}</span>
        <select
          class="sort__select"
          value={sortMode.value}
          onChange={(e) => setSortMode((e.currentTarget as HTMLSelectElement).value as SortMode)}
        >
          {SORTS.map(({ mode, id }) => (
            <option key={mode} value={mode}>
              {t(id)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
