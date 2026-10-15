---
id: F-008
title: Strip symbols
status: shipped
milestone: M-2
priority: P1
personas: [PER-01]
entities: [ENT-Preferences, ENT-Token, ENT-Result]
rules: [RULE-01b, RULE-02, RULE-03, RULE-08, RULE-11, RULE-12, RULE-14]
screens: [SCR-Converter]
components: [CMP-Controls, CMP-ResultGrid]
nfr: [NFR-02, NFR-04]
events: []
depends_on: [F-002]
---

## Intent
Let the user get clean, ASCII-alphanumeric-only results in one toggle, so stray punctuation,
whitespace, accents and non-Latin characters in the source don't leak into identifiers (PRN-03).

## Scope
- In: a toggle that reduces every result's words to ASCII letters and digits only (RULE-11),
  live and remembered (RULE-14).
- Out: folding accents while keeping symbols (that's F-009); choosing which cases it applies to
  (it applies to all); editing the input itself (the input is untouched).

## Requirements
- **R1** The user can turn Strip symbols on and off; it is on by default and its state is
  remembered on the device (RULE-14).
- **R2** When on, every result is built from the RULE-02 tokens reduced to ASCII letters and
  digits — accented Latin letters folded to their ASCII base, all other non-ASCII-alphanumeric
  characters (symbols, whitespace, non-Latin letters) dropped (RULE-11).
- **R3** Token-based kinds keep their own separators; the character-based kinds (UPPERCASE,
  lowercase) render the cleaned tokens joined by single spaces (RULE-11, RULE-01b).
- **R4** Toggling re-renders all results live (RULE-08, NFR-02); the input text is never changed.
- **R5** When on and a line reduces to no ASCII-alphanumeric characters, that line's result is
  empty (RULE-11, RULE-03).

## Acceptance criteria
- **AC1** Given the input `café, v2!` with Strip symbols on, when converted, then snake_case is `cafe_v2`, kebab-case is `cafe-v2`, UPPERCASE is `CAFE V2`, and lowercase is `cafe v2`. (R2, R3)
- **AC2** Given the same input with Strip symbols off, when converted, then UPPERCASE is `CAFÉ, V2!` (accents and punctuation kept). (R2)
- **AC3** Given the input `Nguyễn 日本` with Strip symbols on, when converted, then snake_case is `nguyen` (the Latin word folds to ASCII, the CJK token drops to empty). (R2, R5)
- **AC4** Given Strip symbols on, when the user turns it off, then every result returns to its un-stripped form with no input change, live. (R1, R4)
- **AC5** Given the user set Strip symbols on, when they reopen the tool, then Strip symbols is still on (RULE-14). (R1)
- **AC6** Given the input `  !!!  ` with Strip symbols on, when converted, then every result is empty. (R5)
- **AC7** Given a device that has never set Strip symbols, when the tool opens, then Strip symbols is on and UPPERCASE of `café` is `CAFE`. (R1)
- **AC8** Given per-device storage is unavailable, when the tool opens, then it starts with default preferences (Strip symbols on) and any changes apply for the session only (RULE-14). (R1)

## UX notes
CMP-Controls: COPY-action.strip toggle. Results update in CMP-ResultGrid.

## Edge cases
- Strip and Remove accents (F-009) can both be on; Strip already folds accents, so the visible
  result is the same as Strip alone.
- Digits are ASCII-alphanumeric and always kept.

## Open questions
