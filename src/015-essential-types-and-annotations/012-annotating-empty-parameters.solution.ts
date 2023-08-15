// CODE

const concatTwoStrings = (a: string, b: string) => {
  return [a, b].join(" ");
};

// TESTS

const result = concatTwoStrings("Hello", "World");

type test = Expect<Equal<typeof result, string>>;
