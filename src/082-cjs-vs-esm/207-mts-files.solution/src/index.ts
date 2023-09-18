const main = async () => {
  const esmModule = await import("./esm-module.mjs"); // Dynamic import

  esmModule.default();
};

main();
