# Vision

A private, client-side **text case converter** for developers, embedded in the taro-kit tools
portal (sibling to the JSON Formatter): paste any text or identifier and instantly see it in
every case at once — camelCase, snake_case, kebab-case, Title Case and more — with acronyms and
numbers handled correctly, and one click to copy. Nothing leaves the browser.

## Why it exists

Developers constantly need a string in a different casing convention — a database column to an
API field, an env var to a config key, a label from a ticket or spec to a variable name. An IDE
command wins when the text is already in the editor; a web tool wins when it is **not**: text
read in a browser tab, a **list** of names to convert at once, a forgotten editor incantation,
or a locked-down / cross-editor / phone context. This is a convenience utility living next to
the tools developers already open in the portal.

## What makes it different

1. **Every case at once, live.** No target to pick, no Convert button. Type or paste once; see
   every case; click any to copy. (PRN-02)
2. **Correct tokenization.** `HTTPResponse` becomes `http_response`, `getUserID` becomes
   `get_user_id`, numbers are handled sensibly. This is what makes the output trustworthy.
   (PRN-03)
3. **Per-line batch.** Paste a list; each line converts independently. A real edge over
   one-selection-at-a-time editor commands. (PRN-04)
4. **Private by construction.** All conversion happens in the page; no uploads, no analytics,
   no storage of your text. (PRN-01)

## Who it is for

Working developers (PER-01) using the portal on desktop or phone, and the portal maintainer
(PER-02) who needs it to feel native and need no backend.

## What success looks like

A developer pastes an identifier or a list, finds the case they want without choosing a mode,
trusts the acronym/number handling, copies it in one click, and never wonders whether their text
was sent anywhere.
