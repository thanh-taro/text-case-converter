---
id: CMP-ResultGrid
title: Result grid
status: ready
tokens: []
---

## Purpose

Shows all eleven cases for the current input at once (PRN-02), each copyable.

## Anatomy

- An ordered list of CMP-ResultRow, one per case kind (RULE-01, RULE-01b), each labelled by its
  copy string: COPY-case.camel, COPY-case.pascal, COPY-case.snake, COPY-case.kebab,
  COPY-case.constant, COPY-case.dot, COPY-case.path, COPY-case.title, COPY-case.sentence,
  COPY-case.upper, COPY-case.lower.
- Row order is the default RULE-01 order shown above, or (M-2) the active sort mode and pins
  (RULE-13). The set of eleven rows never changes — only their order.

## Variants & states

| Variant / state | Description                                                                      |
| --------------- | -------------------------------------------------------------------------------- |
| default         | Every row shows its result for the current input, in RULE-01 order.              |
| empty           | Input empty; every row shows COPY-result.empty; rows are not copyable (RULE-09). |
| multi-line      | Each row shows the per-line result, preserving line structure (RULE-03).         |
| sorted (M-2)    | Rows ordered by the active sort mode (RULE-13); same eleven rows.                 |
| pinned (M-2)    | Pinned cases float to the top, keeping the active sort within groups (RULE-13).   |

## Behavior

Rows update live with the input (RULE-08). The grid never requires the user to pick a target
case first.

## Style

Not a card (style Principle 1): rows sit on the page background separated by `line` hairlines,
with no outer border or radius. The bordered-surface treatment is reserved for the input and
notices.

## Accessibility

A labelled group named COPY-label.results. Rows are reachable and operable by keyboard in visual
order.
