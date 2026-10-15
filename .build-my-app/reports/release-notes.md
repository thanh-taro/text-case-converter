# Text Case Converter — v1.0.0

The first release of the TaroKit Text Case Converter: a private, in-browser tool that turns any
text or identifier into every case at once.

## Highlights
- **Every case at once.** Paste a name, a phrase, or a whole list and instantly see all eleven
  cases — no mode to pick, no Convert button. Click any result to copy it.
- **Eleven cases:** camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case,
  path/case, Title Case, Sentence case, UPPERCASE, lowercase.
- **Gets acronyms and numbers right.** `getUserID` → `get_user_id`, `HTTPResponse` →
  `http_response`, `v2Point5`, `utf8` and friends are tokenized the way a developer expects.
- **Lists, line by line.** Multi-line input converts each line independently — paste a column of
  database fields, get a column of API names.
- **Private by construction.** Everything runs in your browser; your text is never uploaded,
  logged, or stored, there are no analytics and no cookies, and the content security policy
  forbids the tool from making any network connection.
- **Works offline** after the first load, and **fits the TaroKit portal** (light/dark theme,
  embedded or standalone).
- **Accessible:** full keyboard operation, screen-reader announcements, WCAG 2.2 AA contrast in
  both themes.

## Under the hood
- ~14 KB over the wire; a pure in-house tokenizer (no third-party casing library).
- Preact + signals, strict CSP, Cloudflare static hosting.

## Known limitations
- Acronyms are normalized when a case capitalizes per word (`getUserID` → `GetUserId`); a
  keep-acronyms option is a candidate for a later release.
- Round-tripping between cases is not guaranteed (by design).
