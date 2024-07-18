import { Extends, Expect } from "@total-typescript/helpers";

interface WithId {
  id: string;
}

interface WithName {
  name: string;
}

interface WithCreatedAt {
  createdAt: Date;
}

interface User extends WithId, WithName, WithCreatedAt {
  email: string;
}

interface Product extends WithId, WithName, WithCreatedAt {
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
