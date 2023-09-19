import { it } from "vitest";

const Method = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

const request = (url: string, method: "GET" | "POST" | "PUT" | "DELETE") => {
  // ...
};

it("Should force you to use the enum values", () => {
  request(
    "https://example.com",
    // @ts-expect-error
    "GET",
  );

  request(
    "https://example.com",
    // @ts-expect-error
    "POST",
  );

  request("https://example.com", Method.GET);
  request("https://example.com", Method.POST);
});

it("Should give you an error if you pass a different enum with the same value", () => {
  enum Method2 {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
  }

  request(
    "https://example.com",
    // @ts-expect-error
    Method2.GET,
  );
});
