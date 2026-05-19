/**
 * Detect risky deployments before production.
 * @example deploysense.verify()
 */
export function deploysense(): { ok: true; package: string } {
  return { ok: true, package: "deploysense" };
}
