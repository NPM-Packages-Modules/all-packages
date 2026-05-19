# flutter-pub-cleaner

Remove unused Flutter dependencies automatically.

## CLI

```bash
npx flutter-pub-cleaner audit
```

## Features

- Unused dependency detection
- CI integration

## Usage

```dart
import 'package:flutter_pub_cleaner/flutter_pub_cleaner.dart';

void main() {
  FlutterPubCleaner.init();
}
```

## Why

Flutter projects accumulate dead packages.

## License

MIT
