import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_review_bot/flutter_review_bot.dart';

void main() {
  test('review pull request', () async {
    final report = await FlutterReviewBot.review();
    expect(report.widgetIssues, greaterThanOrEqualTo(0));
  });
}
