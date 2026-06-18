import { describe, expect, it } from "vitest";
import { featureSliceForge } from "./index.js";

it("create invoice", async () => {
  const s = await featureSliceForge.create("invoice");
  expect(s.backend[0]).toBe("invoice.model.js");
  expect(s.frontend[0]).toBe("InvoicePage.jsx");
});
