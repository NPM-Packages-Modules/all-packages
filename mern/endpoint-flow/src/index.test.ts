import { describe, expect, it } from "vitest";
import { endpointFlow } from "./index.js";

it("build", () => {
  expect(endpointFlow.build("/users").at(-1)?.kind).toBe("database");
});
