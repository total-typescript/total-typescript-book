const createStringMap = <T = string>() => {
  return new Map<string, T>();
};

const stringMap = createStringMap();

stringMap.set("foo", "bar");

stringMap.set(
  "bar",
  // @ts-expect-error
  123,
);

const numberMap = createStringMap<number>();

numberMap.set("foo", 123);
numberMap.set(
  "bar",
  // @ts-expect-error
  true,
);

const objMap = createStringMap<{ a: number }>();

objMap.set("foo", { a: 123 });

objMap.set(
  "bar",
  // @ts-expect-error
  { b: 123 },
);
