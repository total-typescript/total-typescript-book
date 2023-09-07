namespace GeometryUtils {
  export namespace Rectangle {
    export interface Rectangle {
      width: number;
      height: number;
    }
  }
}

namespace GeometryUtils {
  export namespace Rectangle {
    export interface Rectangle {
      color: string;
    }
  }
}

// @ts-expect-error color required!
const rect: GeometryUtils.Rectangle.Rectangle = {
  width: 10,
  height: 20,
};

const rect2: GeometryUtils.Rectangle.Rectangle = {
  width: 10,
  height: 20,
  color: "red",
};
