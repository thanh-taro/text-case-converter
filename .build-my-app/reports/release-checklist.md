# Release checklist — Text Case Converter v1.0.0

Channel: Cloudflare Workers static assets at **https://text-case-converter.tarokit.app** (ADR-0006),
published by `.github/workflows/deploy.yml`. Owner column: **Claude** = done/automatable here,
**User** = a hard stop (account, secret, domain, push, deploy, publish) only you can do.

## A. Ready in the repo (Claude — done)
- [x] M-1 + M-2 built (F-001..F-010), all features `shipped`; lint/typecheck/spec-lint 0/0; 0 ACs without a test.
- [x] Unit + property (114) and Chromium e2e (34) + axe (0 violations) green locally.
- [x] Production build 16.1 KB critical path (NFR-05 budget 250 KB).
- [x] License audit clean; `dist/` ships only Preact, signals, 2 fonts (ADR-0001).
- [x] `deploy.yml` (manual dispatch or `v*` tag), `scripts/smoke-prod.mjs`, `smoke:prod` script.
- [x] Privacy declaration wording accepted (`.../qa/privacy-declaration.md`); terms draft written.
- [x] **Re-review the privacy paragraph added for M-2** (settings saved on-device) — User.
- [x] Release notes written (`.../release-notes.md`).

## B. Pre-flight the owner should run first (User)
These need engines/tools that can't run in the build sandbox:
- [x] **Three-engine e2e** (2026-10-19, Claude): Chromium 34/34, WebKit 34/34 (after scoping clipboard permissions to Chromium). Firefox 23/27 — the other 4 (F-005.AC2, AC3, AC7, AC9-missing) never got a browser: Playwright's Firefox is killed at launch on this Mac (SIGTERM). They pass on Chromium + WebKit; re-check on CI.
- [x] **Lighthouse budgets** (2026-10-19, Claude): all assertions pass; perf 99–100, a11y 100, best-practices 96, TTI 388–454 ms (budget 1500).
- [ ] **Screen-reader pass** (VoiceOver/NVDA) + a **real touch device** pass + forced-colors/200% zoom.
- [ ] Add **privacy contact details** (you are the data controller) to the privacy text before publishing.
- [ ] Decide a **source license** — `package.json` is `private`/UNLICENSED (all rights reserved); pick one or keep closed.

## C. Accounts & secrets (User — HARD STOPS)
1. [ ] **Cloudflare account**: sign in at https://dash.cloudflare.com (the same account that hosts `tarokit.app` / the JSON Formatter). Confirm the `tarokit.app` zone is active.
2. [ ] **Account ID**: Dashboard → any domain → right sidebar → copy **Account ID**.
3. [ ] **API token**: My Profile → API Tokens → Create Token → *Edit Cloudflare Workers* template (or custom with: Account → Workers Scripts → Edit; Account → Account Settings → Read; Zone → Workers Routes → Edit on `tarokit.app`; Zone → DNS → Edit on `tarokit.app`). Copy the token once.
4. [ ] **GitHub repo**: create a private repo (e.g. `tarokit/text-case-converter`), then from this folder:
   `git remote add origin git@github.com:<you>/text-case-converter.git && git push -u origin main`
   *(first push = hard stop; nothing has been pushed yet — there are local commits only.)*
5. [ ] **Repo secrets**: GitHub → Settings → Environments → **New environment `production`** (add yourself as a Required reviewer if you want manual approval). In that environment add secrets **`CLOUDFLARE_API_TOKEN`** and **`CLOUDFLARE_ACCOUNT_ID`**.

## D. Domain (User — HARD STOP)
6. [ ] The route is pre-set in `wrangler.jsonc` (`text-case-converter.tarokit.app`, custom_domain). On the first `wrangler deploy` Cloudflare provisions the custom hostname + certificate automatically because the `tarokit.app` zone is in the same account. If you prefer, pre-create the DNS/custom-domain in the dashboard first. Verify no other service claims that subdomain.

## E. Deploy (User triggers; pipeline runs the checks)
7. [ ] Bump/confirm version: `package.json` is `1.0.0`.
8. [ ] Tag and push to deploy: `git tag v1.0.0 && git push origin v1.0.0`  — **or** run the **Deploy** workflow manually (Actions → Deploy → Run workflow).
9. [ ] Approve the `production` environment run if you set a required reviewer.
10. [ ] The pipeline runs every check, builds with `HOST_ORIGINS=https://tarokit.app`, `wrangler deploy`s `dist/`, then runs the post-deploy smoke test as its last step.

## F. Verify live (User, or Claude once a URL exists)
11. [ ] `pnpm smoke:prod https://text-case-converter.tarokit.app` → all checks pass (headers, no source maps, notices, zero post-load requests).
12. [ ] Open the live tool standalone; paste `getUserID`; confirm all 11 cases + click-to-copy; toggle Strip symbols / Remove accents, pin a case, reload → settings kept.
13. [ ] Add/confirm the tool's tile/link in the **tarokit.app portal** (host side) and check it embeds with the right theme and no console errors.

## G. Publish policy text (User)
14. [ ] Publish the privacy text (with your contact details) and the terms (after your review) wherever the portal surfaces them.

## Deploy record
| Date | By | Commit | Version ID | Smoke |
|---|---|---|---|---|
| 2026-10-19 | Claude, local `pnpm exec wrangler deploy` with the owner's wrangler OAuth login (account `a883c9c8bc26ff703c6a7894d5b06a02`), at the owner's request; build `HOST_ORIGINS=https://tarokit.app pnpm build` | `78b0811` | `954f0398-fe2a-4484-afd5-ba55fd816455` | `pnpm smoke:prod https://text-case-converter.tarokit.app`: all 9 checks passed |

Sections C–E above (GitHub repo, secrets, tag-driven deploy) are still open: there is no git
remote yet, so the Deploy workflow has never run. The live site was deployed from this machine.

## Rollback
- A failed post-deploy smoke test means the live site is wrong. Re-deploy the previous good tag: `git push origin v<previous>` (or Actions → Deploy → Run workflow on the previous commit).
- **Offline kill switch** (if a bad service worker is stuck in users' browsers): Actions → Deploy → Run workflow with `sw_kill = true` (builds `SW_KILL=1`, which unregisters the worker), then redeploy the fixed build normally.

## Notes
- `public/_headers` is generated by `pnpm gen` from `HOST_ORIGINS`; locally it defaults to `http://localhost:4174` for dev, and the deploy always rebuilds it with `https://tarokit.app`. The committed copy is kept at the production value.
- Claude deployed v1.0.0 on 2026-10-19 at the owner's request (deploy record above). Nothing has been pushed to GitHub or paid for.
