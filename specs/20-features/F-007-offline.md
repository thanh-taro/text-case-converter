---
id: F-007
title: Work offline
status: shipped
milestone: M-1
priority: P2
personas: [PER-01]
entities: []
rules: []
screens: [SCR-Converter]
components: []
nfr: [NFR-01]
events: []
depends_on: [F-005]
---

## Intent

Let the tool keep working with no network — on a plane, a locked-down network, or just a flaky
connection — since all it needs is already in the browser (PRN-01).

## Scope

- In: using every M-1 feature with no network after the first load; picking up updates when a
  network is available.
- Out: offline storage of the user's text (there is none, PRN-01).

## Requirements

- **R1** After the first successful load, the tool starts and works with no network connection.
- **R2** The offline cache holds only the tool's own files, never the user's text (NFR-01).
- **R3** When a newer version of the tool's files is available, the browser picks it up on a
  later open; the current session is not interrupted.

## Acceptance criteria

- **AC1** Given the tool has been loaded once, when the device goes offline and the user reopens
  it, then it starts and every M-1 feature works. (R1)
- **AC2** Given the tool is used offline, when the offline cache is inspected, then it contains
  only the tool's own files and no user text. (R2)
- **AC3** Given a newer version is deployed, when the user reopens the tool with a network, then
  the newer version is used on that or a subsequent open without disrupting the current session.
  (R3)

## UX notes

No offline-specific controls; offline is transparent to the user. The privacy statement (F-006)
holds offline too.

## Edge cases

- First ever load with no network → the tool cannot start (nothing cached yet); this is expected.
- A partially cached first load → the tool fetches what it needs when next online before relying
  on the cache.

## Open questions
