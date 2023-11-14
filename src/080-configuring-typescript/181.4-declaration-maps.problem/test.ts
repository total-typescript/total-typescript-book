import { myFunc } from "./dist/index.js";

myFunc("Hello world");

myFunc(
  // @ts-expect-error
  123,
);
