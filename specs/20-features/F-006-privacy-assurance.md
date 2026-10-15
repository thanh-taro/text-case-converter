---
id: F-006
title: Show the privacy guarantee
status: shipped
milestone: M-1
priority: P1
personas: [PER-01]
entities: [ENT-Preferences]
rules: [RULE-14]
screens: [SCR-Converter]
components: [CMP-StatusBar]
nfr: [NFR-01]
events: []
depends_on: []
---

## Intent

Reassure a developer who may paste sensitive identifiers that their text stays on their device
(PRN-01), and make that promise true and visible.

## Scope

- In: a visible, plain-language privacy statement; the tool making no network requests of its
  own after load; no analytics; no persistence of user text (per-device preferences may be stored
  locally — RULE-14, ENT-Preferences — but never the text you convert).
- Out: a full privacy policy page (owner work in release); cookie banners (there are none).

## Requirements

- **R1** A short, plain privacy statement (COPY-label.privacy) is always visible on the screen.
- **R2** After initial load, the tool makes no network requests of its own; the only network
  activity is the browser maintaining the offline cache of the tool's own files, which never
  carries user text (NFR-01).
- **R3** The tool uses no analytics and never stores the user's text between sessions; only
  non-content preferences may be stored on the device (PRN-01, RULE-14).

## Acceptance criteria

- **AC1** Given the tool is open, when the user looks at the status bar, then COPY-label.privacy
  is shown. (R1)
- **AC2** Given a full session of entering, converting and copying text, when network activity is
  observed, then there are no requests of the tool's own after load. (R2)
- **AC3** Given the user enters text and then reloads the tool, when it reopens, then the input
  is empty (the input text was not persisted; only non-content preferences may be). (R3)
- **AC4** Given the tool is inspected, when its content security policy is read, then it forbids
  outgoing connections. (R2)

## UX notes

CMP-StatusBar shows COPY-label.privacy at all times; it is quiet and never covers the results.

## Edge cases

- Offline (no network) → the statement and the tool still work (F-007).

## Open questions
