import { Equal, Expect } from "@total-typescript/helpers";
import { expect, it } from "vitest";

const isString = (input: unknown): input is string => {
  return typeof input === "string";
};

it("Should be able to be passed to .filter and work", () => {
  const mixedArray = [1, "hello", [], {}];

  const stringsOnly = mixedArray.filter(isString);

  type test1 = Expect<Equal<typeof stringsOnly, string[]>>;

  expect(stringsOnly).toEqual(["hello"]);
});
