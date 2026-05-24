#!/usr/bin/env bash
# Install Flutter SDK for pub.dev publishing only — no Xcode, no iOS/Android tooling.
set -euo pipefail

FLUTTER_ROOT="${FLUTTER_ROOT:-$HOME/.flutter-sdk}"

if [ -x "$FLUTTER_ROOT/bin/flutter" ]; then
  echo "Flutter already installed at $FLUTTER_ROOT"
else
  echo "Cloning Flutter stable to $FLUTTER_ROOT (no Xcode required)..."
  rm -rf "$FLUTTER_ROOT"
  git clone https://github.com/flutter/flutter.git -b stable --depth 1 "$FLUTTER_ROOT"
fi

export PATH="$FLUTTER_ROOT/bin:$PATH"
export FLUTTER_ROOT

# Pub publish only — skip platform SDK downloads (no Xcode/CocoaPods/Android).
flutter config --no-analytics --no-cli-animations 2>/dev/null || flutter config --no-analytics
flutter --version

cat <<EOF

Installed: $FLUTTER_ROOT
Add to ~/.zshrc:

  export FLUTTER_ROOT="$FLUTTER_ROOT"
  export PATH="\$FLUTTER_ROOT/bin:\$PATH"

pub.dev token (one-time):

  dart pub token add https://pub.dev

Then:

  npm run publish:flutter:status
  npm run publish:flutter:daily:local

EOF
