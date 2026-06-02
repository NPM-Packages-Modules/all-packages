/**
 * Update README + package.json description for flagship MERN packages.
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MERN = join(ROOT, "mern");
const SCOPE = "";

const packages = [
  {
    name: "servbridge",
    idea: "Automatically connect multiple MERN services together with minimal setup.",
    features: [
      "service discovery",
      "request routing",
      "event communication",
      "retry handling",
      "distributed tracing",
      "shared auth",
    ],
    example: `import { servbridge } from "${SCOPE}servbridge";

const bridge = servbridge();
bridge.register("payments", async (payload) => {
  /* handle */
});
bridge.emit("order.paid", { id: "1" });`,
    why: "Microservices become operational chaos very quickly.",
  },
  {
    name: "datamorph",
    idea: "Transform API/database data automatically through pipelines.",
    features: [
      "response shaping",
      "field mapping",
      "nested transforms",
      "sanitization",
      "serialization",
    ],
    example: `import { datamorph } from "${SCOPE}datamorph";

const out = datamorph()
  .hide("password")
  .rename("full_name", "name")
  .apply(user);`,
    why: "Developers constantly write repetitive transformation logic.",
  },
  {
    name: "routeforge",
    idea: "Generate complete Express CRUD modules automatically.",
    features: [
      "route generation",
      "controller generation",
      "validation setup",
      "Swagger docs",
      "middleware injection",
      "folder scaffolding",
    ],
    example: `import { routeforge } from "${SCOPE}routeforge";

await routeforge.create("products");`,
    why: "Backend teams repeatedly rebuild identical CRUD structures.",
  },
  {
    name: "authmesh",
    idea: "Create centralized authentication systems across MERN services.",
    features: [
      "JWT validation",
      "role propagation",
      "shared sessions",
      "token rotation",
      "auth middleware",
      "RBAC",
    ],
    example: `import express from "express";
import { authmesh } from "${SCOPE}authmesh";

const app = express();
app.use(authmesh({ accessSecret: process.env.JWT_SECRET! }));`,
    why: "Authentication duplication becomes impossible to maintain at scale.",
  },
  {
    name: "querygenie",
    idea: "Generate advanced MongoDB queries automatically.",
    features: [
      "filtering",
      "search",
      "pagination",
      "sorting",
      "aggregation pipelines",
      "query optimization",
    ],
    example: `import { querygenie } from "${SCOPE}querygenie";

const q = querygenie(Product).filter(req.query);`,
    why: "Developers constantly rebuild repetitive query systems.",
  },
  {
    name: "cachepilot",
    idea: "Automatically cache APIs and database queries intelligently.",
    features: [
      "Redis integration",
      "stale refresh",
      "auto invalidation",
      "query fingerprinting",
      "route caching",
      "memory sync",
    ],
    example: `import { cachepilot } from "${SCOPE}cachepilot";

export const getProducts = cachepilot.wrap(async () => fetchProducts());`,
    why: "Caching logic is complicated and duplicated everywhere.",
  },
  {
    name: "socketmesh",
    idea: "Simplify scalable real-time communication infrastructure.",
    features: [
      "socket clustering",
      "room orchestration",
      "reconnect handling",
      "event replay",
      "namespace isolation",
      "scaling support",
    ],
    example: `import { socketmesh } from "${SCOPE}socketmesh";

const orders = socketmesh.channel("orders");`,
    why: "WebSocket systems become extremely difficult to scale reliably.",
  },
  {
    name: "envsyncer",
    idea: "Synchronize and validate environment variables across services.",
    features: [
      "schema validation",
      "missing variable detection",
      "environment diffing",
      "config versioning",
      "secret masking",
      "deployment validation",
    ],
    example: `import { envsyncer } from "${SCOPE}envsyncer";

envsyncer.validate();`,
    why: "Environment mismatches are a major production failure source.",
  },
  {
    name: "stacktracex",
    idea: "Visual distributed tracing for MERN applications.",
    features: [
      "request timelines",
      "trace correlation",
      "latency visualization",
      "service mapping",
      "error tracing",
      "request replay",
    ],
    example: `import { stacktracex } from "${SCOPE}stacktracex";

stacktracex.track(app);`,
    why: "Debugging distributed systems is incredibly painful.",
  },
  {
    name: "retryflow",
    idea: "Manage retries and fault tolerance automatically.",
    features: [
      "exponential backoff",
      "retry queues",
      "timeout recovery",
      "circuit breakers",
      "dead-letter handling",
      "retry analytics",
    ],
    example: `import { retryflow } from "${SCOPE}retryflow";

await retryflow.wrap(sendEmail)();`,
    why: "Retry systems are difficult and often implemented poorly.",
  },
  {
    name: "mongoforge",
    idea: "Automatically optimize MongoDB indexing strategies.",
    features: [
      "slow query analysis",
      "index generation",
      "duplicate cleanup",
      "query profiling",
      "performance scoring",
      "index recommendations",
    ],
    example: `import { mongoforge } from "${SCOPE}mongoforge";

