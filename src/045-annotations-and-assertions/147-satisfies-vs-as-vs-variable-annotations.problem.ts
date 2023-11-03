import { Equal, Expect } from "@total-typescript/helpers";

// 1

const obj = {} as Record<string, number>;

obj.a = 1;

obj.b = 2;

type test = Expect<Equal<typeof obj.a, number>>;

// 2

const menuConfig: Record<
  string,
  | {
      label: string;
      link: string;
    }
  | {
      label: string;
      children: {
        label: string;
        link: string;
      }[];
    }
> = {
  home: {
    label: "Home",
    link: "/home",
  },
  services: {
    label: "Services",
    children: [
      {
        label: "Consulting",
        link: "/services/consulting",
      },
      {
        label: "Development",
        link: "/services/development",
      },
    ],
  },
};

type tests = [
  Expect<Equal<typeof menuConfig.home.label, string>>,
  Expect<
    Equal<
      typeof menuConfig.services.children,
      {
        label: string;
        link: string;
      }[]
    >
  >,
];

// 3

const element = document.getElementById("app") satisfies HTMLElement;

type test3 = Expect<Equal<typeof element, HTMLElement>>;
