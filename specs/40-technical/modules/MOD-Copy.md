---
id: MOD-Copy
title: Strings
status: draft
depends_on: []
---

## Responsibility

The user-facing strings, generated from `copy.md` at build time (case labels, actions,
placeholders, statuses, notices) with their `{placeholders}` typed. One source of truth for text.

## Not responsible for

- Rendering (MOD-App); conversion (MOD-Engine).

## Public surface

- A typed catalog of the COPY-* strings and a small formatter for `{case}` / `{n}` placeholders.

## Implements

`copy.md`. Decided by ADR-0007.
