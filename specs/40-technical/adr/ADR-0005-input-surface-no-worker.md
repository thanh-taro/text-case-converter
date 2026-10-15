---
id: ADR-0005
title: Input surface and main-thread compute (no editor library, no worker)
status: accepted
date: 2026-10-15
supersedes: []
---

## Context

The sibling needs a full code editor and a worker for 100 MB documents. This tool does not: the
input is bounded by the responsiveness cap (RULE-08, 100,000 characters) and the work is pure
string transformation (MOD-Engine). F-002 requires live results; NFR-02 requires updates within
100 ms of the input settling.

## Decision

Use a **plain multi-line text field** (`<textarea>`) for CMP-InputArea — no editor engine — and
run MOD-Engine **synchronously on the main thread**, debounced ~150 ms (the settle delay,
RULE-08). No Web Worker. The spike (SPK-tokenizer perf) measured all eleven cases on a
100,000-character input in ~55 ms on the reference machine, comfortably within NFR-02; past the
cap, compute runs only after the input stops changing and the one-time COPY-notice.large is shown.

## Alternatives considered

- **Reuse the sibling's CodeMirror + worker** — large, unjustified cost (NFR-05) for input that
  never approaches the sibling's sizes; needs a shadow root for CSP for no benefit here.
- **Worker for compute** — unnecessary at ~55 ms/100k chars; adds protocol complexity.

## Consequences

- Tiny critical path and trivial CSP posture (no editor styles, no blob worker).
- The RULE-08 cap is the single guard against jank; its value is a tunable constant.
- Larger-than-cap inputs are a graceful degradation, not a feature (M-3 candidate).

<!-- Accepted ADRs are immutable. Write a new ADR to change a decision. -->
