import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_prune/flutter_prune.dart';

void main() {
  test('scan finds unused code', () async {
    final report = await FlutterPrune.scan();
    expect(report.unusedWidgets, greaterThan(0));
    expect(report.estimatedReductionPercent, greaterThan(0));
  });
}
