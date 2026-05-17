# logmesh

Structured logger built for the AI debugging era. Every record is JSON, every request gets a trace ID, every error gets a stable fingerprint you can group, alert on, and feed to an LLM.

## Why

- Pretty terminal output in dev, JSON in prod (auto-detected).
- Built-in PII/secret redaction (`password`, `token`, `cookie`, `authorization`, …).
- Async-context trace IDs that flow through every middleware, handler, and DB call.
- Error fingerprinting + clustering so you can answer "how many users hit *this exact bug* today?"
- Pluggable transports (JSON, pretty, file, memory) and sampling.

## Install

```bash
npm install @mr-aftab-ahmad-khan/logmesh
```

## Basics

```ts
import { createLogger } from "@mr-aftab-ahmad-khan/logmesh";

const log = createLogger({ level: "info", bindings: { app: "api" } });

log.info("server started", { port: 3000 });
log.warn({ retries: 3, endpoint: "/orders" }, "retrying upstream");

try {
  await doWork();
} catch (err) {
  log.error(err, { msg: "work failed", userId: "u_1" });
}
```

## Express integration

```ts
import express from "express";
import { createLogger, expressLogger, getContext } from "@mr-aftab-ahmad-khan/logmesh";

const log = createLogger();
const app = express();

app.use(expressLogger({ logger: log }));

app.get("/me", (req, res) => {
  log.info("loading profile");           // automatically tagged with traceId
  res.json({ traceId: getContext()?.traceId });
});
```

Every log inside the request handler is automatically annotated with the request's trace ID via `AsyncLocalStorage`.

## Error clustering

```ts
import { ErrorClusterer, memoryTransport, createLogger } from "@mr-aftab-ahmad-khan/logmesh";

const mem = memoryTransport();
const log = createLogger({ transports: [mem] });
const cluster = new ErrorClusterer();

log.error(new Error("DB timeout"));
log.error(new Error("DB timeout"));

for (const record of mem.records) cluster.observe(record);
console.log(cluster.summarize());
// [error] 5d3f… ×2  DB timeout (first=…, last=…)
```

Use it to drive an `/errors` endpoint, Slack alert, or LLM summarizer.

## Transports

```ts
import {
  jsonTransport,
  prettyTransport,
  fileTransport,
  memoryTransport,
  createLogger,
} from "@mr-aftab-ahmad-khan/logmesh";

const log = createLogger({
  transports: [
    prettyTransport(),                    // dev terminal
    fileTransport("./logs/app.log"),      // newline-delimited JSON
  ],
});
```

Write your own by implementing `Transport`:

```ts
const datadogTransport = {
  name: "datadog",
  write(record) { sendToDatadog(record); },
};
```

## Redaction

```ts
const log = createLogger({ redactKeys: ["x-user-token", "social_security"] });
log.info("req", { headers: { "x-user-token": "secret" } });
// -> "headers": { "x-user-token": "[REDACTED]" }
```

Defaults already redact `password`, `pass`, `secret`, `token`, `apikey`, `authorization`, `cookie`, `set-cookie`, `session`, `ssn`, `creditcard`, `cvv`.

## Sampling

```ts
createLogger({
  sampler: (record) => record.level === "info" ? Math.random() < 0.1 : true,
});
```

## API

| Function | Purpose |
| --- | --- |
| `createLogger(options)` | Construct a logger |
| `logger.child(bindings)` | Inherit all options, append bindings |
| `logger.{trace,debug,info,warn,error,fatal}(msg \| obj \| err, ctx?)` | Emit a record |
| `expressLogger({ logger })` | Express middleware with trace IDs |
| `runWithContext(ctx, fn)` | Manually set async context |
| `ErrorClusterer` | Group records by `fingerprint` |
| `serializeError(err)` | Convert any thrown value to a JSON-safe shape |
| `errorFingerprint(serialized)` | 12-char stable hash |
| `buildRedactor(extraKeys)` | Reusable redactor function |

## License

MIT
