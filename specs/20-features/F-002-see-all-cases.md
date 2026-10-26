---
id: F-002
title: See every case at once
status: shipped
milestone: M-1
priority: P0
personas: [PER-01]
entities: [ENT-Input, ENT-Token, ENT-CaseKind, ENT-Result]
rules: [RULE-01, RULE-01b, RULE-02, RULE-04, RULE-05, RULE-06, RULE-08, RULE-09]
screens: [SCR-Converter]
components: [CMP-ResultGrid, CMP-ResultRow]
nfr: [NFR-02, NFR-03]
events: []
depends_on: [F-001]
---

## Intent

The heart of the tool: for whatever is in the input, show every case at once so the user
never has to pick a target first (PRN-02), with acronyms and numbers handled the way a developer
expects (PRN-03).

## Scope

- In: computing and showing every case kind live; tokenization; casing and Unicode handling.
- Out: copying a result (F-003); the per-line mechanics of a list (F-004, this feature covers a
  single line); choosing or hiding cases (non-goal for M-1).

## Requirements

- **R1** For any non-empty input, the tool shows a result for each case kind
  (RULE-01, RULE-01b) at the same time, without the user selecting a target case; all
  outputs are deterministic for a given input and the active preferences (INV-02).
- **R2** Results update live as the input changes, within the responsiveness cap, and always
  describe the current input (RULE-08, NFR-02, INV-05).
- **R3** Token-based kinds split the input into tokens by RULE-02, handling existing delimiters,
  camel/Pascal boundaries, acronym runs, and attached digits.
- **R4** Casing is locale-independent and non-cased characters pass through unchanged in every
  result (RULE-05, INV-04).
- **R5** Title Case and Sentence case follow RULE-04 (no stop-word list); within-token acronyms
  are normalized per RULE-06.
- **R6** UPPERCASE and lowercase are character-based (RULE-01b): they fold case across the whole
  input and preserve every delimiter and the line structure.
- **R7** When the input is empty, every result is empty (RULE-09).

## Acceptance criteria

- **AC1** Given the input `getUserID`, when it is converted, then the results are: camelCase `getUserId`, PascalCase `GetUserId`, snake_case `get_user_id`, kebab-case `get-user-id`, CONSTANT_CASE `GET_USER_ID`, dot.case `get.user.id`, path/case `get/user/id`, Title Case `Get User Id`, Sentence case `Get user id`, UPPERCASE `GETUSERID`, lowercase `getuserid`. (R1, R3, R5, R6)
- **AC2** Given the input `HTTPResponse`, when it is converted, then snake_case is `http_response`, camelCase is `httpResponse`, and PascalCase is `HttpResponse`. (R3, R5)
- **AC3** Given the input `parseURLToString`, when it is converted, then snake_case is `parse_url_to_string`. (R3)
- **AC4** Given the input `userID2`, when it is converted, then snake_case is `user_id2` (digits stay attached to their token). (R3)
- **AC5** Given the input `v2Point5`, when it is converted, then snake_case is `v2_point5` and camelCase is `v2Point5`. (R3)
- **AC6** Given the input `utf8Decode`, when it is converted, then snake_case is `utf8_decode` and kebab-case is `utf8-decode`. (R3)
- **AC7** Given the input `already_snake_case`, when it is converted, then camelCase is `alreadySnakeCase`, kebab-case is `already-snake-case`, and Title Case is `Already Snake Case`. (R3)
- **AC8** Given the input `Hello, World!`, when it is converted, then snake_case is `hello_world`, camelCase is `helloWorld`, UPPERCASE is `HELLO, WORLD!` and lowercase is `hello, world!` (character-based kinds preserve the comma, space and exclamation mark). (R3, R6)
- **AC9** Given the input `caféCrème`, when it is converted, then snake_case is `café_crème` and Title Case is `Café Crème` (accented letters are cased; no mojibake). (R4)
- **AC10** Given an input made only of non-cased characters, e.g. `日本語`, when it is converted, then every token-based result is `日本語` unchanged. (R4)
- **AC11** Given the input is empty, when the grid is shown, then every result row shows COPY-result.empty. (R7)
- **AC12** Given any input, when it is converted, then a result for every case kind (RULE-01) is shown at once with no step where the user chooses a target case. (R1)
- **AC13** Given the input `hello`, when the user appends ` world`, then every result updates to reflect `hello world` with no convert action, and each result corresponds to the current input. (R2)
- **AC14** Given the input `the lord of the rings`, when it is converted, then Title Case is `The Lord Of The Rings` and Sentence case is `The lord of the rings` (no stop-word list, RULE-04). (R5)
- **AC15** Given the input `BIG`, when it is converted, then lowercase is `big` using locale-independent folding (a Turkish locale would wrongly give the dotless `bıg`). (R4)
- **AC16** Given the input `日Foo` (a caseless letter followed by a capitalized word), when it is converted, then it stays a single token — snake_case and camelCase are both `日foo` — because no boundary is inserted at the script change (a caseless letter is neither lowercase nor a digit, RULE-02, RULE-05). (R3, R4)

## UX notes

CMP-ResultGrid of CMP-ResultRow on SCR-Converter, one row per case in the RULE-01 order. Each
row's label is that case's copy string (e.g. COPY-case.snake). Accessible name
COPY-label.results.

## Edge cases

- A single token (`foo`) → camel/snake/kebab/dot/path are `foo`, Pascal/Title are `Foo`,
  CONSTANT/UPPER are `FOO`.
- Leading/trailing/repeated delimiters (`__foo--bar__`) collapse to tokens `foo`, `bar`
  (RULE-02); the character-based kinds keep them (`__FOO--BAR__`).
- A number-only input (`2024`) has one caseless token: every result is `2024`.

## Open questions