await mongoforge.optimize();`,
    why: "Poor Mongo indexing destroys app performance silently.",
  },
  {
    name: "eventbridgex",
    idea: "Unified event-driven communication layer for MERN services.",
    features: [
      "pub/sub",
      "event retries",
      "schema validation",
      "consumer groups",
      "dead event handling",
      "event replay",
    ],
    example: `import { eventbridgex } from "${SCOPE}eventbridgex";

await eventbridgex.emit("order.created", { id: "42" });`,
    why: "Event architectures become chaotic without centralized tooling.",
  },
  {
    name: "cronpilot",
    idea: "Manage distributed cron jobs safely across servers.",
    features: [
      "duplicate prevention",
      "retry scheduling",
      "cron balancing",
      "execution history",
      "worker coordination",
      "failure recovery",
    ],
    example: `import { cronpilot } from "${SCOPE}cronpilot";

cronpilot.schedule("* * * * *", task);`,
    why: "Cron systems break unpredictably in scaled environments.",
  },
  {
    name: "schemashift",
    idea: "Automatically generate MongoDB schema migrations.",
    features: [
      "migration generation",
      "rollback support",
      "schema diffing",
      "validation repair",
      "version history",
      "migration tracking",
    ],
    example: `import { schemashift } from "${SCOPE}schemashift";

await schemashift.generate();`,
    why: "Mongo migrations are still mostly unmanaged manually.",
  },
  {
    name: "secureflow",
    idea: "Automate backend security middleware orchestration.",
    features: [
      "rate limiting",
      "XSS protection",
      "NoSQL injection guards",
      "header hardening",
      "suspicious activity detection",
      "IP throttling",
    ],
    example: `import { secureflow } from "${SCOPE}secureflow";

secureflow.protect(app);`,
    why: "Security setups are fragmented and inconsistently implemented.",
  },
  {
    name: "logmesh",
    idea: "Centralized structured logging for MERN systems.",
    features: [
      "log aggregation",
      "service tagging",
      "trace correlation",
      "error grouping",
      "real-time streams",
      "log analytics",
    ],
    example: `import { logmesh } from "${SCOPE}logmesh";

logmesh.connect(app);`,
    why: "Logs become unreadable across multiple services.",
  },
  {
    name: "servqueue",
    idea: "Simple distributed queue management for MERN applications.",
    features: [
      "delayed jobs",
      "retries",
      "worker balancing",
      "queue priorities",
      "job monitoring",
      "distributed processing",
    ],
    example: `import { servqueue } from "${SCOPE}servqueue";

await servqueue.add("email", payload);`,
    why: "Queue systems are often overly complex or fragmented.",
  },
  {
    name: "deploysense",
    idea: "Detect risky deployments before production release.",
    features: [
      "dependency checks",
      "migration validation",
      "env verification",
      "rollback alerts",
      "memory forecasting",
      "deployment scoring",
    ],
    example: `import { deploysense } from "${SCOPE}deploysense";

await deploysense.verify();`,
    why: "Many production outages happen during deployment.",
  },
  {
    name: "apidocsmith",
    idea: "Generate beautiful API documentation automatically.",
    features: [
      "Swagger generation",
      "request examples",
      "response examples",
      "auth documentation",
      "route grouping",
      "API versioning",
    ],
    example: `import { apidocsmith } from "${SCOPE}apidocsmith";

apidocsmith.scan(app);`,
    why: "API documentation is usually outdated or missing completely.",
  },
  {
    name: "apiflowx",
    idea: "Visualize and orchestrate complex API architectures.",
    features: [
      "dependency graphs",
      "API mapping",
      "request replay",
      "latency visualization",
      "service flow analysis",
      "endpoint discovery",
    ],
    example: `import { apiflowx } from "${SCOPE}apiflowx";

apiflowx.inspect(app);`,
    why: "Teams lose visibility as backend systems scale.",
  },
];

function readme(pkg) {
  const features = pkg.features.map((f) => `- ${f}`).join("\n");
  return `# ${pkg.name}

${pkg.idea}

## Features

${features}

## Example

\`\`\`ts
${pkg.example}
\`\`\`

## Why it matters

${pkg.why}

## License

MIT
`;
}

for (const pkg of packages) {
  const dir = join(MERN, pkg.name);
  if (!existsSync(dir)) {
    console.warn("skip missing", pkg.name);
    continue;
  }
  writeFileSync(join(dir, "README.md"), readme(pkg));
  const pjPath = join(dir, "package.json");
  const pj = JSON.parse(readFileSync(pjPath, "utf8"));
  pj.description = pkg.idea;
  writeFileSync(pjPath, JSON.stringify(pj, null, 2) + "\n");
  console.log("updated", pkg.name);
}
