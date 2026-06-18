import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_go_live/flutter_go_live.dart';

void main() {
  test('scan readiness', () async {
    final report = await FlutterGoLive.scan();
    expect(report.scorePercent, greaterThan(0));
    expect(report.missing, isNotEmpty);
  });
}
