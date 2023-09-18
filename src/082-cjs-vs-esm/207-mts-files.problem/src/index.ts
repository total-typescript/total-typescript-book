const main = async () => {
  const esmModule = await import("./esm-module.js"); // Dynamic import

  esmModule.default();
};

main();
