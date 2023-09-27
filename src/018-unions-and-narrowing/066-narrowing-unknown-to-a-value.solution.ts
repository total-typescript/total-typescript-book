import { Equal, Expect } from "@total-typescript/helpers";
import { expect, it } from "vitest";

const parseValue = (value: unknown) => {
  if (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    typeof value.data === "object" &&
    value.data !== null &&
    "id" in value.data &&
    typeof value.data.id === "string"
  ) {
    return value.data.id;
  }

  throw new Error("Parsing error!");
};

it("Should handle a { data: { id: string } }", () => {
  const result = parseValue({
    data: {
      id: "123",
    },
  });

  type test = Expect<Equal<typeof result, string>>;

  expect(result).toBe("123");
});

it("Should error when anything else is passed in", () => {
  expect(() => parseValue("123")).toThrow("Parsing error!");
  expect(() => parseValue(123)).toThrow("Parsing error!");
});
