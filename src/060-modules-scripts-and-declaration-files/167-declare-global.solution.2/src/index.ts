import { Equal, Expect } from "@total-typescript/helpers";

const state = DEBUG.getState();

type test = Expect<Equal<typeof state, { id: string }>>;
