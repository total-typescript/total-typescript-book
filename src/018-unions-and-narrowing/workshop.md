# Fast Track

## Section 1

### 053 - Introduction To Unions

The way that `username` is defined inside `getUsername` doesn't seem right. See if you can find a different annotation that will also allow us to pass `null` into the function.

https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types

### 054 - Literal Types

Try to find a better type definition for `direction` inside the `move` function.

You should only be able to pass `up`, `down`, `left` or `right`.

https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types

### 058 - Narrowing Unions With typeof

Notice how `time` is a `string` in the `if` statement, but a `number` in the `else` statement.

Outside of the `if` statement, it's represented as `string | number`.

### 059 - Narrowing With If Statements

Rewrite the function to make the error go away.

https://www.typescriptlang.org/docs/handbook/2/narrowing.html#truthiness-narrowing

## Section 2

### 060 - Narrowing with Boolean

Why doesn't narrowing with a `Boolean` expression work?

Try changing the code to use a `!!` instead. Why does this work?

### 062 - Throwing Errors to Narrow

Try adding some runtime code after `appElement` (but before the type test) to throw an error if `appElement` is not defined.

See what happens to the errors!

### 064 - Narrowing with `in` Statements

Change the `if (true)` line to check if there is a `data` key on `response`.

https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing

## Section 3

### 065 - Introduction to Unknown (led by Matt)

### 065.5 - Narrowing with `instanceof`

Make the type errors go away by changing the `if (true)` line.

https://www.typescriptlang.org/docs/handbook/2/narrowing.html#instanceof-narrowing

### 066 - Narrowing Unknown to a value

Change the `if (true)` line to check if `value.data.id` is a string. Don't change `value: unknown`.

(you'll need to write a lot of code to get this to work!)

## Section 4

### 067 - Introduction to Never

`never` is a type that should never exist. Nothing is assignable to `never`, but `never` is assignable to anything!

https://www.typescriptlang.org/docs/handbook/2/functions.html#never

### 068 - Returning Never to Narrow

Change the type definitions of `throwError` to make the type error inside `handleSearchParams` go away.

### 071 - Narrowing in Different Scopes

Change the code inside `findUsersByName` so that the type error goes away. Don't change the definition of `searchParams`.

Also - why is the type error happening in the first place?

## Section 5

### 074 - Intro to Discriminated Unions

Find a different way to define `Shape` so that the type errors go away in the `calculateArea` function.

https://www.totaltypescript.com/discriminated-unions-are-a-devs-best-friend

### 075 - Destructuring Discriminated Unions

Investigate why the type errors are happening inside the `calculateArea` function. Fix them by changing the `calculateArea` function.

## Section 6

### 076 - Narrowing Discriminated Unions With Switch Statements

Refactor the `calculateArea` function to use a `switch` statement instead of an `if` statement.

### 079 - Discriminated Booleans

Change the way `ApiResponse` is declared to use a discriminated tuple, to make the type errors go away.

Once you've got this working, notice how impressive it is that TypeScript can narrow the response of `value` based on checking `succeeded` inside the `exampleFunc`.

### 080 - Adding Defaults to Discriminated Unions

Change the way `Circle` or `Square` is declared to make `Circle` the default if no `kind` is passed to `calculateArea`.

You'll probably also need to change the `calculateArea` function.
