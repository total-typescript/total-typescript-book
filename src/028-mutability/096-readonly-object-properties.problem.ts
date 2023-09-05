type User = {
  id: number;
  name: string;
  age: number;
};

const updateUser = (user: User) => {
  user.name = "Jane Doe";
  user.age = 30;

  // @ts-expect-error Should not be able to modify readonly
  user.id = 1;
};
