---
id: MOD-Host
title: Host integration & offline
status: draft
depends_on: []
---

## Responsibility

Everything about living inside (or outside) the portal: reads the initial theme and language
(RULE-15) from the tool's address before first paint and sets the page language, listens for origin-checked settings messages, sends the single
ready signal, follows the device preference when standalone, and registers the offline service
worker that caches only the tool's own files (RULE-10). Enforces that no user text ever leaves
the page (INV-01).

## Not responsible for

- App state or rendering (MOD-App); conversion (MOD-Engine).
- Any message carrying user content — it never constructs one (INV-01).

## Public surface

- A boot step (inline, CSP-hashed) that sets the theme attribute and the page language from the
  address.
- Language resolution (RULE-15) as pure functions, and forwarding of accepted language messages
  to MOD-Copy's active language.
- A theme signal/subscription other modules read.
- Message handling that accepts only allow-listed origins from the parent frame (RULE-10, NFR-07)
  and ignores everything else.
- Service-worker registration and the worker script itself (tool's own files only).

## Implements

F-005 (theme, sizing, embedding, ready signal), F-007 (offline), F-011 (language); RULE-10; NFR-01, NFR-07.
Decided by ADR-0006, ADR-0008, ADR-0010, ADR-0013.
