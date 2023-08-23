# Title

Title here!

## Exercises

- `tsconfig.json`
  - The file that contains compiler options and the files or folders to compile
  - Nesting `tsconfig.json` inside subfolders
    - Multiple `tsconfig.json` files can be in different subfolders of the project, and each will be treated as a separate project
  - The `extends` property can be used to inherit configuration from another `tsconfig.json` and override or add options.
- My recommended `tsconfig.json`
- Commonly used `tsconfig.json` attributes:
  - `jsx`
  - `strict`
    - `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, etc.
  - `noUncheckedIndexedAccess`
  - `moduleResolution`
  - `declaration` and `declarationMap`
