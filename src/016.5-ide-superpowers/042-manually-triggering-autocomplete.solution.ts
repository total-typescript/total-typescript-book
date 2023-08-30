type MyObj = {
  foo: string;
  bar: number;
  baz: boolean;
};

const acceptsObj = (obj: MyObj) => {};

acceptsObj({
  foo: "hello",
  bar: 123,
  baz: true,
});

document.addEventListener(
  // Autocomplete this string!
  "",
  (event) => {
    console.log(event);
  },
);
