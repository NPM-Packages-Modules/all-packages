import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_env_forge/flutter_env_forge.dart';

void main() {
  test('flutter_env_forge scaffold', () {
    expect(FlutterEnvForge.packageName, 'flutter_env_forge');
  });
}
