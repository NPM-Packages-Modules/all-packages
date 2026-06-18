import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_feature_pilot/flutter_feature_pilot.dart';

void main() {
  test('create checkout flag', () {
    final plan = FlutterFeaturePilot.create('checkout_v2', rolloutPercent: 10);
    expect(plan.name, 'checkout_v2');
    expect(plan.hasKillSwitch, isTrue);
  });
}
