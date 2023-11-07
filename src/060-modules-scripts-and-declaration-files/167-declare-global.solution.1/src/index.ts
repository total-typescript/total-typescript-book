import { Equal, Expect } from "@total-typescript/helpers";

declare global {
  const DEBUG: {
    getState(): { id: string };
  };
}

const state = DEBUG.getState();

type test = Expect<Equal<typeof state, { id: string }>>;
