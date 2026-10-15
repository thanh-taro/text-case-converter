---
id: ADR-0011
title: Unicode casing policy (SPK-unicode result)
status: accepted
date: 2026-10-15
supersedes: []
---

## Context

Casing non-ASCII text is a trap: the Turkish dotless-i, Greek final sigma, accents, CJK (no
case), emoji, and combining marks. RULE-05 requires locale-independent casing and pass-through of
non-cased characters; we must confirm the platform behaves and pin the policy.

## Decision

Use the platform's **locale-independent** `String.prototype.toLowerCase` / `toUpperCase` (never
the `toLocale*` variants). The spike (SPK-unicode, `.build-my-app/reports/spike-unicode.md`)
confirmed on the reference engine: `BIG`→`big` (not the Turkish `bıg`), `café`↔`CAFÉ`,
`ΣΊΣΥΦΟΣ`→`σίσυφος` (final sigma), CJK unchanged, emoji passes through, `İ`→`i̇`, combining marks
preserved. Tokenization boundaries (RULE-02) fire only around cased letters and digits, so caseless
letters keep their token (`日Foo` stays one token) — pinned by F-002.AC16. No locale selection and
no script-change boundary in M-1 (M-2 candidate if demand appears).

## Alternatives considered

- **`toLocaleUpperCase`/`toLocaleLowerCase`** — introduces the Turkish-i locale dependency we must
  avoid (RULE-05); rejected.
- **A Unicode segmentation library (e.g. Intl.Segmenter words)** — heavier and still ambiguous on
  identifiers; our rule set is simpler and documented.

## Consequences

- Predictable, locale-independent output tested in the corpus (NFR-03) and by property tests.
- Non-Latin scripts are preserved, not mangled; some exotic cases pass through unchanged by design.

<!-- Accepted ADRs are immutable. Write a new ADR to change a decision. -->
