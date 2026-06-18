export interface AuditWatcher {
  model: string;
  events: readonly string[];
}

export const auditmesh = {
  watch(model: string): AuditWatcher {
    return {
      model,
      events: ["create", "update", "delete"],
    };
  },
};
