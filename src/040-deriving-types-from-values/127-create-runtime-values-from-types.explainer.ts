// We can create types from values...

const user = {
  id: 1,
  name: "Waqas",
};

type UserFromValue = typeof user;

// ...so why not values from types?

interface User {
  id: number;
  name: string;
}

// Can we do this?
// const user = valueof User;
