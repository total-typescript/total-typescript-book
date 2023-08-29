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
      User,
      {
        id: string;
        createdAt: Date;
        name: string;
        email: string;
      }
    >
  >,
  Expect<
    Extends<
      Product,
      {
        id: string;
        createdAt: Date;
        name: string;
        price: number;
      }
    >
  >,
];
