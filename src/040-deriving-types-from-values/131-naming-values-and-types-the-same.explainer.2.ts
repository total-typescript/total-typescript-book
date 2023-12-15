import { Logger } from "./131-naming-values-and-types-the-same.explainer.1";

const myApp = (logger: Logger) => {
  logger.log("Hello");
  logger.info("Hello");
  logger.warn("Hello");
  logger.error("Hello");
};

myApp(Logger);
