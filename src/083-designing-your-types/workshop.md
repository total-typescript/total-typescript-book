# Fast Track

## Section 1

### 204 - Intro To Generic Types

There is some duplication inside `UserDataShape` and `PostDataShape`. Both are a union between some object containing `data` and an `ErrorShape`.

See if you can refactor it to create a generic type called `DataShape`, which can be used like this:

```ts
type UserDataShape = DataShape<{
  id: string;
  name: string;
  email: string;
}>;

type PostDataShape = DataShape<{
  id: string;
  title: string;
  body: string;
}>;
```

https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-types

### 205 - Multiple Type Parameters

The `PromiseFunc` type is currently not very useful. We want to be able to pass it two type arguments. The first should be the type of the `input` argument. The second should be inside the `Promise` returned by the function.

Add two type parameters to `PromiseFunc` to make the errors go away.

## Section 2

### 206 - Result Type

One way to avoid throwing errors in TypeScript is to use a `Result` type. Take a look at the `createRandomNumber` function, and debate whether you think this code is more readable/maintainable than a `try/catch` would be.

### 207 - Default Type Parameters

We've got a `Result` type, but we want to use it without passing in a type argument. See if you can add a default type argument to `Result` to make the errors go away.

https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-parameter-defaults

## Section 3

### 208 - Type Parameter Constraints

We now want to make sure that the `Error` passed in to `Result` is constrained to a type matching `{ message: string }`.

The `BadExample` shows what we don't want to have happen - we don't want our users to be able to pass something without a `message` property defined.

See if you can add a constraint to the `TError` type parameter to make the errors go away.

https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints

### 209 - Stricter Version of Omit

By default, TypeScript's `Omit` type will allow you to omit properties that _don't exist_ from the object.

See if you can create a stricter version of `Omit` which will only allow you to omit properties that _do exist_ on the object.

To do that, you'll need to add some constraints to one of the type parameters inside `StrictOmit` - possibly involving `keyof`.

## Section 4

### 210 - Template Literal Types

We want to constrain our `goToRoute` function so that it only works with strings which start with `/`.

Change the way `AbsoluteRoute` is defined to use a template literal type to make the errors go away.

https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html

### 211 - Passing Unions To Template Literal Types

Change the `Sandwich` type so that it matches the list of sandwiches in the test below.

Hint - the result is easier than you think!

## Section 5

### 212 - Mapped Types

Define `AttributeGetters` so that it matches the test below.

You'll need to map over `Attributes` using a mapped type, turning each value of the object into a function which returns the object.

You'll also need to use `keyof`, and Indexed Access Types.

https://www.typescriptlang.org/docs/handbook/2/mapped-types.html

### 213 - 'As' In Mapped Types

Now, we want to change the key of each attribute so that it's prefixed with `get`.

For this, we'll need to use 'Key remapping', template literal strings, and the `Capitalize` type helper.

Key remapping: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as

Capitalize: https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#capitalizestringtype
