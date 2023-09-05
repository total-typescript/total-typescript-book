import { expect, it } from "vitest";

type ViewMode = "hidden" | "visible" | "selected";

type InitialOptions = { x: number; y: number; viewMode?: ViewMode };

interface IShape {
  position: { x: number; y: number };
  move: (deltaX: number, deltaY: number) => void;
}

class Shape implements IShape {
  #x: number;
  #y: number;

  constructor(initial?: InitialOptions) {
    this.#x = initial?.x ?? 0;
    this.#y = initial?.y ?? 0;
  }

  get position() {
    return { x: this.#x, y: this.#y };
  }

  move(deltaX: number, deltaY: number) {
    this.#x += deltaX;
    this.#y += deltaY;
  }
}

class CanvasNode extends Shape {
  #viewMode: ViewMode = "visible";

  constructor(initial?: InitialOptions) {
    super(initial);
    this.#viewMode = initial?.viewMode ?? "visible";
  }

  hide = () => {
    this.#viewMode = "hidden";
  };

  get isHidden() {
    return this.#viewMode === "hidden";
  }

  get isSelected() {
    return this.#viewMode === "selected";
  }

  get isVisible() {
    return this.#viewMode === "visible";
  }
}

it("Should start at 0,0", () => {
  const canvasNode = new CanvasNode();

  expect(canvasNode.position).toEqual({ x: 0, y: 0 });
});

it("Should not be able to access x and y from outside", () => {
  const canvasNode = new CanvasNode();

  // @ts-expect-error Property is private
  canvasNode.#x = 10;

  // @ts-expect-error Property is private
  canvasNode.#y = 20;
});

it("Should be able to receive an initial position", () => {
  const canvasNode = new CanvasNode({
    x: 10,
    y: 20,
  });

  expect(canvasNode.position).toEqual({ x: 10, y: 20 });
});

it("Should store some basic properties", () => {
  const canvasNode = new CanvasNode();

  expect(canvasNode.position).toEqual({ x: 0, y: 0 });

  canvasNode.move(10, 20);

  expect(canvasNode.position).toEqual({ x: 10, y: 20 });
});

it('Should handle "hidden" view mode', () => {
  const canvasNode = new CanvasNode();

  expect(canvasNode.isVisible).toEqual(true);
  expect(canvasNode.isHidden).toEqual(false);
  expect(canvasNode.isSelected).toEqual(false);

  canvasNode.hide();

  expect(canvasNode.isVisible).toEqual(false);
  expect(canvasNode.isHidden).toEqual(true);
  expect(canvasNode.isSelected).toEqual(false);
});
