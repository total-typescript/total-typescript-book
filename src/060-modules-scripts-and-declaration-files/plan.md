# Title

Title here!

## Exercises

- `declare` keyword
  - _Used for declaring functions in the module scope that don’t actually exist (useful for third-party packages etc)_
- `declare global`
  - Can be used inside a module declaration file to modify the global scope
    - `declare global { interface String { startsWithHello(): boolean; } }` adds a new method to the String interface in the global scope
  - Namespaces can be used in `declare global` to group related declarations or avoid name conflicts
- `declare module '*'`
  - Syntax used inside a module declaration to declare a module that matches any string
    - `declare module '*' { export var x: number; }` declares a module that exports a variable `x` for any import path
  - Differences inside `.d.ts` files and `.ts` files
