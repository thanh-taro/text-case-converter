---
id: MOD-Host
title: Host integration & offline
status: draft
depends_on: []
---

## Responsibility

Everything about living inside (or outside) the portal: reads the initial theme from the tool's
address before first paint, listens for origin-checked settings messages, sends the single
ready signal, follows the device preference when standalone, and registers the offline service
worker that caches only the tool's own files (RULE-10). Enforces that no user text ever leaves
the page (INV-01).

## Not responsible for

- App state or rendering (MOD-App); conversion (MOD-Engine).
- Any message carrying user content — it never constructs one (INV-01).

## Public surface

- A boot step (inline, CSP-hashed) that sets the theme attribute from the address.
- A theme signal/subscription other modules read.
- Message handling that accepts only allow-listed origins from the parent frame (RULE-10, NFR-07)
  and ignores everything else.
- Service-worker registration and the worker script itself (tool's own files only).

## Implements

F-005 (theme, sizing, embedding, ready signal), F-007 (offline); RULE-10; NFR-01, NFR-07.
Decided by ADR-0006, ADR-0008, ADR-0010.
