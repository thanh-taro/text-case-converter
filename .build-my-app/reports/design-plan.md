# Design plan — Text Case Converter

One screen (SCR-Converter), few components → a single design phase.

## Coverage to produce (design/mockup.html)

States (SCR-Converter): default (single-line), empty, multi-line, large (notice), copied,
copy-failed (notice). Themes: dark + light. Viewports: embedded (~1200), narrow (360).
Components: CMP-InputArea (empty/single/multi/large), CMP-ResultGrid (default/empty/multi),
CMP-ResultRow (default/empty/copied), CMP-Notice (info/danger), CMP-StatusBar (single/multi).

## Loop

make mockup → design-auditor (coverage, COPY IDs, tokens) → ui-critic (screenshots) →
a11y-auditor (contrast, targets, reading order) → fix. Max 3 rounds. Then Gate G2 (owner approves).
