import { expect, it } from "vitest";

class CanvasNode {
  x: number;
  y: number;

  constructor(opts?: { x: number; y: number }) {
    this.x = opts?.x || 0;
    this.y = opts?.y || 0;
  }

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

it("Should be able to move", () => {
  const canvasNode = new CanvasNode();

  expect(canvasNode.x).toEqual(0);
  expect(canvasNode.y).toEqual(0);

  canvasNode.move(10, 20);

  expect(canvasNode.x).toEqual(10);
  expect(canvasNode.y).toEqual(20);
});

it("Should be able to receive an initial position", () => {
  const canvasNode = new CanvasNode({
    x: 10,
    y: 20,
  });

  expect(canvasNode.x).toEqual(10);
  expect(canvasNode.y).toEqual(20);
});
