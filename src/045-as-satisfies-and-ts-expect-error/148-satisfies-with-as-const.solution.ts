import { Equal, Expect } from "@total-typescript/helpers";

const routes = {
  "/": {
    component: "Home",
  },
  "/about": {
    component: "About",
    // @ts-expect-error
    search: "?foo=bar",
  },
} as const satisfies Record<
  string,
  {
    component: string;
  }
>;

// @ts-expect-error
routes["/"].component = "About";

type tests = [
  Expect<Equal<(typeof routes)["/"]["component"], "Home">>,
  Expect<Equal<(typeof routes)["/about"]["component"], "About">>,
];
