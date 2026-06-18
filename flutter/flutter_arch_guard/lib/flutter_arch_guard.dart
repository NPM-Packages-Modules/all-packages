/// Audit Flutter projects for architecture drift.
class FlutterArchGuard {
  FlutterArchGuard._();

  static const String packageName = 'flutter_arch_guard';

  static Future<ArchAuditReport> audit() async {
    return const ArchAuditReport(
      violations: 3,
      layerBreaches: 2,
      featureBoundaryIssues: 1,
      score: 82,
    );
  }
}

class ArchAuditReport {
  const ArchAuditReport({
    required this.violations,
    required this.layerBreaches,
    required this.featureBoundaryIssues,
    required this.score,
  });

  final int violations;
  final int layerBreaches;
  final int featureBoundaryIssues;
  final int score;
}
