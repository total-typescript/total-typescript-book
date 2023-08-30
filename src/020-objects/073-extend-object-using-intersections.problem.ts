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
