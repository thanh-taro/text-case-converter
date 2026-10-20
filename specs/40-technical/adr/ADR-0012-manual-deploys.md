---
id: ADR-0012
title: Deploys are manual, run from the owner's machine
status: accepted
date: 2026-10-20
supersedes: []
---

## Context

The release pipeline had a tag- or dispatch-triggered deploy workflow on the code host, which
needed a hosting token stored there as a secret. The owner wants every deploy to be a deliberate,
hands-on step, and no hosting credential kept outside their own machine.

## Decision

There is no deploy workflow. Every deploy is run by hand from the owner's machine with
`pnpm deploy:prod` (scripts/deploy-prod.sh), using the owner's own hosting login (DEP-33). The script
runs the same checks the workflow ran — codegen up to date, spec lint, typecheck, lint, unit tests,
Chromium and WebKit e2e, production build with `HOST_ORIGINS=https://tarokit.app`, license and size
checks, production header check — then uploads `dist/` and runs the post-deploy smoke test.
Firefox e2e runs only in CI (it cannot launch locally), so the green CI run of the commit being
deployed is checked before deploying. CI (tests only) stays and never deploys. A version tag records
what was deployed; pushing a tag deploys nothing.

## Alternatives considered

- **Keep the tag-triggered workflow** — automatic on tag push, which the owner does not want, and it
  needs a hosting secret stored on the code host.
- **Workflow with manual dispatch only** — still keeps a hosting secret on the code host.

## Consequences

- No hosting secret lives on the code host; the deploy needs the owner's local login.
- Releases depend on the owner's machine and toolchain; the script makes them repeatable.
- Recovery (the offline kill switch) is also a manual run: `SW_KILL=1 pnpm deploy:prod`.

<!-- Accepted ADRs are immutable. Write a new ADR to change a decision. -->
