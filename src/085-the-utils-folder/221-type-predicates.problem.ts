import { Equal, Expect } from "@total-typescript/helpers";
import { describe, expect, it } from "vitest";

const hasDataAndId = (value: unknown) => {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    typeof value.data === "object" &&
    value.data !== null &&
    "id" in value.data &&
    typeof value.data.id === "string"
  );
};

const parseValue = (value: unknown) => {
  if (hasDataAndId(value)) {
    return value.data.id;
  }

  throw new Error("Parsing error!");
};

const parseValueAgain = (value: unknown) => {
  if (hasDataAndId(value)) {
    return value.data.id;
  }

  throw new Error("Parsing error!");
};

describe("parseValue", () => {
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
});

describe("parseValueAgain", () => {
  it("Should handle a { data: { id: string } }", () => {
    const result = parseValueAgain({
      data: {
        id: "123",
      },
    });

    type test = Expect<Equal<typeof result, string>>;

    expect(result).toBe("123");
  });

  it("Should error when anything else is passed in", () => {
    expect(() => parseValueAgain("123")).toThrow("Parsing error!");
    expect(() => parseValueAgain(123)).toThrow("Parsing error!");
  });
});
