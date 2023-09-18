const main = async () => {
  const esModule = await import("./esm-module.js"); // Dynamic import

  esModule.default();
};

main();
