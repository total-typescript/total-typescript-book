import { Equal, Expect } from "@total-typescript/helpers";

import pngUrl1 from "./example1.png";
import pngUrl2 from "./example2.png";
import pngUrl3 from "./example3.png";
import pngUrl4 from "./example4.png";

type test = [
  Expect<Equal<typeof pngUrl1, string>>,
  Expect<Equal<typeof pngUrl2, string>>,
  Expect<Equal<typeof pngUrl3, string>>,
  Expect<Equal<typeof pngUrl4, string>>,
];
