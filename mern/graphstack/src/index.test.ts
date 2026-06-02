import { describe, expect, it } from "vitest";
import { graphstackx } from "./index.js";

it("version", () => expect(graphstackx.version).toBe("0.1.0"));
