# Text Case Converter (taro-kit tools)

A private, client-side text case converter for developers, embedded via iframe in the taro-kit
tools portal: paste any text or identifier and see it in **every case at once** — camelCase,
snake_case, kebab-case, Title Case and more — with acronyms and numbers handled right, and one
click to copy. Nothing leaves the browser.

Specs are the source of truth: start with `specs/README.md`. Architecture:
`specs/40-technical/architecture.md`.

## Develop

Requirements: Node 24 (`.nvmrc`), pnpm 11 (`corepack enable`), Python 3 for the spec tools.

| Command | What it does |
|---|---|
| `pnpm install` | Install dependencies (lockfile committed; lifecycle scripts blocked) |
| `pnpm dev` | Regenerate code, then start the dev server at http://localhost:5190 |
| `pnpm gen` / `pnpm gen:check` | Regenerate tokens, copy, notices and `_headers` / fail if stale |
| `pnpm build` | Codegen, typecheck, production build into `dist/` |
| `pnpm preview` | Serve `dist/` at http://localhost:4190 |
| `pnpm typecheck` | TypeScript, app and e2e projects |
| `pnpm lint` / `pnpm format` | ESLint + Prettier check / write |
| `pnpm test` | Vitest: engine corpus, property and unit tests |
| `pnpm test:e2e` | Playwright smoke on Chromium against `dist/` (run `pnpm build` first) |
| `pnpm check:size` | Compressed critical-path budget (NFR-05) |
| `pnpm check:licenses` | License audit against the ADR-0001 allow-lists |
| `python3 tools/spec_lint.py` | Spec lint; add `--coverage tests` for criteria without tests |

First run of the browser tests: `pnpm exec playwright install chromium`.

Deploying for other host origins: `HOST_ORIGINS="https://a.example https://b.example" pnpm build`
(sets `frame-ancestors` and the compiled-in message allow-list).

## How it works

The heart is **MOD-Engine** (`src/engine/`): a pure, zero-dependency tokenizer + eleven case
renderers (RULE-01…RULE-06), validated 100% against an adversarial corpus. The UI (Preact +
signals) shows all cases live; clicking a row copies it. **MOD-Host** handles the portal theme,
origin-checked messages, the ready signal, and the offline service worker. There is no backend
and no network: the content security policy forbids outgoing connections.

## Privacy

Text Case Converter runs entirely in your browser. Your text is never uploaded, logged, or
stored, and the tool sends no analytics. It has no cookies and no accounts. Its content security
policy forbids it from making network connections, so what you paste stays in the page's memory
and is discarded when you close it. To work offline, the browser keeps a copy of the tool's own
program files (never your text). When embedded in the portal, the tool only tells the portal that
it is ready and receives the light or dark theme — never your text.

Questions about privacy: Thanh Nguyen Tri, [adamnguyen.itdn@gmail.com](mailto:adamnguyen.itdn@gmail.com).

## Release and deployment

Hosting is Cloudflare Workers static assets at https://text-case-converter.tarokit.app (ADR-0006).
Deploys are manual only (ADR-0012): there is no deploy workflow, and pushing a branch or tag deploys
nothing. From a clean `main`, after the commit's CI run is green, run `pnpm deploy:prod`. It runs
every check, builds with `HOST_ORIGINS=https://tarokit.app`, uploads `dist/` with your own
`wrangler` login, then runs the smoke test. Source maps are built hidden and excluded from upload
(`dist/.assetsignore`).

| Command | What it does |
|---|---|
| `pnpm deploy:prod` | Manual production deploy: checks, production build, upload, smoke test |
| `pnpm smoke:prod <url>` | Post-deploy check of headers, no source maps, notices, and zero requests after load in headless Chromium |
| `pnpm exec wrangler dev --port 8787` | Serve `dist/` locally with the real `_headers`; then `pnpm smoke:prod http://127.0.0.1:8787` |
| `SW_KILL=1 pnpm deploy:prod` | Deploy the offline kill switch (recovery only) |

## Status

M-1 and M-2 are built, QA-passed and live at https://text-case-converter.tarokit.app
(`specs/60-delivery/roadmap.md`). Release history: `specs/60-delivery/changelog.md`.

## License

Copyright (c) 2026 Thanh Nguyen Tri. The source is published under the
[PolyForm Strict License 1.0.0](LICENSE): you may read it and use it for personal, noncommercial purposes.
You may not use it commercially, redistribute it, or publish modified versions or new works based on it.
For any other use, ask the author.
