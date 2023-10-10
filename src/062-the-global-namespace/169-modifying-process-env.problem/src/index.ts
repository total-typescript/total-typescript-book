import { Equal, Expect } from "@total-typescript/helpers";

const envVariable = process.env.MY_ENV_VAR;

type test = Expect<Equal<typeof envVariable, string>>;
