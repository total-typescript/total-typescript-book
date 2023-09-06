const isProblemOrSolution = (filename: string) => {
  const splitFilename = filename.split(".");

  const finalIndex = splitFilename.length - 1;

  const extension = splitFilename[finalIndex];

  const isProblem = extension === "problem";

  const isSolution = extension === "solution";

  return isProblem || isSolution;
};

type test1 = Expect<
  Equal<typeof isProblemOrSolution, (filename: string) => boolean>
>;

const users = [
  {
    name: "Waqas",
  },
  {
    name: "Zain",
  },
];

const usersWithIds = users.map(
  (
    user: {
      name: string;
    },
    index: number,
  ) => ({
    ...user,
    id: index,
  }),
);

type test2 = Expect<
  Equal<
    typeof usersWithIds,
    {
      id: number;
      name: string;
    }[]
  >
>;
