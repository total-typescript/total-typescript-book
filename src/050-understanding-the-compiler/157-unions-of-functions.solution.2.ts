const objOfFunctions = {
  string: (input: string) => input.toUpperCase(),
  number: (input: number) => input.toFixed(2),
  boolean: (input: boolean) => (input ? "true" : "false"),
};

const format = (input: string | number | boolean) => {
  if (typeof input === "string") {
    return objOfFunctions.string(input);
  } else if (typeof input === "number") {
    return objOfFunctions.number(input);
  } else {
    return objOfFunctions.boolean(input);
  }
};
