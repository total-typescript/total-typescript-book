import { expect, it } from "vitest";

// TODO - remove return type in 5.5
const hasDataId = (value: unknown): value is { data: { id: string } } => {
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
  if (hasDataId(value)) {
    return value.data.id;
  }

  throw new Error("Parsing error!");
};

const parseValueAgain = (value: unknown) => {
  if (hasDataId(value)) {
    return value.data.id;
  }

  throw new Error("Parsing error!");
};

it("parseValue should handle a { data: { id: string } }", () => {
  const result = parseValue({
    data: {
      id: "123",
    },
  });

  expect(result).toBe("123");
});

it("parseValue should error when anything else is passed in", () => {
  expect(() => parseValue("123")).toThrow("Parsing error!");
  expect(() => parseValue(123)).toThrow("Parsing error!");
});

it("parseValueAgain should handle a { data: { id: string } }", () => {
  const result = parseValueAgain({
    data: {
      id: "123",
    },
  });

  expect(result).toBe("123");
});

it("parseValueAgain should error when anything else is passed in", () => {
  expect(() => parseValueAgain("123")).toThrow("Parsing error!");
  expect(() => parseValueAgain(123)).toThrow("Parsing error!");
});
