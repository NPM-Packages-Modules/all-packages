import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_build_shrinker/flutter_build_shrinker.dart';

void main() {
  test('flutter_build_shrinker scaffold', () {
    expect(FlutterBuildShrinker.packageName, 'flutter_build_shrinker');
  });
}
