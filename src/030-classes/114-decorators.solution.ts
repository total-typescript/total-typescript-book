// TODO

import { expect, it, vi } from "vitest";

function logXAndY(
  originalMethod: (...args: any[]) => any,
  context: ClassMethodDecoratorContext<Shape>,
) {
  const methodName = String(context.name);

  function replacementMethod(this: Shape, ...args: any[]) {
    console.log(`Calling ${methodName} with`, ...args);
    const result = originalMethod.call(this, ...args);
    console.log(`x: ${this.x}, y: ${this.y}`);
    return result;
  }

  return replacementMethod;
}

// Class

type ShapeOptions = { x: number; y: number };

class Shape {
  x: number;
  y: number;

  constructor(initial?: ShapeOptions) {
    this.x = initial?.x ?? 0;
    this.y = initial?.y ?? 0;
  }

  get position() {
    return { x: this.x, y: this.y };
  }

  @logXAndY
  move(deltaX: number, deltaY: number) {
    this.x += deltaX;
    this.y += deltaY;
  }
}

const shape = new Shape({ x: 1, y: 2 });
shape.move(3, 4);

// it("should log x and y when move is called", () => {
//   const consoleMock = vi.spyOn(console, "log");
// const shape = new Shape({ x: 1, y: 2 });
// shape.move(3, 4);
//   expect(shape.position).toEqual({ x: 4, y: 6 });

//   expect(consoleMock).toHaveBeenCalled();
// });
