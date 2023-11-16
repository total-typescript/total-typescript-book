import { expect, it } from "vitest";

function sum(values: { a: number; b: number }): number;
function sum(a: number, b: number): number;
function sum(valuesOrA: { a: number; b: number } | number, b?: number): number {
  if (typeof valuesOrA === "object") {
    return valuesOrA.a + valuesOrA.b;
  }
  return valuesOrA + b!;
}

it("Should work when passed an object", () => {
  expect(sum({ a: 1, b: 2 })).toEqual(3);
});

it("Should work when passed two numbers", () => {
  expect(sum(1, 2)).toEqual(3);
});

it("Should error in TS when passed incorrect arguments", () => {
  sum(
    // @ts-expect-error too many arguments
    { a: 1, b: 2 },
    2,
  );

  sum(
    // @ts-expect-error not enough arguments
    1,
  );
});
