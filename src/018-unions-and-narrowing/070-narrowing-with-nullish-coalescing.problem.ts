import { Equal, Expect } from "@total-typescript/helpers";
import { expect, it } from "vitest";

function formatMessage(message: string | undefined) {}

it("Should handle a string", () => {
  const result = formatMessage("Hello");

  expect(result).toBe("Hello");

  type test = Expect<Equal<typeof result, string>>;
});

it("Should handle undefined", () => {
  const result = formatMessage(undefined);

  expect(result).toBe("No message available");

  type test = Expect<Equal<typeof result, string>>;
});

it("Should handle an empty string", () => {
  const result = formatMessage("");

  expect(result).toBe("");

  type test = Expect<Equal<typeof result, string>>;
});
