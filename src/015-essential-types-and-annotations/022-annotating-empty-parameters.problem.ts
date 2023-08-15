// CODE

const concatTwoStrings = (a, b) => {
  return [a, b].join(" ");
};

// TESTS

const result = concatTwoStrings("Hello", "World");

type test = Expect<Equal<typeof result, string>>;
