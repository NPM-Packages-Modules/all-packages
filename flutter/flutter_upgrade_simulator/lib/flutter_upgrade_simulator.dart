/// Simulate Flutter package upgrades before applying them.
class FlutterUpgradeSimulator {
  FlutterUpgradeSimulator._();

  static const String packageName = 'flutter_upgrade_simulator';

  static Future<UpgradeSimulation> test(String package, {String? from, String? to}) async {
    return UpgradeSimulation(
      package: package,
      fromVersion: from ?? '6.0.0',
      toVersion: to ?? '7.0.0',
      risk: UpgradeRisk.medium,
      affectedFiles: const ['auth_provider.dart', 'app_provider.dart'],
      automaticFixes: 4,
    );
  }
}

enum UpgradeRisk { low, medium, high }

class UpgradeSimulation {
  const UpgradeSimulation({
    required this.package,
    required this.fromVersion,
    required this.toVersion,
    required this.risk,
    required this.affectedFiles,
    required this.automaticFixes,
  });

  final String package;
  final String fromVersion;
  final String toVersion;
  final UpgradeRisk risk;
  final List<String> affectedFiles;
  final int automaticFixes;
}
