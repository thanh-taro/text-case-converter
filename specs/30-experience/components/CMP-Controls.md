---
id: CMP-Controls
title: Options bar
status: draft
tokens: []
---

## Purpose
A thin options bar (M-2) for the two transforms and the result ordering, between the input and the
result grid.

## Anatomy
- Strip-symbols toggle (COPY-action.strip, RULE-11).
- Remove-accents toggle (COPY-action.accents, RULE-12).
- Sort control (COPY-label.sort) with options COPY-sort.default / COPY-sort.recent / COPY-sort.alpha
  (RULE-13).

## Variants & states
| Variant / state | Description                                                             |
| --------------- | ----------------------------------------------------------------------- |
| default         | Both toggles off, sort = COPY-sort.default (first-run defaults, RULE-14) |
| toggled         | One or both transforms on; the grid reflects them live                   |
| restored        | Opened with remembered preferences (RULE-14)                            |

## Behavior
Changing a toggle re-renders every result live (RULE-11/RULE-12, within the RULE-08 cap).
Changing the sort reorders the grid (RULE-13) without changing any result text. Every change is
saved to preferences (RULE-14).

## Accessibility
A labelled group named COPY-label.options. Toggles are switches with an on/off state announced;
the sort control is a labelled selector; all reachable and operable by keyboard, each at least
`size.targetMin` (→ `size.touchTarget` on coarse pointers).
