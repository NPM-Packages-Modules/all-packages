#!/usr/bin/env bash
# Scheduled wrapper for publish-daily.sh (launchd / cron).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/.scripts"
LOCKDIR="$LOG_DIR/publish-daily.scheduled.lock.d"
LOG="$LOG_DIR/publish-scheduled-$(date +%Y%m%d).log"

export HOME="${HOME:-/Users/$(whoami)}"
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
export NPM_CONFIG_USERCONFIG="${HOME}/.npmrc"
export npm_config_userconfig="${HOME}/.npmrc"
unset npm_config_devdir NPM_CONFIG_DEVDIR 2>/dev/null || true

exec >>"$LOG" 2>&1
echo "=== npm publish scheduled run $(date -Iseconds) ==="

if ! command -v node >/dev/null || ! command -v npm >/dev/null; then
  echo "ERROR: node/npm not found in PATH=$PATH"
  exit 1
fi

if ! mkdir "$LOCKDIR" 2>/dev/null; then
  echo "SKIP: another publish run is already in progress"
  exit 0
fi
trap 'rmdir "$LOCKDIR" 2>/dev/null || true' EXIT

cd "$ROOT"
bash .scripts/publish-daily.sh
echo "=== finished $(date -Iseconds) exit $? ==="
