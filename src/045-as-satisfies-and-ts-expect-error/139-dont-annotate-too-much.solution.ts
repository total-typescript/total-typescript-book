import { Equal, Expect } from "@total-typescript/helpers";

// CODE

const isProblemOrSolution = (filename: string) => {
  const splitFilename = filename.split(".");

  const finalIndex = splitFilename.length - 1;

  const extension = splitFilename[finalIndex];

  const isProblem = extension === "problem";

  const isSolution = extension === "solution";

  return isProblem || isSolution;
};

// TESTS

type test1 = Expect<
  Equal<typeof isProblemOrSolution, (filename: string) => boolean>
>;

// CODE

const users = [
  {
    name: "Waqas",
  },
  {
    name: "Zain",
  },
];

const usersWithIds = users.map((user, index) => ({
  ...user,
  id: index,
}));

// TESTS

type test2 = Expect<
  Equal<
    typeof usersWithIds,
    {
      id: number;
      name: string;
    }[]
  >
>;
