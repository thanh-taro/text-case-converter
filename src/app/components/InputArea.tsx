// MOD-App — the input area (CMP-InputArea). Implements: F-001.R1, F-001.R2, F-001.R3, F-001.R4.
import type { JSX } from 'preact';
import { t } from '../../copy';
import { clearInput, input, isEmpty, setInput } from '../state';
import { Icon } from './Icon';

export function InputArea(): JSX.Element {
  return (
    <div class="inputwrap">
      <label class="inputlabel" for="tcc-input">
        {t('label.input')}
      </label>
      <textarea
        id="tcc-input"
        class="input"
        rows={3}
        spellcheck={false}
        autocapitalize="off"
        autocorrect="off"
        placeholder={t('placeholder.input')}
        value={input.value}
        onInput={(e) => setInput((e.currentTarget as HTMLTextAreaElement).value)}
      />
      {!isEmpty.value && (
        <button type="button" class="clear" onClick={clearInput} aria-label={t('action.clear')}>
          <Icon name="x" />
          {t('action.clear')}
        </button>
      )}
    </div>
  );
}
