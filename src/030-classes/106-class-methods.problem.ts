import { expect, it } from "vitest";

class CanvasNode {
  readonly x = 0;
  readonly y = 0;
}

it("Should work", () => {
  const canvasNode = new CanvasNode();

  expect(canvasNode.x).toEqual(0);
  expect(canvasNode.y).toEqual(0);

  // @ts-expect-error Property is readonly
  canvasNode.x = 10;

  // @ts-expect-error Property is readonly
  canvasNode.y = 20;
});
