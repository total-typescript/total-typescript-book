interface Attributes {
  firstName: string;
  lastName: string;
  age: number;
}

type AttributeGetters = {
  [K in keyof Attributes]: () => Attributes[K];
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
