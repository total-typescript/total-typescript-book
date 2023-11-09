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

## Section 2

### 132 - Parameters Type Helper

Imagine you don't control the `makeQuery` function, but you want to extract the type of its parameters to `MakeQueryParameters`.

Use the `Parameters` type helper (and `typeof`) to do this.

https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype

### 133 - ReturnType Type Helper

Imagine you don't control the `createUser` function, but you want to extract the type of its return value to `User`.

Use the `ReturnType` type helper (and `typeof`) to do this.

https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype

### 134 - Awaited Type Helper

We want to extract the return value of `fetchUser`, but it's wrapped in a `Promise`. See if you can use the `Awaited` type helper WITH `ReturnType` to extract the return value.

https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype

## Section 3

### 135 - Indexed Access Types

We want `Group` to be of type `"group"`. But we also want to make sure it stays in sync with `programModeEnumMap`.

See if you can use an indexed access type to derive `Group` from `programModeEnumMap`.

https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html

### 136 - Passing Unions To Indexed Access Types

Now, we want to be able to create a union of all the 'planned' programs in the `programModeEnumMap` - `planned1on1` and `plannedSelfDirected`.

See if you can use an indexed access type to derive `PlannedPrograms` from `programModeEnumMap`.

Hint - you can pass unions to indexed access types!

### 137 - Pass `keyof` to an Indexed Access Type

Finally, let's extract all the values from `programModeEnumMap` into a union.

See if you can used an indexed access type with `keyof` to derive `AllPrograms` from `programModeEnumMap`.
