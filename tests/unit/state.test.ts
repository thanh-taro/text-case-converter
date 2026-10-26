// MOD-App state (F-001, F-003, F-004, RULE-08/09). Titles cite the spec (adapters/tests.md).
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  announcement,
  clearInput,
  copiedCase,
  copyFailed,
  isEmpty,
  LARGE_INPUT,
  largeNotice,
  lineCount,
  markCopied,
  markCopyFailed,
  results,
  setInput,
} from '../../src/app/state';

beforeEach(() => {
  vi.useFakeTimers();
  clearInput();
  largeNotice.value = false;
  copyFailed.value = false;
  copiedCase.value = null;
  announcement.value = '';
});
afterEach(() => vi.useRealTimers());

describe('F-001 input', () => {
  it('F-001.AC1 typing updates the results after settling (RULE-08)', () => {
    setInput('getUserID');
    expect(isEmpty.value).toBe(false);
    vi.advanceTimersByTime(200);
    expect(results.value.snake).toBe('get_user_id');
  });
  it('F-001.AC3 multi-line input is kept as separate lines', () => {
    setInput('a\nb\nc');
    expect(lineCount.value).toBe(3);
  });
  it('F-001.AC2 clear returns to the empty state (RULE-09)', () => {
    setInput('x');
    clearInput();
    expect(isEmpty.value).toBe(true);
    expect(results.value.snake).toBe('');
  });
  it('F-001.AC4 / F-001.AC5 large input shows the notice once and still settles', () => {
    setInput('a'.repeat(LARGE_INPUT + 1));
    expect(largeNotice.value).toBe(true);
    largeNotice.value = false;
    setInput('b'.repeat(LARGE_INPUT + 2));
    expect(largeNotice.value).toBe(false); // once per session
    vi.advanceTimersByTime(400);
    expect(results.value.lower.length).toBe(LARGE_INPUT + 2);
  });
});

describe('F-003 copy feedback', () => {
  it('F-003.AC5 markCopied flashes the row and announces the case', () => {
    markCopied('snake', 'Copied snake_case');
    expect(copiedCase.value).toBe('snake');
    expect(announcement.value).toBe('Copied snake_case');
  });
  it('F-003.AC6 markCopyFailed shows the failure and announces it', () => {
    markCopyFailed('Couldn’t copy');
    expect(copyFailed.value).toBe(true);
    expect(announcement.value).toBe('Couldn’t copy');
  });
});

describe('F-004 line count', () => {
  it('F-004.AC4 shows a count for multi-line input', () => {
    setInput('a\nb');
    expect(lineCount.value).toBe(2);
  });
  it('F-004.AC5 shows no count for single-line input', () => {
    setInput('a');
    expect(lineCount.value).toBe(1);
  });
});

describe('F-011 live language switch', () => {
  it('F-011.AC3 a language switch clears the last announcement (no old-language live text)', async () => {
    const { language } = await import('../../src/copy');
    markCopied('snake', 'Đã sao chép snake_case');
    language.value = 'en-US' === language.value ? 'vi-VN' : 'en-US';
    expect(announcement.value).toBe('');
    language.value = 'en-US';
  });
});
