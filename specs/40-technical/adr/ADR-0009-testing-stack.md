---
id: ADR-0009
title: Testing stack
status: accepted
date: 2026-10-15
supersedes: []
---

## Context

Correctness of the engine is the product (NFR-03); privacy, accessibility, embedding and startup
are all testable NFRs (NFR-01, NFR-04, NFR-05, NFR-06, NFR-07). We want the sibling's proven
toolchain.

## Decision

- **Vitest** (DEP-21) for unit and integration tests, including the engine's adversarial corpus
  (NFR-03) kept as a table of input → eleven expected outputs.
- **fast-check** (DEP-23) for property tests (e.g. non-cased characters always pass through
  RULE-05; results always preserve line count INV-03; determinism INV-02).
- **Playwright** (DEP-25) on Chromium, Gecko and WebKit (DEP-26) for flows (F-001…F-005),
  the host contract (origin filtering, theme, ready-only message), the no-network assertion
  (NFR-01) via a request log, and clipboard behavior.
- **@axe-core/playwright** (DEP-27) for the automated accessibility audit (NFR-04), plus a manual
  screen-reader pass.
- **Lighthouse CI** (DEP-28) for the startup/size budget (NFR-05).

## Alternatives considered

- **Jest** — Vitest matches Vite and the sibling.
- **Cypress** — Playwright gives three real engines, needed for NFR-06/NFR-07.

## Consequences

- The corpus is the executable contract for the documented tokenization rules.
- Same CI shape and commands as the sibling.

<!-- Accepted ADRs are immutable. Write a new ADR to change a decision. -->
