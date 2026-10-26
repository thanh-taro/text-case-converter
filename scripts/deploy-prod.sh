#!/usr/bin/env bash
# Manual production deploy (ADR-0012, ADR-0006, MOD-Build): `pnpm deploy:prod`.
# Runs every local check, builds for production, uploads dist/ with the owner's wrangler login,
# then runs the post-deploy smoke test. There is no deploy workflow; nothing deploys on a push or tag.
#   SW_KILL=1 pnpm deploy:prod   recovery only: ship the offline kill switch
set -euo pipefail
cd "$(dirname "$0")/.."

SITE_URL="https://text-case-converter.tarokit.app"
export WRANGLER_SEND_METRICS=false

step() { printf '\n== %s\n' "$*"; }

# Tracked files must match the commit being deployed. Untracked files (IDE, local settings) and
# the workflow's own progress file never reach dist/, so they are not checked.
step "Tracked files are committed and on main"
[ -z "$(git status --porcelain --untracked-files=no -- . ':!.build-my-app/state.json')" ] ||
  { echo "Uncommitted changes to tracked files; commit first." >&2; exit 1; }
[ "$(git rev-parse --abbrev-ref HEAD)" = "main" ] || { echo "Not on main." >&2; exit 1; }

step "Checks"
pnpm gen:check
python3 tools/spec_lint.py
pnpm typecheck
pnpm lint
pnpm test

# Firefox is not automated (ADR-0014); it is checked by hand on the release candidate.
step "E2E (Chromium + WebKit; builds its own dist against the stub host)"
pnpm exec playwright test --project=chromium --project=webkit

step "Production build (HOST_ORIGINS=https://tarokit.app)"
HOST_ORIGINS="https://tarokit.app" SW_KILL="${SW_KILL:-}" pnpm build
pnpm check:licenses
pnpm check:size
grep -q 'frame-ancestors https://tarokit.app$' dist/_headers
test -f dist/.assetsignore
grep -q '^\*\.map$' dist/.assetsignore

step "Upload dist/ with wrangler"
pnpm exec wrangler whoami >/dev/null || { echo "Not logged in: run 'pnpm exec wrangler login'." >&2; exit 1; }
pnpm exec wrangler deploy

step "Post-deploy smoke test"
pnpm smoke:prod "$SITE_URL"

echo
echo "Deployed $(node -p "require('./package.json').version") ($(git rev-parse --short HEAD)) to $SITE_URL"
