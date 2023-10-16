import { it, expect } from "vitest";

function add() {
  return this.x + this.y;
}

const setValues = (x: number, y: number) => {
  this.x = x;
  this.y = y;
};

it("Should add the numbers together", () => {
  const calculator = {
    x: 0,
    y: 0,

    add,
    setValues,
  };

  calculator.setValues(1, 2);

  expect(calculator.add()).toEqual(3);
});
