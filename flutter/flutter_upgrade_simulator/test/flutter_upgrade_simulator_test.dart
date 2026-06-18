import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_upgrade_simulator/flutter_upgrade_simulator.dart';

void main() {
  test('simulates provider upgrade', () async {
    final result = await FlutterUpgradeSimulator.test('provider');
    expect(result.package, 'provider');
    expect(result.risk, UpgradeRisk.medium);
    expect(result.automaticFixes, 4);
  });
}
