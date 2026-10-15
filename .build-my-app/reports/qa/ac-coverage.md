# AC coverage — M-1 build

Automated coverage via `python3 tools/spec_lint.py --coverage tests`.

**Covered now:** every F-001/F-002/F-003/F-004/F-006 acceptance criterion, via
`tests/unit/*` (engine corpus 100%, state, host-contract, offline-policy, copy, headers),
`tests/property/*` (INV-02/03/04, RULE-05), and the Chromium e2e smoke `tests/e2e/smoke.spec.ts`.

**Deferred to QA (phase 5) — 10 ACs** needing the two-origin iframe host harness and the
offline service-worker harness (the sibling's `tests/e2e/server.mjs` pattern, three engines):

| AC | Why deferred |
|---|---|
| F-005.AC2 | host switches theme via postMessage → needs a stub host frame on a second origin |
| F-005.AC3 | standalone device-preference theme → needs emulated `prefers-color-scheme` + standalone load |
| F-005.AC4 | fills host area / resize to 320 with no own scrollbar → needs embedded layout harness |
| F-005.AC7 | browser refuses to embed from a non-allowed origin → needs real `frame-ancestors` headers |
| F-005.AC8 | every M-1 feature works standalone → full standalone pass on three engines |
| F-005.AC9 | missing/unknown theme fallback → stub host harness |
| F-005.AC10 | empty allow-list → standalone-only build + header check |
| F-007.AC1 | works offline after first load → service-worker + offline harness |
| F-007.AC2 | offline cache holds only the tool’s own files → cache-inspection harness |
| F-007.AC3 | newer version picked up on next open → SW update harness |

These are implemented in code (MOD-Host theme/contract/offline, verified at the unit level in
`host-contract.test.ts` and `offline-policy.test.ts`) and will get end-to-end coverage when the
phase-5 harness is stood up. Build-gate decision: recorded manual/e2e checks per the build gate.
