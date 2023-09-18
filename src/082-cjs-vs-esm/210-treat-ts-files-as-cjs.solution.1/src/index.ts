// @ts-expect-error
import otherModule from "./other-module.js";

const main = async () => {
  otherModule();
};

main();
