---
id: F-004
title: Convert a list line by line
status: shipped
milestone: M-1
priority: P1
personas: [PER-01]
entities: [ENT-Input, ENT-Result]
rules: [RULE-03, RULE-09]
screens: [SCR-Converter]
components: [CMP-ResultGrid, CMP-StatusBar]
nfr: [NFR-02]
events: []
depends_on: [F-002, F-003]
---

## Intent

Let a developer paste a list — a column of database fields, a set of names — and get the whole
list back in the case they want, which editors do one selection at a time (PRN-04).

## Scope

- In: converting each input line independently and keeping the list shape; showing the line
  count; copying the whole converted list (via F-003).
- Out: sorting, de-duplicating, or reordering lines (non-goal); CSV/column parsing (non-goal).

## Requirements

- **R1** Each line of the input is tokenized and converted independently; one line never affects
  another (RULE-03).
- **R2** A result preserves the number of lines and keeps blank lines blank (INV-03 for
  token-based kinds, INV-04 for character-based kinds; RULE-03).
- **R3** Copying a result copies all of its converted lines (F-003).
- **R4** When the input has more than one line, the line count is shown (COPY-status.lines).

## Acceptance criteria

- **AC1** Given the three-line input `first name` / `last_name` / `EmailAddress`, when it is
  converted to camelCase, then the result is `firstName` / `lastName` / `emailAddress` on three
  lines in the same order. (R1, R2)
- **AC2** Given a four-line input whose second line is blank, when it is converted to snake_case,
  then the result has four lines and the second line is blank. (R2)
- **AC3** Given a multi-line input converted to kebab-case, when the user copies that result,
  then the clipboard contains all lines separated by line breaks. (R3)
- **AC4** Given a two-line input, when it is shown, then the status bar shows COPY-status.lines
  with a count of 2. (R4)
- **AC5** Given a single-line input, when it is shown, then no line count is shown. (R4)
- **AC6** Given the three-line input `alpha` / `beta` / `gamma`, when it is converted to UPPERCASE, then the result is `ALPHA` / `BETA` / `GAMMA` on three lines in the same order (character-based kinds preserve lines too). (R1, R2)
- **AC7** Given the three-line input `foo` / `---` / `bar`, when it is converted, then snake_case is `foo` / (empty) / `bar` and UPPERCASE is `FOO` / `---` / `BAR` (a line with no word characters is empty for token-based kinds and kept as-is for character-based kinds). (R1, R2)

## UX notes

Results in CMP-ResultGrid show the per-line conversion; CMP-StatusBar shows COPY-status.lines
when multi-line.

## Edge cases

- A trailing newline produces a final empty line, which stays empty in the result.
- A line with no word characters (e.g. `---`) converts to an empty line for token-based kinds;
  character-based kinds keep it as-is.

## Open questions
