---
id: CMP-StatusBar
title: Status bar
status: ready
tokens: []
---

## Purpose

A quiet footer showing input context, the privacy guarantee, and a link to the source code.

## Anatomy

- Line count (COPY-status.lines) when the input has more than one line.
- Privacy statement (COPY-label.privacy).
- Source-code link (COPY-link.source, accessible name COPY-link.source_a11y), after the privacy
  statement (F-006.R4): the code host's logo mark (decorative) followed by the text.

## Variants & states

| Variant / state | Description                                      |
| --------------- | ------------------------------------------------ |
| single-line     | Privacy statement and source link.               |
| multi-line      | Line count, privacy statement and source link.   |

## Behavior

Shows nothing about the input's content, only its size and the privacy promise. The source link
opens the source in a new page (F-006.R4); it has a visible focus state and an underline or other
non-colour cue.

## Accessibility

Readable in the normal reading order; one interactive control (the source link), last in the tab
order, with an accessible name that says it opens a new page (COPY-link.source_a11y).
