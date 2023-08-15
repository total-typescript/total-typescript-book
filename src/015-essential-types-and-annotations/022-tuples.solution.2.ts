const setRange = (range: [x: number, y: number]) => {
  const x = range[0];
  const y = range[1];

  // Do something with x and y in here

  type tests = [
    Expect<Equal<typeof x, number>>,
    Expect<Equal<typeof y, number>>,
  ];
};

setRange([0, 10]);

// @ts-expect-error string is not assignable to number
setRange([0, "10"]);

// @ts-expect-error too few arguments
setRange([0]);

// @ts-expect-error too many arguments
setRange([0, 10, 20]);
