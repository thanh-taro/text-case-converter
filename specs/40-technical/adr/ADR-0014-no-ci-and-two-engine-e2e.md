---
id: ADR-0014
title: No code-host workflows; automated e2e on Chromium and WebKit only
status: accepted
date: 2026-10-26
supersedes: []
---

## Context

ADR-0012 removed the deploy workflow but kept a test-only CI workflow, mainly because Firefox e2e
ran only there: Playwright's Firefox does not launch on the owner's machine (the process is
terminated right after start). ADR-0009 runs the e2e suite on Chromium, Gecko and WebKit. The owner
decided (2026-10-26) for all three taro-kit tools: no `ci.yml` or `deploy.yml`, deploys only by the
owner or Claude by hand, and Firefox removed from the automated suites.

## Decision

1. The repository has no code-host workflows. `pnpm deploy:prod` (ADR-0012) runs every check
   locally before uploading; there is no CI run to wait for (amends ADR-0012).
2. Playwright projects: `chromium` and `webkit` only (amends ADR-0009). Firefox-only branches are
   removed from the tests.
3. NFR-06 still includes Gecko-based browsers: each release candidate gets a manual check in
   Firefox (the release checklist's real-browser pass).

## Alternatives considered

- **Keep the test-only CI workflow** — the owner does not want code-host workflows.
- **Drop Gecko from NFR-06** — not requested; Firefox users stay supported.

## Consequences

- Gecko regressions are caught only by the manual release check.
- DEP-26 no longer includes Playwright's Firefox (MPL-2.0).

<!-- Accepted ADRs are immutable. Write a new ADR to change a decision. -->
