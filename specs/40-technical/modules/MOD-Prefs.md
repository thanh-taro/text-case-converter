---
id: MOD-Prefs
title: Preferences store
status: draft
depends_on: [MOD-Engine]
---

## Responsibility

The one place that reads and writes ENT-Preferences in per-device storage (RULE-14): the
strip-symbols, remove-accents and keep-acronyms toggles, the sort mode, pins and recent-use order. Stores only
non-content preferences under a single key; never user text (PRN-01, INV-01). All access is
guarded so the tool still works when storage is unavailable (session-only defaults, RULE-14).

## Not responsible for

- Applying the transforms (MOD-Engine) or ordering/rendering the grid (MOD-App).
- Storing any input text or derived content — forbidden (INV-01).

## Public surface

- Load the current preferences (validated; defaults if missing, malformed, or storage throws). A
  stored value lacking a field added later (e.g. `keepAcronyms`, M-3) takes that field's default
  and keeps every other stored field; unknown case-kind ids in pins or recent order are dropped
  one by one (F-013.AC12).
- Save the current preferences.

## Implements

F-008/F-009/F-013 (persisted toggles), F-010 (persisted sort/pins/recent); RULE-14; INV-01. It is the
only module permitted to use `localStorage`, and only for the single preferences key
(platform-mapping.md; enforced by the ESLint storage-ban exception for `src/prefs/**`).
Decided by ADR-0001, ADR-0006.
