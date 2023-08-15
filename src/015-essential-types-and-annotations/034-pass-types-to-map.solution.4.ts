type User = {
  name: string;
  age: number;
};

const userMap: Map<number, User> = new Map();

userMap.set(1, { name: "Max", age: 30 });
userMap.set(2, { name: "Manuel", age: 31 });

// @ts-expect-error
userMap.set("3", { name: "Anna", age: 29 });

// @ts-expect-error
userMap.set(3, "123");
