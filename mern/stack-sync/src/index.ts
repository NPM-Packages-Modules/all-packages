export interface StackSyncReport {
  brokenEndpoints: string[];
  ok: boolean;
}

export const stackSync = {
  check(opts: { client: string[]; server: string[] }): StackSyncReport {
    const server = new Set(opts.server);
    const broken = opts.client.filter((p) => !server.has(p));
    return { brokenEndpoints: broken, ok: broken.length === 0 };
  },
};
