function add() {
  return this.x + this.y;
}

const setValues = (x: number, y: number) => {
  this.x = x;
  this.y = y;
};

const calculator = {
  x: 0,
  y: 0,

  add,

  setValues,
};
