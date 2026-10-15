---
id: ADR-0008
title: Host contract transport
status: accepted
date: 2026-10-15
supersedes: []
---

## Context

The tool must take its initial theme without a flash, follow later theme changes, accept messages
only from allowed origins, and send exactly one message that never carries user text (F-005,
RULE-10, NFR-07, INV-01). It must match the portal's existing contract and the sibling's.

## Decision

Adopt the portal's contract (same as the sibling): the host passes `?theme=light|dark` in the
tool's address, read before first paint by an inline, CSP-hashed classic script that sets
`<html data-theme>`. Later changes arrive as `postMessage` `{ type: "taro:theme", value }`,
accepted only when `event.origin` is in the allow-list and `event.source === window.parent`;
unknown values are ignored. The tool posts `{ type: "taro:ready" }` once to the parent origin —
the only message out, never `"*"`, never content. Standalone, it follows
`matchMedia("(prefers-color-scheme: dark)")`.

## Alternatives considered

- **Query-string theme only** — cannot follow live theme switches (F-005.AC2).
- **A richer message API** — more surface for no M-1 need and more privacy risk.

## Consequences

- Native feel in the portal with no theme flash; a sibling-identical, testable contract.
- The allow-list is fixed at deploy (ADR-0006 header); empty list = standalone only.

<!-- Accepted ADRs are immutable. Write a new ADR to change a decision. -->
