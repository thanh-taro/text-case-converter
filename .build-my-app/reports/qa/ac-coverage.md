# AC coverage — M-1 (updated in QA phase 5)

`python3 tools/spec_lint.py --coverage tests` → **0 acceptance criteria without a test.**

All 7 features' ACs are covered. The 10 ACs deferred from the build phase (F-005 embedding and
F-007 offline) are now covered by the e2e harness added in QA:
- `tests/e2e/server.mjs` — serves the production `dist/` with the generated `_headers`, plus a
  stub portal host on a second origin and an unlisted origin (frame-ancestors refusal).
- `tests/e2e/host/host.html` — stub host that embeds the tool and relays theme messages.
- `tests/e2e/host.spec.ts` — F-005.AC2/AC3/AC4/AC6/AC7/AC8/AC9.
- `tests/e2e/offline.spec.ts` — F-007.AC1/AC2/AC3 (service worker).
- F-005.AC5 (non-allowed origin message ignored) and F-005.AC10 (empty allow-list → standalone,
  frame-ancestors 'none') are covered by unit tests (`host-contract.test.ts`, `headers.test.ts`).

## Engine note
Local run: Chromium — all 21 e2e + 4 axe a11y tests green; 92 unit/property tests green.
Firefox and WebKit binaries do not launch in the local build sandbox; the full three-engine run
executes in CI (`.github/workflows/ci.yml`, `playwright install ... chromium firefox webkit`).

## M-2 (F-008, F-009, F-010) — covered

`python3 tools/spec_lint.py --coverage tests` → **0 acceptance criteria without a test** (M-1 + M-2).
- Engine transforms: `tests/unit/transform.test.ts` (F-008.AC1–AC8, F-009.AC1–AC7 outputs; RULE-11/12).
- UI + persistence + ordering: `tests/e2e/options.spec.ts` (F-008 live toggle/persist/fallback, F-009 live/persist, F-010 alphabetical/recent/last-used/pin/order-stable), Chromium.
- Privacy: `tests/e2e/smoke.spec.ts` strengthened — localStorage holds only the `tcc.prefs` key, never user text.
- Firefox/WebKit e2e + `pnpm lhci` remain CI / owner checks (binaries don't launch in the build sandbox), as for M-1.
