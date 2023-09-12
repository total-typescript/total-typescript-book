# Title

Title here!

## Exercises

- Global Scope vs Isolated Modules

- Namespaces: TypeScript’s solution to modules

  - Namespaces are a way to organize code into named objects that can span multiple files
    - How namespaces compile in JavaScript

- Should I use namespaces?

  - Namespaces are not recommended for modern code because they have drawbacks:
    - Harder dependency management
    - Not compatible with some module loaders and bundlers
  - Modules are the native and standard way to organize code
    - Better reuse, isolation, and tooling support

- Ambient Context in TypeScript
  - Term for the situation where TS declarations are used to describe the types and values of libraries or environments that are not written in TypeScript.
  - Use the `declare` keyword to indicate they don’t provide an implementation
  - Typically written in `.d.ts` files
