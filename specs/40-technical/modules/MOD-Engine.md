---
id: MOD-Engine
title: Case engine
status: draft
depends_on: []
---

## Responsibility

The pure, dependency-free core that turns input text into the results (one per RULE-01 case kind). It owns
tokenization (RULE-02), the token-based joins (RULE-01), the character-based folds (RULE-01b),
Title/Sentence casing (RULE-04), locale-independent casing and non-cased pass-through (RULE-05),
acronym normalization (RULE-06) or keeping acronyms (RULE-16), the strip-symbols and
remove-accents transforms (RULE-11, RULE-12), and whether each result matches the input
(RULE-17), applied per line (RULE-03). It is synchronous, side-effect
free, and holds no state — the same input always yields the same output (INV-02).

## Not responsible for

- Rendering, DOM, or the result grid (MOD-App).
- The clipboard, host messages, storage, or any I/O.
- Debouncing or the responsiveness cap scheduling (MOD-App owns when it is called; RULE-08).
- User-facing strings (MOD-Copy).

## Public surface

- Each function takes the input text and the active transform preferences (stripSymbols,
  removeAccents, keepAcronyms; ENT-Preferences) — passed in as plain values, never read from
  storage.
- A pure function that, given the input text, preferences and a case-kind id (ENT-CaseKind), returns the
  result text (ENT-Result) with the input's line structure preserved (RULE-03, INV-03).
- A pure function returning every result for an input in one pass.
- A pure function returning, for an input and preferences, the set of case kinds whose result
  equals the whole input (RULE-17); empty for an empty input.
- A pure `tokenize(line)` helper returning the ordered tokens (ENT-Token) for a line (RULE-02),
  used by tests and the token-based kinds.
- No class instances, no stored configuration, no globals (strict-CSP safe: no `eval`, no codegen).

## Implements

F-002 (all case kinds + tokenization), F-003 result text, F-004 per-line conversion, F-008/F-009
(transforms), F-012 (match), F-013 (keep acronyms), F-015 (Train/COBOL);
RULE-01, RULE-01b, RULE-02, RULE-03, RULE-04, RULE-05, RULE-06, RULE-11, RULE-12, RULE-16, RULE-17; INV-01, INV-02, INV-03, INV-04;
NFR-03 (correctness, verified against the adversarial corpus). Decided by ADR-0004, ADR-0011.
