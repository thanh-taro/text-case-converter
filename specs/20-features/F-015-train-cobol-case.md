---
id: F-015
title: Train-Case and COBOL-CASE
status: building
milestone: M-3
priority: P2
personas: [PER-01]
entities: [ENT-CaseKind, ENT-Result]
rules: [RULE-01, RULE-02, RULE-03, RULE-11, RULE-12, RULE-13, RULE-16, RULE-17]
screens: [SCR-Converter]
components: [CMP-ResultGrid, CMP-ResultRow]
nfr: [NFR-02, NFR-03, NFR-06]
events: []
depends_on: [F-002]
---

## Intent

HTTP header names (`Content-Type`) and COBOL or some config keys (`MAX-RETRY-COUNT`) use
hyphenated capitalised styles the tool does not offer. Adding them keeps "every case at once"
true for these users (PRN-02).

## Scope

- In: two more token-based case kinds, Train-Case and COBOL-CASE (RULE-01), shown, copied,
  sorted, pinned and matched like every other kind.
- Out: more kinds (e.g. Ada_Case, flatcase) unless asked for.

## Requirements

- **R1** The grid shows a Train-Case result: every token's first cased letter uppercased, the
  rest lowercased, joined with `-` (RULE-01).
- **R2** The grid shows a COBOL-CASE result: every token uppercased, joined with `-` (RULE-01).
- **R3** Both kinds take part in everything that applies to case kinds: per-line conversion,
  strip symbols, remove accents, keep acronyms (Train-Case only), copy, sort, pin, last-used and
  matches-input badges (RULE-03, RULE-11, RULE-12, RULE-13, RULE-16, RULE-17).
- **R4** In the default order Train-Case follows kebab-case and COBOL-CASE follows CONSTANT_CASE
  (RULE-01); the A–Z sort places them by their labels (RULE-13).

## Acceptance criteria

- **AC1** Given the input `content type`, when converted, then Train-Case is `Content-Type` and
  COBOL-CASE is `CONTENT-TYPE`. (R1, R2)
- **AC2** Given the input `getHTTPResponse2` with Keep acronyms off (the default), when converted,
  then Train-Case is `Get-Http-Response2` and COBOL-CASE is `GET-HTTP-RESPONSE2`; with Keep
  acronyms on, Train-Case is `Get-HTTP-Response2`. (R1, R2, R3)
- **AC3** Given the two-line input `first name` / `last name`, when converted, then Train-Case is
  `First-Name` / `Last-Name`. (R3)
- **AC4** Given the input `Content-Type`, when converted, then the Train-Case row shows the
  matches-input badge. (R3)
- **AC5** Given the default order, when the grid is shown, then the rows read camelCase,
  PascalCase, snake_case, kebab-case, Train-Case, CONSTANT_CASE, COBOL-CASE, dot.case, path/case,
  Title Case, Sentence case, UPPERCASE, lowercase. (R4)
- **AC6** Given the A–Z sort, when the grid is shown, then the rows read camelCase, COBOL-CASE, CONSTANT_CASE, dot.case, kebab-case, lowercase, PascalCase, path/case, Sentence case, snake_case, Title Case, Train-Case, UPPERCASE. (R4)
- **AC7** Given the user activates the Train-Case row, when the copy succeeds, then the
  Train-Case result is copied and the row gets the last-used badge. (R3)

## UX notes

Two more CMP-ResultRow rows, labelled COPY-case.train and COPY-case.cobol.

## Edge cases

- A device whose remembered recent-use order or pins predate M-3 simply has no entry for the new
  kinds; they follow in default order (RULE-13).

## Open questions
