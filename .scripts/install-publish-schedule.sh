#!/usr/bin/env bash
# Install daily launchd jobs: npm 10:00 PM, Flutter/pub.dev 11:00 PM.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
USER_ID="$(id -u)"
mkdir -p "$HOME/Library/LaunchAgents"

install_job() {
  local label="$1"
  local plist_src="$2"
  local plist_dst="$HOME/Library/LaunchAgents/${label}.plist"
  local hour="$3"
  local minute="$4"

  sed "s|/Users/aftabahmadkhan/Github/Personal/NPM|$ROOT|g" "$plist_src" > "$plist_dst"
  launchctl bootout "gui/${USER_ID}/${label}" 2>/dev/null || true
  launchctl bootstrap "gui/${USER_ID}" "$plist_dst"
  launchctl enable "gui/${USER_ID}/${label}" 2>/dev/null || true
  echo "  ✓ ${label} → daily ${hour}:$(printf '%02d' "$minute")"
}

chmod +x "$ROOT/.scripts/publish-daily-scheduled.sh"
chmod +x "$ROOT/.scripts/publish-flutter-daily-scheduled.sh"
chmod +x "$ROOT/.scripts/publish-flutter-daily.sh"
chmod +x "$ROOT/.scripts/install-flutter-sdk.sh"

echo "Installing publish schedules…"
install_job "com.npm-packages.publish-daily" "$ROOT/.scripts/com.npm-packages.publish-daily.plist" 22 0
install_job "com.pub-packages.publish-daily" "$ROOT/.scripts/com.pub-packages.publish-daily.plist" 23 0

cat <<EOF

Installed launchd jobs (Mac must be awake + logged in):

  npm     — 10:00 PM  → .scripts/publish-scheduled-YYYYMMDD.log
  pub.dev — 11:00 PM  → .scripts/publish-flutter-scheduled-YYYYMMDD.log

Flutter setup (one-time, no Xcode):

  bash .scripts/install-flutter-sdk.sh
  dart pub token add https://pub.dev

Check:
  launchctl print gui/${USER_ID}/com.npm-packages.publish-daily
  launchctl print gui/${USER_ID}/com.pub-packages.publish-daily

EOF
