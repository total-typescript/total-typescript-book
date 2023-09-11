// TODO - make this simpler, no need for visual metaphor.

// You can move up or down as the tree as far as you like with 'as',
// but not 'across'

const num1 = "hello" as number;

// You can turn 'unknown' into anything, or anything into 'unknown':

const num2 = "hello" as never | {} as number;

// You can turn 'never' into anything, or anything into 'never'!
const iAmNever = undefined as never;

const yeah = iAmNever as number;

// You can turn any object into almost any other object

const obj = {
  a: 123,
} as {
  b: string;
};

// Oddly, literals are more permissive!
const str1 = "wow";

const hello: "hello" = str1 as "hello";
