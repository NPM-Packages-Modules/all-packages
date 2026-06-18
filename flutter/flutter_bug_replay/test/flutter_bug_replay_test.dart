import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_bug_replay/flutter_bug_replay.dart';

void main() {
  test('replay crash session', () async {
    final session = await FlutterBugReplay.replay('crash-4821');
    expect(session.crashId, 'crash-4821');
    expect(session.reproduced, isTrue);
  });
}
