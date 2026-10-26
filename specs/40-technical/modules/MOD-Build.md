---
id: MOD-Build
title: Build and local checks
status: draft
depends_on: []
---

## Responsibility

The build and its local checks (no code-host workflows, ADR-0014): code generation from specs (token constants, the COPY string catalog,
third-party notices), the production security headers (`_headers`), and the gates — type-check,
unit/property tests, spec lint, license scan, startup/size budget. Produces the deployable
`dist/` of the tool's own files only.

## Not responsible for

- Runtime behavior (the other modules); account/DNS/secret setup (owner work at release).

## Public surface

- Codegen scripts, the headers file, and the local checks run by `pnpm deploy:prod` (not shipped to the browser).

## Implements

NFR-01 (CSP header, no-network, notices), NFR-05 (startup/size budget), NFR-03 (runs the
correctness corpus). Decided by ADR-0001, ADR-0003, ADR-0006, ADR-0009, ADR-0012, ADR-0014.
