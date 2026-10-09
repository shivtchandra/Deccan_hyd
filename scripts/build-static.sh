#!/usr/bin/env bash
# Builds the whole site as static files in out/ for Cloudflare Pages.
#
# Run on a throwaway checkout (CI): it deletes app/api, which runs on the API
# Worker (api-worker/, reached through functions/api).
set -euo pipefail
cd "$(dirname "$0")/.."

if [ "${CI:-}" != "true" ] && [ "${ALLOW_DESTRUCTIVE_LOCAL:-}" != "1" ]; then
  echo "Refusing to run outside CI: this deletes app/api from the checkout." >&2
  exit 1
fi

rm -rf app/api out
HYD_STATIC_EXPORT=1 npx next build
node scripts/static-redirects.mjs > out/_redirects
node scripts/static-headers.mjs > out/_headers
echo "static export: $(find out -type f | wc -l | tr -d ' ') files, $(du -sh out | cut -f1)"
