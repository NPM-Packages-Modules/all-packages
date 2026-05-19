# flutter-build-shrinker

**Topics:** `dart` · `flutter` · `flutter-build-shrinker` · `mobile` · `pub`

Reduce Flutter app size automatically.

## CLI

```bash
npx flutter-build-shrinker optimize
```

## Features

- asset compression
- font tree shaking
- unused code detection

## Usage

```dart
import 'package:flutter_build_shrinker/flutter_build_shrinker.dart';

void main() {
  FlutterBuildShrinker.init();
}
```

## Why

Large APK/AAB sizes remain a pain.

## License

MIT
