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
- The whole row is the copy target (COPY-action.copy_row); no separate button.

## Variants & states

| Variant / state | Description                                                                                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| default         | Label + value + a quiet trailing copy icon; activating copies the value (RULE-07).                                                                               |
| hover/focus     | Row fills with `surface2`; the copy icon strengthens; a 2 px `accent` focus ring.                                                                                |
| empty           | Input empty; shows COPY-result.empty; not activatable (RULE-09).                                                                                                 |
| copied          | A brief "copied" flash: the row tints `successBg` and COPY-status.copied_short appears as an overlay pinned to the trailing edge (it does not reflow the value). |

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

Role is a button with accessible name COPY-action.copy_row (the case name), the value provided as
its description; the copy/check icons are decorative (hidden from assistive tech). An empty row is
marked disabled and names its value COPY-label.no_result. Meets `size.targetMin`, growing to
`size.touchTarget` on coarse pointers; the copy icon is always visible on coarse pointers (no
hover). The copied flash fade respects reduced-motion (opacity only).
