# Dependencies & assets

Policy: ADR-0001 (same allow-lists and exceptions as the portal and the sibling JSON Formatter).
Every direct dependency, every transitive **runtime** dependency, and every asset pack is
registered here before it enters the lockfile. Versions as published on 2026-10-15.

Kinds: **runtime** = shipped to the browser; **asset** = shipped non-code file; **build** /
**dev** / **ci** = never shipped. Status: `candidate` → `approved` → `removed`.

**Owner sign-off required (legal):** the license policy (ADR-0001) and every `runtime`/`asset`
row below are a legal decision. They are drafted here as `candidate` and must be approved by the
owner at the architecture gate before the lockfile is created.

## Runtime (shipped)

| ID         | Name                 | Version range                  | License | Kind    | Purpose                           | Status   | Decided by |
| ---------- | -------------------- | ------------------------------ | ------- | ------- | --------------------------------- | -------- | ---------- |
| **DEP-01** | preact               | ~10.29 (10.x, like the portal) | MIT     | runtime | UI shell rendering                | approved | ADR-0002   |
| **DEP-02** | @preact/signals      | ^2.11                          | MIT     | runtime | App state, per-row result updates | approved | ADR-0002   |
| **DEP-03** | @preact/signals-core | transitive of DEP-02 (^1.x)    | MIT     | runtime | Signals runtime                   | approved | ADR-0002   |

The case engine (MOD-Engine) is **in-house** (ADR-0004), so there is no tokenization/casing
runtime dependency — the main difference from the sibling's dependency set.

## Assets (shipped)

| ID         | Name                                                 | Version range                  | License          | Kind           | Purpose                                                     | Status                                               | Decided by |
| ---------- | ---------------------------------------------------- | ------------------------------ | ---------------- | -------------- | ----------------------------------------------------------- | ---------------------------------------------------- | ---------- |
| **DEP-11** | lucide-static                                        | ^1.55                          | ISC              | asset          | Not adopted: the few icons (copy, check, x, info, alert) are inlined as hand-authored SVG in lucide's visual style in src/app/components/Icon.tsx; no icon package ships | removed (not adopted)                                | ADR-0007   |
| **DEP-43** | GitHub mark (path from simple-icons 13.21.0, inlined) | 13.21.0 (path copied once) | CC0-1.0 (icon data); the mark is GitHub's trademark, used only to link to the tool's GitHub repository per GitHub's logo guidelines | asset | Brand icon on the source-code link (F-006.R4), one SVG path inlined in src/app/components/Icon.tsx; no package ships | approved (owner sign-off 2026-10-20) | ADR-0001 |
| **DEP-12** | @fontsource-variable/manrope                         | ^5                             | OFL-1.1          | asset          | UI face, self-hosted Latin + Vietnamese subsets (ADR-0013)  | approved                                             | ADR-0007   |
| **DEP-13** | @fontsource-variable/jetbrains-mono                  | ^5                             | OFL-1.1          | asset          | Mono face for result text, self-hosted Latin subset         | approved                                             | ADR-0007   |
| **DEP-14** | Portal design tokens ("Night Market", `tokens.json`) | copy pinned to a portal commit | Owner's own work | asset (source) | Colours, spacing, radii, motion shared with the portal      | candidate (owner's own work, reused with permission) | ADR-0007   |

## Build, dev, test (never shipped)

