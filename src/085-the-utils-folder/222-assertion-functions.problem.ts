import { Equal, Expect } from "@total-typescript/helpers";
import { expect, it } from "vitest";

interface User {
  id: string;
  name: string;
}

interface AdminUser extends User {
  roles: string[];
}

function assertIsAdminUser(user: User | AdminUser) {
  if (!("roles" in user)) {
    throw new Error("User is not an admin");
  }
}

const handleRequest = (user: User | AdminUser) => {
  type test1 = Expect<Equal<typeof user, User | AdminUser>>;

  assertIsAdminUser(user);

  type test2 = Expect<Equal<typeof user, AdminUser>>;

  user.roles;
};

it("Should error if you pass a user", () => {
  expect(() => {
    handleRequest({ id: "1", name: "Bob" });
  }).toThrowError("User is not an admin");
});

it("Should pass if you pass an admin user", () => {
  handleRequest({ id: "1", name: "Bob", roles: ["admin"] });
});
