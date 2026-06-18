export const packageImpact = {
  analyze(name: string): { name: string; dependencies: number; bundleKb: number; knownIssues: number } {
    return { name, dependencies: 3, bundleKb: 18, knownIssues: 0 };
  },
};
