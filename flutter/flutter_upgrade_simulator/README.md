# flutter-upgrade-simulator

**Topics:** `dart` · `flutter` · `flutter-upgrade-simulator` · `mobile` · `pub`

Simulate package upgrades before touching the actual project.

## CLI

```bash
dart run flutter_upgrade_simulator test
```

## Features

- dependency conflict prediction
- pubspec impact analysis
- breaking change detection
- migration suggestions
- upgrade scoring
- rollback plans

## Example output

```
provider 6 → 7
Risk: Medium

Affected Files:
- auth_provider.dart
- app_provider.dart

Suggested Fixes:
✓ 4 automatic
```

## License

MIT
