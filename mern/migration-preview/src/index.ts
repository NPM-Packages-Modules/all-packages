export const migrationPreview = {
  run(opts: { collection: string; affected: number }): { collection: string; affected: number; safe: boolean } {
    return { ...opts, safe: opts.affected < 100_000 };
  },
};
