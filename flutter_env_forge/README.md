# flutter-env-forge

Generate environment systems automatically.

## CLI

```bash
npx flutter-env-forge create
```

## Features

- .env.dev
- .env.prod
- flavor configs
- Dart env accessors

## Usage

```dart
import 'package:flutter_env_forge/flutter_env_forge.dart';

void main() {
  FlutterEnvForge.init();
}
```

## Why

Env setup across Android/iOS/Web is repetitive.

## License

MIT
