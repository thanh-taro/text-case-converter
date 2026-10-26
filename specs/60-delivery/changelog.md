# Changelog

Behavior changes to `building` or `shipped` specs are recorded here (specs/README.md).

## Unreleased

## v1.3.2 — 2026-10-26

- 2026-10-26 — Bug fix (F-011.R7/AC12, NFR-01): in WebKit the Vietnamese UI face was sometimes not
  requested at startup (the stylesheet's faces were not registered yet when the app script ran),
  so it was fetched later, when Vietnamese text first appeared. Each Manrope face is now loaded
  directly at startup, on the next frame and at page load. Seen as an intermittent WebKit e2e
  failure (9/30 under parallel load; now 0/30). v1.3.1 was tagged but never deployed — the
  deploy's checks stopped on this failure; v1.3.2 ships both fixes.

## v1.3.1 — 2026-10-26

- 2026-10-26 — Change (owner request, M-4 scope): a copy activated before the results settle now
  copies the result for the current input, settling first (RULE-07, F-003.R6/AC7); previously it
  copied the previous input's result. Owner dropped slug mode from M-4 (kebab-case with the
  default switches already gives slugs); it stays a roadmap idea. Shipped in v1.3.1.
## v1.3.0 — 2026-10-26

- 2026-10-26 — M-3 specs drafted (owner scope): F-012 matches-input badge (RULE-17, every exact match),
  F-013 Keep acronyms (RULE-16, default off; RULE-06 now describes the default), F-014 keyboard
  navigation in the grid (single Tab stop, arrows/Home/End), F-015 Train-Case + COBOL-CASE (RULE-01 now
  thirteen kinds; default order changes — Train-Case after kebab-case, COBOL-CASE after CONSTANT_CASE).
  The case count is now stated only in RULE-01 (F-002, F-010, glossary, style, flow, modules,
  architecture point to it). ENT-Preferences gains `keepAcronyms`. CMP-Controls default row corrected
  (Strip/Accents default on since v1.0.0). Larger-input hardening moved to M-4. Spec review (2 reviewers) applied: shipped
  F-010.AC1/AC2/AC5 updated for thirteen kinds; RULE-16 all-caps exception is "no lowercase letter
  in the line"; F-014 focus follows a copy in recent sort, grid is a composite widget (ARIA grid
  pattern, platform-mapping); empty rows keep the pin operable (style, CMP-ResultRow); badge styles;
  MOD-Engine takes preferences and computes the match; MOD-App owns grid focus; MOD-Prefs migrates
  pre-M-3 prefs; NFR-03 covers RULE-16 and all kinds. Owner set ready ("Approve & build").
- 2026-10-26 — M-3 built (F-012–F-015 `building`): thirteen kinds; Keep acronyms switch (persisted,
  pre-M-3 prefs migrate with it off); matches-input badge before the last-used badge, hidden at once
  when the input is emptied; the grid is one Tab stop (ARIA grid, roving tabindex) that remembers the
  focused case across pins and sort moves, enters on copy whenever the input is not empty, and only
  restores focus after a row move if the moved action had it. NFR-02: 23 ms (defaults) / 30.5 ms (all
  preferences on) per 100k characters. Unit 163, e2e (Chromium + WebKit) 131 pass, AC coverage 100%. F-012–F-015 shipped in v1.3.0.

## v1.2.0 — 2026-10-26

- 2026-10-26 — Change (owner request): the tool follows the portal's language. The host passes
  `?lang=en-US|vi-VN` and may switch live with a `taro:language` settings message (RULE-10 extended);
  missing/unsupported → the browser's language → en-US (new RULE-15). New F-011; copy.md gains a
  vi-VN column and COPY-app.title; case labels and results never change with language. ADR-0013;
  MOD-Host/MOD-Copy, platform mapping, SCR-Converter, glossary updated; DEP-12/13 add their
  Vietnamese + Latin-ext subsets (same packages, same license). F-005 scope points to F-011.
  Line counts now use the active language's digit grouping (en-US `1,234`, vi-VN `1.234`). Manrope's
  Vietnamese subset loads at startup in every language (DEP-12, ADR-0013); no font request after load.
  Built: header-driven copy codegen (fails on a missing translation or placeholder mismatch);
  case labels carry `lang="en"`; a live switch clears the last live-region announcement; in the
  stacked layout the last-used badge steps aside while the copied flash shows (CMP-ResultRow) and
  status-bar count/link never break. Message type aligned with the portal's tool contract:
  `taro:language` (the portal answers `taro:ready` with theme + language; repeats are idempotent). 133 unit + 49 Chromium + 41 WebKit e2e green; AC coverage
  100%; critical path 18.2 KB / 250 KB. Firefox e2e: CI. Owner kept the English tool title in vi-VN. F-011 shipped in v1.2.0.

## v1.1.0 — 2026-10-20

- 2026-10-20 — Release process (owner decision, ADR-0012): deploys are manual only. The deploy
  workflow is removed; `pnpm deploy:prod` (scripts/deploy-prod.sh) runs the checks, builds, uploads
  with the owner's own login and runs the smoke test. CI stays (tests only). Working reports under
  `.build-my-app/reports/` are no longer tracked.
- 2026-10-20 — Change (owner request): a **Source code** link to the public repository in the
  status bar, so anyone can verify the privacy promise (F-006.R4, AC5–AC6; CMP-StatusBar; COPY-link.source,
  COPY-link.source_a11y; platform-mapping row). Opens in a new tab with `noopener noreferrer`; no CSP
  change. F-006 shipped in v1.1.0. Follow-up (owner request): the link shows the GitHub mark — one CC0 path
  from Simple Icons inlined (DEP-43, trademark used only to link to the repo; owner sign-off).
- 2026-10-20 — Tooling (owner request): local ports moved off the Vite defaults, which clashed with
  sibling tools — dev 5190, preview 4190, e2e fixture servers 4500–4506 (`E2E_PORT_BASE`).

## v1.0.0 — 2026-10-19

- 2026-10-15 — Change (owner): Strip symbols and Remove accents now **default ON** (RULE-11/12,
  ENT-Preferences, MOD-Prefs DEFAULTS); the choice is still remembered per device (RULE-14). F-008.R1/
  AC7/AC8 and F-009.R1/AC7 updated; e2e reworked for default-on. Note: with strip on by default,
  UPPERCASE/lowercase of a plain identifier render space-joined (getUserID → "GET USER ID"), and
  non-Latin/punctuation is dropped by default until a user turns Strip off.
- 2026-10-15 — Design: the Sort dropdown uses a custom, theme-aware chevron with proper spacing
  (app.css + design/mockup.html); CSP-safe data: SVG.

- 2026-10-15 — M-2 built & shipped (F-008/009/010): in-house engine transforms (RULE-11 strip
  symbols, RULE-12 remove accents, pure, zero-dep); CMP-Controls options bar (switches + sort);
  CMP-ResultRow restructured to a group with a copy button + a separate pin button, plus the
  last-used badge; MOD-Prefs persists ENT-Preferences in a single `localStorage` key (RULE-14,
  non-content) with a try/catch session-only fallback; ESLint storage-ban updated to allow that one
  key in `src/prefs/**` only. 114 unit + 34 Chromium e2e green; AC coverage 100%; size 15.8 KB /
  250 KB; licenses within ADR-0001 (no new deps); axe 0 violations. FF/WebKit e2e + lhci remain
  CI/owner checks.

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
