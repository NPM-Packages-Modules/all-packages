import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_pub_cleaner/flutter_pub_cleaner.dart';

void main() {
  test('flutter_pub_cleaner scaffold', () {
    expect(FlutterPubCleaner.packageName, 'flutter_pub_cleaner');
  });
}
