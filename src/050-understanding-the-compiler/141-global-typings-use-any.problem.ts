import { expect, it } from "vitest";

const getObj = () => {
  const obj: {
    a: number;
    b: number;
  } = JSON.parse('{ "a": 123, "c": 456 }');

  return obj;
};

it("Should return an obj", () => {
  const obj = getObj();

  expect(obj.b).toEqual(456);
});
