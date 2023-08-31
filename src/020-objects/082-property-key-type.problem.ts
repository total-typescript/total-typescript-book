type MyType = string | number | boolean;

type TypeWithIndexSignature = {
  [key: MyType]: {
    id: string;
  };
};
