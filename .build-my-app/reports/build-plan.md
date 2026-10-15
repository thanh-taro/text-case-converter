# Build plan — Text Case Converter (M-1)

## Nature of this app

One screen, one in-house engine, shared app shell. Features are tightly coupled (they all touch
the same screen + state), so **parallel worktrees would thrash** — we build **sequentially** in
one worktree with a per-stage test-first + review loop. This matches "fan out only where work is
independent" (core).

## Prerequisite — Scaffold (Phase 3.3, deferred from architecture)

Mirror the JSON Formatter sibling, installing only the **approved** deps (DEP-01/02 runtime;
fonts DEP-12/13; icons DEP-11; build/dev/ci DEP-15…35):
package.json · tsconfig(.e2e) · vite.config · eslint.config (incl. network/storage ban + module
boundaries) · prettier · token codegen (style-dictionary → CSS vars) · copy codegen · index.html ·
service worker + offline · wrangler.jsonc · `_headers` (CSP) · playwright + vitest config · CI
(.github/workflows). Install, commit lockfile.

## Build waves (sequential; test-first; cite spec IDs; COPY ids + tokens only)

| Stage            | Scope                                                                 | Key specs                                                  |
| ---------------- | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| S1 Engine        | MOD-Engine: tokenizer + 11 case renderers, pure, zero-dep             | RULE-01/01b/02/03/04/05/06, INV-02/03/04, the F-002 corpus |
| S2 Shell + F-001 | MOD-App shell, input area, clear, debounce, live update, large-notice | F-001, RULE-08/09, NFR-02                                  |
| S3 F-002         | Result grid, all 11 rows live, empty state                            | F-002 (16 ACs)                                             |
| S4 F-003         | Click-to-copy, copied flash + live announce, copy-failed notice       | F-003, RULE-07, NFR-04                                     |
| S5 F-004         | Per-line batch, line count, preserved blank lines                     | F-004, RULE-03, INV-03                                     |
| S6 F-005         | Host theme/sizing/embedding, origin allow-list, ready signal          | F-005, RULE-10, NFR-06/07                                  |
| S7 F-006 + F-007 | Privacy statement + no-network; offline SW works                      | F-006, F-007, NFR-01                                       |

## Per-stage pipeline

context → tests from ACs (vitest unit/property for engine; Playwright e2e for flows) → implement
→ build + test + lint + **run app & screenshot** vs designs → review-loop:
`code-reviewer` + spec audit (`spec_lint.py --coverage`) + `security-auditor` (F-005/F-006/F-007:
network/host/clipboard) → fix → commit, set feature building→shipped.

## Final milestone checks

Full vitest + Playwright (3 engines) green · 100% AC coverage · size/startup budget (NFR-05) ·
license audit green (ADR-0001) · a11y audit on the running app. Then Gate (owner).

## Rough scale

~1 scaffold pass + 7 build stages. Agents: a feature-builder (or direct) per stage + a shared
review wave (code-reviewer, security, a11y, perf) near the end. Est. heavy but bounded.
