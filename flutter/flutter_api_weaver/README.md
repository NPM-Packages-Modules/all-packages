# flutter-api-weaver

Generate API layers from Swagger/Postman.

## CLI

```bash
npx flutter-api-weaver generate ./swagger.json
```

## Features

- Models
- Repository layer
- Dio services
- Error handlers
- Retry interceptors

## Usage

```dart
import 'package:flutter_api_weaver/flutter_api_weaver.dart';

void main() {
  FlutterApiWeaver.init();
}
```

## Why

API integration consumes massive time.

## License

MIT
