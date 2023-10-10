import { Equal, Expect } from "@total-typescript/helpers";

const fetchUser = async (id: string) => {
  return {
    id,
    name: "John Doe",
    email: "example@email.com",
  };
};

type User = Awaited<ReturnType<typeof fetchUser>>;

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
