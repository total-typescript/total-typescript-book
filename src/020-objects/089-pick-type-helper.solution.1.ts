import { Equal, Expect } from "@total-typescript/helpers";

interface NameAndEmail {
  name: string;
  email: string;
}

interface User extends NameAndEmail {
  id: string;
  role: string;
}

const fetchUser = async (): Promise<NameAndEmail> => {
  const response = await fetch("/api/user");
  const user = await response.json();
  return user;
};

const example = async () => {
  const user = await fetchUser();

  type test = Expect<Equal<typeof user, { name: string; email: string }>>;
};
