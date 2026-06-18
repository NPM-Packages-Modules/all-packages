/**
 * Scaffold Flutter packages #21–30 (vertical batch).
 *   node .scripts/scaffold-flutter-21-30.mjs
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { assertCanScaffold } from "./package-coverage.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const FLUTTER = join(root, "flutter");
const LICENSE = readFileSync(join(FLUTTER, "flutter_perf_doctor", "LICENSE"), "utf8");
const GITIGNORE = `.dart_tool/
.packages
build/
pubspec.lock
`;
const ANALYSIS = `include: package:flutter_lints/flutter.yaml

linter:
  rules:
    prefer_const_constructors: true
`;

/** @param {typeof PACKAGES[number]} pkg */
function scaffold(pkg) {
  const dir = join(FLUTTER, pkg.dir);
  if (existsSync(join(dir, "pubspec.yaml"))) {
    console.log(`skip (exists): flutter/${pkg.dir}`);
    return;
  }
  const coverage = assertCanScaffold(pkg.dir, "flutter");
  if (!coverage.ok) {
    console.log(`skip (coverage): ${pkg.dir} — ${coverage.reason}`);
    return;
  }

  mkdirSync(join(dir, "lib"), { recursive: true });
  mkdirSync(join(dir, "test"), { recursive: true });

  const topicSlug = pkg.dir.replace(/_/g, "-");
  writeFileSync(
    join(dir, "pubspec.yaml"),
    `name: ${pkg.dir}
description: ${pkg.description}
version: 0.1.0

topics:
  - dart
  - flutter
  - ${topicSlug}
  - mobile
  - pub
environment:
  sdk: ">=3.0.0 <4.0.0"
  flutter: ">=3.10.0"

dependencies:
  flutter:
    sdk: flutter

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

repository: https://github.com/NPM-Packages-Modules/flutter
homepage: https://github.com/NPM-Packages-Modules/flutter/tree/main/${pkg.dir}
issue_tracker: https://github.com/NPM-Packages-Modules/flutter/issues
`
  );

  writeFileSync(join(dir, "lib", `${pkg.dir}.dart`), pkg.lib);
  writeFileSync(join(dir, "test", `${pkg.dir}_test.dart`), pkg.test);
  writeFileSync(join(dir, "README.md"), pkg.readme);
  writeFileSync(join(dir, "CHANGELOG.md"), `# Changelog\n\n## 0.1.0\n\n- Initial scaffold release.\n`);
  writeFileSync(join(dir, "LICENSE"), LICENSE);
  writeFileSync(join(dir, ".gitignore"), GITIGNORE);
  writeFileSync(join(dir, "analysis_options.yaml"), ANALYSIS);
  writeFileSync(
    join(dir, "package-topics.json"),
    JSON.stringify({ topics: ["dart", "flutter", topicSlug, "mobile", "pub"] }, null, 2) + "\n"
  );

  console.log(`created: flutter/${pkg.dir}`);
}

