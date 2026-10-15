---
id: F-001
title: Enter and clear text
status: building
milestone: M-1
priority: P0
personas: [PER-01]
entities: [ENT-Input]
rules: [RULE-03, RULE-08, RULE-09]
screens: [SCR-Converter]
components: [CMP-InputArea, CMP-Notice]
nfr: [NFR-02]
events: []
depends_on: []
---

## Intent

Give the user one place to put the text they want converted — a single name, a phrase, or a
whole list — and a quick way to start over (PRN-02).

## Scope

- In: typing and pasting text; clearing it; accepting multi-line input.
- Out: converting the text (F-002); copying a result (F-003); file upload (non-goal for M-1).

## Requirements

- **R1** The user can type or paste text into the input, and the shown results reflect the
  current text.
- **R2** The user can clear the input in one action; clearing returns the screen to the empty
  state (RULE-09). The clear action is unavailable when the input is already empty.
- **R3** Multi-line input is accepted and kept as separate lines (RULE-03).
- **R4** As the input changes, results recompute once the input settles and the interface never
  freezes (RULE-08, NFR-02).
- **R5** When the input passes the RULE-08 cap, a notice (COPY-notice.large) is shown once per
  session and results update after the input stops changing (RULE-08).

## Acceptance criteria

- **AC1** Given the input is empty, when the user types `hello world`, then the results update to
  reflect `hello world` and the clear action becomes available. (R1, R2)
- **AC2** Given the input contains `hello world`, when the user clears it, then the input is
  empty, the placeholder (COPY-placeholder.input) is shown, and every result row shows
  COPY-result.empty. (R2)
- **AC3** Given the input is empty, when the user pastes three lines of text, then the input
  holds three lines and the results are computed per line. (R3)
- **AC4** Given a large input past the RULE-08 cap, when the user keeps typing, then the
  interface stays responsive and results update once typing settles. (R4)
- **AC5** Given the input crosses the RULE-08 cap for the first time this session, when it does,
  then COPY-notice.large is shown once (not again on later keystrokes within the session) and can
  be dismissed. (R5)

## UX notes

CMP-InputArea on SCR-Converter: placeholder COPY-placeholder.input, clear action
COPY-action.clear. Accessible name COPY-label.input. Past the RULE-08 cap, CMP-Notice shows
COPY-notice.large once per session.

## Edge cases

- Pasting text with trailing blank lines keeps those lines (they convert to empty lines, RULE-03).
- Whitespace-only input is treated as having no word characters: results are empty per line.

## Open questions
