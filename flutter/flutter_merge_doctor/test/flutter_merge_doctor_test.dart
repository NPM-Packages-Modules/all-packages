import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_merge_doctor/flutter_merge_doctor.dart';

void main() {
  test('resolve merge conflicts', () async {
    final report = await FlutterMergeDoctor.resolve();
    expect(report.pubspecFixed, isTrue);
    expect(report.importsFixed, greaterThan(0));
  });
}
