import { describe, expect, it } from "vitest";
import { errorTranslator } from "./index.js";

it("translate", () => {
  errorTranslator.register("USER_EXISTS", "Email already registered");
  expect(errorTranslator.translate("USER_EXISTS")).toBe("Email already registered");
});
