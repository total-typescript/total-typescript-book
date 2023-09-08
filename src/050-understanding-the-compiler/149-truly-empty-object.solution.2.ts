// From https://github.com/sindresorhus/type-fest/issues/395#issuecomment-1162156994
declare const tag: unique symbol;
type EmptyObject = { [tag]?: never };

const acceptOnlyEmptyObject = (input: Record<PropertyKey, never>) => {};

acceptOnlyEmptyObject({});

acceptOnlyEmptyObject({
  // @ts-expect-error
  a: 1,
});
acceptOnlyEmptyObject(
  // @ts-expect-error
  "hello",
);
acceptOnlyEmptyObject(
  // @ts-expect-error
  42,
);
acceptOnlyEmptyObject(
  // @ts-expect-error
  true,
);
acceptOnlyEmptyObject(
  // @ts-expect-error
  Symbol("foo"),
);
acceptOnlyEmptyObject(
  // @ts-expect-error
  [],
);
acceptOnlyEmptyObject(
  // @ts-expect-error
  () => {},
);
acceptOnlyEmptyObject(
  // @ts-expect-error
  /foo/,
);
acceptOnlyEmptyObject(
  // @ts-expect-error
  new Error("foo"),
);
acceptOnlyEmptyObject(
  // @ts-expect-error
  null,
);
acceptOnlyEmptyObject(
  // @ts-expect-error
  undefined,
);
