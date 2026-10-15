# Spike SPK-tokenizer — build vs buy the case engine

Date: 2026-10-15 · Resolved by: ADR-0004 · Status: closed

## Question

Can one ruleset tokenize an adversarial corpus acceptably (≥90%), and should we build our own
tokenizer or use a library (scule / change-case / case-anything) under strict CSP?

## Method

Implemented a ~60-line pure JS tokenizer + case engine per RULE-02 and the RULE-01/01b/04/05/06
joins (no dependencies, no `eval`). Built a corpus of **46 assertions** from F-002's acceptance
criteria plus edge cases: `getUserID` (all 11 cases), `HTTPResponse`, `parseURLToString`,
`userID2`, `v2Point5`, `utf8Decode`, `already_snake_case`, `Hello, World!`, `caféCrème`, `日本語`,
`日Foo`, `BIG`, `the lord of the rings`, `__foo--bar__`, `2024`, and multi-line (F-004) inputs.
Ran under Node. Checked each candidate library's license and CSP-safety via the npm registry.

## Result

- **Our engine: 46/46 assertions passed (100%).**
- Perf (SPK-tokenizer perf script): all eleven cases on a 100,000-character input in **~55 ms** on
  the reference machine — within NFR-02's 100 ms, so **no Web Worker is needed** (ADR-0005).
- Libraries (all permissive, all strict-CSP safe — ESM, no `eval`):
  - `change-case` 5.4.4 — MIT
  - `scule` 1.3.0 — MIT
  - `case-anything` 3.1.7 — MIT

## Verdict

**Build our own** (ADR-0004). It reaches 100% on the corpus, is ~1 KB, adds no runtime dependency
(matches the privacy/CSP/minimal-dependency ethos), and gives full control over the documented
tokenization rules — the product's differentiator. The three libraries are recorded as viable MIT
fallbacks (DEP-40/41/42) if the engine ever falls short.

## Spec impact

None — the corpus ratified every F-002 acceptance-criterion output; no RULE-02 change needed.
The corpus becomes the executable contract for NFR-03.
