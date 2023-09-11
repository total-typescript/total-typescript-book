const isProblemOrSolution = (filename: string): boolean => {
  const splitFilename: string[] = filename.split(".");

  const finalIndex: number = splitFilename.length - 1;

  const extension: string | undefined = splitFilename[finalIndex];

  const isProblem: boolean = extension === "problem";

  const isSolution: boolean = extension === "solution";

  return isProblem || isSolution;
};

type test1 = Expect<
  Equal<typeof isProblemOrSolution, (filename: string) => boolean>
>;

const users: {
  name: string;
}[] = [
  {
    name: "Waqas",
  },
  {
    name: "Zain",
  },
];

const usersWithIds: {
  id: number;
  name: string;
}[] = users.map(
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
