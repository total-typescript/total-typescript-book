import { describe, expect, it } from "vitest";

class CanvasNode {
  x = 0;
  y = 0;

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const positionFromCanvasNode = (node) => {
  return {
    x: node.x,
    y: node.y,
  };
};

describe("positionFromCanvasNode", () => {
  it("Should return the position of the node", () => {
    const canvasNode = new CanvasNode();

    expect(positionFromCanvasNode(canvasNode)).toEqual({ x: 0, y: 0 });

    canvasNode.move(10, 20);

    expect(positionFromCanvasNode(canvasNode)).toEqual({ x: 10, y: 20 });
  });
});
