function add(this: { x: number; y: number }) {
  return this.x + this.y;
}

function setValues(this: { x: number; y: number }, x: number, y: number) {
  this.x = x;
  this.y = y;
}

const calculator = {
  x: 0,
  y: 0,

  add,

  setValues,
};
