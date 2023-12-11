type UserPart = {
  id: string;
  name: string;
  age: number;
};

type UserPart2 = {
  id: number;
  phone: string;
};

interface User extends UserPart, UserPart2 {}

const user: User = {
  id: "1",
  name: "John",
  age: 20,
  phone: "123456789",
};
