---
title: Style — Workbench
status: ready
---

# Style — "Workbench"

The converter is a workbench inside the portal's night market: the same palette, fonts and grid
as the host (and its JSON Formatter sibling), arranged simply. The input and the results are the
hero; chrome stays thin. All values live in `tokens.json`; base colors, fonts, spacing and motion
mirror the portal's tokens so the tool looks native when embedded (PRN-05).

## Principles

1. **Content first.** The input area and the result grid take the space; the status bar
   (`size.statusbar`) is a thin strip on `surface`. Hairlines (`line`) separate regions; borders
   that identify controls use `lineStrong`; no cards, no shadows, no glow inside the tool —
   notices and any floating surface are set apart by a `lineStrong` border on `surface`.
2. **Every case at once, quietly.** The results (PRN-02) are a plain vertical list, each
   row the same weight; none is "primary." There is no Convert button and no filled call-to-action
   competing with the results. The one accent is the focus ring (`accent`).
3. **Click anything to copy.** The whole result row is the copy target. A quiet copy icon sits at
   each row's trailing edge so rows read as interactive even at rest (and on touch, where there is
   no hover); it strengthens on hover/focus, where the row also fills with `surface2`. On copy the
   row flashes `successBg` with a short `success` "Copied" note (COPY-status.copied_short) pinned
   as an overlay — it never reflows or shreds the value. The clear and notice-dismiss buttons are
   quiet text/icon controls.
4. **Dense but targetable.** Result rows are `size.resultRow`; every interactive element is at
   least `size.targetMin`, and at least `size.touchTarget` when the primary pointer is coarse
   (phones). Disabled controls use `muted` text, not opacity. Text never goes below
   `font.size.xs`.
5. **Label vs value.** The case label is UI type in `muted`; the converted value is mono in `fg`,
   so the eye lands on the result. At width ≥ `size.stackAt` the label sits in a `size.labelCol`
   column and the value fills the rest, both top-aligned (the label pairs with the first value
   line of a multi-line result); below `size.stackAt` the label stacks above the full-width value.
   Values wrap; they are never truncated or shredded silently.
6. **State in form, not only color.** The copied flash pairs the `successBg` tint with the word
   "Copied"; the privacy badge pairs `success` with words; notices carry an icon and text. Color
   is never the only signal.
7. **Same in both themes.** Dark and light are both first-class; every text/background pair passes
   WCAG AA (`contrast.pairs`).
8. **Crisp shapes.** `radius.sm` for the input, rows, buttons and notices. Square outer edges.

## Type

- **UI:** Manrope 500/600 at `font.size.sm`–`md` for case labels, buttons, status bar.
- **Mono:** JetBrains Mono. The input uses `font.size.input` (16px, so mobile browsers do not zoom
  on focus); result values use `font.size.md` — they are code identifiers and read best monospaced.
- The portal's wide display face is not used inside the tool (the portal header carries the title).

## Regions (SCR-Converter)

- **Input area (CMP-InputArea):** a multi-line mono field on `surface` with a `lineStrong` border;
  placeholder in `muted` (COPY-placeholder.input); a quiet Clear button (COPY-action.clear) at its
  top-right when non-empty.
- **Notice (CMP-Notice):** a thin bar on `warnBg` (large input) with an icon, text and a dismiss
  button; the copy-failure message uses `dangerBg`.
- **Result grid (CMP-ResultGrid / CMP-ResultRow):** one row per case kind in the RULE-01 order, separated by
  `line` hairlines on the page background — not a card (no outer border or radius). Each row: case
  label (`muted`, UI type), the converted value (mono, `fg`), and a trailing copy icon (`muted`,
  → `fg`/`accent` on hover/focus); hover `surface2`; focus a 2 px `accent` ring; copied flash
  `successBg` + overlay "Copied". Empty input shows a dimmed `—` (COPY-result.empty); the copy button is
  disabled and the pin button stays operable.
- **Badges (CMP-ResultRow):** small UI text (`font.size.xs`, medium weight), small radius, never
  split across lines, text never colour-only. Last-used: `surface2` fill, `muted` text.
  Matches-input (M-3), the quieter one: no fill, a hairline `line` border, `muted` text.
- **Status bar (CMP-StatusBar):** line count (COPY-status.lines) when multi-line at the left, the
  privacy statement (COPY-label.privacy) in `success` at the far end, followed by the source-code
  link (COPY-link.source) in `muted`, led by the code host's logo mark, text underlined, → `fg` on hover; focus a 2 px `accent` ring.
- **Width:** fills the full available width — the host area when embedded and the whole viewport
  standalone (like the JSON Formatter), with a comfortable side gutter (`space.4`). No centered
  content cap. Usable down to `size.minWidth` with no horizontal scroll (NFR-06).

## Targets & motion

- Every interactive element meets `size.targetMin` (24px) and grows to `size.touchTarget` (44px)
  when the primary pointer is coarse; the row copy icon is always visible on coarse pointers.
- Only `motion.duration.fast` hover/press and copied-flash fades, and `base` for notice
  open/close. Under reduced-motion, only opacity changes.

## Iconography

1.5 px stroke icons at `size.icon.sm`, rounded caps, from the open-licensed set chosen in the
architecture (same family as the portal): clear, copy, dismiss, check (copied), info/warning. All
icons are decorative and hidden from assistive technology; the control's accessible name carries
the meaning. One exception to the stroke style: the source-code link shows the code host's own
logo mark, filled in `currentColor` at `size.icon.sm`, before its text (F-006.R4); brand marks are
never redrawn or recoloured beyond `currentColor`.
