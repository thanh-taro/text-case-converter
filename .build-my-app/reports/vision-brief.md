# Vision brief — Text Case Converter (TaroKit)

_Phase 1 · drafted 2026-10-15 · sibling of the TaroKit JSON Formatter_

## One-line pitch

Paste anything and instantly see it in every case — camelCase, snake_case, kebab-case,
Title Case and more — with acronyms and numbers handled right, and one click to copy. Private,
in-browser, no setup.

## The problem (who, when, why now)

Developers constantly need a string in a different casing convention: a DB column → an API
field, an env var → a config key, a label from a Jira ticket / Slack / PDF spec → a variable
name. The honest truth: inside an editor, an IDE command wins. A web converter wins precisely
when **the text isn't in the editor yet** (it's in a browser tab you're already reading), when
it's a **bulk list** (40 column names at once), when you **don't recall the editor incantation**,
or on a **locked-down / cross-editor / phone** context. This is a convenience utility living
next to the JSON Formatter you already came to TaroKit for — not a destination tool. That
framing keeps scope honest.

## Positioning

- **Differentiator 1 — the whole product: all cases at once, live.** No target dropdown, no
  "Convert" button. Type/paste once, see every case, click any to copy. Most converters make
  you pick a target first; that's the UX flaw we remove.
- **Differentiator 2 — correct tokenization.** `HTTPResponse` → `http_response` (not
  `h_t_t_p_response`), `getUserID` → `get_user_id`, `v2Point5` handled sanely. This is what
  separates a tool devs trust from one they hand-correct. It's also the hard part (see risks).
- **Differentiator 3 — per-line batch, free.** Each line converts independently; paste a list,
  get a converted list. A genuine edge over one-selection-at-a-time editor commands.
- **Table stakes (state, don't architect around):** fully client-side, no ads, no trackers,
  clean UX, light/dark from host.

### Non-goals (explicit)

No persistence/history/saved snippets · no settings/preferences panel · no custom acronym
dictionary or configurable tokenization rules · no file upload/download (paste & copy only) ·
no URL-param/state sharing (conflicts with privacy) · no detect-current-case · no find/replace,
regex, or transformation chaining · no statistics/word counts · no "copy as array/JSON" · no
reordering/pinning/hiding cases · no CLI/API/npm package · no UI i18n · no stop-word list for
Title Case.

## Platform

Recommendation (same as JSON Formatter, no reason to differ): **web, 100% client-side**, Preact

- Vite + TypeScript, strict CSP, iframe-embeddable in the TaroKit portal and fully usable
  standalone, hosted on Cloudflare Workers static assets at `text-case-converter.tarokit.app`.
  Audience is developers on desktop + phone; distribution is the portal; cost is the free tier.

## Business & legal

Free personal/portfolio tool. No accounts, no payments, no user data leaves the device
(client-side string ops only). No regulation applies to a client-side text utility.
**Licensing watch-item:** if we reuse a tokenization library, it must be permissive (MIT/ISC) —
avoid GPL (e.g. IT Tools is GPL-3.0) — and contain no `eval`/runtime codegen (strict CSP).
Build-vs-buy is resolved by the tokenizer spike in Phase 3.

## Proposed case set (M-1)

User-named (definite): **camelCase, snake_case, kebab-case, UPPERCASE, Title Case.**
Recommended additions (cheap, commonly wanted by devs): **PascalCase, CONSTANT_CASE, lowercase,
Sentence case, dot.case, path/case.** → 11 rows. Title Case = capitalize the first letter of
every token, no stop-word list (documented choice). Round-tripping is explicitly **not**
guaranteed. Final list is a product decision for the owner.

## Feasibility & risks → spike candidates (Phase 3)

- **R1 Tokenization (main correctness/reputation risk).** No universally "correct" split;
  acronyms (`HTTPResponse`, `userID`) and numbers (`v2`, `utf8`) are genuinely ambiguous.
  → **SPK-tokenizer:** fixed 30–50 row adversarial corpus with expected outputs; target ≥90%
  pass with documented intentional choices; decide build-vs-buy (own vs scule/change-case/
  case-anything under strict CSP).
- **R2 Unicode / non-ASCII.** `café`, Greek, CJK (no case), emoji, Turkish-i trap.
  → **SPK-unicode:** confirm JS case-mapping; policy = non-cased/non-Latin characters pass
  through untouched; no crashes/mojibake. Keep small; no locale selection.
- **R3 Title/Sentence case ambiguity.** Decision, not spike: first-letter-per-token, no
  stop-words.
- **R4 Large paste performance.** Debounce input (~100–150 ms); warn beyond an input-size cap
  rather than freeze. Low risk (string ops are fast).

## MVP scope / milestones

- **M-1 — Core value:** one input area; live grid of the agreed case rows, each click-to-copy
  with a "copied" confirmation; per-line batch (multi-line input converts line-by-line,
  preserving line structure); defensible tokenizer (acronyms, numbers, existing delimiters,
  unicode pass-through); host theme + CSP + iframe inherited from JSON Formatter verbatim;
  privacy statement; offline use.
- **M-2 — candidates (not committed):** detect & highlight input's apparent case; a few more
  cases (Train-Case, COBOL-CASE) if demand appears; keyboard navigation of the grid.
- **M-3 — candidates:** remembered preferences (which rows shown) — settings only, never
  content.

## Open questions for the owner

1. Confirm the M-1 case set (recommend the 11 above).
2. Confirm "paste & copy only" — no file upload/download in M-1 (recommended).
3. Confirm per-line batch is in M-1 (recommended — it's the cheap, high-value edge).
