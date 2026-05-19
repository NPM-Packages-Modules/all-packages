import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_perf_doctor/flutter_perf_doctor.dart';

void main() {
  test('flutter_perf_doctor scaffold', () {
    expect(FlutterPerfDoctor.packageName, 'flutter_perf_doctor');
  });
}
