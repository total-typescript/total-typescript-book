import { it } from "vitest";

const getObj = () => {
  const obj: {
    a: number;
    b: number;
  } = JSON.parse('{ "a": 123, "b": 456 }');

  return obj;
};

it("Should return an obj", () => {
  const obj = getObj();
});
