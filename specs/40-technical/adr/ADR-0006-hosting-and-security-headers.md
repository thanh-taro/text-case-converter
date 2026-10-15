---
id: ADR-0006
title: Hosting, security headers, and platform access
status: accepted
date: 2026-10-15
supersedes: []
---

## Context

The tool is a static single-page app, embedded by the portal and usable standalone, that must
make no network requests of its own after load (NFR-01), be embeddable only by allowed origins
(NFR-07, RULE-10), and still reach the clipboard on an explicit copy (F-003, RULE-07). No backend,
zero budget, parity with the sibling.

## Decision

Host on **Cloudflare Workers static assets** at `text-case-converter.tarokit.app` (DEP-33 for
deploy), serving a header-delivered strict CSP:
`default-src 'none'; script-src 'self' 'sha256-…'; style-src 'self'; img-src 'self' data:;
font-src 'self'; connect-src 'none'; frame-ancestors https://tarokit.app; base-uri 'none';
form-action 'none'; object-src 'none'`. Also `Permissions-Policy` granting only clipboard-write
to self (camera/microphone/geolocation/clipboard-read off), `Referrer-Policy: no-referrer`,
`X-Content-Type-Options: nosniff`, `Cross-Origin-Opener-Policy: same-origin`. Clipboard copy uses
`navigator.clipboard.writeText` inside the click handler; a refusal is handled by F-003.R5.
`connect-src 'none'` makes the privacy promise enforceable (INV-01).

## Alternatives considered

- **GitHub Pages / Netlify** — fine, but the sibling uses Cloudflare and it gives header control
  and the same deploy path.
- **Meta-tag CSP** — cannot set `frame-ancestors`; must be a header.

## Consequences

- Privacy is enforced by the platform, not just by discipline (NFR-01, NFR-07).
- Account, DNS, and secrets are owner work at release (hard stop).
- No `eval`, no inline styles, no network — constraints the engine and UI already satisfy.

<!-- Accepted ADRs are immutable. Write a new ADR to change a decision. -->
