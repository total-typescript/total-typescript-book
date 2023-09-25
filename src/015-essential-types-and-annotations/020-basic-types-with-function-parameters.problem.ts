import { Expect, Equal } from "@total-typescript/helpers";

// CODE

const add = (a: boolean, b: boolean) => {
  return a + b;
};

// TESTS

const result = add(1, 2);

type test = Expect<Equal<typeof result, number>>;
