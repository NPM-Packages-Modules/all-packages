/**
 * Scaffold mern/ (MERN Node packages) and flutter/ (Dart pub packages).
 * Run: node .scripts/scaffold-ecosystem-repos.mjs
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MERN_DIR = join(ROOT, "mern");
const FLUTTER_DIR = join(ROOT, "flutter");
const GITHUB_ORG = "NPM-Packages-Modules";
const NPM_SCOPE = "@mr-aftab-ahmad-khan";
const AUTHOR =
  "Aftab Ahmad Khan (https://github.com/aftab-ahmad-khan-dev)";
const MIT = `MIT License

Copyright (c) ${new Date().getFullYear()} Aftab Ahmad Khan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

const mernPackages = [
  {
    name: "routeforge",
    description:
      "Automatically generate Express routes, controllers, validators, and services from schema definitions.",
    example: 'routeforge.generate("users")',
    benefit:
      "MERN developers repeatedly create the same REST boilerplate for every module.",
    features: [
      "CRUD scaffolding",
      "request validation",
      "controller generation",
      "auto Swagger docs",
      "service injection",
    ],
  },
  {
    name: "modelsync",
    description:
      "Keep Mongoose models, TypeScript types, and validation schemas synchronized automatically.",
    example: "modelsync.sync(UserSchema)",
    benefit:
      "Model duplication creates constant inconsistencies in MERN projects.",
    features: [
      "TS type generation",
      "Zod/Yup sync",
      "schema diffing",
      "migration alerts",
      "auto validation updates",
    ],
  },
  {
    name: "stacktracex",
    description: "Visual distributed error tracing for MERN microservices.",
    example: "stacktracex.track(app)",
    benefit: "Debugging across services is operational chaos.",
    features: [
      "request tracing",
      "service timelines",
      "error replay",
      "correlation IDs",
      "latency visualization",
    ],
  },
  {
    name: "cachepilot",
    description: "Automatically cache API/database responses intelligently.",
    example: "cachepilot.wrap(getProducts)",
    benefit: "Developers repeatedly rebuild caching layers manually.",
    features: [
      "Redis memory sync",
      "stale refresh",
      "route-level caching",
      "auto invalidation",
      "query fingerprinting",
    ],
  },
  {
    name: "authmesh",
    description: "Centralized authentication layer across MERN services.",
    example: "authmesh.connect(app)",
    benefit:
      "Auth duplication becomes unmaintainable in multi-service systems.",
    features: [
      "shared JWT validation",
      "role propagation",
      "session sync",
      "token rotation",
      "auth middleware generation",
    ],
  },
  {
    name: "querygenie",
    description: "Generate advanced MongoDB queries from simple configs.",
    example: "querygenie(Product).search(req.query)",
    benefit: "Developers repeatedly write nearly identical query logic.",
    features: [
      "filtering",
      "pagination",
      "search",
      "sorting",
      "aggregation pipelines",
    ],
  },
  {
    name: "socketmesh",
    description: "Simplify scalable real-time event communication.",
    example: 'socketmesh.channel("orders")',
    benefit: "WebSocket scaling becomes extremely complex quickly.",
    features: [
      "room orchestration",
      "event namespaces",
      "reconnect handling",
      "clustered sockets",
      "event replay",
    ],
  },
  {
    name: "apidocsmith",
    description: "Generate beautiful API docs directly from Express routes.",
    example: "apidocsmith.scan(app)",
    benefit: "API documentation is usually outdated or missing.",
    features: [
      "Swagger generation",
      "request examples",
      "response examples",
      "auth docs",
      "version tracking",
    ],
  },
  {
    name: "retryflow",
    description: "Smart retry orchestration for failed operations.",
    example: "retryflow.wrap(sendEmail)",
    benefit: "Retry logic is duplicated everywhere and often broken.",
    features: [
      "exponential retries",
      "dead letter queues",
      "timeout handling",
      "retry analytics",
      "circuit breaking",
    ],
  },
  {
    name: "envsyncer",
    description:
      "Synchronize and validate environment variables across services.",
    example: "envsyncer.validate()",
    benefit: "Environment mismatches cause massive deployment failures.",
    features: [
      "schema validation",
      "missing key detection",
      "environment diffing",
      "secret masking",
      "config versioning",
    ],
  },
  {
    name: "mongoforge",
    description: "Automatically generate MongoDB indexes intelligently.",
    example: "mongoforge.optimize()",
    benefit: "Most MERN apps suffer poor DB performance from bad indexing.",
    features: [
      "query analysis",
      "slow query detection",
      "index suggestions",
      "duplicate index cleanup",
      "performance scoring",
    ],
  },
  {
    name: "servqueue",
    description: "Lightweight queue orchestration for MERN microservices.",
    example: 'servqueue.add("email", payload)',
    benefit: "Queue systems are usually over-engineered or fragmented.",
    features: [
      "delayed jobs",
      "retries",
      "queue priorities",
      "workers",
      "distributed processing",
    ],
  },
  {
    name: "reactstatex",
    description: "Auto-generate React state management from APIs.",
    example: 'reactstatex.create("/products")',
    benefit: "Frontend state management remains repetitive.",
    features: [
      "hooks generation",
      "caching",
      "optimistic updates",
      "loading states",
      "mutation helpers",
    ],
  },
  {
    name: "secureflow",
    description: "Automated security middleware orchestration.",
    example: "secureflow.protect(app)",
    benefit: "Security setups are inconsistent across projects.",
    features: [
      "rate limiting",
      "XSS protection",
      "SQL/NoSQL injection guards",
      "header hardening",
      "suspicious activity detection",
    ],
  },
  {
    name: "deploysense",
    description: "Detect risky deployments before production.",
    example: "deploysense.verify()",
    benefit: "Many outages happen due to unnoticed deployment issues.",
    features: [
      "env verification",
      "dependency mismatch checks",
      "migration validation",
      "memory forecasts",
      "rollback alerts",
    ],
  },
  {
    name: "eventbridgex",
    description: "Unified event communication layer for MERN services.",
    example: 'eventbridgex.emit("order.created")',
    benefit: "Event-driven systems become chaotic without structure.",
    features: [
      "pub/sub",
      "event retries",
      "event schemas",
      "consumer groups",
      "dead event handling",
    ],
  },
  {
    name: "cronpilot",
    description: "Manage distributed cron jobs safely.",
    example: 'cronpilot.schedule("0 * * * *", task)',
    benefit: "Cron jobs become unreliable in scaled systems.",
    features: [
      "duplicate prevention",
      "retry scheduling",
      "cron dashboards",
      "worker balancing",
      "execution history",
    ],
  },
  {
    name: "schemashift",
    description: "Automatic schema migration generation for MongoDB.",
    example: "schemashift.generate()",
    benefit: "Mongo migrations are often unmanaged chaos.",
    features: [
      "migration diffing",
      "rollback support",
      "schema history",
      "version tracking",
      "validation repair",
    ],
  },
  {
    name: "apiflowx",
    description: "Visual API orchestration for MERN systems.",
    example: "apiflowx.inspect(app)",
    benefit: "Teams lose visibility in growing backend architectures.",
    features: [
      "route mapping",
      "dependency graphs",
      "latency monitoring",
      "API replay",
      "request simulation",
    ],
  },
  {
    name: "logmesh",
    description: "Centralized structured logging for MERN apps.",
    example: "logmesh.connect(app)",
    benefit: "Logs become unusable in distributed environments.",
    features: [
      "request logs",
      "service tagging",
      "error grouping",
      "trace correlation",
      "log streaming",
    ],
  },
];

const flutterPackages = [
  {
    name: "smart_form_x",
    title: "SmartFormX",
    description: "AI-powered form engine for Flutter.",
    features: [
      "Auto validation",
      "Dynamic forms from JSON",
      "Multi-step wizard",
      "Auto-save drafts",
      "Conditional fields",
      "Built-in OTP inputs",
      "File upload widgets",
      "Async validators",
    ],
    why: "Developers waste huge time building forms repeatedly.",
    highPotential: true,
  },
  {
    name: "auto_state_sync",
    title: "AutoStateSync",
    description: "Automatic API → local state → cache synchronization.",
    features: [
      "Auto cache invalidation",
      "Offline persistence",
      "Realtime sync",
      "Pagination handling",
      "Optimistic updates",
      "Retry queue",
    ],
    why: "Removes tons of boilerplate from Riverpod/BLoC/GetX.",
    highPotential: true,
  },
  {
    name: "responsive_magic_ui",
    title: "ResponsiveMagicUI",
    description: "Fully automatic responsive layout engine.",
    features: [
      "Adaptive spacing",
      "Auto scaling typography",
      "Device-aware widgets",
      "Responsive grids",
      "Smart breakpoints",
      "Foldable support",
    ],
    why: "Flutter responsiveness is still painful manually.",
    highPotential: true,
  },
  {
    name: "motion_builder",
    title: "MotionBuilder",
    description: "No-code animation system for Flutter.",
    features: [
      "Timeline animations",
      "Drag-drop animation configs",
      "Gesture-based transitions",
      "Preset effects",
      "Shared element transitions",
    ],
    why: "Animations in Flutter are powerful but verbose.",
  },
  {
    name: "secure_vault_lite",
    title: "SecureVaultLite",
    description: "Complete secure local storage ecosystem.",
    features: [
      "Encrypted storage",
      "Secure file vault",
      "PIN/biometric lock",
      "Auto session expiration",
      "Secret sharing between isolates",
    ],
    why: "Most apps implement security poorly.",
  },
  {
    name: "smart_theme_engine",
    title: "SmartThemeEngine",
    description: "Dynamic AI-style theming system.",
    features: [
      "Generate themes from logo/image",
      "Auto dark mode tuning",
      "Dynamic gradients",
      "Semantic colors",
      "Brand consistency checker",
    ],
    why: "Theme systems take massive effort in production apps.",
  },
  {
    name: "flutter_super_table",
    title: "FlutterSuperTable",
    description: "Enterprise-level data table package.",
    features: [
      "Virtual scrolling",
      "Column resize",
      "Filters",
      "Inline editing",
      "Frozen columns",
      "Excel-like keyboard navigation",
      "CSV/Excel export",
    ],
    why: "Flutter lacks truly powerful data table solutions.",
    highPotential: true,
  },
  {
    name: "auto_localization_kit",
    title: "AutoLocalizationKit",
    description: "Fully automated localization system.",
    features: [
      "AI translation integration",
      "Auto key extraction",
      "Missing translation detector",
      "RTL auto-fixes",
      "Locale-aware formatting",
    ],
    why: "Localization setup is repetitive and messy.",
  },
  {
    name: "app_flow_orchestrator",
    title: "AppFlowOrchestrator",
    description: "Visual screen flow/state orchestration engine.",
    features: [
      "Navigation graph builder",
      "Conditional routing",
      "Auth guards",
      "Deep-link manager",
      "Feature flags",
      "Screen analytics",
    ],
    why: "Navigation complexity becomes huge in large apps.",
  },
  {
    name: "widget_studio",
    title: "WidgetStudio",
    description: "Build Flutter UIs from JSON/schema dynamically.",
    features: [
      "Server-driven UI",
      "Live updates without app release",
      "Remote layout changes",
      "Dynamic widgets",
      "A/B testing ready",
    ],
    why: "Massive demand for server-driven Flutter apps is coming.",
    highPotential: true,
  },
  {
    name: "flutter_zero_setup",
    title: "flutter-zero-setup",
    description:
      "Initialize a production-grade Flutter app in one command.",
    tagline: "Initialize a production-grade Flutter app in one command.",
    cli: "npx flutter-zero-setup init",
    features: ["flavors", "Firebase", "CI/CD", "folder architecture", "env handling", "linting", "localization"],
    why: "Flutter create gives bare minimum setup.",
    type: "cli",
  },
  {
    name: "flutter_asset_sync",
    title: "flutter-asset-sync",
    description: "Sync Figma/exported assets directly into Flutter projects.",
    tagline: "Sync Figma/exported assets directly into Flutter projects.",
    cli: "npx flutter-asset-sync pull",
    features: ["Optimized images", "Generated asset constants", "Updated pubspec.yaml", "Removed unused assets"],
    why: "Asset management is still manual and messy.",
    type: "cli",
  },
  {
    name: "flutter_env_forge",
    title: "flutter-env-forge",
    description: "Generate environment systems automatically.",
    tagline: "Generate environment systems automatically.",
    cli: "npx flutter-env-forge create",
    features: [".env.dev", ".env.prod", "flavor configs", "Dart env accessors"],
    why: "Env setup across Android/iOS/Web is repetitive.",
    type: "cli",
  },
  {
    name: "flutter_route_genius",
    title: "flutter-route-genius",
    description: "Auto-generate type-safe navigation.",
    tagline: "Auto-generate type-safe navigation.",
    cli: "npx flutter-route-genius scan",
    features: ["Type-safe routes", "Deep links", "Route analytics"],
    why: "Navigation boilerplate is huge.",
    type: "cli",
  },
  {
    name: "flutter_api_weaver",
    title: "flutter-api-weaver",
    description: "Generate API layers from Swagger/Postman.",
    tagline: "Generate API layers from Swagger/Postman.",
    cli: "npx flutter-api-weaver generate ./swagger.json",
    features: ["Models", "Repository layer", "Dio services", "Error handlers", "Retry interceptors"],
    why: "API integration consumes massive time.",
    type: "cli",
  },
  {
    name: "flutter_screen_forge",
    title: "flutter-screen-forge",
    description: "Generate complete screens from prompts.",
    tagline: "Generate complete screens from prompts.",
    cli: 'npx flutter-screen-forge create "product listing page"',
    features: ["loading states", "pagination", "filters", "shimmer"],
    why: "Creating repetitive CRUD screens wastes hours.",
    type: "cli",
  },
  {
    name: "flutter_pub_cleaner",
    title: "flutter-pub-cleaner",
    description: "Remove unused Flutter dependencies automatically.",
    tagline: "Remove unused Flutter dependencies automatically.",
    cli: "npx flutter-pub-cleaner audit",
    features: ["Unused dependency detection", "CI integration"],
    why: "Flutter projects accumulate dead packages.",
    type: "cli",
  },
  {
    name: "flutter_release_pilot",
    title: "flutter-release-pilot",
    description: "Fully automate Flutter releases.",
    tagline: "Fully automate Flutter releases.",
    cli: "npx flutter-release-pilot deploy",
    features: ["version bump", "changelog", "build", "signing", "store upload"],
    why: "Release process is fragmented.",
    type: "cli",
  },
  {
    name: "flutter_perf_doctor",
    title: "flutter-perf-doctor",
    description: "Detect Flutter performance issues automatically.",
    tagline: "Detect Flutter performance issues automatically.",
    cli: "npx flutter-perf-doctor scan",
    features: ["rebuild issues", "memory leaks", "oversized widgets", "nested scroll issues"],
    why: "Performance debugging is difficult.",
    type: "cli",
  },
  {
    name: "flutter_state_smith",
    title: "flutter-state-smith",
    description: "Generate complete state management architecture.",
    tagline: "Generate complete state management architecture.",
    cli: "npx flutter-state-smith create auth",
    features: ["state", "providers", "repositories", "usecases", "tests"],
    why: "Riverpod/BLoC setup is repetitive.",
    type: "cli",
  },
  {
    name: "flutter_ui_cloner",
    title: "flutter-ui-cloner",
    description: "Convert screenshots into Flutter UI code.",
    tagline: "Convert screenshots into Flutter UI code.",
    cli: "npx flutter-ui-cloner scan ./design.png",
    features: ["Widget tree generation", "AI-assisted layout"],
    why: "UI recreation takes too long.",
    type: "cli",
  },
  {
    name: "flutter_test_factory",
    title: "flutter-test-factory",
    description: "Generate Flutter tests automatically.",
    tagline: "Generate Flutter tests automatically.",
    cli: "npx flutter-test-factory generate",
    features: ["unit tests", "widget tests", "mock setup"],
    why: "Testing coverage is poor because writing tests is slow.",
    type: "cli",
  },
  {
    name: "flutter_build_shrinker",
    title: "flutter-build-shrinker",
    description: "Reduce Flutter app size automatically.",
    tagline: "Reduce Flutter app size automatically.",
    cli: "npx flutter-build-shrinker optimize",
    features: ["asset compression", "font tree shaking", "unused code detection"],
    why: "Large APK/AAB sizes remain a pain.",
    type: "cli",
  },
  {
    name: "flutter_firelink",
    title: "flutter-firelink",
    description: "Firebase setup in one command.",
    tagline: "Firebase setup in one command.",
    cli: "npx flutter-firelink connect",
    features: ["Firebase apps", "config files", "auth setup", "analytics", "crashlytics"],
    why: "Firebase integration still involves many steps.",
    type: "cli",
  },
  {
    name: "flutter_icon_smith",
    title: "flutter-icon-smith",
    description: "Generate app icons and splash screens instantly.",
    tagline: "Generate app icons and splash screens instantly.",
    cli: "npx flutter-icon-smith generate ./logo.png",
    features: ["All platform assets", "Branding presets"],
    why: "Manual asset resizing is tedious.",
    type: "cli",
  },
  {
    name: "flutter_monorepo_chief",
    title: "flutter-monorepo-chief",
    description: "Manage Flutter monorepos effortlessly.",
    tagline: "Manage Flutter monorepos effortlessly.",
    cli: "npx flutter-monorepo-chief bootstrap",
    features: ["package linking", "dependency sync", "shared builds"],
    why: "Monorepo tooling in Flutter is weak.",
    type: "cli",
  },
  {
    name: "flutter_db_scaffold",
    title: "flutter-db-scaffold",
    description: "Generate local database layers automatically.",
    tagline: "Generate local database layers automatically.",
    cli: "npx flutter-db-scaffold create users",
    features: ["models", "migrations", "repositories", "DAOs"],
    why: "SQLite/Drift setup is repetitive.",
    type: "cli",
  },
  {
    name: "flutter_device_lab",
    title: "flutter-device-lab",
    description: "Run automated testing across device matrices.",
    tagline: "Run automated testing across device matrices.",
    cli: "npx flutter-device-lab run",
    features: ["emulator spawning", "screenshots", "logs", "reports"],
    why: "Cross-device testing setup is painful.",
    type: "cli",
  },
  {
    name: "flutter_clean_arch_bot",
    title: "flutter-clean-arch-bot",
    description: "Generate full clean architecture instantly.",
    tagline: "Generate full clean architecture instantly.",
    cli: "npx flutter-clean-arch-bot init",
    features: ["Enterprise-ready structure", "layered modules"],
    why: "Setting up scalable architecture takes hours.",
    type: "cli",
  },
  {
    name: "flutter_widget_map",
    title: "flutter-widget-map",
    description: "Visualize widget dependency trees.",
    tagline: "Visualize widget dependency trees.",
    cli: "npx flutter-widget-map analyze",
    features: ["Interactive widget graph", "dependency analysis"],
    why: "Large widget trees become impossible to understand.",
    type: "cli",
  },
];

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  if (existsSync(path)) return false;
  writeFileSync(path, content, "utf8");
  return true;
}

function kebabFromName(name) {
  return name.replace(/_/g, "-");
}

function exportFn(name) {
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function scaffoldMern(pkg) {
  const dir = join(MERN_DIR, pkg.name);
  if (existsSync(dir)) return "skip";
  const slug = `${GITHUB_ORG}/${pkg.name}`;
  const scopeName = `${NPM_SCOPE}/${pkg.name}`;
  const fn = exportFn(pkg.name);
  const featuresMd = pkg.features.map((f) => `- ${f}`).join("\n");

  write(
    join(dir, "package.json"),
    JSON.stringify(
      {
        name: scopeName,
        version: "0.1.0",
        description: pkg.description,
        license: "MIT",
        type: "module",
        main: "./dist/index.cjs",
        module: "./dist/index.js",
        types: "./dist/index.d.ts",
        exports: {
          ".": {
            types: "./dist/index.d.ts",
            import: "./dist/index.js",
            require: "./dist/index.cjs",
          },
        },
        files: ["dist", "README.md", "LICENSE", "CHANGELOG.md"],
        scripts: {
          build: "tsup",
          test: "vitest run",
          typecheck: "tsc --noEmit",
          prepublishOnly: "npm run build",
        },
        keywords: [
          "merndev",
          "nodejs",
          "typescript",
          "express",
          "mongodb",
          pkg.name,
        ],
        dependencies: {},
        devDependencies: {
          "@types/express": "^4.17.21",
          "@types/node": "^20.11.0",
          "express": "^4.19.2",
          "tsup": "^8.0.0",
          "typescript": "^5.4.0",
          "vitest": "^1.4.0",
        },
        peerDependencies: {
          express: "^4.0.0 || ^5.0.0",
        },
        peerDependenciesMeta: {
          express: { optional: true },
        },
        engines: { node: ">=18" },
        author: AUTHOR,
        repository: {
          type: "git",
          url: `git+https://github.com/${slug}.git`,
        },
        bugs: { url: `https://github.com/${slug}/issues` },
        homepage: `https://github.com/${slug}#readme`,
        publishConfig: { access: "public" },
      },
      null,
      2
    ) + "\n"
  );

  write(join(dir, "tsconfig.json"), `${tsconfig}\n`);
  write(
    join(dir, "tsup.config.ts"),
    `import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "node18",
});
`
  );
  write(join(dir, ".gitignore"), "node_modules\ndist\ncoverage\n.DS_Store\n*.log\n");
  write(join(dir, "LICENSE"), MIT);
  write(
    join(dir, "CHANGELOG.md"),
    "# Changelog\n\n## 0.1.0\n\n- Initial scaffold release.\n"
  );
  write(
    join(dir, "README.md"),
    `# ${pkg.name}

${pkg.description}

## Features

${featuresMd}

## Example

\`\`\`ts
import { ${fn} } from "${scopeName}";

${pkg.example};
\`\`\`

## Why

${pkg.benefit}

## License

MIT
`
  );
  write(
    join(dir, "src/index.ts"),
    `/**
 * ${pkg.description}
 * @example ${pkg.example}
 */
