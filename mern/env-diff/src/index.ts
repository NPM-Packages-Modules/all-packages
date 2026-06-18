export const envDiff = {
  compare(envs: Record<string, string[]>): { missing: string[] } {
    const all = new Set(Object.values(envs).flat());
    const present = new Set(envs.staging ?? []);
    const missing = [...all].filter((k) => !present.has(k));
    return { missing };
  },
};
