import { Equal, Expect } from "@total-typescript/helpers";

import { AvailableViaImport } from "./treated-as-module";

type tests = [
  Expect<Equal<GloballyAvailable, string>>,
  Expect<Equal<AvailableViaImport, string>>,
];
