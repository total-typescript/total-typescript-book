import { Extends, Expect } from "@total-typescript/helpers";

type BaseEntity = {
  id: string;
  createdAt: Date;
};

type User = {
  name: string;
  email: string;
} & BaseEntity;

type Product = {
  name: string;
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
