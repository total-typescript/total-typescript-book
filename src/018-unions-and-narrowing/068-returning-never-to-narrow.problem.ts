import { Equal, Expect } from "@total-typescript/helpers";

const throwError = (message: string): undefined => {
  throw new Error(message);
};

const handleSearchParams = (params: { id?: string }) => {
  const id = params.id || throwError("No id provided");

  type test = Expect<Equal<typeof id, string>>;

  return id;
};
