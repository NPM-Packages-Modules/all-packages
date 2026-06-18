export interface MergeRisk {
  file: string;
  likelihood: "low" | "medium" | "high";
}

export const mergeSafe = {
  analyze(paths: string[]): MergeRisk[] {
    return paths.map((file) => ({
      file,
      likelihood: file.includes("Service") ? "high" : "medium",
    }));
  },
};
