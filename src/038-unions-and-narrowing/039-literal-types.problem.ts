function move(direction: string, distance: number) {
  // Move the specified distance in the given direction
}

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
