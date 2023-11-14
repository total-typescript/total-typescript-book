// API's are NOT transformed

const str = "Hello, world!";

str.replaceAll("Hello", "Goodbye");

// Syntax IS transformed:

const myFunc = (input?: { search?: string }) => {
  // Optional chaining
  const search = input?.search;

  // Nullish coalescing
  const defaultedSearch = search ?? "Hello";
};
