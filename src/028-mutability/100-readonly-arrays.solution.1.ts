function printNames(names: readonly string[]) {
  for (const name of names) {
    console.log(name);
  }

  // @ts-expect-error
  names.push("John");

  // @ts-expect-error
  names[0] = "Billy";
}

const names = ["John", "Jane", "Mike"];
printNames(names);
