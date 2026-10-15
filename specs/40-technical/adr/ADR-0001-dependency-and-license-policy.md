---
id: ADR-0001
title: Dependency and license policy (aligned with the portal's policy)
status: accepted
date: 2026-10-15
supersedes: []
---

## Context

The tool is a personal, zero-budget project that ships JavaScript to every visitor and is
embedded in the taro-kit portal owned by the same person (PER-02). Every runtime dependency is
an attack surface for INV-01 / NFR-01 (a library that phones home breaks the privacy promise)
and a cost against the startup budget (NFR-05). The sibling JSON Formatter and the portal already
use a machine-checkable policy; using the same one keeps one audit approach across the suite.

## Decision

Adopt the portal's dependency-and-license policy unchanged:

1. **Allowed for shipped code and assets**: MIT, ISC, BSD-2/3-Clause, 0BSD, Apache-2.0,
   Unlicense, CC0-1.0, BlueOak-1.0.0, Python-2.0, and OFL-1.1 for fonts.
2. **Allowed for build/dev/test tools only, unmodified, never shipped**: MPL-2.0, LGPL prebuilt
   binaries, CC-BY-4.0 data (attributed in the notices).
3. **Never allowed**: GPL, AGPL, SSPL, BUSL or other source-available, CC-BY-NC/ND, no license,
   unknown license.
4. **Registry first**: every direct dependency, every transitive runtime dependency, and every
   asset pack is a DEP- row in `dependencies.md` before it enters the lockfile
   (`candidate` → `approved` → `removed`).
5. **Runtime dependencies must** run fully offline, make no network requests, collect no
   telemetry, work under the CSP of ADR-0006, and earn their bundle cost. Prefer the platform or
   a small amount of our own code when there is no tricky correctness surface.
6. **Enforcement in CI**: license report checked against the allow-lists by kind; a `dist/` scan
   fails on unregistered shipped code or fonts; the build emits `/third-party-notices.txt`.
7. **Supply chain**: committed lockfile, blocked dependency lifecycle scripts, a minimum release
   age, and reviewed (never auto-merged) update PRs.

Because the case engine is built in-house (ADR-0004), the shipped runtime set is only the UI
library and signals — smaller than the sibling's.

## Alternatives considered

- **Stricter MIT/Apache/BSD-only everywhere** — impossible with a Vite build (its CSS tooling is
  MPL-2.0) and the standard accessibility engine (MPL-2.0); diverging from the portal means two
  audit scripts.
- **No registry, CI audit only** — loses the "why is this here" record and the review moment.

## Consequences

- One policy and one audit across the portal and its tools.
- Adding any package is a two-step change (registry row, then lockfile).
- The license policy itself and any runtime dependency require owner sign-off (legal decision).

<!-- Accepted ADRs are immutable. Write a new ADR to change a decision. -->
