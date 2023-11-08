import { Equal, Expect } from "@total-typescript/helpers";

type ErrorShape = {
  error: {
    message: string;
  };
};

/**
 * The data shape we get back from the API
 */
type DataShape<TData> =
  | {
      data: TData;
    }
  | ErrorShape;

type UserDataShape = DataShape<{
  id: string;
  name: string;
  email: string;
}>;

type PostDataShape = DataShape<{
  id: string;
  title: string;
  body: string;
}>;

// TESTS

type tests = [
  Expect<
    Equal<
      UserDataShape,
      | {
          data: {
            id: string;
            name: string;
            email: string;
          };
        }
      | {
          error: {
            message: string;
          };
        }
    >
  >,
  Expect<
    Equal<
      PostDataShape,
      | {
          data: {
            id: string;
            title: string;
            body: string;
          };
        }
      | {
          error: {
            message: string;
          };
        }
    >
  >,
];
