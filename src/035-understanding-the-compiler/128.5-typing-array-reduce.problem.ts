// TODO

// Discuss how to solve the following problem:

// Discuss that sometimes you want to give more information to the type system

const array = [
  {
    name: "John",
  },
  {
    name: "Steve",
  },
];

const obj = array.reduce((accum, item) => {
  accum[item.name] = item;
  return accum;
}, {});
