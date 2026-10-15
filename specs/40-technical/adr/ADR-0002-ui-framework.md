---
id: ADR-0002
title: UI framework — Preact + signals
status: accepted
date: 2026-10-15
supersedes: []
---

## Context

The UI is a single screen (SCR-Converter): an input area and a live grid of eleven rows that
re-render whenever the input settles (F-002, RULE-08). It must be tiny (NFR-05 startup budget),
work under a strict CSP with no `eval` (ADR-0006), and feel native next to the sibling tool.

## Decision

Render with **Preact 10** and **@preact/signals** (DEP-01, DEP-02), matching the sibling and the
portal. The input signal drives derived result signals so only the affected rows update. No
router, no state library. JSX compiled ahead of time (ADR-0003), so no runtime template eval.

## Alternatives considered

- **Vanilla DOM** — viable for this small UI, but signals give clean reactive updates and parity
  with the sibling at ~8 KB gzip.
- **React** — heavier for no benefit here.
- **Svelte/Solid** — fine technically, but diverging from the portal/sibling costs consistency.

## Consequences

- Shared idioms with the sibling; tiny runtime.
- Reactive result updates with per-row granularity.
- One more runtime dependency pair (DEP-01, DEP-02), both MIT and registered.

<!-- Accepted ADRs are immutable. Write a new ADR to change a decision. -->
