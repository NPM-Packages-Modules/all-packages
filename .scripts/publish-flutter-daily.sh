#!/usr/bin/env bash
# Publish up to 15 Flutter packages to pub.dev — no Xcode required.
set -euo pipefail
cd "$(dirname "$0")/.."

export FLUTTER_ROOT="${FLUTTER_ROOT:-$HOME/.flutter-sdk}"
export PATH="$FLUTTER_ROOT/bin:${PATH:-/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin}"

if ! command -v flutter >/dev/null || ! command -v dart >/dev/null; then
  echo "Flutter/Dart not found. Run: bash .scripts/install-flutter-sdk.sh"
  exit 1
fi

echo "Using Flutter: $(command -v flutter)"
flutter --version | head -1

# Enable pub.dev publishing (removes publish_to: none).
node .scripts/patch-flutter-pubspecs.mjs

export PUB_PUBLISH_DAILY_LIMIT="${PUB_PUBLISH_DAILY_LIMIT:-15}"
export PUB_PUBLISH_GAP_SEC="${PUB_PUBLISH_GAP_SEC:-120}"

node .scripts/publish-flutter-daily-batch.mjs
