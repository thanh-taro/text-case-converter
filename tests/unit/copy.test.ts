// MOD-Copy (ADR-0007). Titles cite the spec (adapters/tests.md).
import { describe, expect, it } from 'vitest';
import { MESSAGES, t } from '../../src/copy';
import { CASE_IDS } from '../../src/engine';

describe('copy catalog', () => {
  it('has a label for every case kind (RULE-01)', () => {
    for (const id of CASE_IDS) expect(MESSAGES[`case.${id}` as keyof typeof MESSAGES]).toBeTruthy();
  });
  it('fills placeholders (COPY-status.copied, COPY-action.copy_row)', () => {
    expect(t('status.copied', { case: 'snake_case' })).toBe('Copied snake_case');
    expect(t('action.copy_row', { case: 'camelCase' })).toBe('Copy camelCase');
  });
  it('returns plain text when there are no placeholders', () => {
    expect(t('action.clear')).toBe('Clear');
  });
});
