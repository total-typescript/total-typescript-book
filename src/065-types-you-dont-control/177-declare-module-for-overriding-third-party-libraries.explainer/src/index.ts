import { type Equal, type Expect } from "@total-typescript/helpers";
import { z } from "zod";

const user = z.object({
  name: z.string(),
});

type Test = Expect<Equal<typeof user, any>>;
