interface WithId {
  id: string;
}

interface WithCreatedAt {
  createdAt: Date;
}

interface User extends WithId, WithCreatedAt {
  name: string;
  email: string;
}

interface Product extends WithId, WithCreatedAt {
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
