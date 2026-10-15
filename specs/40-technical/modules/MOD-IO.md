---
id: MOD-IO
title: Clipboard
status: draft
depends_on: []
---

## Responsibility

Writing a chosen result to the clipboard on an explicit user action, and reporting success or a
refusal back to the caller (RULE-07). Writes nothing else anywhere (PRN-01, INV-01).

## Not responsible for

- Deciding what to copy or showing the confirmation (MOD-App drives the UI).
- File upload or download — out of scope for M-1.

## Public surface

- A copy function that takes the result text and resolves to success or a refusal signal, so
  MOD-App can show COPY-status.copied or COPY-status.copy_failed.

## Implements

F-003 (copy, failure path); RULE-07; NFR-01. Decided by ADR-0006.
