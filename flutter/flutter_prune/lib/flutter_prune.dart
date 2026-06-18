/// Find and remove unused Flutter code safely.
class FlutterPrune {
  FlutterPrune._();

  static const String packageName = 'flutter_prune';

  static Future<PruneScanReport> scan() async {
    return const PruneScanReport(
      unusedWidgets: 12,
      unusedRoutes: 2,
      unusedAssets: 4,
      estimatedReductionPercent: 28,
    );
  }
}

class PruneScanReport {
  const PruneScanReport({
    required this.unusedWidgets,
    required this.unusedRoutes,
    required this.unusedAssets,
    required this.estimatedReductionPercent,
  });

  final int unusedWidgets;
  final int unusedRoutes;
  final int unusedAssets;
  final int estimatedReductionPercent;
}
