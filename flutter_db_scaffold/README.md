# flutter-db-scaffold

Generate local database layers automatically.

## CLI

```bash
npx flutter-db-scaffold create users
```

## Features

- models
- migrations
- repositories
- DAOs

## Usage

```dart
import 'package:flutter_db_scaffold/flutter_db_scaffold.dart';

void main() {
  FlutterDbScaffold.init();
}
```

## Why

SQLite/Drift setup is repetitive.

## License

MIT