export function ${fn}(): { ok: true; package: string } {
  return { ok: true, package: "${pkg.name}" };
}
`
  );
  write(
    join(dir, "src/index.test.ts"),
    `import { describe, it, expect } from "vitest";
import { ${fn} } from "./index.js";

describe("${pkg.name}", () => {
  it("exports scaffold API", () => {
    expect(${fn}()).toEqual({ ok: true, package: "${pkg.name}" });
  });
});
`
  );
  mkdirSync(join(dir, ".github", "workflows"), { recursive: true });
  write(join(dir, ".github", "workflows", "publish.yml"), publishYml);
  return "created";
}

const tsconfig = `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noUncheckedIndexedAccess": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}`;

const publishYml = `name: Publish to npm

on:
  push:
    branches: [main]

permissions:
  contents: write

concurrency:
  group: publish-\${{ github.ref }}
  cancel-in-progress: false

jobs:
  publish:
    if: \${{ !contains(github.event.head_commit.message, '[skip ci]') }}
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          registry-url: https://registry.npmjs.org

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test --if-present

      - name: Configure git identity
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

      - name: Determine publish version
        id: ver
        run: |
          NAME=$(node -p "require('./package.json').name")
          VERSION=$(node -p "require('./package.json').version")
          echo "name=$NAME" >> "$GITHUB_OUTPUT"
          if npm view "$NAME@$VERSION" version >/dev/null 2>&1; then
            echo "needs_bump=true" >> "$GITHUB_OUTPUT"
          else
            echo "needs_bump=false" >> "$GITHUB_OUTPUT"
          fi

      - name: Bump patch version
        if: steps.ver.outputs.needs_bump == 'true'
        run: npm version patch -m "chore: release v%s [skip ci]"

      - name: Publish to npm
        env:
          NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}
        run: npm publish

      - name: Push version commit and tag
        if: steps.ver.outputs.needs_bump == 'true'
        run: git push --follow-tags
`;

