type Direction = "up" | "down" | "left" | "right";

function move(direction: Direction, distance: number) {}

// TESTS

move("up", 10);
move("left", 5);

move(
  // @ts-expect-error - "up-right" is not a valid direction
  "up-right",
  10,
);

move(
  // @ts-expect-error - "down-left" is not a valid direction
  "down-left",
  20,
);

move(
  "up",
  // @ts-expect-error - "20" is not a valid distance
  "20",
);
