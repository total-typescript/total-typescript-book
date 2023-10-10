import { Extends, Expect } from "@total-typescript/helpers";

type User = {
  id: string;
  createdAt: Date;
  name: string;
  email: string;
};

type Product = {
  id: string;
  createdAt: Date;
  name: string;
  price: number;
};

type tests = [
  Expect<
    Extends<
      {
        id: string;
        createdAt: Date;
        name: string;
        email: string;
      },
      User
    >
  >,
  Expect<
    Extends<
      {
        id: string;
        createdAt: Date;
        name: string;
        price: number;
      },
      Product
    >
  >,
];
