---
id: CMP-ResultRow
title: Result row
status: ready
tokens: []
---

## Purpose

One case's result, labelled and copyable in a single click.

## Anatomy

- Case label (the case's copy string, e.g. COPY-case.camel), top-aligned to the first value line.
- The converted text for this case (ENT-Result), mono.
- A resting copy icon at the row's trailing edge, signalling the row is copyable.
- The copy target (COPY-action.copy_row): in M-1 the whole row; in M-2 a copy button covering the
  label + value + copy icon, beside the pin button (see Accessibility).
- (M-2) A last-used badge (COPY-badge.last_used) on the most-recently-copied case's row (RULE-13).
- (M-2) A pin control (COPY-action.pin / COPY-action.unpin) to float the case to the top (RULE-13).

## Variants & states

| Variant / state | Description                                                                                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| default         | Label + value + a quiet trailing copy icon; activating copies the value (RULE-07).                                                                               |
| hover/focus     | Row fills with `surface2`; the copy icon strengthens; a 2 px `accent` focus ring.                                                                                |
| empty           | Input empty; shows COPY-result.empty; not activatable (RULE-09).                                                                                                 |
| copied          | A brief "copied" flash: the row tints `successBg` and COPY-status.copied_short appears as an overlay pinned to the trailing edge (it does not reflow the value). |
| last-used (M-2) | Shows the COPY-badge.last_used badge near the label, never split across lines; persists across sorts and sessions until another case is copied (RULE-13). In the stacked (narrow) layout the badge steps aside while the copied flash shows, so the flash never covers it in any language (F-011.AC10).                                   |
| pinned (M-2)    | Pin control is active; the row floats to the top group (RULE-13).                                                                                                |

## Layout

- Wide (≥ `size.stackAt`): label in a `size.labelCol` column, value fills the rest, both
  top-aligned so the label pairs with the first value line even when the value is multi-line.
- Narrow (< `size.stackAt`): label stacks above the value, which takes the full row width; the
  value is never shredded to make room for the copy icon or the copied overlay.

## Behavior

Activating the row (click, tap, or keyboard) copies the full value and flashes the copied state;
focus stays on the row. The copied announcement (COPY-status.copied, with the case name) is sent
to a live region (NFR-04), separate from the short visible overlay. If the clipboard write is
refused, the value is unchanged and COPY-status.copy_failed is shown via CMP-Notice (F-003.R5).

## Accessibility

In M-1 the whole row is a single button. In **M-2**, because the row also carries a pin control,
the row becomes a group (not one button) containing two controls: a **copy button** covering the
label + value + copy icon (accessible name COPY-action.copy_row, the value as its description) and
a separate **pin toggle button** at the trailing edge (accessible name COPY-action.pin /
COPY-action.unpin, pressed state exposed). Keyboard order within the row: copy button, then pin
button. Both meet `size.targetMin`, growing to `size.touchTarget` on coarse pointers; the copy
icon is always visible on coarse pointers (no hover). The copy/check/pin icons are decorative
(hidden from assistive tech); the meaning is in the accessible names. The last-used badge is
exposed as text (COPY-badge.last_used), not colour alone, within the row's accessible description.
An empty row is marked disabled and names its value COPY-label.no_result. The copied flash fade
respects reduced-motion (opacity only).