| ID         | Name                                                    | Version range              | License                                                              | Kind  | Purpose                                                     | Status   | Decided by         |
| ---------- | ------------------------------------------------------- | -------------------------- | -------------------------------------------------------------------- | ----- | ----------------------------------------------------------- | -------- | ------------------ |
| **DEP-15** | typescript                                              | ~6.0                       | Apache-2.0                                                           | dev   | Type checking                                               | approved | ADR-0003           |
| **DEP-16** | vite                                                    | ^8.3                       | MIT                                                                  | build | Dev server, bundling                                        | approved | ADR-0003           |
| **DEP-17** | @preact/preset-vite                                     | ^2.10                      | MIT                                                                  | build | Preact JSX/HMR for Vite                                     | approved | ADR-0003           |
| **DEP-18** | lightningcss (via vite)                                 | transitive                 | MPL-2.0 (build-only exception)                                       | build | CSS transforms in Vite 8                                    | approved | ADR-0001           |
| **DEP-19** | caniuse-lite (via browserslist)                         | transitive                 | CC-BY-4.0 (attribution in notices)                                   | build | Browser target data                                         | approved | ADR-0001           |
| **DEP-20** | style-dictionary                                        | ~5.5                       | Apache-2.0                                                           | dev   | Compile DTCG tokens to CSS variables (same as portal)       | approved | ADR-0007           |
| **DEP-21** | vitest                                                  | ^5.0                       | MIT                                                                  | dev   | Unit, property and corpus tests                             | approved | ADR-0009           |
| **DEP-23** | fast-check                                              | ^4.10                      | MIT                                                                  | dev   | Property-based tests (INV-02/03/04, RULE-05)                | approved | ADR-0009           |
| **DEP-25** | @playwright/test                                        | ~1.63                      | Apache-2.0                                                           | dev   | E2E on three engines, host contract, no-network             | approved | ADR-0009           |
| **DEP-26** | Playwright browser binaries (Chromium, WebKit) | via DEP-25                 | Chromium BSD; WebKit LGPL-2.1 (test-only exception) | dev   | E2E engines (Firefox dropped, ADR-0014) | approved | ADR-0001, ADR-0009 |
| **DEP-27** | @axe-core/playwright (pulls axe-core)                   | ^4.13                      | MPL-2.0 (dev-only exception)                                         | dev   | Automated accessibility audit                               | approved | ADR-0001, ADR-0009 |
| **DEP-28** | @lhci/cli                                               | ^0.15                      | Apache-2.0                                                           | dev   | Startup/size budgets for NFR-05                             | approved | ADR-0009           |
| **DEP-29** | eslint                                                  | ^10                        | MIT                                                                  | dev   | Linting incl. network/storage-API ban and module boundaries | approved | ADR-0003           |
| **DEP-30** | typescript-eslint                                       | ^8.71                      | MIT                                                                  | dev   | TypeScript lint rules                                       | approved | ADR-0003           |
| **DEP-31** | eslint-plugin-jsx-a11y                                  | ^6.10                      | MIT                                                                  | dev   | Accessibility lint for TSX                                  | approved | ADR-0003           |
| **DEP-32** | prettier                                                | ^3.9                       | MIT                                                                  | dev   | Formatting                                                  | approved | ADR-0003           |
| **DEP-33** | wrangler                                                | ^4 (pinned by release age) | MIT OR Apache-2.0                                                    | ci    | Deploy static assets to Cloudflare                          | approved | ADR-0006           |
| **DEP-35** | pnpm                                                    | 11.x                       | MIT                                                                  | dev   | Package manager, license report                             | approved | ADR-0003           |

## Evaluated, not adopted (SPK-tokenizer)

| ID         | Name          | Version | License | Kind                 | Purpose                                                                   | Status                | Decided by |
| ---------- | ------------- | ------- | ------- | -------------------- | ------------------------------------------------------------------------- | --------------------- | ---------- |
| **DEP-40** | change-case   | 5.4.4   | MIT     | runtime (spike only) | Tokenization/casing candidate; viable MIT fallback, not needed (ADR-0004) | removed (not adopted) | ADR-0004   |
| **DEP-41** | scule         | 1.3.0   | MIT     | runtime (spike only) | Tokenization/casing candidate; viable MIT fallback, not needed            | removed (not adopted) | ADR-0004   |
| **DEP-42** | case-anything | 3.1.7   | MIT     | runtime (spike only) | Tokenization/casing candidate; viable MIT fallback, not needed            | removed (not adopted) | ADR-0004   |

## Notes

- All three evaluated libraries are MIT and strict-CSP safe (no `eval`); building our own
  (ADR-0004) keeps the runtime set to Preact + signals only and the shipped code all MIT.
- `/third-party-notices.txt` will list exactly the shipped runtime/asset rows plus the fonts
  (OFL) and icons (ISC). The CI license audit (ADR-0001) covers build-only transitive packages.
