---
id: CMP-Notice
title: Notice
status: ready
tokens: []
---

## Purpose

A brief, dismissible message for occasional conditions (e.g. large input).

## Anatomy

- Message text.
- Dismiss action (COPY-action.dismiss).

## Variants & states

| Variant / state | Description                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| info            | Neutral message on `warnBg` with an info icon, e.g. COPY-notice.large (shown once per session, RULE-08).           |
| error           | Problem message on `dangerBg` with a warning icon, e.g. COPY-status.copy_failed (F-003.R5); stays until dismissed. |
| hidden          | No notice present.                                                                                                 |

## Placement

Below the input area and above the result grid (SCR-Converter reading order: input → notice →
grid → status).

## Behavior

Appears when its condition is met and can be dismissed; does not steal focus from the input. On
dismiss, focus returns to the input.

## Accessibility

Rendered into a pre-existing live region so it is announced politely when it appears; the icon is
decorative (hidden from assistive tech); the dismiss action has an accessible name
(COPY-action.dismiss) and meets `size.targetMin`, growing to `size.touchTarget` on coarse
pointers.
