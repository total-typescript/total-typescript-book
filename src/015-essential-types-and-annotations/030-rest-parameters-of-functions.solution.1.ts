import { Expect, Equal } from "@total-typescript/helpers";
import { expect, it } from "vitest";

export function concatenate(...strings: string[]): string {
  return strings.join("");
}

it("should concatenate strings", () => {
  const result = concatenate("Hello", " ", "World");
  expect(result).toEqual("Hello World");

  type test = Expect<Equal<typeof result, string>>;
});
