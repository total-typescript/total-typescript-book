import { expect, it, vitest } from "vitest";

interface User {
  id: number;
  name: string;
}

function printUser(user: User) {
  for (const key in user) {
    console.log(user[key as keyof User]);
  }
}

it("Should log all the keys of the user", () => {
  const consoleSpy = vitest.spyOn(console, "log");

  printUser({
    id: 1,
    name: "Waqas",
  });

  expect(consoleSpy).toHaveBeenCalledWith(1);
  expect(consoleSpy).toHaveBeenCalledWith("Waqas");
});
