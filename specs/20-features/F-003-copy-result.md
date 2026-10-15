---
id: F-003
title: Copy a result
status: shipped
milestone: M-1
priority: P0
personas: [PER-01]
entities: [ENT-Result]
rules: [RULE-07, RULE-09]
screens: [SCR-Converter]
components: [CMP-ResultRow, CMP-Notice]
nfr: [NFR-01, NFR-04]
events: []
depends_on: [F-002]
---

## Intent

Let the user take the case they want in a single click, with clear confirmation and no risk to
their privacy (PRN-01).

## Scope

- In: copying one result's full text to the clipboard; confirming the copy.
- Out: copying the whole grid at once (non-goal); downloading a file (non-goal for M-1).

## Requirements

- **R1** Activating a result copies that result's full text (all lines) to the clipboard
  (RULE-07).
- **R2** A brief confirmation (COPY-status.copied) is shown and announced to assistive
  technology (NFR-04).
- **R3** Copying happens only on an explicit user action and writes nothing anywhere else
  (PRN-01, INV-01); the clipboard is written only on that action.
- **R4** When the input is empty, result rows are not activatable and nothing can be copied
  (RULE-09).
- **R5** If the clipboard write fails or is refused by the browser, the result is unchanged and a
  failure message (COPY-status.copy_failed) is shown and announced (NFR-04); the user can still
  select the text manually.

## Acceptance criteria

- **AC1** Given the input `hello world` and the snake_case row, when the user activates it, then
  the clipboard contains `hello_world` and COPY-status.copied is shown. (R1, R2)
- **AC2** Given a multi-line input, when the user copies the kebab-case row, then the clipboard
  contains every converted line separated by line breaks. (R1)
- **AC3** Given any copy action, when it completes, then no network request is made and nothing
  is stored beyond the clipboard write the user asked for. (R3)
- **AC4** Given the input is empty, when the user tries to activate a result row, then nothing is
  copied and no confirmation is shown. (R4)
- **AC5** Given a result was copied, when the confirmation appears, then it is announced once per
  copy action, not repeatedly. (R2)
- **AC6** Given a result row, when the clipboard write is refused by the browser, then no text is
  copied, the result is unchanged, and COPY-status.copy_failed is shown and announced. (R5)

## UX notes

CMP-ResultRow is itself the copy target (COPY-action.copy_row with the case name); confirmation
COPY-status.copied. No separate copy button step.

## Edge cases

- Clipboard access denied by the browser → handled by R5: result unchanged, COPY-status.copy_failed
  shown via CMP-Notice, no crash.
- Copying the UPPERCASE/lowercase result copies the character-folded text exactly as shown.

## Open questions
