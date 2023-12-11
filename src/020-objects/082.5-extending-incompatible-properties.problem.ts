type UserPart = {
  id: string;
  name: string;
  age: number;
};

type UserPart2 = {
  id: number;
  phone: string;
};

type User = UserPart & UserPart2;

const user: User = {
  id: "1",
  name: "John",
  age: 20,
  phone: "123456789",
};
