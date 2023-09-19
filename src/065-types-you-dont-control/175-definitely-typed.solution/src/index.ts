import Diff from "diff";

const message = "Hello, world!";

const secondMessage = "Goodbye, world!";

const diff = Diff.diffChars(message, secondMessage);

type test = Expect<
  Equal<
    typeof diff,
    {
      count?: number;
      value: string;
      added?: boolean;
      removed?: boolean;
    }[]
  >
>;
