---
id: CMP-ResultGrid
title: Result grid
status: ready
tokens: []
---

## Purpose

Shows every case kind (RULE-01) for the current input at once (PRN-02), each copyable.

## Anatomy

- An ordered list of CMP-ResultRow, one per case kind (RULE-01, RULE-01b), each labelled by its
  copy string: COPY-case.camel, COPY-case.pascal, COPY-case.snake, COPY-case.kebab,
  COPY-case.train, COPY-case.constant, COPY-case.cobol, COPY-case.dot, COPY-case.path, COPY-case.title, COPY-case.sentence,
  COPY-case.upper, COPY-case.lower.
- Row order is the default RULE-01 order shown above, or (M-2) the active sort mode and pins
  (RULE-13). The set of rows never changes — only their order.

## Variants & states

| Variant / state | Description                                                                      |
| --------------- | -------------------------------------------------------------------------------- |
| default         | Every row shows its result for the current input, in RULE-01 order.              |
| empty           | Input empty; every row shows COPY-result.empty; rows are not copyable (RULE-09). |
| multi-line      | Each row shows the per-line result, preserving line structure (RULE-03).         |
| sorted (M-2)    | Rows ordered by the active sort mode (RULE-13); same rows.                 |
| matched (M-3)   | Every row whose result equals the input shows COPY-badge.matches_input (RULE-17). |
| pinned (M-2)    | Pinned cases float to the top, keeping the active sort within groups (RULE-13).   |

## Behavior

Rows update live with the input (RULE-08), and so do matches-input badges (RULE-17). The grid never requires the user to pick a target
case first.

## Style

Not a card (style Principle 1): rows sit on the page background separated by `line` hairlines,
with no outer border or radius. The bordered-surface treatment is reserved for the input and
notices.

## Accessibility

A labelled composite widget named COPY-label.results that assistive technology treats as
interactive, so arrow keys reach it in a screen reader's default mode (the exact role is a
technical choice, platform-mapping.md). Rows are reachable and operable by keyboard in visual
order. From M-3 (F-014) the grid is a single Tab stop: Arrow Up/Down, Home and End move between
rows keeping the same action, Arrow Left/Right switch between a row's copy and pin actions, and
Tab leaves the grid; re-entering returns to the last-focused row. Focus follows a case when its
row moves (pin, sort, a copy in the recently-copied sort). When copy actions are unavailable
(empty input), entering the grid focuses the remembered (or first) row's pin action.
