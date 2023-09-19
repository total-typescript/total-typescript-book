// From type-transformations

type BreadType = "rye" | "brown" | "white";

type Filling = "cheese" | "ham" | "salami";

type Sandwich = unknown;

type tests = [
  Expect<
    Equal<
      Sandwich,
      | "rye sandwich with cheese"
      | "rye sandwich with ham"
      | "rye sandwich with salami"
      | "brown sandwich with cheese"
      | "brown sandwich with ham"
      | "brown sandwich with salami"
      | "white sandwich with cheese"
      | "white sandwich with ham"
      | "white sandwich with salami"
    >
  >,
];
