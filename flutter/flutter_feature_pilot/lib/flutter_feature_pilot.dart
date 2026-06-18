/// Feature flag scaffolding for Flutter apps.
class FlutterFeaturePilot {
  FlutterFeaturePilot._();

  static const String packageName = 'flutter_feature_pilot';

  static FeatureFlagPlan create(String flagName, {int rolloutPercent = 0}) {
    return FeatureFlagPlan(
      name: flagName,
      rolloutPercent: rolloutPercent,
      hasKillSwitch: true,
      files: [
        'lib/flags/${flagName}_flag.dart',
        'lib/flags/remote_flags.dart',
      ],
    );
  }
}

class FeatureFlagPlan {
  const FeatureFlagPlan({
    required this.name,
    required this.rolloutPercent,
    required this.hasKillSwitch,
    required this.files,
  });

  final String name;
  final int rolloutPercent;
  final bool hasKillSwitch;
  final List<String> files;
}