function scaffoldFlutter(pkg) {
  const dir = join(FLUTTER_DIR, pkg.name);
  if (existsSync(dir)) return "skip";
  const slug = `${GITHUB_ORG}/${pkg.name}`;
  const title = pkg.title || pkg.name;
  const featuresMd = (pkg.features || []).map((f) => `- ${f}`).join("\n");
  const className = pkg.name
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");

  write(
    join(dir, "pubspec.yaml"),
    `name: ${pkg.name}
description: ${pkg.description}
version: 0.1.0
publish_to: none

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

repository: https://github.com/${slug}
`
  );

  write(
    join(dir, "analysis_options.yaml"),
    `include: package:flutter_lints/flutter.yaml

linter:
  rules:
    prefer_const_constructors: true
`
  );

  write(join(dir, ".gitignore"), `.dart_tool/
.packages
build/
pubspec.lock
`
  );
  write(join(dir, "LICENSE"), MIT);
  write(
    join(dir, "CHANGELOG.md"),
    "# Changelog\n\n## 0.1.0\n\n- Initial scaffold release.\n"
  );

  const cliSection = pkg.cli
    ? `\n## CLI\n\n\`\`\`bash\n${pkg.cli}\n\`\`\`\n`
    : "";
  const potential = pkg.highPotential ? "\n\n**High market potential** — production pain point.\n" : "";

  write(
    join(dir, "README.md"),
    `# ${title}

${pkg.tagline || pkg.description}
${cliSection}
## Features

${featuresMd}

## Usage

\`\`\`dart
import 'package:${pkg.name}/${pkg.name}.dart';

void main() {
  ${className}.init();
}
\`\`\`

## Why

${pkg.why || "Reduces Flutter boilerplate."}${potential}

## License

MIT
`
  );

  write(
    join(dir, "lib", `${pkg.name}.dart`),
    `/// ${pkg.description}
class ${className} {
  ${className}._();

  static const String packageName = '${pkg.name}';

  /// Scaffold entry — replace with real implementation.
  static void init() {}
}
`
  );

  write(
    join(dir, "test", `${pkg.name}_test.dart`),
    `import 'package:flutter_test/flutter_test.dart';
import 'package:${pkg.name}/${pkg.name}.dart';

void main() {
  test('${pkg.name} scaffold', () {
    expect(${className}.packageName, '${pkg.name}');
  });
}
`
  );

  return "created";
}

