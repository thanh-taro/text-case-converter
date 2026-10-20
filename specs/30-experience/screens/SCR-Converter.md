---
id: SCR-Converter
title: Converter
status: ready
features: [F-001, F-002, F-003, F-004, F-005, F-006, F-007, F-008, F-009, F-010]
components: [CMP-InputArea, CMP-Controls, CMP-ResultGrid, CMP-ResultRow, CMP-Notice, CMP-StatusBar]
---

## Purpose

The single screen: enter text, see every case at once, and copy the one you want.

## Layout regions

1. CMP-InputArea — the text to convert, with a clear action.
2. CMP-Controls (M-2) — strip-symbols and remove-accents toggles and the sort control.
3. CMP-Notice (when present) — occasional messages such as the large-input notice.
4. CMP-ResultGrid — the eleven CMP-ResultRow results for the current input, ordered per the sort.
5. CMP-StatusBar — line count (when multi-line), the privacy statement and the source-code link.

## States

| State       | When                          | What the user sees                                                                         |
| ----------- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| default     | input present                 | input with results for every case in the grid                                              |
| empty       | input empty                   | placeholder in the input; every result row shows COPY-result.empty (RULE-09)               |
| multi-line  | input has several lines       | each result row shows the per-line conversion; status bar shows the line count (RULE-03)   |
| large       | input past the RULE-08 cap    | CMP-Notice (info) shows COPY-notice.large once; results update after the input settles     |
| copied      | a row was just activated      | brief COPY-status.copied_short overlay on the row + COPY-status.copied announced (RULE-07) |
| copy-failed | a clipboard write was refused | CMP-Notice (error) shows COPY-status.copy_failed until dismissed (F-003.R5)                |
| options (M-2) | a transform toggle is on | results reflect strip-symbols (RULE-11) and/or remove-accents (RULE-12) live |
| sorted (M-2) | a non-default sort or a pin is active | rows reordered (RULE-13); the last-used case shows COPY-badge.last_used |

Startup must meet NFR-05.

## Entry & exit

- Entered from: the host portal's navigation, or the tool's own address (standalone).
- Exits to: none (single screen).

## Accessibility

Reading order: input area → options bar (CMP-Controls) → notice (if any) → result grid → status bar. Every action has a
keyboard path and an accessible name (COPY-* labels). A single persistent live region announces
the copied confirmation (COPY-status.copied), a copy failure, and notices politely (NFR-04);
content is injected into it rather than inserted with it. Icons are decorative (hidden from
assistive tech). Standalone, the tool exposes a top-level landmark/name; embedded, the host
supplies the title. No theme control when embedded; the host owns it (RULE-10).
