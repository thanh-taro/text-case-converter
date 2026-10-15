# Changelog

Behavior changes to `building` or `shipped` specs are recorded here (specs/README.md).

## Unreleased

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
