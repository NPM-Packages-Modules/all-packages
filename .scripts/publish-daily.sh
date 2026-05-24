#!/usr/bin/env bash
# Publish up to 20 packages — run in Terminal.app after: npm login
set -euo pipefail
cd "$(dirname "$0")/.."

unset npm_config_devdir NPM_CONFIG_DEVDIR 2>/dev/null || true
export NPM_CONFIG_USERCONFIG="${HOME}/.npmrc"
export npm_config_userconfig="${HOME}/.npmrc"

echo "Using npm config: $NPM_CONFIG_USERCONFIG"
npm whoami || {
  echo "Not logged in. Run: npm login"
  exit 1
}

export NPM_PUBLISH_DAILY_LIMIT="${NPM_PUBLISH_DAILY_LIMIT:-20}"
export NPM_PUBLISH_GAP_SEC="${NPM_PUBLISH_GAP_SEC:-300}"
export NPM_PUBLISH_SKIP_COOLDOWN=1

node .scripts/publish-daily-batch.mjs
