import { Equal, Expect } from "@total-typescript/helpers";

interface Attributes {
  firstName: string;
  lastName: string;
  age: number;
}

type AttributeGetters = {
  [K in keyof Attributes as `get${Capitalize<K>}`]: () => Attributes[K];
};

type tests = [
  Expect<
    Equal<
      AttributeGetters,
      {
        getFirstName: () => string;
        getLastName: () => string;
        getAge: () => number;
      }
    >
  >,
];
