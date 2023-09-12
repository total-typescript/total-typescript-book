import { myModuleFunc } from "my-module";

type test = Expect<Equal<typeof myModuleFunc, () => void>>;
