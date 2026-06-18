import { describe, expect, it } from "vitest";
import { auditmesh } from "./index.js";

it("watch", () => {
  expect(auditmesh.watch("User").events).toContain("update");
});
