interface User {
  id: number;
  name: string;
}

function printUser(user: Record<string, any>) {
  Object.keys(user).forEach((key) => {
    console.log(user[key]);
  });
}
