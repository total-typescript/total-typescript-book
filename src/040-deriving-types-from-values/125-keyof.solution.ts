import { Equal, Expect } from "@total-typescript/helpers";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const inputs: Record<
  keyof FormValues,
  {
    initialValue: string;
    label: string;
  }
> = {
  name: {
    initialValue: "",
    label: "Name",
  },
  email: {
    initialValue: "",
    label: "Email",
  },
  password: {
    initialValue: "",
    label: "Password",
  },
};

type test = Expect<
  Equal<
    typeof inputs,
    {
      name: {
        initialValue: string;
        label: string;
      };
      email: {
        initialValue: string;
        label: string;
      };
      password: {
        initialValue: string;
        label: string;
      };
    }
  >
>;
