/**
 * Single source of truth: proposed package folder/name → existing package(s).
 * Used by scaffold scripts and documented in .cursor/rules/no-duplicate-packages.mdc
 *
 * Before scaffolding, check:
 *   1. Folder does not exist in mern/, react-native/, or flutter/
 *   2. Key is not listed here (semantic duplicate)
 *   3. Do NOT re-add @mr-aftab-ahmad-khan/ scope unless user asks
 */

/** @type {Record<string, string>} */
export const EXISTING_COVERAGE = {
  // mern #21–30 (removed as duplicates)
  "schema-ops": "mern/modelsync, mern/schemagen, mern/schemaui",
  "react-hook-factory": "mern/reactstatex",
  "crud-storm": "mern/relatik, mern/backendforge, react-native/routeforge",
  "api-mocksmith": "mern/mockpress",
  "mongo-seeder-pro": "mern/seedforge",
  "route-audit": "mern/shieldpress, mern/guardpress, mern/routecheck",
  "component-admin": "mern/adminforge",

  // react-native #31–40 (skipped)
  featureforge: "react-native/routeforge, mern/backendforge",
  relationforge: "mern/relatik",
  mockforge: "mern/mockpress",
  jobforge: "mern/jobforge (jobforgekit)",
  contractforge: "mern/duoapi, mern/typepress, mern/sdkforge, react-native/apidocsmith, mern/stack-sync",
  seedforge: "mern/seedforge (seedforgex) — do not duplicate in react-native",
  sdkforge: "mern/sdkforge (sdkforgex)",
  recoverflow: "mern/recoverpress, react-native/retryflow",
  tenantforge: "mern/tenantforge",

  // common alternate names / synonyms
  "model-central": "mern/modelsync, mern/schemagen",
  "schema-engine": "mern/modelsync, mern/schemagen",
  hooksmith: "mern/reactstatex, react-native/retryflow",
  hookforge: "mern/reactstatex",
  crudforge: "mern/relatik, react-native/routeforge",
  mockpress: "mern/mockpress (exists)",
  smartseed: "mern/seedforge",
  deployforge: "mern/deployguard, mern/deploy-template",
  adminforge: "mern/adminforge (adminforgex)",
  "auth-launcher": "react-native/authmesh, mern/guardpress",

  // mern vertical-slice batch #31–40 (skipped duplicates)
  "query-recorder": "mern/monguard (monguardx) — query recording & optimization",
  "mongo-recorder": "mern/monguard",
  querylens: "mern/monguard",
  "api-replay": "mern/replaystack",
  "request-replay": "mern/replaystack",
  "traffic-clone": "mern/replaystack",
  "feature-machine": "mern/feature-slice-forge",
  slicebuilder: "mern/feature-slice-forge",
  "stack-errors": "mern/error-translator",
  errorbridge: "mern/error-translator",
  routegraph: "mern/endpoint-flow",
  "react-cleaner": "mern/component-usage-scanner",
  configdiff: "mern/env-diff",
  "schema-preview": "mern/migration-preview, react-native/schemashift",
  "npm-inspector": "mern/package-impact, mern/chainsentry",

  // flutter #21–30 (alternate names → created packages)
  "flutter-safe-upgrade": "flutter/flutter_upgrade_simulator",
  "flutter-version-lab": "flutter/flutter_upgrade_simulator",
  "flutter-dep-sandbox": "flutter/flutter_upgrade_simulator",
  "flutter-upgrade-pilot": "flutter/flutter_upgrade_simulator",
  "flutter-conflict-fixer": "flutter/flutter_merge_doctor",
  "flutter-merge-genius": "flutter/flutter_merge_doctor",
  "flutter-git-healer": "flutter/flutter_merge_doctor",
  "flutter-merge-ai": "flutter/flutter_merge_doctor",
  "flutter-code-hunter": "flutter/flutter_prune",
  "flutter-deadcode-ai": "flutter/flutter_prune",
  "flutter-cleancode-bot": "flutter/flutter_prune",
  "flutter-unused-finder": "flutter/flutter_prune",
  "flutter-visual-review": "flutter/flutter_shotguard",
  "flutter-ui-approval": "flutter/flutter_shotguard",
  "flutter-screenshot-review": "flutter/flutter_shotguard",
  "flutter-pixel-review": "flutter/flutter_shotguard",
  "flutter-flagsmith": "flutter/flutter_feature_pilot",
  "flutter-feature-toggle": "flutter/flutter_feature_pilot",
  "flutter-rollout-engine": "flutter/flutter_feature_pilot",
  "flutter-launch-control": "flutter/flutter_feature_pilot",
  "flutter-error-lab": "flutter/flutter_bug_replay",
  "flutter-repro-engine": "flutter/flutter_bug_replay",
  "flutter-debug-replay": "flutter/flutter_bug_replay",
  "flutter-crash-replay": "flutter/flutter_bug_replay",
  "flutter-market-builder": "flutter/flutter_store_ai",
  "flutter-appstore-gen": "flutter/flutter_store_ai",
  "flutter-release-copy": "flutter/flutter_store_ai",
  "flutter-storepilot": "flutter/flutter_store_ai, flutter/flutter_release_pilot",
  "flutter-boundary-check": "flutter/flutter_arch_guard",
  "flutter-clean-enforcer": "flutter/flutter_arch_guard",
  "flutter-layer-watch": "flutter/flutter_arch_guard",
  "flutter-architecture-police": "flutter/flutter_arch_guard",
  "flutter-pr-audit": "flutter/flutter_review_bot",
  "flutter-code-reviewer": "flutter/flutter_review_bot",
  "flutter-review-genius": "flutter/flutter_review_bot",
  "flutter-pr-guardian": "flutter/flutter_review_bot",
  "flutter-production-check": "flutter/flutter_go_live",
  "flutter-release-inspector": "flutter/flutter_go_live",
  "flutter-ready-check": "flutter/flutter_go_live",
  "flutter-launch-audit": "flutter/flutter_go_live",
};

/**
 * @param {string} dir package folder name (e.g. schema-ops, featureforge)
 * @param {"mern"|"react-native"|"flutter"} ecosystem
 * @returns {{ ok: true } | { ok: false; reason: string }}
 */
export function assertCanScaffold(dir, ecosystem) {
  if (EXISTING_COVERAGE[dir]) {
    return {
      ok: false,
      reason: `"${dir}" already covered by: ${EXISTING_COVERAGE[dir]}`,
    };
  }
  return { ok: true };
}
