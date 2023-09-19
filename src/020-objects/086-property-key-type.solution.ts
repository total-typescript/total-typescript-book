import { expect, it } from "vitest";

const hasKey = (obj: object, key: PropertyKey) => {
  return obj.hasOwnProperty(key);
};

it("Should work on string keys", () => {
  const obj = {
    foo: "bar",
  };

  expect(hasKey(obj, "foo")).toBe(true);
  expect(hasKey(obj, "bar")).toBe(false);
});

it("Should work on number keys", () => {
  const obj = {
    1: "bar",
  };

  expect(hasKey(obj, 1)).toBe(true);
  expect(hasKey(obj, 2)).toBe(false);
});

it("Should work on symbol keys", () => {
  const fooSymbol = Symbol("foo");
  const barSymbol = Symbol("bar");

  const obj = {
    [fooSymbol]: "bar",
  };

  expect(hasKey(obj, fooSymbol)).toBe(true);
  expect(hasKey(obj, barSymbol)).toBe(false);
});
