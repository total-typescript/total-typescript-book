const idToUppercase = (obj: { id: string }) => {
  return obj.id.toUpperCase();
};
const idToInt = (obj: { id: string }) => {
  return parseInt(obj.id);
};

const funcs = [idToUppercase, idToInt];

const resolveAll = (obj: { id: string }) => {
  return funcs.map((func) => {
    return func(obj);
  });
};
