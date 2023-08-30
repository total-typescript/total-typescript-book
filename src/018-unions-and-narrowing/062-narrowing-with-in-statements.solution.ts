import { expect, it } from "vitest";

type APIResponse =
  | {
      data: {
        id: string;
      };
    }
  | {
      error: string;
    };

const handleResponse = (response: APIResponse) => {
  if ("data" in response) {
    return response.data.id;
  } else {
    throw new Error(response.error);
  }
};

it("Should handle a response with data", () => {
  const response = {
    data: {
      id: "123",
    },
  };

  expect(handleResponse(response)).toBe("123");
});

it("Should handle a response with an error", () => {
  const response = {
    error: "Something went wrong",
  };

  expect(() => handleResponse(response)).toThrow("Something went wrong");
});
