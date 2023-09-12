const esmModule = require("./esm-module.mjs"); // cjs require
// import esmModule from "./esm-module.mjs"; // esm import

const main = async () => {
  // const esmModule = await import("./esm-module.mjs"); // Dynamic import

  esmModule();
};