mkdirSync(MERN_DIR, { recursive: true });
mkdirSync(FLUTTER_DIR, { recursive: true });

const rnResults = mernPackages.map((p) => [p.name, scaffoldMern(p)]);
const flResults = flutterPackages.map((p) => [p.name, scaffoldFlutter(p)]);

write(
  join(MERN_DIR, "README.md"),
  `# MERN packages

Node.js packages for Express, MongoDB, and React state tooling. Each folder is a standalone repo target under [\`${GITHUB_ORG}\`](https://github.com/${GITHUB_ORG}).

| Package | Description |
| --- | --- |
${mernPackages.map((p) => `| [\`${p.name}\`](./${p.name}) | ${p.description} |`).join("\n")}

## Development

From the monorepo root:

\`\`\`bash
npm install
npm run build --workspace=mern/<package>
\`\`\`
`
);

write(
  join(FLUTTER_DIR, "README.md"),
  `# Flutter packages

Dart/Flutter libraries and CLI-oriented packages. Each folder is a standalone repo target under [\`${GITHUB_ORG}\`](https://github.com/${GITHUB_ORG}).

### Widget / library packages

${flutterPackages
  .filter((p) => p.type !== "cli")
  .map((p) => `- **${p.title || p.name}** (\`${p.name}\`) — ${p.description}`)
  .join("\n")}

### CLI / tooling packages

${flutterPackages
  .filter((p) => p.type === "cli")
  .map((p) => `- **${p.title}** (\`${p.name}\`) — ${p.description}`)
  .join("\n")}

## Development

\`\`\`bash
cd flutter/<package>
flutter pub get
flutter test
\`\`\`
`
);

console.log("mern:", rnResults.filter(([, s]) => s === "created").length, "created");
console.log("flutter:", flResults.filter(([, s]) => s === "created").length, "created");
console.log(
  "skipped (exist):",
  [...rnResults, ...flResults].filter(([, s]) => s === "skip").map(([n]) => n).join(", ") || "none"
);
