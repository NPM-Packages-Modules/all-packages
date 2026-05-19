/**
 * Manage distributed cron jobs safely.
 * @example cronpilot.schedule("0 * * * *", task)
 */
export function cronpilot(): { ok: true; package: string } {
  return { ok: true, package: "cronpilot" };
}
