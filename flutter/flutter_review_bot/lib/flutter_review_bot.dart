/// Flutter-focused PR review assistant.
class FlutterReviewBot {
  FlutterReviewBot._();

  static const String packageName = 'flutter_review_bot';

  static Future<PrReviewReport> review() async {
    return const PrReviewReport(
      widgetIssues: 2,
      performanceWarnings: 1,
      securityFindings: 0,
      styleViolations: 4,
      approved: false,
    );
  }
}

class PrReviewReport {
  const PrReviewReport({
    required this.widgetIssues,
    required this.performanceWarnings,
    required this.securityFindings,
    required this.styleViolations,
    required this.approved,
  });

  final int widgetIssues;
  final int performanceWarnings;
  final int securityFindings;
  final int styleViolations;
  final bool approved;
}
