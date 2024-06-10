const acceptsCallback = (callback: () => void) => {
  callback();
};

const returnString = () => {
  return "Hello!";
};

acceptsCallback(returnString);
