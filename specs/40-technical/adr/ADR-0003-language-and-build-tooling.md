---
id: ADR-0003
title: Language and build tooling — TypeScript + Vite + pnpm
status: accepted
date: 2026-10-15
supersedes: []
---

## Context

We need type safety for the engine's correctness (NFR-03), a fast dev loop, small production
output (NFR-05), ahead-of-time JSX compile (no runtime eval under ADR-0006), and parity with the
sibling and portal toolchain.

## Decision

Use **TypeScript** (DEP-15), **Vite** (DEP-16) with the Preact preset (DEP-17), and **pnpm**
(DEP-35), pinned to the same major versions as the sibling. ESLint + typescript-eslint +
jsx-a11y + Prettier (DEP-29–DEP-32) lint and format, including a ban on network APIs and storage
APIs (enforces NFR-01) and module-boundary rules (MOD-Engine imports nothing). Node 24 (`.nvmrc`).

## Alternatives considered

- **esbuild/Rollup alone** — Vite wraps these with a better dev server and matches the sibling.
- **npm/yarn** — pnpm matches the portal workspace and its license-report tooling.
- **Plain JS** — loses the type checking that guards the engine's many edge cases.

## Consequences

- Identical build commands and CI shape to the sibling.
- Typed engine with lint-enforced privacy and import boundaries.

<!-- Accepted ADRs are immutable. Write a new ADR to change a decision. -->
