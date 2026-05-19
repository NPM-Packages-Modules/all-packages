# Flutter packages

![Flutter](https://img.shields.io/badge/Flutter-02569B?style=flat&logo=flutter&logoColor=white)
![Dart](https://img.shields.io/badge/Dart-0175C2?style=flat&logo=dart&logoColor=white)

All **Flutter / Dart** packages live here (not npm workspaces — use `pub` per package). Same idea as [`../mern`](../mern): one folder = one repo under [`NPM-Packages-Modules`](https://github.com/NPM-Packages-Modules).

## Layout (every repo)

```
flutter/<package>/
  pubspec.yaml
  lib/
  test/
  README.md
  LICENSE
  CHANGELOG.md
```

### Widget / library packages

- **SmartFormX** (`smart_form_x`) — AI-powered form engine for Flutter.
- **AutoStateSync** (`auto_state_sync`) — Automatic API → local state → cache synchronization.
- **ResponsiveMagicUI** (`responsive_magic_ui`) — Fully automatic responsive layout engine.
- **MotionBuilder** (`motion_builder`) — No-code animation system for Flutter.
- **SecureVaultLite** (`secure_vault_lite`) — Complete secure local storage ecosystem.
- **SmartThemeEngine** (`smart_theme_engine`) — Dynamic AI-style theming system.
- **FlutterSuperTable** (`flutter_super_table`) — Enterprise-level data table package.
- **AutoLocalizationKit** (`auto_localization_kit`) — Fully automated localization system.
- **AppFlowOrchestrator** (`app_flow_orchestrator`) — Visual screen flow/state orchestration engine.
- **WidgetStudio** (`widget_studio`) — Build Flutter UIs from JSON/schema dynamically.

### CLI / tooling packages

- **flutter-zero-setup** (`flutter_zero_setup`) — Initialize a production-grade Flutter app in one command.
- **flutter-asset-sync** (`flutter_asset_sync`) — Sync Figma/exported assets directly into Flutter projects.
- **flutter-env-forge** (`flutter_env_forge`) — Generate environment systems automatically.
- **flutter-route-genius** (`flutter_route_genius`) — Auto-generate type-safe navigation.
- **flutter-api-weaver** (`flutter_api_weaver`) — Generate API layers from Swagger/Postman.
- **flutter-screen-forge** (`flutter_screen_forge`) — Generate complete screens from prompts.
- **flutter-pub-cleaner** (`flutter_pub_cleaner`) — Remove unused Flutter dependencies automatically.
- **flutter-release-pilot** (`flutter_release_pilot`) — Fully automate Flutter releases.
- **flutter-perf-doctor** (`flutter_perf_doctor`) — Detect Flutter performance issues automatically.
- **flutter-state-smith** (`flutter_state_smith`) — Generate complete state management architecture.
- **flutter-ui-cloner** (`flutter_ui_cloner`) — Convert screenshots into Flutter UI code.
- **flutter-test-factory** (`flutter_test_factory`) — Generate Flutter tests automatically.
- **flutter-build-shrinker** (`flutter_build_shrinker`) — Reduce Flutter app size automatically.
- **flutter-firelink** (`flutter_firelink`) — Firebase setup in one command.
- **flutter-icon-smith** (`flutter_icon_smith`) — Generate app icons and splash screens instantly.
- **flutter-monorepo-chief** (`flutter_monorepo_chief`) — Manage Flutter monorepos effortlessly.
- **flutter-db-scaffold** (`flutter_db_scaffold`) — Generate local database layers automatically.
- **flutter-device-lab** (`flutter_device_lab`) — Run automated testing across device matrices.
- **flutter-clean-arch-bot** (`flutter_clean_arch_bot`) — Generate full clean architecture instantly.
- **flutter-widget-map** (`flutter_widget_map`) — Visualize widget dependency trees.

## Development

```bash
cd flutter/<package>
flutter pub get
flutter test
```
