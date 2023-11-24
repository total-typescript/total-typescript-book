# Fast Track

## Section 1

### 215 - Generic Functions without Inference

Our `createStringMap` function creates a map with a certain type as its values.

See if you can add a type parameter to the `createStringMap` function so that the `Map` it creates will be the type of the type argument passed in.

https://www.typescriptlang.org/docs/handbook/2/generics.html

### 216 - Type Parameter Defaults in Generic Functions

Let's say that if we _don't_ provide a type argument to `createStringMap`, we want the `Map` to be typed with `string` as its values.

See if you can add a default type argument to `createStringMap` to make this happen.

https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-parameter-defaults

### 217 - Generic Functions with Inference

Our `uniqueArray` function turns an array into a set, and then back into an array.

But because it's typed as `any[]`, anything returned from the function is also typed as `any[]`.

See if you can add a type parameter to `uniqueArray` to make the errors go away.

Notice how you _don't need to add a type argument_ to `uniqueArray([1, 2, 3])` get the inference working!

https://www.typescriptlang.org/docs/handbook/2/generics.html#hello-world-of-generics

## Section 2

### 218 - Type Parameter Constraints in Generic Functions

In our `addCodeToError` function, we want to make sure that any error passed in has an optional `code` property.

We also want to ensure that all errors passed have a `message` property.

See if you can add a constraint to the `TError` type parameter to make the errors go away.

https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints

### 219 - Generic Types and Generic Functions

Our `safeFunction` function takes in an `async` function, and returns a `try/catch`'ed version of that function.

But currently, it's not inferring the `result` - it's always typed as `any`.

See if you can use what you know about generic types and generic functions to fix the typing of `safeFunction`.

### 220 - Multiple Type Arguments in Generic Functions

Now we've got the result of our `safeFunction` typed, we also need to make sure the `args` passed to it are typed.

Notice how we've added `...args` to the `safeFunction` function.

See if you can add a second type parameter to `safeFunction` and `PromiseFunc` to make the errors go away. You'll also need to use a constraint.
