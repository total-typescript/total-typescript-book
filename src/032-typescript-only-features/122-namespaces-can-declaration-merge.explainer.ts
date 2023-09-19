namespace GeometryUtils {
  export namespace Circle {
    export function calculateArea(radius: number) {
      // implementation
    }

    export function calculateCircumference(radius: number) {
      // implementation
    }
  }
}

namespace GeometryUtils {
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

// All must be exported or none
// Can't be on different scopes
