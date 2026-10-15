---
id: F-009
title: Remove accents
status: shipped
milestone: M-2
priority: P1
personas: [PER-01]
entities: [ENT-Preferences, ENT-Token, ENT-Result]
rules: [RULE-01b, RULE-05, RULE-08, RULE-12, RULE-14]
screens: [SCR-Converter]
components: [CMP-Controls, CMP-ResultGrid]
nfr: [NFR-02, NFR-04]
events: []
depends_on: [F-002]
---

## Intent
Let the user fold accented Latin text to plain ASCII letters — e.g. Vietnamese `Nguyễn Đặng` →
`Nguyen Dang` — while keeping punctuation and non-Latin text, so names and words become safe
identifiers (PRN-03).

## Scope
- In: a toggle that folds accented Latin letters to their ASCII base before casing (RULE-12),
  live and remembered (RULE-14).
- Out: removing symbols or non-Latin characters (that's F-008); transliterating non-Latin
  scripts (not supported — they pass through, RULE-05).

## Requirements
- **R1** The user can turn Remove accents on and off; it is off by default and its state is
  remembered on the device (RULE-14).
- **R2** When on, accented Latin letters are folded to their ASCII base before casing per RULE-12
  (NFD + combining-mark removal, plus the `đ`/`ø`/`ß`/`æ`/`œ`/`ł` map); symbols, digits,
  whitespace and non-Latin scripts are left unchanged.
- **R3** Toggling re-renders all results live (RULE-08, NFR-02); the input text is never changed.

## Acceptance criteria
- **AC1** Given the input `Nguyễn Đặng` with Remove accents on, when converted, then snake_case is `nguyen_dang`, Title Case is `Nguyen Dang`, and camelCase is `nguyenDang`. (R2)
- **AC2** Given the input `café, v2!` with Remove accents on, when converted, then snake_case is `cafe_v2` and UPPERCASE is `CAFE, V2!` (the comma and space are kept, unlike F-008). (R2)
- **AC3** Given the input `straße` with Remove accents on, when converted, then lowercase is `strasse` (`ß`→`ss`). (R2)
- **AC4** Given the input `日本 café` with Remove accents on, when converted, then snake_case is `日本_cafe` (CJK unchanged, accent folded). (R2)
- **AC5** Given Remove accents on, when the user turns it off, then results return to their accented form live, with no input change. (R1, R3)
- **AC6** Given the user set Remove accents on, when they reopen the tool, then it is still on (RULE-14). (R1)
- **AC7** Given a device that has never set Remove accents, when the tool opens, then Remove accents is off and snake_case of `café` is `café`. (R1)

## UX notes
CMP-Controls: COPY-action.accents toggle. Results update in CMP-ResultGrid.

## Edge cases
- Combining marks applied to non-Latin bases are left as-is (only Latin letters are folded).
- With both F-008 and F-009 on, F-008 governs (symbols and non-Latin also removed).

## Open questions
