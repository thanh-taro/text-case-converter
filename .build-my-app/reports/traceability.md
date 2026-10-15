# Traceability matrix — M-1

Generated in QA (phase 5). `spec_lint.py --coverage tests` → **0 acceptance criteria without a
test**. Engines: Chromium verified locally (all green); Firefox + WebKit run in CI
(`.github/workflows/ci.yml`) — their binaries cannot launch in the local build environment.

## Acceptance criteria → tests

| Feature | ACs | Tests | Result |
|---|---|---|---|
| F-001 Enter/clear | AC1–AC5 | `tests/unit/state.test.ts` (settle, large-notice, clear-when-empty), `e2e/smoke.spec.ts` (AC2 clear) | ✅ |
| F-002 See all cases | AC1–AC16 | `tests/unit/engine.test.ts` (corpus 100% — AC1–AC10, AC14–AC16), `tests/property/engine.property.test.ts` (INV-02/03/04, RULE-05), `e2e/smoke.spec.ts` (AC1, AC12, AC13) | ✅ |
| F-003 Copy | AC1–AC6 | `tests/unit/state.test.ts` + `io`, `e2e/smoke.spec.ts` (AC1,AC2,AC3,AC4,AC5), copy-failed path unit-tested | ✅ |
| F-004 Batch | AC1–AC7 | `tests/unit/engine.test.ts` (per-line, blank lines, char-based lines), `e2e/smoke.spec.ts` (AC1,AC3,AC4) | ✅ |
| F-005 Host | AC1–AC10 | `tests/unit/host-contract.test.ts` (AC5 origin reject, AC10 empty list), `e2e/smoke.spec.ts` (AC1), `e2e/host.spec.ts` (AC2,AC3,AC4,AC6,AC7,AC8,AC9) | ✅ (AC5/AC10 unit; rest e2e) |
| F-006 Privacy | AC1–AC4 | `tests/unit/headers.test.ts` (CSP), `e2e/smoke.spec.ts` (AC1,AC2,AC3,AC4) | ✅ |
| F-007 Offline | AC1–AC3 | `tests/unit/offline-policy.test.ts`, `e2e/offline.spec.ts` (AC1,AC2,AC3 — Chromium; Firefox/WebKit manual/CI) | ✅ |

## Flows
| Flow | Test | Result |
|---|---|---|
| FLOW-01 Convert and copy | `e2e/smoke.spec.ts` (fill → all cases → click row → copied + announced) | ✅ |

## NFRs → measurement

| NFR | Measurement | Result |
|---|---|---|
| NFR-01 Privacy / no network | e2e network log after load (F-006.AC2); CSP `connect-src 'none'`; storage-API ESLint ban | ✅ 0 requests |
| NFR-02 Responsiveness (<100 ms after settle) | Engine compute ~55 ms for 11 cases on 100 k chars (SPK-tokenizer) + ~150 ms debounce; e2e live-update confirms | ✅ within budget |
| NFR-03 Correctness | Engine corpus 46/46 (100%) + property tests (INV-02/03/04, RULE-05) | ✅ |
| NFR-04 Accessibility (WCAG 2.2 AA) | `e2e/a11y.spec.ts` axe: 0 violations (default + empty, both themes); labels/roles/live-region/focus verified | ✅ (manual SR pass = owner checklist) |
| NFR-05 Startup / size | `check:size` critical path **14.2 KB** / 250 KB; lighthouse (`pnpm lhci`) = CI/owner | ✅ size; lhci in CI |
| NFR-06 Browsers / 320 px reflow | 3-engine e2e in CI; `host.spec.ts` AC4 (320 px, no own scroll) | ✅ Chromium; FF/WebKit in CI |
| NFR-07 Embedding safety | `host.spec.ts` AC6 (ready-only), AC7 (non-allowed origin refused); `host-contract` unit | ✅ |
| NFR-08 Target sizes | 24 px min / 44 px coarse in CSS + design audit; a11y scan | ✅ (coarse-device tap = owner checklist) |

## Manual checks for the owner (not automatable here)
- Firefox + WebKit full e2e (run in CI or on the owner's machine — binaries don't launch in this sandbox).
- `pnpm lhci` startup numbers on the owner's machine/CI (needs Chrome).
- Screen-reader pass (VoiceOver / NVDA) and a real coarse-pointer/touch device pass.
- Forced-colors / 200% zoom / text-spacing manual pass.
