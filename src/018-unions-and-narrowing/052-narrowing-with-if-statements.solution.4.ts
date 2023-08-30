import { expect, it } from "vitest";

function validateUsername(username: string | null): boolean {
  if (typeof username === "object") {
    return false;
  }

  return username.length > 5;
}

it("should return true for valid usernames", () => {
  expect(validateUsername("Matt1234")).toBe(true);

  expect(validateUsername("Alice")).toBe(false);
  expect(validateUsername("Bob")).toBe(false);
});

it("Should return false for null", () => {
  expect(validateUsername(null)).toBe(false);
});
