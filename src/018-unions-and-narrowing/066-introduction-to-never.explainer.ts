// This function returns never, because it never returns!
const getNever = () => {
  throw new Error("This function never returns");
};

// ---------------------------------------------

const fn = (input: never) => {};

// Nothing is assignable to never!
fn("hello");
fn(42);
fn(true);
fn({});
fn([]);
fn(() => {});

// Except for never itself!

fn(getNever());

// ---------------------------------------------

// But we can assign never to anything!

const str: string = getNever();
const num: number = getNever();
const bool: boolean = getNever();
const arr: string[] = getNever();
