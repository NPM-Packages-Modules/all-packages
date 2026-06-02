import { describe, it, expect } from "vitest";
import { deploysensex } from "./index.js";

describe("deploysensex", () => {
  it("exports scaffold API", () => {
    expect(deploysensex()).toEqual({ ok: true, package: "deploysensex" });
  });
});
