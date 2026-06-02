import { describe, expect, it } from "vitest";
import { eventmeshx } from "../src/index.js";

describe("eventmeshx", () => {
  it("pub sub", async () => {
    const bus = eventmeshx();
    const p = new Promise<string>((res) => {
      bus.subscribe<string>("user.created", (x) => res(x));
    });
    bus.publish("user.created", "u1");
    expect(await p).toBe("u1");
  });
});
