---
id: F-005
title: Fit into the host portal
status: building
milestone: M-1
priority: P0
personas: [PER-02, PER-01]
entities: []
rules: [RULE-10]
screens: [SCR-Converter]
components: []
nfr: [NFR-06, NFR-07]
events: []
depends_on: []
---

## Intent

Feel like a native part of the portal when embedded, and work fully on its own (PRN-05).

## Scope

- In: theme (light/dark) following the host or the system; filling the host's area; running
  standalone; accepting messages only from trusted origins.
- Out: sharing user text with the host (PRN-01); the host's own navigation and chrome.

## Requirements

- **R1** When embedded, the tool uses the initial theme the host passes in its address from first
  display (no flash of the wrong theme), and follows later theme messages (RULE-10).
- **R2** When standalone, the tool follows the device's light/dark preference.
- **R3** The tool fills the area the host gives it and adapts when that area changes size, with
  no page scrollbar of its own (NFR-06).
- **R4** Only allowed host origins (RULE-10) can embed the tool; settings messages from any other
  origin are ignored (NFR-07).
- **R5** The only message the tool sends to the host is the ready signal; it never contains user
  text (INV-01, RULE-10).
- **R6** The tool works completely when opened standalone.

## Acceptance criteria

- **AC1** Given the host opens the tool with theme dark in its address, when the tool first
  displays, then it shows the dark theme with no light frame shown first. (R1)
- **AC2** Given the tool is embedded in light theme, when the host switches to dark, then the
  tool switches to dark without reloading or losing the input. (R1)
- **AC3** Given the tool is opened standalone on a device set to dark, when it loads, then it
  shows the dark theme. (R2)
- **AC4** Given the tool is embedded, when the host area is resized to 320 px wide, then the tool
  fills the new area without a horizontal scrollbar of its own. (R3)
- **AC5** Given a settings message from an origin not in the allowed list, when it arrives, then
  it is ignored. (R4)
- **AC6** Given the tool is embedded and the user converts and copies text, when messages to the
  host are observed, then the only one is the ready signal, with no user text. (R5)
- **AC7** Given a page whose origin is not in the allowed list, when it tries to embed the tool,
  then the browser refuses to display the tool inside it. (R4)
- **AC8** Given the tool is opened standalone, when the user uses every M-1 feature, then each
  works as specified. (R6)
- **AC9** Given the tool is embedded and the host passes no theme (or an unknown value) in its
  address, when it first displays, then with no theme it follows the device preference and with an
  unknown value it keeps the current theme, with no flash. (R1)
- **AC10** Given the allowed-origin list is empty, when any page tries to embed the tool, then the
  browser refuses to display it, and the tool is still fully usable standalone. (R4, R6)

## UX notes

No visible theme control when embedded; the host owns it. SCR-Converter has no header of its own
when embedded (the host shows the title).

## Edge cases

- Host sends an unknown theme value → keep the current theme.
- Host never sends a theme → follow the device preference.

## Open questions
