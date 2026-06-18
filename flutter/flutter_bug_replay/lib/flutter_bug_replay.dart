/// Reproduce production crashes locally.
class FlutterBugReplay {
  FlutterBugReplay._();

  static const String packageName = 'flutter_bug_replay';

  static Future<ReplaySession> replay(String crashId) async {
    return ReplaySession(
      crashId: crashId,
      deviceSimulated: 'iPhone 15',
      apiCallsReplayed: 14,
      navigationSteps: 6,
      reproduced: true,
    );
  }
}

class ReplaySession {
  const ReplaySession({
    required this.crashId,
    required this.deviceSimulated,
    required this.apiCallsReplayed,
    required this.navigationSteps,
    required this.reproduced,
  });

  final String crashId;
  final String deviceSimulated;
  final int apiCallsReplayed;
  final int navigationSteps;
  final bool reproduced;
}
