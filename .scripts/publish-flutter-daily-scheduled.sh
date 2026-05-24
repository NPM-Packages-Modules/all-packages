#!/usr/bin/env bash
# Scheduled wrapper for publish-flutter-daily.sh (launchd).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/.scripts"
LOCKDIR="$LOG_DIR/publish-flutter-daily.scheduled.lock.d"
LOG="$LOG_DIR/publish-flutter-scheduled-$(date +%Y%m%d).log"

export HOME="${HOME:-/Users/$(whoami)}"
export FLUTTER_ROOT="${FLUTTER_ROOT:-$HOME/.flutter-sdk}"
export PATH="$FLUTTER_ROOT/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"

exec >>"$LOG" 2>&1
echo "=== pub.dev publish scheduled run $(date -Iseconds) ==="

if ! command -v flutter >/dev/null || ! command -v dart >/dev/null; then
  echo "Flutter/Dart not in PATH — run: bash $ROOT/.scripts/install-flutter-sdk.sh"
  exit 1
fi

if ! mkdir "$LOCKDIR" 2>/dev/null; then
  echo "SKIP: another flutter publish run is already in progress"
  exit 0
fi
trap 'rmdir "$LOCKDIR" 2>/dev/null || true' EXIT

cd "$ROOT"
bash .scripts/publish-flutter-daily.sh
echo "=== finished $(date -Iseconds) exit $? ==="
