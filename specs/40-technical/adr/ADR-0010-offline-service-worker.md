---
id: ADR-0010
title: Offline service worker
status: accepted
date: 2026-10-15
supersedes: []
---

## Context

F-007 wants the tool to work offline after one visit, caching only the tool's own files and never
user text (NFR-01). The sibling solved this with a small hand-written service worker.

## Decision

After first render, MOD-Host registers `/sw.js` (`updateViaCache: "all"`) and posts the list of
loaded same-origin URLs; the worker stores them in Cache Storage from the HTTP cache
(`force-cache`). Later openings serve HTML network-first with an offline fallback and hashed
assets cache-first, pruning old assets per navigation; a new version is adopted from the next
opening, never mid-session. The worker caches the tool's own files only — never user input, which
never leaves memory (INV-01). The one network allowance of NFR-01 is the browser's own install /
update fetch of these files.

## Alternatives considered

- **No offline (drop F-007)** — F-007 is only P2, but the pattern is cheap and already proven in
  the sibling.
- **A library (Workbox)** — more bytes than the handful of lines needed (NFR-05).

## Consequences

- Offline use with no runtime dependency and no privacy cost.
- `/sw.js` has its own cache-control and CSP exception (ADR-0006), tested per engine.

<!-- Accepted ADRs are immutable. Write a new ADR to change a decision. -->
