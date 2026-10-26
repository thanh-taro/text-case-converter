---
id: F-013
title: Keep acronyms
status: draft
milestone: M-3
priority: P1
personas: [PER-01]
entities: [ENT-Preferences, ENT-Token, ENT-Result]
rules: [RULE-01, RULE-02, RULE-05, RULE-06, RULE-08, RULE-11, RULE-12, RULE-14, RULE-16]
screens: [SCR-Converter]
components: [CMP-Controls, CMP-ResultGrid]
nfr: [NFR-02, NFR-03, NFR-04]
events: []
depends_on: [F-002, F-008]
---

## Intent

Many codebases write acronyms in capitals (`getUserID`, `HTTPClient`). By default the tool
normalises them (`getUserId`), which is right for some style guides and wrong for others. A
toggle lets the user keep them as written (PRN-03), removing the RULE-06 known limitation.

## Scope

- In: a Keep acronyms toggle (COPY-action.acronyms), off by default, remembered on the device
  (RULE-14), applied per RULE-16.
- Out: a list of known acronyms (detection is by capitals as written); making a lowercase word
  into an acronym (`id` stays `Id`); per-case-kind choice.

## Requirements

- **R1** The user can turn Keep acronyms on and off; it is off by default and its state is
  remembered on the device (RULE-14).
- **R2** When on, acronyms keep all their capitals in camelCase, PascalCase, Train-Case, Title
  Case and Sentence case, except the first token of a camelCase line, which is lowercased
  (RULE-16).
- **R3** A line with no lowercase letter (all-caps input) is converted as if Keep acronyms were off
  (RULE-16).
- **R4** Kinds that case every letter uniformly are the same whether the toggle is on or off
  (RULE-16).
- **R5** Toggling re-renders all results live; the input text is never changed (RULE-08, NFR-02).
- **R6** When off, every result is exactly what it was before M-3 (RULE-06).

## Acceptance criteria

- **AC1** Given the input `getUserID` with Keep acronyms on, when converted, then camelCase is
  `getUserID`, PascalCase is `GetUserID`, Train-Case is `Get-User-ID`, Title Case is
  `Get User ID`, and snake_case is `get_user_id`. (R2, R4)
- **AC2** Given the input `parseHTTPResponse` with Keep acronyms on, when converted, then
  Sentence case is `Parse HTTP response` and camelCase is `parseHTTPResponse`. (R2)
- **AC3** Given the input `URLParser` with Keep acronyms on, when converted, then camelCase is
  `urlParser` and PascalCase is `URLParser`. (R2)
- **AC4** Given the input `USER_ID` with Keep acronyms on, when converted, then camelCase is
  `userId` and PascalCase is `UserId`. (R3)
- **AC5** Given the input `utf8Encoder ID2` with Keep acronyms on, when converted, then
  PascalCase is `Utf8EncoderID2` (`utf8` is not an acronym as written; `ID2` is). (R2)
- **AC6** Given the input `getUserID` with Keep acronyms on, when the user turns it off, then
  camelCase changes from `getUserID` to `getUserId` live, with no input change. (R5, R6)
- **AC7** Given a device that never set Keep acronyms, when the tool opens, then it is off and
  camelCase of `getUserID` is `getUserId`. (R1, R6)
- **AC8** Given the user turned Keep acronyms on, when they reopen the tool, then it is still on.
  (R1)
- **AC9** Given the input `Café ID` with Keep acronyms, Strip symbols and Remove accents on, when
  converted, then PascalCase is `CafeID`. (R2)
- **AC10** Given any input from the NFR-03 corpus, when converted with Keep acronyms off, then
  every pre-M-3 kind equals its pre-M-3 expected output, and Train-Case and COBOL-CASE equal their
  corpus entries. (R6)
- **AC11** Given the input `MAX_RETRIES_3` with Keep acronyms on, when converted, then camelCase
  is `maxRetries3` and PascalCase is `MaxRetries3`; given `URL` alone, then PascalCase is `Url`.
  (R3)
- **AC12** Given a device whose remembered preferences predate M-3 (no Keep acronyms entry), when
  the tool opens, then Keep acronyms is off and every other remembered preference — toggles, sort,
  pins, recent order — is kept. (R1)

## UX notes

CMP-Controls: COPY-action.acronyms switch, after the two M-2 toggles. Results update in
CMP-ResultGrid.

## Edge cases

- A single capital letter (`aB`, `A`) is never an acronym (needs two cased letters).
- Digits inside an acronym are kept (`ID2`, `MP3`).
- Non-cased tokens (CJK, digits only) are never acronyms and pass through (RULE-05).

## Open questions
