---
id: ADR-0007
title: Styling, design tokens, and copy generation
status: accepted
date: 2026-10-15
supersedes: []
---

## Context

The tool must look native in the portal in both themes (PRN-05, F-005), stay tiny (NFR-05), and
keep all user-facing text in one place (`copy.md`). It needs no inline styles under the CSP
(ADR-0006).

## Decision

Style with **plain CSS driven by the portal's design tokens** compiled from DTCG JSON to CSS
variables by **style-dictionary** (DEP-20), reusing the portal/sibling "Night Market" token set
(DEP-14) so colours, spacing, radii and motion match (D to be finalised in the design phase).
Icons, if any, are inlined SVGs from **lucide-static** (DEP-11); UI and mono faces are the
self-hosted variable fonts **Manrope** (DEP-12) and **JetBrains Mono** (DEP-13). Build-time
codegen turns `copy.md` into the typed string catalog of MOD-Copy and `tokens.json` into CSS
variables.

## Alternatives considered

- **A CSS framework (Tailwind etc.)** — unnecessary weight and divergence from the portal.
- **Hard-coded colors** — breaks theme parity and the one-source-of-truth rule.

## Consequences

- Visual consistency with the portal and sibling; theme handled by tokens.
- The exact style tile and token values are the design phase's output.
- No inline styles; CSP-clean.

<!-- Accepted ADRs are immutable. Write a new ADR to change a decision. -->
