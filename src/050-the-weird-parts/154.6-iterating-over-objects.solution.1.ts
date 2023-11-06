interface User {
  id: number;
  name: string;
}

function printUser(user: User) {
  Object.keys(user).forEach((key) => {
    console.log(user[key as keyof User]);
  });
}
