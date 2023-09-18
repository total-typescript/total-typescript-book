const main = async () => {
  const esModule = await import("./esm-module.mjs"); // Dynamic import

  esModule.default();
};

main();
