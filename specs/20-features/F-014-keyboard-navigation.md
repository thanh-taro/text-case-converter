---
id: F-014
title: Move through results with the keyboard
status: shipped
milestone: M-3
priority: P2
personas: [PER-01]
entities: []
rules: [RULE-07, RULE-09, RULE-13]
screens: [SCR-Converter]
components: [CMP-ResultGrid, CMP-ResultRow]
nfr: [NFR-04]
events: []
depends_on: [F-003, F-010]
---

## Intent

Keyboard users currently tab through a copy action and a pin action on every row — over two
dozen stops to reach the last case. Arrow keys inside the grid make any result two or three key
presses away, while Tab still moves past the grid in one step (PRN-06, NFR-04).

## Scope

- In: the result grid as a single Tab stop; Arrow Up/Down, Home and End between rows; Arrow
  Left/Right between a row's copy and pin actions; focus that follows a row when it moves.
- Out: shortcuts outside the grid (e.g. a global "copy camelCase" key); type-ahead search.

## Requirements

- **R1** The result grid is one Tab stop: Tab from the control before it moves focus into the
  grid, and Tab from inside the grid moves to the next control after it (Shift+Tab mirrors this).
- **R2** Entering the grid focuses the row that last had focus there, or the first row the first
  time.
- **R3** Inside the grid, Arrow Down/Up move focus to the next/previous row in visual order, and
  Home/End to the first/last row, keeping the same action (copy or pin); focus does not wrap
  around at either end.
- **R4** Arrow Right/Left move focus between a row's copy action and its pin action.
- **R5** Enter and Space activate the focused action exactly as a click does (RULE-07, F-010).
- **R6** When a row moves because of a pin, a sort change, or a copy in the recently-copied sort,
  focus stays on the same case's action.
- **R7** When the input is empty and copy actions are unavailable (RULE-09), arrows move between
  the rows' pin actions, and entering the grid focuses the remembered row's pin action (the first
  row's the first time).
- **R8** Arrow keys outside the grid (e.g. in the input) keep their normal behaviour.
- **R9** Arrow Left on a copy action and Arrow Right on a pin action do nothing.

## Acceptance criteria

- **AC1** Given a non-empty input, no notice shown, and focus on the sort control (the last control
  of the options bar), when the user presses Tab, then focus moves to the
  first row's copy action; when they press Tab again, then focus leaves the grid to the next
  control after it. (R1, R2)
- **AC2** Given focus on the first row's copy action, when the user presses Arrow Down three
  times, then the fourth row's copy action has focus; when they press Arrow Up, then the third.
  (R3)
- **AC3** Given focus inside the grid, when the user presses End, then the last row's action has
  focus; Home, then the first; Arrow Down on the last row keeps focus there. (R3)
- **AC4** Given focus on a row's copy action, when the user presses Arrow Right, then that row's
  pin action has focus; Arrow Left returns to the copy action; Arrow Down then focuses the next
  row's copy action. (R3, R4)
- **AC5** Given focus left the grid from the fifth row, when the user tabs back into the grid,
  then the fifth row's action has focus. (R2)
- **AC6** Given focus on a copy action, when the user presses Enter (or Space), then that result
  is copied and confirmed as on click. (R5)
- **AC7** Given focus on the pin action of the seventh row, when the user presses Space to pin
  it, then the row moves to the top and its pin action still has focus. (R5, R6)
- **AC8** Given the input is empty, when the user tabs into the grid and presses Arrow Down, then
  focus moves between pin actions. (R7)
- **AC9** Given focus in the input area, when the user presses Arrow Up/Down, then the caret moves
  in the text and focus stays in the input. (R8)
- **AC10** Given a screen reader in its default mode, when the user moves through the grid with
  the arrow keys, then each press moves focus and announces the action's name, the case label and
  the result. (R3)
- **AC11** Given sort = recently copied and focus on the fifth row's copy action, when the user
  presses Enter, then that row moves to the top and its copy action still has focus. (R6)
- **AC12** Given focus on a copy action, when the user presses Arrow Left, then focus does not
  move; given focus on a pin action, Arrow Right does not move it. (R9)

## UX notes

No visible change beyond the existing focus ring (CMP-ResultRow). The pin action becomes visible
when focused, as today.

## Edge cases

- The focused row is pinned or the sort changes while focus is elsewhere → the remembered row is
  still the same case, wherever it moved.

## Open questions
