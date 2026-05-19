export { Logger } from "./logger.js";
export {
  jsonTransport,
  prettyTransport,
  fileTransport,
  memoryTransport,
} from "./transports.js";
export { runWithContext, getContext, patchContext } from "./context.js";
export { ErrorClusterer, type ErrorCluster } from "./cluster.js";
export { serializeError, errorFingerprint } from "./error.js";
export { buildRedactor } from "./redact.js";
export { expressLogger } from "./express.js";
export type { LogRecord, Level, LoggerOptions, Transport, SerializedError } from "./types.js";

import { Logger } from "./logger.js";

export function createLogger(options: ConstructorParameters<typeof Logger>[0] = {}): Logger {
  return new Logger(options);
}

export const log = new Logger();
export default log;
