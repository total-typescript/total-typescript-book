import { Expect, Equal } from "@total-typescript/helpers";
import { expect, it } from "vitest";

const concatName = (user: { first: string; last: string }) => {
  if (!user.last) {
    return user.first;
  }
  return `${user.first} ${user.last}`;
};

it("should return the full name", () => {
  const result = concatName({
    first: "John",
    last: "Doe",
  });

  type test = Expect<Equal<typeof result, string>>;

  expect(result).toEqual("John Doe");
});

it("should only return the first name if last name not provided", () => {
  const result = concatName({
    first: "John",
  });

  type test = Expect<Equal<typeof result, string>>;

  expect(result).toEqual("John");
});
