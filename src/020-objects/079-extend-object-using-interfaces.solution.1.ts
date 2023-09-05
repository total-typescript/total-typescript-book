interface BaseEntity {
  id: string;
  createdAt: Date;
}

interface User extends BaseEntity {
  name: string;
  email: string;
}

interface Product extends BaseEntity {
  name: string;
  price: number;
}

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
