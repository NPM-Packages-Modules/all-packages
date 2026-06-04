export function retryflowkit<T extends (...args: unknown[]) => Promise<unknown>>(fn: T): T {
  return fn;
}
