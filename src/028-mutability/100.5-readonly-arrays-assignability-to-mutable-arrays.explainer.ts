function printNamesReadonly(names: readonly string[]) {
  for (const name of names) {
    console.log(name);
  }
}

function printNamesMutable(names: string[]) {
  for (const name of names) {
    console.log(name);
  }
}

// Mutable arrays are assignable to readonly arrays

const mutableNames = ["John", "Jane", "Mike"];

printNamesReadonly(mutableNames);
printNamesMutable(mutableNames);

// Readonly arrays are NOT assignable to mutable arrays

const readonlyNames = ["John", "Jane", "Mike"] as const;

printNamesReadonly(readonlyNames);
printNamesMutable(readonlyNames);
