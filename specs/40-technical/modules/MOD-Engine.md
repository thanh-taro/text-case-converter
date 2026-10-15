---
id: MOD-Engine
title: Case engine
status: draft
depends_on: []
---

## Responsibility

The pure, dependency-free core that turns input text into the eleven results. It owns
tokenization (RULE-02), the token-based joins (RULE-01), the character-based folds (RULE-01b),
Title/Sentence casing (RULE-04), locale-independent casing and non-cased pass-through (RULE-05),
and acronym normalization (RULE-06), applied per line (RULE-03). It is synchronous, side-effect
free, and holds no state — the same input always yields the same output (INV-02).

## Not responsible for

- Rendering, DOM, or the result grid (MOD-App).
- The clipboard, host messages, storage, or any I/O.
- Debouncing or the responsiveness cap scheduling (MOD-App owns when it is called; RULE-08).
- User-facing strings (MOD-Copy).

## Public surface

- A pure function that, given the input text and a case-kind id (ENT-CaseKind), returns the
  result text (ENT-Result) with the input's line structure preserved (RULE-03, INV-03).
- A pure function returning all eleven results for an input in one pass.
- A pure `tokenize(line)` helper returning the ordered tokens (ENT-Token) for a line (RULE-02),
  used by tests and the token-based kinds.
- No class instances, no configuration, no globals (strict-CSP safe: no `eval`, no codegen).

## Implements

F-002 (all case kinds + tokenization), F-003 result text, F-004 per-line conversion;
RULE-01, RULE-01b, RULE-02, RULE-03, RULE-04, RULE-05, RULE-06; INV-01, INV-02, INV-03, INV-04;
NFR-03 (correctness, verified against the adversarial corpus). Decided by ADR-0004, ADR-0011.
