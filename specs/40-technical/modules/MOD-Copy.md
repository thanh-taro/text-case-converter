---
id: MOD-Copy
title: Strings
status: draft
depends_on: []
---

## Responsibility

The user-facing strings, generated from `copy.md` at build time (case labels, actions,
placeholders, statuses, notices) in every supported language (RULE-15), with their
`{placeholders}` typed. Holds the active language and formats counts for it. One source of
truth for text.

## Not responsible for

- Rendering (MOD-App); conversion (MOD-Engine).

## Public surface

- A typed catalog of the COPY-* strings per language and a small formatter for `{case}` / `{n}`
  placeholders that uses the active language.
- The active-language signal (set by MOD-Host) and a locale-aware count formatter (F-011.R6).

## Implements

`copy.md`; F-011 (strings and formatting). Decided by ADR-0007, ADR-0013.
