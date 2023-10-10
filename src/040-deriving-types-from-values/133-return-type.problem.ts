import { Equal, Expect } from "@total-typescript/helpers";

const createUser = (id: string) => {
  return {
    id,
    name: "John Doe",
    email: "example@email.com",
  };
};

type User = unknown;

type test = Expect<
  Equal<
    User,
    {
      id: string;
      name: string;
      email: string;
    }
  >
>;
