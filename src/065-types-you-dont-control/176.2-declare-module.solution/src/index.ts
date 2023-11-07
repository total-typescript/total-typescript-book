import { Equal, Expect } from "@total-typescript/helpers";

import { myModuleFunc } from "my-module";

type test = Expect<Equal<typeof myModuleFunc, () => void>>;
