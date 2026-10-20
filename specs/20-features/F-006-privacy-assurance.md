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
- In: a link to the tool's public source code, so anyone can check the privacy promise for
  themselves.
- Out: a full privacy policy page (owner work in release); cookie banners (there are none).

## Requirements

- **R1** A short, plain privacy statement (COPY-label.privacy) is always visible on the screen.
- **R2** After initial load, the tool makes no network requests of its own; the only network
  activity is the browser maintaining the offline cache of the tool's own files, which never
  carries user text (NFR-01).
- **R3** The tool uses no analytics and never stores the user's text between sessions; only
  non-content preferences may be stored on the device (PRN-01, RULE-14).
- **R4** A link to the tool's public source code (COPY-link.source) is always visible next to the
  privacy statement. Following it opens the source in a new page and never navigates the tool
  itself away; it carries no user text and tells the source page nothing about where it came from
  (PRN-01).

## Acceptance criteria

- **AC1** Given the tool is open, when the user looks at the status bar, then COPY-label.privacy
  is shown. (R1)
- **AC2** Given a full session of entering, converting and copying text, when network activity is
  observed, then there are no requests of the tool's own after load. (R2)
- **AC3** Given the user enters text and then reloads the tool, when it reopens, then the input
  is empty (the input text was not persisted; only non-content preferences may be). (R3)
- **AC4** Given the tool is inspected, when its content security policy is read, then it forbids
  outgoing connections. (R2)
- **AC5** Given the tool is open, standalone or embedded, when the user looks at the status bar,
  then COPY-link.source is shown, points to the tool's public source code, and is reachable by
  keyboard with accessible name COPY-link.source_a11y. (R4)
- **AC6** Given the user has entered text, when they follow COPY-link.source, then the source opens
  in a new page, the tool stays open with its input intact, and the link address contains no user
  text and no referrer is sent. (R4)

## UX notes

CMP-StatusBar shows COPY-label.privacy at all times; it is quiet and never covers the results.
COPY-link.source sits beside it, equally quiet.

## Edge cases

- Offline (no network) → the statement and the tool still work (F-007); following the source link
  just fails to load the new page, the tool is unaffected.
- The host forbids the embedded tool from opening new pages → following the link does nothing; the
  tool is unaffected.

## Open questions
