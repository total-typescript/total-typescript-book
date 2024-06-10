const acceptsCallback = (callback: () => undefined) => {
  callback();
};

const returnString = () => {
  return "Hello!";
};

acceptsCallback(returnString);
