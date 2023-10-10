import { Equal, Expect } from "@total-typescript/helpers";

import { MyInterface, MyType } from "./can-export-types";

type test = Expect<Equal<MyType, string>>;
type test2 = Expect<Equal<MyInterface, { myProp: string }>>;
