namespace GeometryUtils {
  export namespace Circle {
    export function calculateArea(radius: number) {
      // implementation
    }

    export function calculateCircumference(radius: number) {
      // implementation
    }
  }

  export namespace Rectangle {
    export interface Rectangle {
      width: number;
      height: number;
    }
    export function calculateArea(rect: Rectangle) {
      // implementation
    }

    export function calculatePerimeter(rect: Rectangle) {
      // implementation
    }
  }
}

// Can be used as values...
GeometryUtils.Circle.calculateArea(10);

// ...or as types
const rect: GeometryUtils.Rectangle.Rectangle = {
  width: 10,
  height: 20,
};
