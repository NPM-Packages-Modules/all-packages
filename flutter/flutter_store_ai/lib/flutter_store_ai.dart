/// Generate App Store / Play Store listing assets and copy.
class FlutterStoreAi {
  FlutterStoreAi._();

  static const String packageName = 'flutter_store_ai';

  static StoreListingDraft generate({String locale = 'en'}) {
    return StoreListingDraft(
      locale: locale,
      title: 'My Flutter App',
      shortDescription: 'Fast, beautiful, reliable.',
      keywords: const ['flutter', 'mobile', 'productivity'],
      changelog: 'Bug fixes and performance improvements.',
    );
  }
}

class StoreListingDraft {
  const StoreListingDraft({
    required this.locale,
    required this.title,
    required this.shortDescription,
    required this.keywords,
    required this.changelog,
  });

  final String locale;
  final String title;
  final String shortDescription;
  final List<String> keywords;
  final String changelog;
}
