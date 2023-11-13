import { Equal, Expect } from "@total-typescript/helpers";
import { expect, it } from "vitest";

type PromiseFunc = () => Promise<any>;

const safeFunction = (func: PromiseFunc) => async () => {
  try {
    const result = await func();
    return result;
  } catch (e) {
    if (e instanceof Error) {
      return e;
    }
    throw e;
  }
};

it("should return an error if the function throws", async () => {
  const func = safeFunction(async () => {
    if (Math.random() > 0.5) {
      throw new Error("Something went wrong");
    }
    return 123;
  });

  type test1 = Expect<Equal<typeof func, () => Promise<Error | number>>>;

  const result = await func();

  type test2 = Expect<Equal<typeof result, Error | number>>;
});

it("should return the result if the function succeeds", async () => {
  const func = safeFunction(() => {
    return Promise.resolve(`Hello!`);
  });

  type test1 = Expect<Equal<typeof func, () => Promise<string | Error>>>;

  const result = await func();

  type test2 = Expect<Equal<typeof result, string | Error>>;

  expect(result).toEqual("Hello!");
});
