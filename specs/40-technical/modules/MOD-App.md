---
id: MOD-App
title: App shell & state
status: draft
depends_on: [MOD-Engine, MOD-Copy, MOD-Host, MOD-IO]
---

## Responsibility

The Preact shell and app state: renders SCR-Converter (CMP-InputArea, CMP-ResultGrid,
CMP-ResultRow, CMP-StatusBar, CMP-Notice), holds the current input in a signal, and recomputes
the results through MOD-Engine when the input settles (RULE-08). Owns the responsiveness
cap: below the cap it recomputes after the settle delay; past the cap it shows COPY-notice.large
once per session and recomputes only after the input stops changing (RULE-08, NFR-02). Keeps the
line count for the status bar (RULE-03). Renders CMP-Controls and the matches-input and last-used
badges (RULE-13, RULE-17), and owns grid keyboard focus: a single Tab stop, arrow/Home/End
movement, the remembered focused case, and focus following a moved row (F-014).

## Not responsible for

- The conversion logic itself (MOD-Engine).
- Clipboard writes (MOD-IO) or host messages/theme (MOD-Host).
- Persistence of preferences (MOD-Prefs); user text is never persisted (PRN-01).

## Public surface

- The mounted app (an exported mount function) and the reactive app state (input signal,
  derived results, line count, large-input flag).
- Wires result-row activation to MOD-IO copy and shows COPY-status.copied / COPY-status.copy_failed.

## Implements

SCR-Converter; F-001 (enter/clear, settle recompute, large-input notice), F-002 (live grid),
F-004 (per-line results + line count), F-006 (privacy statement placement), F-012 (badge),
F-013 (toggle), F-014 (keyboard navigation), F-015 (rows); NFR-02, NFR-06,
NFR-08. Decided by ADR-0002, ADR-0005, ADR-0007.
