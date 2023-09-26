// You can use go to definition to jump to the definition of something

const myFunction = () => {
  console.log("Hello!");
};

myFunction();

// This can work across files, too:

import { hiThere } from "./dummy-import";

hiThere();

// As well as on types:

type Example = PropertyKey;

// It can also take you to mysterious places:

document;
