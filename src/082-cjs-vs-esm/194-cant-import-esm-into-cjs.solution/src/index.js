// const esModule = require("./esm-module.js"); // cjs require

const main = async () => {
  const esModule = await import("./esm-module.mjs");
  esModule.default();
};

main();
