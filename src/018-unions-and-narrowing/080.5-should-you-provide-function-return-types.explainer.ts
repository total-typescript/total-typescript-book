// 1. CON: Function return types can be wider than
// what is actually returned

import { Equal, Expect } from "@total-typescript/helpers";

const returnsStringOrNumber = (): string | number => {
  return 1;
};

const value = returnsStringOrNumber();

if (typeof value === "string") {
  type test = Expect<Equal<typeof value, never>>;

  // @ts-expect-error
  value.toUpperCase();
}

// 2. PRO: Function return types can help enforce the type of the function

type UserRole = "admin" | "editor" | "viewer";

function getPermissions(role: UserRole): string[] {
  switch (role) {
    case "admin":
      return ["create", "read", "update", "delete"];
    case "editor":
      return ["create", "read", "update"];
    // case "viewer":
    //   return ["read"];
  }
}
