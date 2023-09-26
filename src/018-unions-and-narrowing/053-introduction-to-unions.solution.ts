import { Equal, Expect } from "@total-typescript/helpers";

function getUsername(username: string | null) {
  if (username !== null) {
    return `User: ${username}`;
  } else {
    return "Guest";
  }
}

// TESTS

const result = getUsername("Alice");
type test = Expect<Equal<typeof result, string>>;

const result2 = getUsername(null);
type test2 = Expect<Equal<typeof result2, string>>;