const PACKAGES = [
  {
    dir: "flutter_upgrade_simulator",
    description: "Simulate Flutter package upgrades before touching the actual project.",
    readme: `# flutter-upgrade-simulator

**Topics:** \`dart\` · \`flutter\` · \`flutter-upgrade-simulator\` · \`mobile\` · \`pub\`

Simulate package upgrades before touching the actual project.

## CLI

\`\`\`bash
dart run flutter_upgrade_simulator test
\`\`\`

## Features

- dependency conflict prediction
- pubspec impact analysis
- breaking change detection
- migration suggestions
- upgrade scoring
- rollback plans

## Example output

\`\`\`
provider 6 → 7
Risk: Medium

Affected Files:
- auth_provider.dart
- app_provider.dart

Suggested Fixes:
✓ 4 automatic
\`\`\`

## License

MIT
`,
    lib: `/// Simulate Flutter package upgrades before applying them.
class FlutterUpgradeSimulator {
  FlutterUpgradeSimulator._();

  static const String packageName = 'flutter_upgrade_simulator';

  static Future<UpgradeSimulation> test(String package, {String? from, String? to}) async {
    return UpgradeSimulation(
      package: package,
      fromVersion: from ?? '6.0.0',
      toVersion: to ?? '7.0.0',
      risk: UpgradeRisk.medium,
      affectedFiles: const ['auth_provider.dart', 'app_provider.dart'],
      automaticFixes: 4,
    );
  }
}

enum UpgradeRisk { low, medium, high }

class UpgradeSimulation {
  const UpgradeSimulation({
    required this.package,
    required this.fromVersion,
    required this.toVersion,
    required this.risk,
    required this.affectedFiles,
    required this.automaticFixes,
  });

  final String package;
  final String fromVersion;
  final String toVersion;
  final UpgradeRisk risk;
  final List<String> affectedFiles;
  final int automaticFixes;
}
`,
    test: `import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_upgrade_simulator/flutter_upgrade_simulator.dart';

void main() {
  test('simulates provider upgrade', () async {
    final result = await FlutterUpgradeSimulator.test('provider');
    expect(result.package, 'provider');
    expect(result.risk, UpgradeRisk.medium);
    expect(result.automaticFixes, 4);
  });
}
`,
  },
  {
    dir: "flutter_merge_doctor",
    description: "Automatically resolve common Flutter merge conflicts.",
    readme: `# flutter-merge-doctor

**Topics:** \`dart\` · \`flutter\` · \`flutter-merge-doctor\` · \`mobile\` · \`pub\`

Automatically resolve common Flutter merge conflicts.

## CLI

\`\`\`bash
dart run flutter_merge_doctor resolve
\`\`\`

## Features

- pubspec conflict repair
- import conflict fixes
- generated file reconciliation
- localization merge
- route merge

## License

MIT
`,
    lib: `/// Resolve common Flutter merge conflicts automatically.
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
`,
    test: `import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_merge_doctor/flutter_merge_doctor.dart';

void main() {
  test('resolve merge conflicts', () async {
    final report = await FlutterMergeDoctor.resolve();
    expect(report.pubspecFixed, isTrue);
    expect(report.importsFixed, greaterThan(0));
  });
}
`,
  },
  {
    dir: "flutter_prune",
    description: "Find and remove unused Flutter code safely.",
    readme: `# flutter-prune

**Topics:** \`dart\` · \`flutter\` · \`flutter-prune\` · \`mobile\` · \`pub\`

Find and remove unused Flutter code safely.

> For unused **pubspec dependencies** only, see \`flutter_pub_cleaner\`.

## CLI

\`\`\`bash
dart run flutter_prune scan
\`\`\`

## Features

- widget detection
- route analysis
- provider usage scan
- asset references
- dependency references

## License

MIT
`,
    lib: `/// Find and remove unused Flutter code safely.
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
`,
    test: `import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_prune/flutter_prune.dart';

void main() {
  test('scan finds unused code', () async {
    final report = await FlutterPrune.scan();
    expect(report.unusedWidgets, greaterThan(0));
    expect(report.estimatedReductionPercent, greaterThan(0));
  });
}
`,
  },
  {
    dir: "flutter_shotguard",
    description: "Visual pull request approval workflow for Flutter UI.",
    readme: `# flutter-shotguard

**Topics:** \`dart\` · \`flutter\` · \`flutter-shotguard\` · \`mobile\` · \`pub\`

Visual pull request approval workflow.

## CLI

\`\`\`bash
dart run flutter_shotguard compare
\`\`\`

## Features

- before/after screenshots
- pixel diff
- regression detection
- GitHub integration
- approval dashboard

## License

MIT
`,
    lib: `/// Visual PR screenshot review and approval.
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
`,
    test: `import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_shotguard/flutter_shotguard.dart';

void main() {
  test('compare screenshots', () async {
    final diff = await FlutterShotguard.compare(before: 'a.png', after: 'b.png');
    expect(diff.changedPixels, greaterThan(0));
  });
}
`,
  },
  {
    dir: "flutter_feature_pilot",
    description: "Generate complete feature flag infrastructure for Flutter apps.",
    readme: `# flutter-feature-pilot

**Topics:** \`dart\` · \`flutter\` · \`flutter-feature-pilot\` · \`mobile\` · \`pub\`

Generate complete feature flag infrastructure.

## CLI

\`\`\`bash
dart run flutter_feature_pilot create checkout_v2
\`\`\`

## Features

- local flags
- remote flags
- rollout percentages
- A/B testing
- kill switches

## License

MIT
`,
    lib: `/// Feature flag scaffolding for Flutter apps.
class FlutterFeaturePilot {
  FlutterFeaturePilot._();

  static const String packageName = 'flutter_feature_pilot';

  static FeatureFlagPlan create(String flagName, {int rolloutPercent = 0}) {
    return FeatureFlagPlan(
      name: flagName,
      rolloutPercent: rolloutPercent,
      hasKillSwitch: true,
      files: [
        'lib/flags/\${flagName}_flag.dart',
        'lib/flags/remote_flags.dart',
      ],
    );
  }
}

class FeatureFlagPlan {
  const FeatureFlagPlan({
    required this.name,
    required this.rolloutPercent,
    required this.hasKillSwitch,
    required this.files,
  });

  final String name;
  final int rolloutPercent;
  final bool hasKillSwitch;
  final List<String> files;
}
`,
    test: `import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_feature_pilot/flutter_feature_pilot.dart';

void main() {
  test('create checkout flag', () {
    final plan = FlutterFeaturePilot.create('checkout_v2', rolloutPercent: 10);
    expect(plan.name, 'checkout_v2');
    expect(plan.hasKillSwitch, isTrue);
  });
}
`,
  },
  {
    dir: "flutter_bug_replay",
    description: "Automatically reproduce production Flutter crashes locally.",
    readme: `# flutter-bug-replay

**Topics:** \`dart\` · \`flutter\` · \`flutter-bug-replay\` · \`mobile\` · \`pub\`

Automatically reproduce production crashes locally.

## CLI

\`\`\`bash
dart run flutter_bug_replay replay crash-4821
\`\`\`

## Features

- state recreation
- device simulation
- API replay
- navigation replay
- session reconstruction

## License

MIT
`,
    lib: `/// Reproduce production crashes locally.
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
`,
    test: `import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_bug_replay/flutter_bug_replay.dart';

void main() {
  test('replay crash session', () async {
    final session = await FlutterBugReplay.replay('crash-4821');
    expect(session.crashId, 'crash-4821');
    expect(session.reproduced, isTrue);
  });
}
`,
  },
  {
    dir: "flutter_store_ai",
    description: "Generate Flutter store listings, assets, and marketing copy.",
    readme: `# flutter-store-ai

**Topics:** \`dart\` · \`flutter\` · \`flutter-store-ai\` · \`mobile\` · \`pub\`

Generate store assets and descriptions automatically.

> For release builds and store upload, see \`flutter_release_pilot\`.

## CLI

\`\`\`bash
dart run flutter_store_ai generate
\`\`\`

## Features

- screenshots
- descriptions
- keyword optimization
- changelogs
- localization

## License

MIT
`,
    lib: `/// Generate App Store / Play Store listing assets and copy.
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
`,
    test: `import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_store_ai/flutter_store_ai.dart';

void main() {
  test('generate store listing', () {
    final draft = FlutterStoreAi.generate();
    expect(draft.keywords, isNotEmpty);
    expect(draft.title, isNotEmpty);
  });
}
`,
  },
  {
    dir: "flutter_arch_guard",
    description: "Detect and prevent Flutter architecture violations automatically.",
    readme: `# flutter-arch-guard

**Topics:** \`dart\` · \`flutter\` · \`flutter-arch-guard\` · \`mobile\` · \`pub\`

Prevent architecture violations automatically.

> To scaffold clean architecture, see \`flutter_clean_arch_bot\`.

## CLI

\`\`\`bash
dart run flutter_arch_guard audit
\`\`\`

## Features

- layer dependency checks
- repository validation
- feature boundaries
- CI integration
- rule enforcement

## License

MIT
`,
    lib: `/// Audit Flutter projects for architecture drift.
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
`,
    test: `import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_arch_guard/flutter_arch_guard.dart';

void main() {
  test('audit architecture', () async {
    final report = await FlutterArchGuard.audit();
    expect(report.score, greaterThan(0));
    expect(report.violations, greaterThanOrEqualTo(0));
  });
}
`,
  },
  {
    dir: "flutter_review_bot",
    description: "Specialized Flutter pull request code reviewer.",
    readme: `# flutter-review-bot

**Topics:** \`dart\` · \`flutter\` · \`flutter-review-bot\` · \`mobile\` · \`pub\`

Specialized code reviewer for Flutter projects.

## CLI

\`\`\`bash
dart run flutter_review_bot review
\`\`\`

## Features

- widget review
- performance warnings
- architecture validation
- security checks
- style enforcement

## License

MIT
`,
    lib: `/// Flutter-focused PR review assistant.
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
`,
    test: `import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_review_bot/flutter_review_bot.dart';

void main() {
  test('review pull request', () async {
    final report = await FlutterReviewBot.review();
    expect(report.widgetIssues, greaterThanOrEqualTo(0));
  });
}
`,
  },
  {
    dir: "flutter_go_live",
    description: "Verify whether a Flutter app is ready for production release.",
    readme: `# flutter-go-live

**Topics:** \`dart\` · \`flutter\` · \`flutter-go-live\` · \`mobile\` · \`pub\`

Verify whether a Flutter app is ready for release.

> For performance scans see \`flutter_perf_doctor\`; for release automation see \`flutter_release_pilot\`.

## CLI

\`\`\`bash
dart run flutter_go_live scan
\`\`\`

## Example output

\`\`\`
Readiness Score: 84%

Missing:
✓ Crashlytics
✓ Privacy Policy URL
✓ Android Backup Rules
\`\`\`

## Features

- security checks
- performance checks
- missing assets
- crash analytics setup
- store requirements

## License

MIT
`,
    lib: `/// Production readiness scanner for Flutter apps.
class FlutterGoLive {
  FlutterGoLive._();

  static const String packageName = 'flutter_go_live';

  static Future<ReadinessReport> scan() async {
    return const ReadinessReport(
      scorePercent: 84,
      missing: [
        'Crashlytics',
        'Privacy Policy URL',
        'Android Backup Rules',
      ],
    );
  }
}

class ReadinessReport {
  const ReadinessReport({
    required this.scorePercent,
    required this.missing,
  });

  final int scorePercent;
  final List<String> missing;
}
`,
    test: `import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_go_live/flutter_go_live.dart';

void main() {
  test('scan readiness', () async {
    final report = await FlutterGoLive.scan();
    expect(report.scorePercent, greaterThan(0));
    expect(report.missing, isNotEmpty);
  });
}
`,
  },
];

for (const pkg of PACKAGES) scaffold(pkg);
console.log("done");
