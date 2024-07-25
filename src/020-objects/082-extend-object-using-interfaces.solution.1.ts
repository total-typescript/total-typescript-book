import { Extends, Expect } from "@total-typescript/helpers";

interface BaseEntity {
  id: string;
  createdAt: Date;
  name: string;
}

interface User extends BaseEntity {
  email: string;
}

interface Product extends BaseEntity {
  price: number;
}

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
