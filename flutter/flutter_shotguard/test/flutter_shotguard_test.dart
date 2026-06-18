import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_shotguard/flutter_shotguard.dart';

void main() {
  test('compare screenshots', () async {
    final diff = await FlutterShotguard.compare(before: 'a.png', after: 'b.png');
    expect(diff.changedPixels, greaterThan(0));
  });
}
