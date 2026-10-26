---
id: F-012
title: See which case the input is in
status: shipped
milestone: M-3
priority: P1
personas: [PER-01]
entities: [ENT-Result, ENT-CaseKind, ENT-Preferences]
rules: [RULE-03, RULE-08, RULE-09, RULE-13, RULE-17]
screens: [SCR-Converter]
components: [CMP-ResultGrid, CMP-ResultRow]
nfr: [NFR-02, NFR-04, NFR-06]
events: []
depends_on: [F-002]
---

## Intent

When the user pastes an identifier, they often want to know what convention it already follows
before picking a new one. Marking the rows that equal the input answers that at a glance, with
no extra step (PRN-02).

## Scope

- In: a matches-input badge (COPY-badge.matches_input) on every row whose result equals the
  whole input (RULE-17), updated live.
- Out: guessing a single "most likely" case or suggesting a target case (M-4 candidate);
  changing row order because of a match; partial or per-line matches.

## Requirements

- **R1** Every case kind whose result, under the current preferences, equals the whole input
  shows the matches-input badge on its row; rows that don't match show no badge (RULE-17).
- **R2** The badge updates live when the input or a preference changes, within the RULE-08
  settle behaviour (NFR-02).
- **R3** An empty input shows no matches-input badge (RULE-09).
- **R4** The match only marks rows: it never changes a result's text or the row order, and it
  appears in every sort mode and alongside the last-used badge (RULE-13, INV-02).
- **R5** The badge is exposed as text to assistive technology as part of its row's description,
  not by colour alone (NFR-04).

## Acceptance criteria

- **AC1** Given the input `get_user_id` with Strip symbols on (the default), when it is converted, then the snake_case row shows the
  matches-input badge and no other row does. (R1)
- **AC2** Given the input `user`, when it is converted, then exactly camelCase, snake_case,
  kebab-case, dot.case, path/case and lowercase show the badge. (R1)
- **AC3** Given the input `Hello there, World!` with Strip symbols on, when it is converted, then
  no row shows the badge. (R1)
- **AC4** Given the input `getUserID` with Keep acronyms off, when it is converted, then no row
  shows the badge; when the user turns Keep acronyms on, then camelCase shows it. (R1, R2)
- **AC5** Given the input `get_user_id` with Strip symbols on and the snake_case row showing the badge, when the user
  types `-x` at the end, then after the input settles no row shows the badge. (R2)
- **AC6** Given the input is empty, when the grid is shown, then no row shows the badge. (R3)
- **AC7** Given the two-line input `first_name` / `last_name` with Strip symbols on, when it is
  converted, then
  snake_case shows the badge; given `first_name` / `lastName`, then no row does. (R1)
- **AC8** Given the snake_case row matches and was the last case copied, when the user switches
  to each sort mode, then the snake_case row shows both badges, and every result's text is
  unchanged. (R4)
- **AC9** Given the snake_case row matches, when a screen reader focuses its copy action, then
  the badge text is announced as part of the row's description. (R5)
- **AC10** Given a row with both badges at 320 px wide in each supported language, when it is
  shown, then neither badge is clipped or covered and there is no horizontal scrollbar. (R4)
- **AC11** Given the input `user` followed by a line break, when it is converted, then snake_case
  shows the badge. (R1)

## UX notes

CMP-ResultRow shows COPY-badge.matches_input beside the label, styled as a quieter sibling of the
last-used badge. In CMP-ResultGrid several rows can carry it at once.

## Edge cases

- Trailing spaces stop a match (results have none), except lowercase/UPPERCASE with Strip symbols
  off. A trailing line break keeps a match, because results keep the empty last line (RULE-03).
- With Strip symbols off, lowercase keeps separators, so `get_user_id` also matches lowercase.
- With Strip symbols on, an input containing symbols that the kind would keep cannot match.
- An input of only digits (e.g. `123`) matches all thirteen kinds.

## Open questions
