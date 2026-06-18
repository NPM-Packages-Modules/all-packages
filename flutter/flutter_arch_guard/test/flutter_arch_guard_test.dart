import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_arch_guard/flutter_arch_guard.dart';

void main() {
  test('audit architecture', () async {
    final report = await FlutterArchGuard.audit();
    expect(report.score, greaterThan(0));
    expect(report.violations, greaterThanOrEqualTo(0));
  });
}
