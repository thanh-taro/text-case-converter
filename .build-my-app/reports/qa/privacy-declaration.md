# Privacy declaration — Text Case Converter

*Wording reviewed and accepted by the owner (2026-10-15). **Before publishing at release**, the
owner (the data controller) must add contact details for privacy questions.*

## Statement
Text Case Converter runs entirely in your browser. The text you type or paste is never uploaded,
logged, or stored, and the tool sends no analytics. It has no cookies, no accounts and no
third-party code. Its content security policy forbids it from making network connections
(`connect-src 'none'`), so the text you convert stays in the page's memory and is discarded when
you close it.

To work offline, the browser keeps a copy of the tool's **own program files** (never your text).
It may re-check those files when you open the tool. When embedded in the taro-kit portal, the
tool only tells the portal that it is ready and receives the light or dark theme — it never shares
your text. Copy writes to your clipboard only when you activate a result, and nothing else.

One caveat outside our control: browser extensions and your browser's own features, such as
automatic page translation, can see page content. If you handle secrets, use a browser profile
without untrusted extensions.

## Evidence (verified in QA)
- **No network after load** — e2e `smoke.spec.ts` (F-006.AC2 / NFR-01): zero requests of the
  tool's own after load while converting and copying. CSP header `connect-src 'none'` present
  (`dist/_headers`).
- **Nothing persisted** — e2e (F-006.AC3): reload returns an empty input. No `localStorage` /
  `IndexedDB` / cookie writes (ESLint storage-API ban, MOD-Build).
- **Offline cache holds only the tool's own files** — e2e `offline.spec.ts` (F-007.AC2): every
  cached entry is a same-origin tool file; user text never appears in the cache.
- **Host messaging carries no user text** — e2e `host.spec.ts` (F-005.AC6): the only message the
  tool sends the host is `{type:"taro:ready"}`; settings messages are origin-gated (F-005.AC7).
- **No analytics / third-party code** — license audit: `dist/` ships only Preact, signals and the
  two self-hosted fonts.

## Data collected
None. No personal data, no usage data, no content leaves the device.

## Needs owner
- Contact point for privacy questions (an email or page).
- Confirm the hosting provider (Cloudflare) serves the static assets with no added logging beyond
  standard edge request logs, and that this is acceptable / disclosed.
