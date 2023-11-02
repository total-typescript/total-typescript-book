# Fast Track

## Section 1

### 125 - keyof

There is some duplication between the definition for `inputs` and `FormValues`. `name`, `email` and `password` are duplicated between them.

See if you can use `keyof` to derive one from the other.

https://www.typescriptlang.org/docs/handbook/2/keyof-types.html

### 126 - typeof

`Environment` is defined as a type, and contains `development`, `staging` and `production`. `configurations` is an object with the same keys.

See if you can use `typeof` and `keyof` to derive `Environment` from `configurations`.

https://www.typescriptlang.org/docs/handbook/2/typeof-types.html

### 132 - Parameters Type Helper

Imagine you don't control the `makeQuery` function, but you want to extract the type of its parameters to `MakeQueryParameters`.

Use the `Parameters` type helper (and `typeof`) to do this.

https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype

### 133 - ReturnType Type Helper

### 134 - Awaited Type Helper

### 135 - Indexed Access Types

### 136 - Passing Unions To Indexed Access Types

### 137 - Pass `keyof` to an Indexed Access Type
