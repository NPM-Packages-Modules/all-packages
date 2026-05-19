import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const RN = join(fileURLToPath(new URL("..", import.meta.url)), "react-native");
const BASE = ["merndev", "nodejs", "typescript", "observability", "mern-packages", "npm-pm", "react-native", "react", "mobile"];

const EXTRA = {
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
  apidocsmith: ["swagger", "openapi", "api-docs"],
  apiflowx: ["api", "orchestration", "visualization"],
};

for (const name of readdirSync(RN)) {
  const p = join(RN, name, "package.json");
  if (!existsSync(p)) continue;
  const pj = JSON.parse(readFileSync(p, "utf8"));
  pj.keywords = [...new Set([...BASE, ...(EXTRA[name] || []), name])];
  writeFileSync(p, JSON.stringify(pj, null, 2) + "\n");
  console.log("keywords", name);
}
