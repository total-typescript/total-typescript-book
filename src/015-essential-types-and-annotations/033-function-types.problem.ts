type User = {
  id: string;
  name: string;
};

const modifyUser = (users: User[], id: string, makeChange) => {
  return users.map((u) => {
    if (u.id === id) {
      return makeChange(u);
    }
    return u;
  });
};

const users: User[] = [
  { id: "1", name: "John" },
  { id: "2", name: "Jane" },
];

modifyUser(users, "1", (user) => {
  return { ...user, name: "Waqas" };
});

modifyUser(
  users,
  "1",
  // @ts-expect-error
  (user) => {
    return { ...user, name: 123 };
  },
);
