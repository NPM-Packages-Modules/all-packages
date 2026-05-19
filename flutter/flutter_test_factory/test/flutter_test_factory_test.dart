import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_test_factory/flutter_test_factory.dart';

void main() {
  test('flutter_test_factory scaffold', () {
    expect(FlutterTestFactory.packageName, 'flutter_test_factory');
  });
}
