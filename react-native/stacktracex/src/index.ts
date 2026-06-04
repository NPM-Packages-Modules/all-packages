/** Distributed tracing hooks for React Native apps. */
export const stacktracekit = {
  track(_root: unknown) {
    return { enabled: true as const };
  },
};

export function track(root: unknown) {
  return stacktracekit.track(root);
}
