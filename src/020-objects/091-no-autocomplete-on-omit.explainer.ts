type User = {
  id: number;
  name: string;
  email: string;
};

// You can omit properties which don't exist!
// TODO - find reasoning for this behaviour
type UserWithoutPhoneNumber = Omit<User, "phoneNumber">;

// But you CAN'T pick properties which don't exist
type UserWithOnlyPhoneNumber = Pick<
  User,
  // @ts-expect-error
  "phoneNumber"
>;
