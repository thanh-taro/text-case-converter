---
id: CMP-InputArea
title: Input area
status: ready
tokens: []
---

## Purpose

Where the user types or pastes the text to convert.

## Anatomy

- Multi-line text field.
- Placeholder (COPY-placeholder.input) when empty.
- Clear action (COPY-action.clear), available when non-empty.

## Variants & states

| Variant / state | Description                                                                |
| --------------- | -------------------------------------------------------------------------- |
| empty           | Placeholder shown; clear hidden; results show COPY-result.empty (RULE-09). |
| single-line     | One line of input.                                                         |
| multi-line      | Several lines; each converts independently (RULE-03).                      |
| large           | Past the RULE-08 cap; CMP-Notice shows COPY-notice.large once.             |

## Behavior

Editing updates the results after a short settle delay (RULE-08, NFR-02). Clear empties the
input and returns to the empty state. Paste is treated the same as typing. The field text is mono
at `font.size.input` (16px, so mobile browsers do not zoom on focus).

## Layout

The Clear control sits at the top trailing corner; the field reserves right padding so text never
runs under it.

## Accessibility

The field has a programmatically associated label (COPY-label.input) — not a placeholder as the
only name. A standard editable text field, fully keyboard operable; the clear action has an
accessible name (COPY-action.clear) and meets `size.targetMin`, growing to `size.touchTarget` on
coarse pointers.
