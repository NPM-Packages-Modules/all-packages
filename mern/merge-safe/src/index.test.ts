import { describe, expect, it } from "vitest";
import { mergeSafe } from "./index.js";

it("analyze", () => {
  expect(mergeSafe.analyze(["src/InvoiceService.ts"])[0]?.likelihood).toBe("high");
});
