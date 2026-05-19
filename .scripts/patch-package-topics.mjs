/**
 * Add org-standard topics/keywords to every package (npm + pub).
 *
 * Standard (all npm): merndev, nodejs, typescript, observability, mern-packages, npm-pm
 * Applied per-package when relevant: cli, schema, mongodb, migration
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const ORG_STANDARD = [
  "merndev",
  "nodejs",
  "typescript",
  "observability",
  "mern-packages",
  "npm-pm",
];
const OPTIONAL = ["cli", "schema", "mongodb", "migration"];

const RN_EXTRA = ["react-native", "react", "mobile"];
const FLUTTER_BASE = ["flutter", "dart", "mobile", "pub"];

/** Package-specific topics beyond heuristics */
const MERN_EXTRA = {
  monguard: ["mongodb", "mongoose", "performance", "profiler"],
  stacksense: ["express", "middleware", "errors"],
  syncora: ["websocket", "realtime", "react"],
  schemashift: ["schema", "migration", "mongodb", "cli"],
  schemagen: ["schema", "mongodb"],
  schemaui: ["schema", "ui"],
  envguard: ["env", "validation", "cli"],
  envrunes: ["env", "config"],
  archsense: ["cli", "architecture"],
  logmesh: ["logging", "structured-logging"],
  seedforge: ["mongodb", "seeding", "cli"],
  graphstack: ["cli", "dependencies"],
  testforge: ["cli", "testing"],
  docstack: ["cli", "docs"],
  codemorph: ["cli", "refactor"],
  "mcp-bootstrap": ["cli", "mcp"],
  "mongoose-advanced-plugin": ["mongodb", "mongoose"],
  queryforge: ["mongodb", "query"],
  searchforge: ["mongodb", "search"],
  dbmesh: ["mongodb", "database"],
  dbflow: ["mongodb", "repository"],
  datamorph: ["transform", "api"],
  apilifecycle: ["express", "api"],
  apiblocks: ["express", "api"],
  cronmesh: ["cron", "scheduler"],
  jobforge: ["jobs", "queue"],
  queueflow: ["queue", "jobs"],
  eventmesh: ["events", "pubsub"],
  retrystack: ["retry", "resilience"],
  deployguard: ["deploy", "ci"],
  perfstack: ["performance", "profiling"],
  promptmesh: ["llm", "ai"],
  llmtoken: ["llm", "openai"],
  "cost-limiter": ["rate-limiting", "budget"],
};

const RN_EXTRA_MAP = {
  servbridge: ["microservices", "service-discovery", "routing", "events"],
  datamorph: ["transform", "mapping", "api", "sanitization"],
  routeforge: ["scaffolding", "crud", "navigation", "cli"],
  authmesh: ["auth", "jwt", "rbac", "session"],
  querygenie: ["mongodb", "query", "pagination", "search"],
  cachepilot: ["cache", "redis", "performance"],
  socketmesh: ["websocket", "realtime", "socket"],
  envsyncer: ["env", "config", "validation"],
  stacktracex: ["tracing", "distributed", "debugging"],
  retryflow: ["retry", "resilience", "circuit-breaker"],
  mongoforge: ["mongodb", "index", "performance"],
  eventbridgex: ["events", "pubsub", "messaging"],
  cronpilot: ["cron", "scheduler", "jobs"],
  schemashift: ["schema", "migration", "mongodb", "cli"],
  secureflow: ["security", "rate-limiting", "xss"],
  logmesh: ["logging", "structured-logging", "tracing"],
  servqueue: ["queue", "jobs", "workers"],
  deploysense: ["deploy", "ci", "release"],
  apidocsmith: ["swagger", "openapi", "api-docs", "cli"],
  apiflowx: ["api", "orchestration", "visualization"],
};

const FLUTTER_EXTRA = {
  smart_form_x: ["forms", "validation", "ui"],
  auto_state_sync: ["state", "cache", "offline"],
  responsive_magic_ui: ["responsive", "layout", "ui"],
  motion_builder: ["animation", "ui"],
  secure_vault_lite: ["security", "storage"],
  smart_theme_engine: ["theme", "ui"],
  flutter_super_table: ["table", "data-grid"],
  auto_localization_kit: ["i18n", "localization"],
  app_flow_orchestrator: ["navigation", "routing"],
  widget_studio: ["server-driven-ui", "json"],
  flutter_zero_setup: ["cli", "scaffolding"],
  flutter_route_genius: ["navigation", "cli"],
  flutter_api_weaver: ["api", "codegen", "cli"],
  flutter_env_forge: ["env", "config", "cli"],
  flutter_db_scaffold: ["database", "sqlite", "drift"],
  schemashift: ["schema", "migration"],
};

