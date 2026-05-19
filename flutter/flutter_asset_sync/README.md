# flutter-asset-sync

Sync Figma/exported assets directly into Flutter projects.

## CLI

```bash
npx flutter-asset-sync pull
```

## Features

- Optimized images
- Generated asset constants
- Updated pubspec.yaml
- Removed unused assets

## Usage

```dart
import 'package:flutter_asset_sync/flutter_asset_sync.dart';

void main() {
  FlutterAssetSync.init();
}
```

## Why

Asset management is still manual and messy.

## License

MIT
