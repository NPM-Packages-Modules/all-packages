import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_store_ai/flutter_store_ai.dart';

void main() {
  test('generate store listing', () {
    final draft = FlutterStoreAi.generate();
    expect(draft.keywords, isNotEmpty);
    expect(draft.title, isNotEmpty);
  });
}
