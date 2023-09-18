const hello = () => {
  console.log("Hello!");
};

// @ts-expect-error
export default hello;
