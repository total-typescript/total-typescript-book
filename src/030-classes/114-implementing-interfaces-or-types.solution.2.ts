interface ShapeOptions {
  x: number;
  y: number;
}

interface IShape {
  position: { x: number; y: number };
  move: (deltaX: number, deltaY: number) => void;
}

class Shape implements IShape {
  #x: number;
  #y: number;

  constructor(initial?: ShapeOptions) {
    this.#x = initial?.x ?? 0;
    this.#y = initial?.y ?? 0;
  }

  get position() {
    return {
      x: this.#x,
      y: this.#y,
    };
  }

  move(x: number, y: number) {
    this.#x = x;
    this.#y = y;
  }
}
