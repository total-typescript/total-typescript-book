import { it } from "node:test";
import { expect } from "vitest";

function getLength(value: string | string[] | undefined) {}

it("Should handle a string", () => {
  const result = getLength("123");

  expect(result).toBe(3);

  type test = Expect<Equal<typeof result, number>>;
});

it("Should handle an array", () => {
  const result = getLength(["123", "456"]);

  expect(result).toBe(2);

  type test = Expect<Equal<typeof result, number>>;
});

it("Should handle undefined", () => {
  const result = getLength(undefined);

  expect(result).toBe(0);

  type test = Expect<Equal<typeof result, number>>;
});
