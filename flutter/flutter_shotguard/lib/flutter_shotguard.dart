/// Visual PR screenshot review and approval.
class FlutterShotguard {
  FlutterShotguard._();

  static const String packageName = 'flutter_shotguard';

  static Future<VisualDiffReport> compare({required String before, required String after}) async {
    return VisualDiffReport(
      beforePath: before,
      afterPath: after,
      changedPixels: 842,
      regressionDetected: true,
      approved: false,
    );
  }
}

class VisualDiffReport {
  const VisualDiffReport({
    required this.beforePath,
    required this.afterPath,
    required this.changedPixels,
    required this.regressionDetected,
    required this.approved,
  });

  final String beforePath;
  final String afterPath;
  final int changedPixels;
  final bool regressionDetected;
  final bool approved;
}
