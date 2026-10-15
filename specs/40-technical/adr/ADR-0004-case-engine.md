---
id: ADR-0004
title: Build our own case engine (SPK-tokenizer result)
status: accepted
date: 2026-10-15
supersedes: []
---

## Context

Tokenization and casing are the heart of the product and its main correctness/reputation risk
(PRN-03, NFR-03). Acronyms (`HTTPResponse`) and numbers (`v2Point5`) are genuinely ambiguous, so
the chosen rules must be ours to document and test (RULE-02, RULE-06). We must decide build vs
buy before implementation. Candidates: `change-case`, `scule`, `case-anything`.

## Decision

**Build our own** pure, dependency-free engine (MOD-Engine). The spike (SPK-tokenizer,
`.build-my-app/reports/spike-tokenizer.md`) built a ~60-line tokenizer implementing RULE-02 and
the RULE-01/01b/04/05/06 joins and ran it against the adversarial corpus derived from F-002's
acceptance criteria: **46/46 assertions passed (100%)**. It is tiny (~1 KB), has no `eval`
(strict-CSP safe, ADR-0006), and gives us full control over the documented rules — which is the
differentiator.

## Alternatives considered

- **`change-case` 5.4.4 (MIT)** — capable and permissive, but a dependency we don't need, with
  its own tokenization choices we'd have to document anyway and pin against.
- **`scule` 1.3.0 (MIT)**, **`case-anything` 3.1.7 (MIT)** — same reasoning; all three are MIT
  and strict-CSP safe, kept as viable fallbacks if our engine ever falls short of the corpus.

## Consequences

- Zero runtime dependency for the core; smallest possible bundle and attack surface (NFR-01).
- We own correctness: the corpus (NFR-03) is the contract, and any rule change is a spec change
  (RULE-02) plus a corpus update, not a library bump.
- Unicode casing is delegated to the platform under the policy of ADR-0011.

<!-- Accepted ADRs are immutable. Write a new ADR to change a decision. -->
