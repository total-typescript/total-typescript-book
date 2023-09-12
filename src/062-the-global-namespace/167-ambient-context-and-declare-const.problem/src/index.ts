const state = DEBUG.getState();

type test = Expect<Equal<typeof state, { id: string }>>;
