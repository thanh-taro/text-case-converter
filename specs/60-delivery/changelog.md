# Changelog

Behavior changes to `building` or `shipped` specs are recorded here (specs/README.md).

## Unreleased

- 2026-10-15 — M-2 specs drafted (owner request): F-008 Strip symbols (RULE-11 — ASCII-alnum only,
  folds accents then drops symbols/non-Latin), F-009 Remove accents (RULE-12 — Latin ASCII-fold incl.
  Vietnamese đ, keeps symbols/non-Latin), F-010 Sort and pin results + last-used badge (RULE-13),
  all remembered on the device (RULE-14, ENT-Preferences). INV-02 rescoped (determinism given input
  + preferences). New CMP-Controls; CMP-ResultRow gains badge + pin (restructured to a group with a
  copy button + pin button so the pin isn't nested in a button). Spec review (2 reviewers) applied:
  reconciled the privacy boundary for preference persistence — platform-mapping allows a single
  `localStorage` preferences key (non-content); RULE-07, F-003 (R3/AC3), F-006 (scope/R3/AC3) and
  NFR-01 now scope their "nothing persisted/written" guarantees to *user text* (preferences excepted);
  CMP-ResultGrid gains sorted/pinned states; reading order includes the options bar; glossary +5 terms.
  Lint 0/0. Pending owner ready + the M-2 design/build/QA cycle.

- 2026-10-15 — Design change (owner request): the view is now **full-width** like the JSON
  Formatter — removed the `size.contentMax` (720px) centered cap from style.md, tokens.json and
  the app layout (`.wrap`); regenerated tokens. No feature/AC/test behavior change; 25 e2e + 92
  unit green, lint 0/0.

- 2026-10-15 — Phase 1: initial M-1 specs drafted (F-001 … F-007, domain model & rules, NFRs,
  SCR-Converter, components, copy, FLOW-01, roadmap). All features `draft` pending review and
  the owner moving them to `ready`.
- 2026-10-15 — Spec review round 1 (3 reviewers) applied: fixed RULE-01 count (nine token-based),
  glossary tokenization wording, added the large-input notice (F-001.R5) and clipboard-failure
  path (F-003.R5, COPY-status.copy_failed), quantified the RULE-08 settle delay, and added ACs
  for stop-words, locale-independent casing, Unicode script boundaries, character-based line
  preservation, host theme/allowlist fallbacks. Lint 0/0.
- 2026-10-15 — Phase 2 (design) + Phase 3 (architecture) approved: Workbench tokens/style, 11 ADRs,
  in-house MOD-Engine (SPK-tokenizer 46/46), stack = Preact+signals/Vite/TS/Cloudflare.
- 2026-10-15 — Phase 4 (build): M-1 implemented and set `building`. In-house engine
  (RULE-01/01b/02/03/04/05/06), the all-cases grid, per-line batch, click-to-copy with live
  announce, host integration + offline SW, strict CSP, privacy. 104 unit/property + 10 Chromium
  e2e tests green; AC coverage complete except 10 embedding/offline ACs deferred to QA phase-5
  (`.build-my-app/reports/qa/ac-coverage.md`). DEP-11 (lucide-static) not adopted — icons inlined.
  Critical path 14.2 KB (NFR-05 ≤ 250 KB). Lint + typecheck + license audit green.
