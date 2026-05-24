# Publishing Flutter packages to pub.dev (no Xcode)

These packages live under `flutter/`. Publishing uses **Flutter/Dart SDK only** — no Xcode, no iOS/Android builds.

## One-time setup

### 1. Install Flutter SDK (no Xcode)

```bash
bash .scripts/install-flutter-sdk.sh
```

Add to `~/.zshrc`:

```bash
export FLUTTER_ROOT="$HOME/.flutter-sdk"
export PATH="$FLUTTER_ROOT/bin:$PATH"
```

### 2. pub.dev upload token

1. Sign in at [pub.dev](https://pub.dev)
2. Account → **Uploaders** → create token
3. Run once:

```bash
dart pub token add https://pub.dev
# paste token when prompted
```

Or non-interactive:

```bash
printf '%s' "$PUB_DEV_PUBLISH_TOKEN" | dart pub token add https://pub.dev
```

### 3. Enable publishing in pubspecs

Removes `publish_to: none` and sets monorepo URLs:

```bash
npm run publish:flutter:patch
```

## Commands

| Command | Purpose |
|---------|---------|
| `npm run publish:flutter:status` | Audit pub.dev vs local versions |
| `npm run publish:flutter:daily:local` | Publish up to 15 packages (manual) |
| `npm run publish:flutter:check-auth` | Verify SDK + pub.dev token |
| `npm run publish:schedule:install` | Daily 10 PM npm + 11 PM pub.dev (launchd) |

## Daily automation

```bash
npm run publish:schedule:install
```

- **npm** — 10:00 PM (up to 20 packages)
- **pub.dev** — 11:00 PM (up to 15 packages)

Logs: `.scripts/publish-flutter-scheduled-YYYYMMDD.log`

## Notes

- `flutter doctor` may warn about missing Xcode — **ignore** for pub publish.
- Mac must be **awake and logged in** at scheduled times.
- All 30 packages start at `@0.1.0` with `publish_to: none` until patched.