function inferOptional(pkg, name) {
  const text = `${name} ${pkg.description || ""} ${(pkg.keywords || []).join(" ")}`.toLowerCase();
  const out = [];
  if (pkg.bin || /\bcli\b|npx |command/.test(text)) out.push("cli");
  if (/mongo|mongoose/.test(text)) out.push("mongodb");
  if (/schema|zod|dto/.test(text)) out.push("schema");
  if (/migrat/.test(text)) out.push("migration");
  return out;
}

function mergeKeywords(...lists) {
  const set = new Set();
  for (const list of lists) {
    for (const k of list) {
      const t = String(k).toLowerCase().trim();
      if (t.length >= 2) set.add(t);
    }
  }
  return [...set].sort();
}

function topicsLine(keywords) {
  return `**Topics:** ${keywords.map((k) => `\`${k}\``).join(" · ")}\n\n`;
}

function patchReadmeTopics(readmePath, keywords) {
  if (!existsSync(readmePath)) return;
  let md = readFileSync(readmePath, "utf8");
  md = md.replace(/^\*\*Topics:\*\*[^\n]*\n\n/m, "");
  const line = topicsLine(keywords);
  if (/^# /m.test(md)) {
    md = md.replace(/^(# [^\n]+\n\n)/m, `$1${line}`);
  } else {
    md = line + md;
  }
  writeFileSync(readmePath, md);
}

function patchNpm(ecosystem, extraMap, addRn = false) {
  const base = join(ROOT, ecosystem);
  let n = 0;
  for (const name of readdirSync(base)) {
    const dir = join(base, name);
    const p = join(dir, "package.json");
    if (!existsSync(p)) continue;
    const pkg = JSON.parse(readFileSync(p, "utf8"));
    const optional = inferOptional(pkg, name);
    const keywords = mergeKeywords(
      ORG_STANDARD,
      addRn ? RN_EXTRA : [],
      optional,
      extraMap[name] || [],
      pkg.keywords || [],
      [name]
    );
    pkg.keywords = keywords;
    writeFileSync(p, JSON.stringify(pkg, null, 2) + "\n");
    patchReadmeTopics(join(dir, "README.md"), keywords);
    writeFileSync(
      join(dir, "package-topics.json"),
      JSON.stringify({ topics: keywords }, null, 2) + "\n"
    );
    n++;
  }
  console.log(`${ecosystem}: ${n} packages updated (keywords + README topics)`);
}

function patchFlutter() {
  const base = join(ROOT, "flutter");
  let n = 0;
  for (const name of readdirSync(base)) {
    const pubPath = join(base, name, "pubspec.yaml");
    if (!existsSync(pubPath)) continue;
    let yaml = readFileSync(pubPath, "utf8");
    const topics = mergeKeywords(
      FLUTTER_BASE,
      FLUTTER_EXTRA[name] || [],
      [name.replace(/_/g, "-")]
    );
    const block = `topics:\n${topics.map((t) => `  - ${t}`).join("\n")}\n`;
    if (/^topics:\n/m.test(yaml)) {
      yaml = yaml.replace(/^topics:\n(?:  - .+\n)+/m, block);
    } else {
      yaml = yaml.replace(/^(version: .+\n)/m, `$1\n${block}`);
    }
    writeFileSync(pubPath, yaml);
    const readmePath = join(base, name, "README.md");
    patchReadmeTopics(readmePath, topics);
    if (existsSync(readmePath)) {
      writeFileSync(
        join(base, name, "package-topics.json"),
        JSON.stringify({ topics }, null, 2) + "\n"
      );
    }
    n++;
  }
  console.log(`flutter: ${n} pub packages updated (pubspec topics + README)`);
}

patchNpm("mern", MERN_EXTRA, false);
patchNpm("react-native", RN_EXTRA_MAP, true);
patchFlutter();
