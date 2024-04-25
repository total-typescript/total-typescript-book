# Fast Track

## Section 1

### 081 - Extending Objects With Intersections

`id` and `createdAt` are duplicated between `User` and `Product`. See if you can create a `BaseEntity` type and use the `&` operator to remove this duplication.

https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types

### 082 - Extending Objects With Interfaces

Instead of using `&`, try redefining `BaseEntity`, `User` and `Product` as interfaces and use `extends` to combine them.

https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces

## Section 2

### 084 - Index Signatures

Find a way to annotate the type of the `scores` object to make the TypeScript errors go away. You can either use an index signature or a Record type.

Index signatures: https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures

Record type: https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type

### 087 - Record Type With Union As Keys

Find a way to type the `configurations` object. It should have `Environment` as the keys, and `{ apiBaseUrl: string; timeout: number }` as the values.

### 088 - Declaration Merging Of Interfaces

Try to understand why the `myLogger.log` call is erroring. Then, try to fix it.

https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces

## Section 3

### 089 - Pick Type Helper

We're expecting the result of `fetchUser` to be only an object containing `name` and `email`. See if you can redefine the return type of `fetchUser` to make the TypeScript errors go away.

Hint - the `Pick` type helper will be of use!

https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys

### 095 - Partial Type Helper

We want to be able to pass a partial `Product` object to `updateProduct`. See if you can redefine the definition of `productInfo` to make the errors go away.

https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype
