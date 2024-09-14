import { Extends, Expect } from "@total-typescript/helpers";

type BaseEntity = {
  id: string;
  createdAt: Date;
  name: string;
};

type User = {
  email: string;
} & BaseEntity;

type Product = {
  price: number;
} & BaseEntity;

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
