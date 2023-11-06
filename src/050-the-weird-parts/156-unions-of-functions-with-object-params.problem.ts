import { expect, it, vitest } from "vitest";

const logId = (obj: { id: string }) => {
  console.log(obj.id);
};
const logName = (obj: { name: string }) => {
  console.log(obj.name);
};

const loggers = [logId, logName];

const logAll = (obj) => {
  loggers.forEach((func) => func(obj));
};

it("should log id and name of an object", () => {
  const consoleSpy = vitest.spyOn(console, "log");

  logAll({ id: "1", name: "Waqas" });

  expect(consoleSpy).toHaveBeenCalledWith("1");
  expect(consoleSpy).toHaveBeenCalledWith("Waqas");
});
