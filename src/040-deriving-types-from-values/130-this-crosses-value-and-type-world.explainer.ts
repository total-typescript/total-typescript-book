import { Equal, Expect } from "@total-typescript/helpers";

class CanvasNode {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  move(x: number, y: number): this {
    this.x += x;
    this.y += y;
    return this;
  }
}

const node = new CanvasNode(0, 0).move(10, 20).move(30, 40);

type test = Expect<Equal<typeof node, CanvasNode>>;
