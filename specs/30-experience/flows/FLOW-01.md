---
id: FLOW-01
title: Convert and copy
status: ready
features: [F-001, F-002, F-003]
screens: [SCR-Converter]
---

## Goal

Turn a piece of text into the case the user needs and copy it, in seconds, without choosing a
mode first.

## Diagram

```mermaid
flowchart LR
  A[Open tool] --> B[Type or paste text]
  B --> C[All eleven cases update live]
  C --> D[Click the wanted case]
  D --> E[Copied — confirmation shown]
  C --> B
```

## Steps

1. Open the tool — SCR-Converter — standalone or embedded (F-005).
2. Type or paste text into the input — CMP-InputArea — F-001.R1/R3.
3. See every case computed live in the grid — CMP-ResultGrid — F-002.R1/R2.
4. Activate the row for the case wanted — CMP-ResultRow — F-003.R1.
5. See the copied confirmation — F-003.R2.

## Exits & failures

- The user can keep editing the input at any time; results recompute (F-001.R4).
- If the clipboard write is blocked by the browser, the text is unchanged and COPY-status.copy_failed
  is shown (F-003.R5).
- Clearing the input returns to the empty state (F-001.R2).
