---
id: CMP-StatusBar
title: Status bar
status: ready
tokens: []
---

## Purpose

A quiet footer showing input context and the privacy guarantee.

## Anatomy

- Line count (COPY-status.lines) when the input has more than one line.
- Privacy statement (COPY-label.privacy).

## Variants & states

| Variant / state | Description                            |
| --------------- | -------------------------------------- |
| single-line     | Only the privacy statement is shown.   |
| multi-line      | Line count plus the privacy statement. |

## Behavior

Passive; shows nothing about the input's content, only its size and the privacy promise.

## Accessibility

Readable in the normal reading order; no interactive controls.
