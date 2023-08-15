// CODE

const add = (a: number, b: number) => {
  return a + b;
};

// TESTS

const result = add(1, 2);

type test = Expect<Equal<typeof result, number>>;
