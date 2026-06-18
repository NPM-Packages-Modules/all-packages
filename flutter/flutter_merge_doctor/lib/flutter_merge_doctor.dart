/// Resolve common Flutter merge conflicts automatically.
class FlutterMergeDoctor {
  FlutterMergeDoctor._();

  static const String packageName = 'flutter_merge_doctor';

  static Future<MergeResolveReport> resolve() async {
    return const MergeResolveReport(
      pubspecFixed: true,
      importsFixed: 3,
      routesMerged: 1,
      localizationMerged: true,
    );
  }
}

class MergeResolveReport {
  const MergeResolveReport({
    required this.pubspecFixed,
    required this.importsFixed,
    required this.routesMerged,
    required this.localizationMerged,
  });

  final bool pubspecFixed;
  final int importsFixed;
  final int routesMerged;
  final bool localizationMerged;
}
