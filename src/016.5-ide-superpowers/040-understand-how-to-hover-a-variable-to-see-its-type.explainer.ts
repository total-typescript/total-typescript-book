let thing = 123;

let otherThing = {
  name: "Alice",
};

const otherObject = {
  ...otherThing,
  thing,
};

otherObject.thing;
