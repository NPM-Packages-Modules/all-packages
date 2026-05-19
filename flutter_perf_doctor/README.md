# flutter-perf-doctor

Detect Flutter performance issues automatically.

## CLI

```bash
npx flutter-perf-doctor scan
```

## Features

- rebuild issues
- memory leaks
- oversized widgets
- nested scroll issues

## Usage

```dart
import 'package:flutter_perf_doctor/flutter_perf_doctor.dart';

void main() {
  FlutterPerfDoctor.init();
}
```

## Why

Performance debugging is difficult.

## License

MIT
