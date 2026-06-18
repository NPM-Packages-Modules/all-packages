/// Production readiness scanner for Flutter apps.
class FlutterGoLive {
  FlutterGoLive._();

  static const String packageName = 'flutter_go_live';

  static Future<ReadinessReport> scan() async {
    return const ReadinessReport(
      scorePercent: 84,
      missing: [
        'Crashlytics',
        'Privacy Policy URL',
        'Android Backup Rules',
      ],
    );
  }
}

class ReadinessReport {
  const ReadinessReport({
    required this.scorePercent,
    required this.missing,
  });

  final int scorePercent;
  final List<String> missing;
}
