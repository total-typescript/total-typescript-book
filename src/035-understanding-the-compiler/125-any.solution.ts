import { expect, it } from "vitest";

const handleFormData = (e: any) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const value = Object.fromEntries(data.entries());
  return value;
};

it("Should handle a form submit", () => {
  const form = document.createElement("form");
  form.innerHTML = `
    <input name="name" value="John Doe" />
  `;

  form.onsubmit = (e) => {
    const value = handleFormData(e);
    expect(value).toEqual({ name: "John Doe" });
  };

  form.requestSubmit();

  expect.assertions(1);
});
