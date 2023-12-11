import { Equal, Expect } from "@total-typescript/helpers";

let selectedId;

selectedId = 123;

type test = Expect<Equal<typeof selectedId, number>>;

selectedId = "123";

type test2 = Expect<Equal<typeof selectedId, string>>;
