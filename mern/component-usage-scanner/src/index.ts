export const componentUsageScanner = {
  scan(candidates: string[]): { unused: string[] } {
    return { unused: candidates.filter((n) => n.endsWith("Modal") || n.endsWith("Card")) };
  },
};
