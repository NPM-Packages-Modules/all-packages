export interface FlowStep {
  name: string;
  kind: "route" | "controller" | "service" | "database";
}

export const endpointFlow = {
  build(path: string): FlowStep[] {
    const resource = path.replace(/^\//, "").split("/")[0] ?? "resource";
    const cap = resource.charAt(0).toUpperCase() + resource.slice(1);
    return [
      { name: path, kind: "route" },
      { name: `${cap}Controller`, kind: "controller" },
      { name: `${cap}Service`, kind: "service" },
      { name: "MongoDB", kind: "database" },
    ];
  },
};
