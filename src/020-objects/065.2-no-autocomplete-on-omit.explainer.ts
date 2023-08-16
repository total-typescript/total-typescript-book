type User = {
  id: number;
  name: string;
  email: string;
};

// You can omit properties which don't exist!
type UserWithoutPhoneNumber = Omit<User, "phoneNumber">;

// But you CAN'T pick properties which don't exist
type UserWithOnlyPhoneNumber = Pick<
  User,
  // @ts-expect-error
  "phoneNumber"
>;
