---
id: F-011
title: Use the portal's language
status: ready
milestone: M-3
priority: P1
personas: [PER-02, PER-01]
entities: []
rules: [RULE-10, RULE-15]
screens: [SCR-Converter]
components: [CMP-InputArea, CMP-Controls, CMP-ResultGrid, CMP-ResultRow, CMP-Notice, CMP-StatusBar]
nfr: [NFR-01, NFR-04, NFR-05, NFR-06, NFR-07]
events: []
depends_on: [F-005]
---

## Intent

The portal is used in English and Vietnamese. The tool should speak the same language as the
portal around it, so it feels native (PRN-05), and pick a sensible language on its own when
opened standalone.

## Scope

- In: every user-facing string (copy.md) in each supported language (RULE-15); the language the
  host passes in the tool's address and in later settings messages (RULE-10); the fallback to the
  browser's language; marking the page language for assistive technology; number formatting.
- Out: translating case labels or results (RULE-15 — they are technical names and the
  conversion itself); a language control inside the tool (the host owns it, like the theme);
  remembering the language on the device; languages other than en-US and vi-VN.

## Requirements

- **R1** The tool shows every user-facing string in the active language (RULE-15), from first
  display, with no frame in another language shown first, and marks the page with that language.
- **R2** When embedded, the tool follows later language messages from the host without reloading
  and without losing the input, the results, or the preferences (RULE-10).
- **R3** When the host passes no language, or one that is not supported, the tool picks the
  language per RULE-15: the browser's preferred languages, then en-US.
- **R4** Language messages are accepted only from allowed host origins; messages from any other
  origin, or with an unsupported value, are ignored (RULE-10, NFR-07).
- **R5** Case labels, results, and the alphabetical sort order are identical in every language
  (RULE-15, INV-02).
- **R6** Counts shown to the user are formatted the way the active language writes numbers.
- **R7** Text in every supported language renders in the tool's own typefaces and fits the layout
  down to 320 px wide without a horizontal scrollbar (NFR-06).

## Acceptance criteria

- **AC1** Given the host opens the tool with language vi-VN in its address, when the tool first
  displays, then every user-facing string on the page is the vi-VN text from copy.md, the page
  language is vi-VN, and no English UI text is shown first; once the tool has started, the
  document title is the vi-VN COPY-app.title. (R1)
- **AC2** Given the host opens the tool with language en-US in its address, when it first
  displays, then every user-facing string is the en-US text and the page language is en-US. (R1)
- **AC3** Given the tool is embedded in vi-VN with text typed and a toggle changed, when the host
  sends a language message for en-US, then the UI switches to English without reloading, the page
  language is en-US, the document title is the en-US COPY-app.title, and the input, results, and
  preferences are unchanged. (R2)
- **AC4** Given the tool is embedded in vi-VN, when a language message arrives from an origin not
  in the allowed list, or with an unsupported value, then the language stays vi-VN. (R4)
- **AC5** Given the tool is opened with no language in its address, when the browser's preferred
  languages are `[vi]` or `[fr-FR, vi]`, then it shows vi-VN; and when they are
  `[fr-FR, en-GB, vi]` or `[fr-FR]`, then it shows en-US. (R3)
- **AC6** Given the host passes an unsupported language (e.g. fr-FR) in the address, when the tool
  first displays, then it behaves as if no language was passed (AC5). (R3)
- **AC7** Given the same input and preferences, when the tool is shown in vi-VN and in en-US, then
  every case label, every result, and the alphabetical order are identical. (R5)
- **AC8** Given the tool is in vi-VN and the input has 1,234 lines, when the status bar shows the
  line count, then the number uses Vietnamese digit grouping (`1.234`); in en-US the same count shows
  `1,234`. (R6)
- **AC9** Given the tool is in vi-VN, when it displays, then Vietnamese UI text renders in the
  tool's own UI typeface, including letters such as `ễ`, `ộ`, `ư`, `đ`. (R7)
- **AC10** Given the tool is in vi-VN at 320 px wide, when every state of SCR-Converter is shown,
  then there is no horizontal scrollbar and no control label is clipped. (R7)
- **AC11** Given copy.md, when the strings are generated, then every COPY ID has a text for every
  supported language, with the same placeholders. (R1)
- **AC12** Given the tool was first opened in en-US, when it is reopened offline in vi-VN, then
  Vietnamese UI text renders in the UI typeface, and in every language the network log shows no
  font request after the initial load, whatever the user types (NFR-01). (R7)

## UX notes

No language control in the tool; the host owns it (RULE-10). Case labels (the case-label strings in copy.md) stay in
their technical English form in every language. The badge, toggles and sort labels are longer in
Vietnamese; CMP-Controls and CMP-ResultRow wrap, and labels are never truncated (AC10). Inside a
vi-VN page the visible case labels are marked as English, so screen readers pronounce them in
English (NFR-04, WCAG 3.1.2).

## Edge cases

- The address holds `vi` or `vi-vn` (no region or other letter case) → matched to vi-VN (RULE-15).
- The address holds `en-GB` → matched to en-US (same primary language, RULE-15).
- The host sends language messages only after the ready signal (RULE-10); the language at open
  time comes from the address. A message sent before ready may be lost — the address value (or the
  RULE-15 fallback) applies, as for the theme.
- The host sends a theme message and a language message together → both apply independently.

## Open questions
