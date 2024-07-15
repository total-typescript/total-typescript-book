In this section, we're going to see how TypeScript can help when a value is one of many possible types. We'll first look at declaring those types using union types, then we'll see how TypeScript can narrow down the type of a value based on your runtime code.

## Unions and Literals

### Union Types

A union type is TypeScript's way of saying that a value can be "either this type or that type".

This situation comes up in JavaScript all the time. Imagine you have a value that is a `string` on Tuesdays, but `null` the rest of the time:

```ts twoslash
const message = Date.now() % 2 === 0 ? "Hello Tuesdays!" : null;
//    ^?
```

If we hover over `message`, we can see that TypeScript has inferred its type as `string | null`.

This is a union type. It means that `message` can be either a `string` or `null`.

#### Declaring Union Types

We can declare our own union types.

For example, you might have an `id` that could be either a `string` or a `number`:

```ts twoslash
const logId = (id: string | number) => {
  console.log(id);
};
```

This means that `logId` can accept either a `string` or a `number` as an argument, but not a `boolean`:

```ts twoslash
// @errors: 2345
const logId = (id: string | number) => {
  console.log(id);
};
// ---cut---
logId("abc");

logId(123);

logId(true);
```

To create a union type, the `|` operator is used to separate the types. Each type of the union is called a 'member' of the union.

Union types also work when creating your own type aliases. For example, we can refactor our earlier definition into a type alias:

```typescript
type Id = number | string;

function logId(id: Id) {
  console.log(id);
}
```

Union types can contain many different types - they don't all have to be primitives, or don't need to be related in any way. When they get particularly large, you can use this syntax (with the `|` before the first member of the union) to make it more readable:

```typescript
type AllSortsOfStuff =
  | string
  | number
  | boolean
  | object
  | null
  | {
      name: string;
      age: number;
    };
```

Union types can be used in many different ways, and they're a powerful tool for creating flexible type definitions.

### Literal Types

Just as TypeScript allows us to create union types from multiple types, it also allows us to create types which represent a specific primitive value. These are called literal types.

Literal types can be used to represent strings, numbers, or booleans that have specific values.

```typescript
type YesOrNo = "yes" | "no";
type StatusCode = 200 | 404 | 500;
type TrueOrFalse = true | false;
```

In the `YesOrNo` type, the `|` operator is used to create a union of the string literals `"yes"` and `"no"`. This means that a value of type `YesOrNo` can only be one of these two strings.

This feature is what powers the autocomplete we've seen in functions like `document.addEventListener`:

```typescript
document.addEventListener(
  // DOMContentLoaded, mouseover, etc.
  "click",
  () => {},
);
```

The first argument to `addEventListener` is a union of string literals, which is why we get autocompletion for the different event types.

### Combining Unions With Unions

What happens when we make a union of two union types? They combine together to make one big union.

For example, we can create `DigitalFormat` and `PhysicalFormat` types that contain a union of literal values:

```tsx
type DigitalFormat = "MP3" | "FLAC";

type PhysicalFormat = "LP" | "CD" | "Cassette";
```

We could then specify `AlbumFormat` as a union of `DigitalFormat` and `PhysicalFormat`:

```tsx
type AlbumFormat = DigitalFormat | PhysicalFormat;
```

Now, we can use the `DigitalFormat` type for functions that handle digital formats, and the `AnalogFormat` type for functions that handle analog formats. The `AlbumFormat` type can be used for functions that handle all cases.

This way, we can ensure that each function only handles the cases it's supposed to handle, and TypeScript will throw an error if we try to pass an incorrect format to a function.

```ts twoslash
// @errors: 2345
type PhysicalFormat = "LP" | "CD" | "Cassette";
// ---cut---
const getAlbumFormats = (format: PhysicalFormat) => {
  // function body
};

getAlbumFormats("MP3");
```

### Exercises

#### Exercise 1: `string` or `null`

Here we have a function called `getUsername` that takes in a `username` string. If the `username` is not equal to `null`, we return a new interpolated string. Otherwise, we return `"Guest"`:

```typescript
function getUsername(username: string) {
  if (username !== null) {
    return `User: ${username}`;
  } else {
    return "Guest";
  }
}
```

In the first test, we call `getUsername` and pass in a string of "Alice" which passes as expected. However, in the second test, we have a red squiggly line under `null` when passing it into `getUsername`:

```ts twoslash
// @errors: 2345
import { Equal, Expect } from "@total-typescript/helpers";

function getUsername(username: string) {
  if (username !== null) {
    return `User: ${username}`;
  } else {
    return "Guest";
  }
}

// ---cut---
const result = getUsername("Alice");

type test = Expect<Equal<typeof result, string>>;

const result2 = getUsername(null);

type test2 = Expect<Equal<typeof result2, string>>;
```

Normally we wouldn't explicitly call the `getUsername` function with `null`, but in this case it's important that we handle `null` values. For example, we might be getting the `username` from a user record in a database, and the user might or might not have a name depending on how they signed up.

Currently, the `username` parameter only accepts a `string` type, and the check for `null` isn't doing anything. Update the function parameter's type so the errors are resolved and the function can handle `null` .

<Exercise title="Exercise 1: `string` or `null`" filePath="/src/018-unions-and-narrowing/053-introduction-to-unions.problem.ts"></Exercise>

#### Exercise 2: Restricting Function Parameters

Here we have a `move` function that takes in a `direction` of type string, and a `distance` of type number:

```tsx
function move(direction: string, distance: number) {
  // Move the specified distance in the given direction
}
```

The implementation of the function is not important, but the idea is that we want to be able to move either up, down, left, or right.

Here's what calling the `move` function might look like:

```typescript
move("up", 10);

move("left", 5);
```

To test this function, we have some `@ts-expect-error` directives that tell TypeScript we expect the following lines to throw an error.

However, since the `move` function currently takes in a `string` for the `direction` parameter, we can pass in any string we want, even if it's not a valid direction. There is also a test where we expect that passing `20` as a distance won't work, but it's being accepted as well.

This leads to TypeScript drawing red squiggly lines under the `@ts-expect-error` directives:

```ts twoslash
// @errors: 2578
function move(direction: string, distance: number) {
  // Move the specified distance in the given direction
}
// ---cut---
move(
  // @ts-expect-error - "up-right" is not a valid direction
  "up-right",
  10,
);

move(
  // @ts-expect-error - "down-left" is not a valid direction
  "down-left",
  20,
);
```

Your challenge is to update the `move` function so that it only accepts the strings `"up"`, `"down"`, `"left"`, and `"right"`. This way, TypeScript will throw an error when we try to pass in any other string.

<Exercise title="Exercise 2: Restricting Function Parameters" filePath="/src/018-unions-and-narrowing/054-literal-types.problem.ts"></Exercise>

#### Solution 1: `string` or `null`

The solution is to update the `username` parameter to be a union of `string` and `null`:

```typescript
function getUsername(username: string | null) {
  // function body
}
```

With this change, the `getUsername` function will now accept `null` as a valid value for the `username` parameter, and the errors will be resolved.

#### Solution 2: Restricting Function Parameters

In order to restrict what the `direction` can be, we can use a union type of literal values (in this case strings).

Here's what this looks like:

```typescript
function move(direction: "up" | "down" | "left" | "right", distance: number) {
  // Move the specified distance in the given direction
}
```

With this change, we now have autocomplete for the possible `direction` values.

To clean things up a bit, we can create a new type alias called `Direction` and update the parameter accordingly:

```typescript
type Direction = "up" | "down" | "left" | "right";

function move(direction: Direction, distance: number) {
  // Move the specified distance in the given direction
}
```

## Narrowing

### Wider vs Narrower Types

Some types are wider versions of other types. For example, `string` is wider than the literal string `"small"`. This is because `string` can be any string, while `"small"` can only be the string `"small"`.

In reverse, we might say that `"small"` is a 'narrower' type than `string`. It's a more specific version of a string. `404` is a narrower type than `number`, and `true` is a narrower type than `boolean`.

This is only true of types which have some kind of shared relationship. For example, `"small"` is not a narrower version of `number` - because `"small"` itself is not a number.

In TypeScript, the narrower version of a type can always take the place of the wider version.

For example, if a function accepts a `string`, we can pass in `"small"`:

```typescript
const logSize = (size: string) => {
  console.log(size.toUpperCase());
};

logSize("small");
```

But if a function accepts `"small"`, we can't pass any random `string`:

```ts twoslash
// @errors: 2345
const recordOfSizes = {
  small: "small",
  large: "large",
};

const logSize = (size: "small" | "large") => {
  console.log(recordOfSizes[size]);
};

logSize("medium");
```

If you're familiar with the concept of 'subtypes' and 'supertypes' in set theory, this is a similar idea. `"small"` is a subtype of `string` (it is more specific), and `string` is a supertype of `"small"`.

### Unions Are Wider Than Their Members

A union type is a wider type than its members. For example, `string | number` is wider than `string` or `number` on their own.

This means that we can pass a `string` or a `number` to a function that accepts `string | number`:

```typescript
function logId(id: string | number) {
  console.log(id);
}

logId("abc");
logId(123);
```

However, this doesn't work in reverse. We can't pass `string | number` to a function that only accepts `string`.

For example, if we changed this `logId` function to only accept a `number`, TypeScript would throw an error when we try to pass `string | number` to it:

```ts twoslash
// @errors: 2345
function logId(id: number) {
  console.log(`The id is ${id}`);
}

type User = {
  id: string | number;
};

const user: User = {
  id: 123,
};

logId(user.id);
```

Hovering over `user.id` shows:

```
Argument of type 'string | number' is not assignable to parameter of type 'number'.
  Type 'string' is not assignable to type 'number'.
```

So, it's important to think of a union type as a wider type than its members.

### What is Narrowing?

Narrowing in TypeScript lets us take a wider type and make it narrower using runtime code.

This can be useful when we want to do different things based on the type of a value. For example, we might want to handle a `string` differently to a `number`, or `"small"` differently to `"large"`.

### Narrowing with `typeof`

One way we can narrow down the type of a value is to use the `typeof` operator, combined with an `if` statement.

Consider a function `getAlbumYear` that takes in a parameter `year`, which can either be a `string` or `number`. Here's how we could use the `typeof` operator to narrow down the type of `year`:

```typescript
const getAlbumYear = (year: string | number) => {
  if (typeof year === "string") {
    console.log(`The album was released in ${year.toUppercase()}.`); // `year` is string
  } else if (typeof year === "number") {
    console.log(`The album was released in ${year.toFixed(0)}.`); // `year` is number
  }
};
```

It looks straightforward, but there are some important things to realize about what's happening behind the scenes.

Scoping plays a big role in narrowing. In the first `if` block, TypeScript understands that `year` is a `string` because we've used the `typeof` operator to check its type. In the `else if` block, TypeScript understands that `year` is a `number` because we've used the `typeof` operator to check its type.

<!-- ILLUSTRATION HERE? -->

This lets us call `toUpperCase` on `year` when it's a `string`, and `toFixed` on `year` when it's a `number`.

However, anywhere outside of the conditional block the type of `year` is still the union `string | number`. This is because narrowing only applies within the block's scope.

For the sale of illustration, if we add a `boolean` to the `year` union, the first `if` block will still end up with a type of `string`, but the `else` block will end up with a type of `number | boolean`:

```typescript
const getAlbumYear = (year: string | number | boolean) => {
  if (typeof year === "string") {
    console.log(`The album was released in ${year}.`); // `year` is string
  } else if (typeof year === "number") {
    console.log(`The album was released in ${year}.`); // `year` is number | boolean
  }

  console.log(year); // `year` is string | number | boolean
};
```

This is a powerful example of how TypeScript can read your runtime code and use it to narrow down the type of a value.

### Other Ways to Narrow

The `typeof` operator is just one way to narrow types.

TypeScript can use other conditional operators like `&&` and `||`, and will take the truthiness into account for coercing the boolean value. It's also possible to use other operators like `instanceof` and `in` for checking object properties. You can even throw errors or use early returns to narrow types.

We'll take a closer look at these in the following exercises.

### Exercises

#### Exercise 1: Narrowing with `if` Statements

Here we have a function called `validateUsername` that takes in either a `string` or `null`, and will always return a `boolean`:

```ts twoslash
// @errors: 18047
function validateUsername(username: string | null): boolean {
  return username.length > 5;

  return false;
}
```

Tests for checking the length of the username pass as expected:

```typescript
it("should return true for valid usernames", () => {
  expect(validateUsername("Matt1234")).toBe(true);

  expect(validateUsername("Alice")).toBe(false);

  expect(validateUsername("Bob")).toBe(false);
});
```

However, we have an error underneath `username` inside of the function body, because it could possibly be `null` and we are trying to access a property off of it.

```typescript
it("Should return false for null", () => {
  expect(validateUsername(null)).toBe(false);
});
```

Your task is to rewrite the `validateUsername` function to add narrowing so that the `null` case is handled and the tests all pass.

<Exercise title="Exercise 1: Narrowing with `if` Statements" filePath="/src/018-unions-and-narrowing/059-narrowing-with-if-statements.problem.ts"></Exercise>

#### Exercise 2: Throwing Errors to Narrow

Here we have a line of code that uses `document.getElementById` to fetch an HTML element, which can return either an `HTMLElement` or `null`:

```typescript
const appElement = document.getElementById("app");
```

Currently, a test to see if the `appElement` is an `HTMLElement` fails:

```ts twoslash
// @errors: 2344
import { Equal, Expect } from "@total-typescript/helpers";

const appElement = document.getElementById("app");

// ---cut---
type Test = Expect<Equal<typeof appElement, HTMLElement>>;
```

Your task is to use `throw` to narrow down the type of `appElement` before it's checked by the test.

<Exercise title="Exercise 2: Throwing Errors to Narrow" filePath="/src/018-unions-and-narrowing/062-throwing-errors-to-narrow.problem.ts"></Exercise>

#### Exercise 3: Using `in` to Narrow

Here we have a `handleResponse` function that takes in a type of `APIResponse`, which is a union of two types of objects.

The goal of the `handleResponse` function is to check whether the provided object has a `data` property. If it does, the function should return the `id` property. If not, it should throw an `Error` with the message from the `error` property.

```tsx
type APIResponse =
  | {
      data: {
        id: string;
      };
    }
  | {
      error: string;
    };

const handleResponse = (response: APIResponse) => {
  // How do we check if 'data' is in the response?

  if (true) {
    return response.data.id;
  } else {
    throw new Error(response.error);
  }
};
```

Currently, there are several errors being thrown as seen in the following tests.

The first error is `Property 'data' does not exist on type 'APIResponse'`

```tsx
test("passes the test even with the error", () => {
  // there is no error in runtime

  expect(() =>
    HandleResponseOrThrowError({
      error: "Invalid argument",
    }),
  ).not.toThrowError();

  // but the data is returned, instead of an error.

  expect(
    HandleResponseOrThrowError({
      error: "Invalid argument",
    }),
  ).toEqual("Should this be 'Error'?");
});
```

Then we have the inverse error, where `Property 'error' does not exist on type 'APIResponse'`:

```
Property data does not exist on type 'APIResponse'.
```

Your challenge is to find the correct syntax for narrowing down the types within the `handleResponse` function's `if` condition.

The changes should happen inside of the function without modifying any other parts of the code.

<Exercise title="Exercise 3: Using `in` to Narrow" filePath="/src/018-unions-and-narrowing/064-narrowing-with-in-statements.problem.ts"></Exercise>

#### Solution 1: Narrowing with `if` Statements

There are several different ways to validate the username length.

##### Option 1: Check Truthiness

We could use an `if` statement to check if `username` is truthy. If it does, we can return `username.length > 5`, otherwise we can return `false`:

```typescript
function validateUsername(username: string | null): boolean {
  // Rewrite this function to make the error go away

  if (username) {
    return username.length > 5;
  }

  return false;
}
```

There is a catch to this piece of logic. If `username` is an empty string, it will return `false` because an empty string is falsy. This happens to match the behavior we want for this exercise - but it's important to bear that in mind.

##### Option 2: Check if `typeof username` is `"string"`

We could use `typeof` to check if the username is a string:

```typescript
function validateUsername(username: string | null): boolean {
  if (typeof username === "string") {
    return username.length > 5;
  }

  return false;
}
```

This avoids the issue with empty strings.

##### Option 3: Check if `typeof username` is not `"string"`

Similar to the above, we could check if `typeof username !== "string"`.

In this case, if `username` is not a string, we know it's `null` and could return `false` right away. Otherwise, we'd return the check for length being greater than 5:

```typescript
function validateUsername(username: string | null | undefined): boolean {
  if (typeof username !== "string") {
    return false;
  }

  return username.length > 5;
}
```

This shows that TypeScript understands the _reverse_ of a check. Very smart.

##### Option 4: Check if `typeof username` is `"object"`

A odd JavaScript quirk is that the type of `null` is equal to `"object"`.

TypeScript knows this, so we can actually use it to our advantage. We can check if `username` is an object, and if it is, we can return `false`:

```typescript
function validateUsername(username: string | null): boolean {
  if (typeof username === "object") {
    return false;
  }

  return username.length > 5;
}
```

##### Option 5: Extract the check into its own variable

Finally, for readability and reusability purposes you could store the check in its own variable `isUsernameOK`.

Here's what this would look like:

```typescript
function validateUsername(username: string | null): boolean {
  const isUsernameOK = typeof username === "string";

  if (isUsernameOK) {
    return username.length > 5;
  }

  return false;
}
```

TypeScript is smart enough to understand that the value of `isUsernameOK` corresponds to whether `username` is a string or not. Very smart.

All of the above options use `if` statements to perform checks by narrowing types by using `typeof`.

No matter which option you go with, remember that you can always use an `if` statement to narrow your type and add code to the case that the condition passes.

#### Solution 2: Throwing Errors to Narrow

The issue with this code is that `document.getElementById` returns `null | HTMLElement`. But we want to make sure that `appElement` is an `HTMLElement` before we use it.

We are pretty sure that `appElement` exists. If it doesn't exist, we probably want to crash the app early so that we can get an informative error about what's gone wrong.

So, we can add an `if` statement that checks if `appElement` is falsy, then throws an error:

```typescript
if (!appElement) {
  throw new Error("Could not find app element");
}
```

By adding this error condition, we can be sure that we will never reach any subsequent code if `appElement` is `null`.

If we hover over `appElement` after the `if` statement, we can see that TypeScript now knows that `appElement` is an `HTMLElement` - it's no longer `null`. This means our test also now passes:

```ts twoslash
import { Equal, Expect } from "@total-typescript/helpers";

const appElement = document.getElementById("app");

if (!appElement) {
  throw new Error("Could not find app element");
}

// ---cut---
console.log(appElement);
//          ^?

type Test = Expect<Equal<typeof appElement, HTMLElement>>; // passes
```

Throwing errors like this can help you identify issues at runtime. In this specific case, it narrows down the code _outside_ of the immediate `if` statement scope. Amazing.

#### Solution 3: Using `in` to Narrow

Your first instinct will be to check if `response.data` is truthy.

```ts twoslash
// @errors: 2339
type APIResponse =
  | {
      data: {
        id: string;
      };
    }
  | {
      error: string;
    };

// ---cut---
const handleResponse = (response: APIResponse) => {
  if (response.data) {
    return response.data.id;
  } else {
    throw new Error(response.error);
  }
};
```

But you'll get an error. This is because `response.data` is only available on one of the members of the union. TypeScript doesn't know that `response` is the one with `data` on it.

##### Option 1: Changing the Type

It may be tempting to change the `APIResponse` type to add `.data` to both branches:

```tsx
type APIResponse =
  | {
      data: {
        id: string;
      };
    }
  | {
      data?: undefined;
      error: string;
    };
```

This is certainly one way to handle it. But there is a built-in way to do it.

##### Option 2: Using `in`

We can use an `in` operator to check if a specific key exists on `response`.

In this example, it would check for the key `data`:

```ts twoslash
type APIResponse =
  | {
      data: {
        id: string;
      };
    }
  | {
      error: string;
    };

// ---cut---
const handleResponse = (response: APIResponse) => {
  if ("data" in response) {
    return response.data.id;
  } else {
    throw new Error(response.error);
  }
};
```

If the `response` isn't the one with `data` on it, then it must be the one with `error`, so we can throw an `Error` with the error message.

You can check this out by hovering over `.data` and `.error` in each of the branches of the `if` statement. TypeScript will show you that it knows the type of `response` in each case.

Using `in` here gives us a great way to narrow down objects that might have different keys from one another.

## `unknown` and `never`

Let's pause for a moment to introduce a couple more types that play an important role in TypeScript, particularly when we talk about 'wide' and 'narrow' types.

### The Widest Type: `unknown`

TypeScript's widest type is `unknown`. It represents something that we don't know what it is.

If you imagine a scale whether the widest types are at the top and the narrowest types are at the bottom, `unknown` is at the top. All other types like strings, numbers, booleans, null, undefined, and their respective literals are assignable to `unknown`, as seen in its assignability chart:

<img src="https://res.cloudinary.com/total-typescript/image/upload/v1706814781/065-introduction-to-unknown.explainer_ohm9pd.png">

Consider this example function `fn` that takes in an `input` parameter of type `unknown`:

```ts twoslash
const fn = (input: unknown) => {};

// Anything is assignable to unknown!
fn("hello");
fn(42);
fn(true);
fn({});
fn([]);
fn(() => {});
```

All of the above function calls are valid because `unknown` is assignable to any other type

The `unknown` type is the preferred choice when you want to represent something that's truly unknown in JavaScript. For example, it is extremely useful when you have things coming into your application from outside sources, like input from a form or a call to a webhook.

#### What's the Difference Between `unknown` and `any`?

You might be wondering what the difference is between `unknown` and `any`. They're both wide types, but there's a key difference.

`any` doesn't really fit into our definition of 'wide' and 'narrow' types. It breaks the type system. It's not really a type at all - it's a way of opting out of TypeScript's type checking.

`any` can be assigned to anything, and anything can be assigned to `any`. `any` is both narrower and wider than every other type.

`unknown`, on the other hand, is part of TypeScript's type system. It's wider than every other type, so it can't be assigned to anything.

```ts twoslash
// @errors: 18046
const handleWebhookInput = (input: unknown) => {
  input.toUppercase();
};

const handleWebhookInputWithAny = (input: any) => {
  // no error
  input.toUppercase();
};
```

This means that `unknown` is a safe type, but `any` is not. `unknown` means "I don't know what this is", while `any` means "I don't care what this is".

### The Narrowest Type: `never`

If `unknown` is the widest type in TypeScript, `never` is the narrowest.

`never` represents something that will _never_ happen. It's the very bottom of the type hierarchy.

You'll rarely use a `never` type annotation yourself. Instead, it'll pop up in error messages and hovers - often when narrowing.

But first, let's look at a simple example of a `never` type:

#### `never` vs `void`

Let's consider a function that never returns anything:

```typescript
const getNever = () => {
  // This function never returns!
};
```

When hovering this function, TypeScript will infer that it returns `void`, indicating that it essentially returns nothing.

```typescript
// hovering over `getNever` shows:

const getNever: () => void;
```

However, if we throw an error inside of the function, the function will _never_ return:

```typescript
const getNever = () => {
  throw new Error("This function never returns");
};
```

With this change, TypeScript will infer that the function's type is `never`:

```typescript
// hovering over `getNever` shows:

const getNever: () => never;
```

The `never` type represents something that can never happen.

There are some weird implications for the `never` type.

You cannot assign anything to `never`, except for `never` itself.

```ts twoslash
// @errors: 2345
const getNever = () => {
  throw new Error("This function never returns");
};
// ---cut---
const fn = (input: never) => {};

fn("hello");
fn(42);
fn(true);
fn({});
fn([]);
fn(() => {});

// no error here, since we're assigning `never` to `never`

fn(getNever());
```

However, you can assign `never` to anything:

```typescript
const str: string = getNever();

const num: number = getNever();

const bool: boolean = getNever();

const arr: string[] = getNever();
```

This behavior looks extremely odd at first - but we'll see later why it's useful.

Let's update our chart to include `never`:

![assignability chart with never](https://res.cloudinary.com/total-typescript/image/upload/v1706814786/067-introduction-to-never.explainer_ktradt.png)

This gives us pretty much the full picture of TypeScript's type hierarchy.

### Exercises

#### Exercise 1: Narrowing Errors with `instanceof`

In TypeScript, one of the most common places you'll encounter the `unknown` type is when using a `try...catch` statement to handle potentially dangerous code. Let's consider an example:

```ts twoslash
// @errors: 18046
const somethingDangerous = () => {
  if (Math.random() > 0.5) {
    throw new Error("Something went wrong");
  }

  return "all good";
};

try {
  somethingDangerous();
} catch (error) {
  if (true) {
    console.error(error.message);
  }
}
```

In the code snippet above, we have a function called `somethingDangerous` that has a 50/50 chance of either throwing an error.

Notice that the `error` variable in the `catch` clause is typed as `unknown`.

Now let's say we want to log the error using `console.error()` only if the error contains a `message` attribute. We know that errors typically come with a `message` attribute, like in the following example:

```typescript
const error = new Error("Some error message");

console.log(error.message);
```

Your task is to update the `if` statement to have the proper condition to check if the `error` has a message attribute before logging it. Check the title of the exercise to get a hint... And remember, `Error` is a class.

<Exercise title="Exercise 1: Narrowing Errors with `instanceof`" filePath="/src/018-unions-and-narrowing/065.5-narrowing-with-instanceof-statements.problem.ts"></Exercise>

#### Exercise 2: Narrowing `unknown` to a Value

Here we have a `parseValue` function that takes in a `value` of type `unknown`:

```ts twoslash
// @errors: 18046
const parseValue = (value: unknown) => {
  if (true) {
    return value.data.id;
  }

  throw new Error("Parsing error!");
};
```

The goal of this function is to return the `id` property of the `data` property of the `value` object. If the `value` object doesn't have a `data` property, then it should throw an error.

Here are some tests for the function that show us the amount of narrowing that needs to be done inside of the `parseValue` function:

```typescript
it("Should handle a { data: { id: string } }", () => {
  const result = parseValue({
    data: {
      id: "123",
    },
  });

  type test = Expect<Equal<typeof result, string>>;

  expect(result).toBe("123");
});

it("Should error when anything else is passed in", () => {
  expect(() => parseValue("123")).toThrow("Parsing error!");

  expect(() => parseValue(123)).toThrow("Parsing error!");
});
```

Your challenge is to modify the `parseValue` function so that the tests pass and the errors go away. I want you to challenge yourself to do this _only_ by narrowing the type of `value` inside of the function. No changes to the types. This will require a very large `if` statement!

<Exercise title="Exercise 2: Narrowing `unknown` to a Value" filePath="/src/018-unions-and-narrowing/066-narrowing-unknown-to-a-value.problem.ts"></Exercise>

#### Exercise 3: Reusable Type Guards

Let's imagine that we have two functions which both take in a `value` of type `unknown`, and attempt to parse that value to an array of strings.

Here's the first function, which joins an array of names together into a single string:

```typescript
const joinNames = (value: unknown) => {
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value.join(" ");
  }

  throw new Error("Parsing error!");
};
```

And here's the second function, which maps over the array of names and adds a prefix to each one:

```typescript
const createSections = (value: unknown) => {
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value.map((item) => `Section: ${item}`);
  }

  throw new Error("Parsing error!");
};
```

Both functions have the same conditional check:

```ts
if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
```

This is a great opportunity to create a reusable type guard.

All the tests are currently passing. Your job is to try to refactor the two functions to use a reusable type guard, and remove the duplicated code. As it turns out, TypeScript makes this a lot easier than you expect.

<Exercise title="Exercise 3: Reusable Type Guards" filePath="/src/018-unions-and-narrowing/072.5-reusable-type-guards.problem.ts"></Exercise>

#### Solution 1: Narrowing Errors with `instanceof`

The way to solve this challenge is to narrow the `error` using the `instanceof` operator.

Where we check the error message, we'll check if `error` is an instance of the class `Error`:

```typescript
if (error instanceof Error) {
  console.log(error.message);
}
```

The `instanceof` operator covers other classes which inherit from the `Error` class as well, such as `TypeError`.

In this case, we're logging the error message to the console - but this could be used to display something different in our applications, or to log the error to an external service.

Even though it works in this particular example for all kinds of `Error`s, it won't cover us for the strange case where someone throws a non-`Error` object.

```typescript
throw "This is not an error!";
```

To be more safe from these edge cases, it's a good idea to include an `else` block that would throw the `error` variable like so:

```typescript
if (error instanceof Error) {
  console.log(error.message);
} else {
  throw error;
}
```

Using this technique, we can handle the error in a safe way and avoid any potential runtime errors.

#### Solution 2: Narrowing `unknown` to a Value

Here's our starting point:

```ts twoslash
// @errors: 18046
const parseValue = (value: unknown) => {
  if (true) {
    return value.data.id;
  }

  throw new Error("Parsing error!");
};
```

To fix the error, we'll need to narrow the type using conditional checks. Let's take it step-by-step.

First, we'll check if the type of `value` is an `object` by replacing the `true` with a type check:

```ts twoslash
// @errors: 18047 2339
const parseValue = (value: unknown) => {
  if (typeof value === "object") {
    return value.data.id;
  }

  throw new Error("Parsing error!");
};
```

Then we'll check if the `value` argument has a `data` attribute using the `in` operator:

```ts twoslash
// @errors: 18047 18046
const parseValue = (value: unknown) => {
  if (typeof value === "object" && "data" in value) {
    return value.data.id;
  }

  throw new Error("Parsing error!");
};
```

With this change, TypeScript is complaining that `value` is possibly `null`. This is because, of course, `typeof null` is `"object"`. Thanks, JavaScript!

To fix this, we can add `&& value` to our first condition to make sure it isn't `null`:

```ts twoslash
// @errors: 18046
const parseValue = (value: unknown) => {
  if (typeof value === "object" && value && "data" in value) {
    return value.data.id;
  }

  throw new Error("Parsing error!");
};
```

Now our condition check is passing, but we're still getting an error on `value.data` being typed as `unknown`.

What we need to do now is to narrow the type of `value.data` to an `object` and make sure that it isn't `null`. At this point we'll also add specify a return type of `string` to avoid returning an `unknown` type:

```ts twoslash
// @errors: 2339
const parseValue = (value: unknown): string => {
  if (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    typeof value.data === "object" &&
    value.data !== null
  ) {
    return value.data.id;
  }

  throw new Error("Parsing error!");
};
```

Finally, we'll add a check to ensure that the `id` is a string. If not, TypeScript will throw an error:

```typescript
const parseValue = (value: unknown): string => {
  if (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    typeof value.data === "object" &&
    value.data !== null &&
    "id" in value.data &&
    typeof value.data.id === "string"
  ) {
    return value.data.id;
  }

  throw new Error("Parsing error!");
};
```

Now when we hover over `parseValue`, we can see that it takes in an `unknown` input and always returns a `string`:

```typescript
// hovering over `parseValue` shows:

const parseValue: (value: unknown) => string;
```

Thanks to this huge conditional, our tests pass, and our error messages are gone!

This is usually _not_ how you'd want to write your code. It's a bit of a mess. You could use a library like [Zod](https://zod.dev) to do this with a much nicer API. But it's a great way to understand how `unknown` and narrowing work in TypeScript.

#### Solution 3: Reusable Type Guards

The first step is to create a function called `isArrayOfStrings` that captures the conditional check:

```typescript
const isArrayOfStrings = (value) => {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
};
```

We haven't given `value` a type here - `unknown` makes sense, because it could be anything.

Now we can refactor the two functions to use this type guard:

```typescript
const joinNames = (value: unknown) => {
  if (isArrayOfStrings(value)) {
    return value.join(" ");
  }

  throw new Error("Parsing error!");
};

const createSections = (value: unknown) => {
  if (isArrayOfStrings(value)) {
    return value.map((item) => `Section: ${item}`);
  }

  throw new Error("Parsing error!");
};
```

Incredibly, this is all TypeScript needs to be able to narrow the type of `value` inside of the `if` statement. It's smart enough to understand that `isArrayOfStrings` being called on `value` ensures that `value` is an array of strings.

We can observe this by hovering over `isArrayOfStrings`:

```typescript
// hovering over `isArrayOfStrings` shows:
const isArrayOfStrings: (value: unknown) => value is string[];
```

This return type we're seeing is a type predicate. It's a way of saying "if this function returns `true`, then the type of the value is `string[]`".

We'll look at authoring our own type predicates in one of the later chapters in the book - but it's very useful that TypeScript infers its own.

## Discriminated Unions

In this section we'll look at a common pattern TypeScript developers use to structure their code. It's called a 'discriminated union'.

To understand what a discriminated union is, let's first look at the problem it solves.

### The Problem: The Bag Of Optionals

Let's imagine we are modelling a data fetch. We have a `State` type with a `status` property which can be in one of three states: `loading`, `success`, or `error`.

```typescript
type State = {
  status: "loading" | "success" | "error";
};
```

This is useful, but we also need to capture some extra data. The data coming back from the fetch, or the error message if the fetch fails.

We could add an `error` and `data` property to the `State` type:

```typescript
type State = {
  status: "loading" | "success" | "error";
  error?: string;
  data?: string;
};
```

And let's imagine we have a `renderUI` function that returns a string based on the input.

```ts twoslash
// @errors: 18048
type State = {
  status: "loading" | "success" | "error";
  error?: string;
  data?: string;
};
// ---cut---
const renderUI = (state: State) => {
  if (state.status === "loading") {
    return "Loading...";
  }

  if (state.status === "error") {
    return `Error: ${state.error.toUpperCase()}`;
  }

  if (state.status === "success") {
    return `Data: ${state.data}`;
  }
};
```

This all looks good, except for the error we're getting on `state.error`. TypeScript is telling us that `state.error` could be `undefined`, and we can't call `toUpperCase` on `undefined`.

This is because we've declared our `State` type in an incorrect way. We've made it so the `error` and `data` properties are _not related to the statuses where they occur_. In other words, it's possible to create types which will never happen in our app:

```typescript
const state: State = {
  status: "loading",
  error: "This is an error", // should not happen on "loading!"
  data: "This is data", // should not happen on "loading!"
};
```

I'd describe this type as a "bag of optionals". It's a type that's too loose. We need to tighten it up so that `error` can only happen on `error`, and `data` can only happen on `success`.

### The Solution: Discriminated Unions

The solution is to turn our `State` type into a discriminated union.

A discriminated union is a type that has a common property, the 'discriminant', which is a literal type that is unique to each member of the union.

In our case, the `status` property is the discriminant.

Let's take each status and separate them into separate object literals:

```typescript
type State =
  | {
      status: "loading";
    }
  | {
      status: "error";
    }
  | {
      status: "success";
    };
```

Now, we can associate the `error` and `data` properties with the `error` and `success` statuses respectively:

```typescript
type State =
  | {
      status: "loading";
    }
  | {
      status: "error";
      error: string;
    }
  | {
      status: "success";
      data: string;
    };
```

Now, if we hover over `state.error` in the `renderUI` function, we can see that TypeScript knows that `state.error` is a `string`:

```ts twoslash
type State =
  | {
      status: "loading";
    }
  | {
      status: "error";
      error: string;
    }
  | {
      status: "success";
      data: string;
    };

// ---cut---
const renderUI = (state: State) => {
  if (state.status === "loading") {
    return "Loading...";
  }

  if (state.status === "error") {
    return `Error: ${state.error.toUpperCase()}`;
    //                     ^?
  }

  if (state.status === "success") {
    return `Data: ${state.data}`;
  }
};
```

This is due to TypeScript's narrowing - it knows that `state.status` is `"error"`, so it knows that `state.error` is a `string` inside of the `if` block.

To clean up our original type, we could use a type alias for each of the statuses:

```typescript
type LoadingState = {
  status: "loading";
};

type ErrorState = {
  status: "error";
  error: string;
};

type SuccessState = {
  status: "success";
  data: string;
};

type State = LoadingState | ErrorState | SuccessState;
```

So if you're noticing that your types are resembling 'bags of optionals', it's a good idea to consider using a discriminated union.

### Exercises

#### Exercise 1: Destructuring a Discriminated Union

Consider a discriminated union called `Shape` that is made up of two types: `Circle` and `Square`. Both types have a `kind` property that acts as the discriminant.

```tsx
type Circle = {
  kind: "circle";
  radius: number;
};

type Square = {
  kind: "square";
  sideLength: number;
};

type Shape = Circle | Square;
```

This `calculateArea` function destructures the `kind`, `radius`, and `sideLength` properties from the `Shape` that is passed in, and calculates the area of the shape accordingly:

```ts twoslash
// @errors: 2339
type Circle = {
  kind: "circle";
  radius: number;
};

type Square = {
  kind: "square";
  sideLength: number;
};

type Shape = Circle | Square;

// ---cut---
function calculateArea({ kind, radius, sideLength }: Shape) {
  if (kind === "circle") {
    return Math.PI * radius * radius;
  } else {
    return sideLength * sideLength;
  }
}
```

However, TypeScript is showing us errors below `'radius'` and `'sideLength'`.

Your task is to update the implementation of the `calculateArea` function so that destructuring properties from the passed in `Shape` works without errors. Hint: the examples I showed in the chapter _didn't_ use destructuring, but some destructuring is possible.

<Exercise title="Exercise 1: Destructuring a Discriminated Union" filePath="/src/018-unions-and-narrowing/075-destructuring-a-discriminated-union.problem.ts"></Exercise>

#### Exercise 2: Narrowing a Discriminated Union with a Switch Statement

Here we have our `calculateArea` function from the previous exercise, but without any destructuring.

```typescript
function calculateArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius * shape.radius;
  } else {
    return shape.sideLength * shape.sideLength;
  }
}
```

Your challenge is to refactor this function to use a `switch` statement instead of the `if/else` statement. The `switch` statement should be used to narrow the type of `shape` and calculate the area accordingly.

<Exercise title="Exercise 2: Narrowing a Discriminated Union with a Switch Statement" filePath="/src/018-unions-and-narrowing/076-narrowing-a-discriminated-union-with-a-switch-statement.problem.ts"></Exercise>

#### Exercise 3: Discriminated Tuples

Here we have a `fetchData` function that returns a promise that resolves to an `APIResponse` tuple that consists of two elements.

The first element is a string that indicates the type of the response. The second element can be either an array of `User` objects in the case of successful data retrieval, or a string in the event of an error:

```ts
type APIResponse = [string, User[] | string];
```

Here's what the `fetchData` function looks like:

```typescript
async function fetchData(): Promise<APIResponse> {
  try {
    const response = await fetch("https://api.example.com/data");

    if (!response.ok) {
      return [
        "error",
        // Imagine some improved error handling here
        "An error occurred",
      ];
    }

    const data = await response.json();

    return ["success", data];
  } catch (error) {
    return ["error", "An error occurred"];
  }
}
```

However, as seen in the tests below, the `APIResponse` type currently will allow for other combinations that aren't what we want. For example, it would allow for passing an error message when data is being returned:

```ts twoslash
// @errors: 2344
import { Equal, Expect } from "@total-typescript/helpers";

type User = {
  id: number;
  name: string;
};

type APIResponse = [string, User[] | string];

async function fetchData(): Promise<APIResponse> {
  try {
    const response = await fetch("https://api.example.com/data");

    if (!response.ok) {
      return [
        "error",
        // Imagine some improved error handling here
        "An error occurred",
      ];
    }

    const data = await response.json();

    return ["success", data];
  } catch (error) {
    return ["error", "An error occurred"];
  }
}
// ---cut---
async function exampleFunc() {
  const [status, value] = await fetchData();

  if (status === "success") {
    console.log(value);

    type test = Expect<Equal<typeof value, User[]>>;
  } else {
    console.error(value);

    type test = Expect<Equal<typeof value, string>>;
  }
}
```

The problem stems from the `APIResponse` type being a "bag of optionals".

The `APIResponse` type needs to be updated so that there are two possible combinations for the returned tuple:

If the first element is `"error"` then the second element should be the error message.

If the first element is `"success"`, then the second element should be an array of `User` objects.

Your challenge is to redefine the `APIResponse` type to be a discriminated tuple that only allows for the specific combinations for the `success` and `error` states defined above.

<Exercise title="Exercise 3: Discriminated Tuples" filePath="/src/018-unions-and-narrowing/078-destructuring-a-discriminated-tuple.problem.ts"></Exercise>

#### Exercise 4: Handling Defaults with a Discriminated Union

We're back with our `calculateArea` function:

```typescript
function calculateArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius * shape.radius;
  } else {
    return shape.sideLength * shape.sideLength;
  }
}
```

Until now, the test cases have involved checking if the `kind` of the `Shape` is a `circle` or a `square`, then calculating the area accordingly.

However, a new test case has been added for a situation where no `kind` has been passed into the function:

```ts twoslash
// @errors: 2345
import { Equal, Expect } from "@total-typescript/helpers";
import { it, expect } from "vitest";

type Circle = {
  kind: "circle";
  radius: number;
};

type Square = {
  kind: "square";
  sideLength: number;
};

type Shape = Circle | Square;

function calculateArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius * shape.radius;
  } else {
    return shape.sideLength * shape.sideLength;
  }
}

// ---cut---
it("Should calculate the area of a circle when no kind is passed", () => {
  const result = calculateArea({
    radius: 5,
  });

  expect(result).toBe(78.53981633974483);

  type test = Expect<Equal<typeof result, number>>;
});
```

TypeScript is showing errors under `radius` in the test:

The test expects that if a `kind` isn't passed in, the shape should be treated as a circle. However, the current implementation doesn't account for this.

Your challenge is to:

1. Make updates to the `Shape` discriminated union that will allow for us to omit `kind`.
2. Make adjustments to the `calculateArea` function to ensure that TypeScript's type narrowing works properly within the function.

<Exercise title="Exercise 4: Handling Defaults with a Discriminated Union" filePath="/src/018-unions-and-narrowing/080-adding-defaults-to-discriminated-union.problem.ts"></Exercise>

#### Solution 1: Destructuring a Discriminated Union

Before we look at the working solution, let's look at an attempt that doesn't work out.

##### A Non-Working Attempt at Destructuring Parameters

Since we know that `kind` is present in all branches of the discriminated union, we can try using the rest parameter syntax to bring along the other properties:

```typescript
function calculateArea({ kind, ...shape }: Shape) {
  // rest of function
}
```

Then inside of the conditional branches, we can specify the `kind` and destructure from the `shape` object:

```ts twoslash
// @errors: 2339
type Circle = {
  kind: "circle";
  radius: number;
};

type Square = {
  kind: "square";
  sideLength: number;
};

type Shape = Circle | Square;
// ---cut---
function calculateArea({ kind, ...shape }: Shape) {
  if (kind === "circle") {
    const { radius } = shape;

    return Math.PI * radius * radius;
  } else {
    const { sideLength } = shape;

    return sideLength * sideLength;
  }
}
```

However, this approach doesn't work because the `kind` property has been separated from the rest of the shape. As a result, TypeScript can't track the relationship between `kind` and the other properties of `shape`. Both `radius` and `sideLength` have error messages below them.

TypeScript gives us these errors because it still cannot guarantee properties in the function parameters since it doesn't know yet whether it's dealing with a `Circle` or a `Square`.

##### The Working Destructuring Solution

Instead of doing the destructuring at the function parameter level, we instead will revert the function parameter back to `shape`:

```typescript
function calculateArea(shape: Shape) {
  // rest of function
}
```

...and move the destructuring to take place inside of the conditional branches:

```ts
function calculateArea(shape: Shape) {
  if (shape.kind === "circle") {
    const { radius } = shape;

    return Math.PI * radius * radius;
  } else {
    const { sideLength } = shape;

    return sideLength * sideLength;
  }
}
```

Now within the `if` condition, TypeScript can recognize that `shape` is indeed a `Circle` and allows us to safely access the `radius` property. A similar approach is taken for the `Square` in the `else` condition.

This approach works because TypeScript can track the relationship between `kind` and the other properties of `shape` when the destructuring takes place inside of the conditional branches.

In general, I prefer to avoid destructuring when working with discriminated unions. But if you want to, do it _inside_ of the conditional branches.

#### Solution 2: Narrowing a Discriminated Union with a Switch Statement

The first step is to clear out the `calculateArea` function and add the `switch` keyword and specify `shape.kind` as our switch condition:

```typescript
function calculateArea(shape: Shape) {
  switch (shape.kind) {
    case "circle": {
      return Math.PI * shape.radius * shape.radius;
    }
    case "square": {
      return shape.sideLength * shape.sideLength;
    }
    // Potential additional cases for more shapes
  }
}
```

As a nice bonus, TypeScript offers us autocomplete on the cases for the `switch` statement. This is a great way to ensure that we're handling all of the cases for our discriminated union.

##### Not Accounting for All Cases

As an experiment, comment out the case where the `kind` is `square`:

```typescript
function calculateArea(shape: Shape) {
  switch (shape.kind) {
    case "circle": {
      return Math.PI * shape.radius * shape.radius;
    }
    // case "square": {
    //   return shape.sideLength * shape.sideLength;
    // }
    // Potential additional cases for more shapes
  }
}
```

Now when we hover over the function, we see that the return type is `number | undefined`. This is because TypeScript is smart enough to know that if we don't return a value for the `square` case, the output will be `undefined` for any `square` shape.

```typescript
// hovering over `calculateArea` shows
function calculateArea(shape: Shape): number | undefined;
```

Switch statements work great with discriminated unions!

#### Solution 3: Destructuring a Discriminated Union of Tuples

When you're done, your `APIResponse` type should look like this:

```typescript
type APIResponse = ["error", string] | ["success", User[]];
```

We've created two possible combinations for the `APIResponse` type. An error state, and a success state. And instead of objects, we've used tuples.

You might be thinking - where's the discriminant? It's the first element of the tuple. This is what's called a discriminated tuple.

And with this update to the `APIResponse` type, the errors have gone away!

##### Understanding Tuple Relationships

Inside of the `exampleFunc` function, we use array destructuring to pull out the `status` and `value` from the `APIResponse` tuple:

```typescript
const [status, value] = await fetchData();
```

Even though the `status` and `value` variables are separate, TypeScript keeps track of the relationships behind them. If `status` is checked and is equal to `"success"`, TypeScript can narrow down `value` to be of the `User[]` type automatically:

```typescript
// hovering over `status` shows
const status: "error" | "success";
```

Note that this intelligent behavior is specific to discriminated tuples, and won't work with discriminated objects - as we saw in our previous exercise.

#### Solution 4: Handling Defaults with a Discriminated Union

Before we look at the working solution, let's take a look at a couple of approaches that don't quite work out.

##### Attempt 1: Creating an `OptionalCircle` Type

One possible first step is to create an `OptionalCircle` type by discarding the `kind` property:

```typescript
type OptionalCircle = {
  radius: number;
};
```

Then we would update the `Shape` type to include the new type:

```typescript
type Shape = Circle | OptionalCircle | Square;
```

This solution appears to work initially since it resolves the error in the radius test case.

However, this approach brings back errors inside of the `calculateArea` function because the discriminated union is broken since not every member has a `kind` property.

```typescript
function calculateArea(shape: Shape) {
  if (shape.kind === "circle") {
    // error on shape.kind
    return Math.PI * shape.radius * shape.radius;
  } else {
    return shape.sideLength * shape.sideLength;
  }
}
```

##### Attempt 2: Updating the `Circle` Type

Rather than developing a new type, we could modify the `Circle` type to make the `kind` property optional:

```typescript
type Circle = {
  kind?: "circle";
  radius: number;
};

type Square = {
  kind: "square";
  sideLength: number;
};

type Shape = Circle | Square;
```

This modification allows us to distinguish between circles and squares. The discriminated union remains intact while also accommodating the optional case where `kind` is not specified.

However, there is now a new error inside of the `calculateArea` function:

```ts twoslash
// @errors: 2339
type Circle = {
  kind?: "circle";
  radius: number;
};

type Square = {
  kind: "square";
  sideLength: number;
};

type Shape = Circle | Square;

// ---cut---
function calculateArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius * shape.radius;
  } else {
    return shape.sideLength * shape.sideLength;
  }
}
```

The error tells us that TypeScript is no longer able to narrow down the type of `shape` to a `Square` because we're not checking to see if `shape.kind` is `undefined`.

##### Fixing the New Error

It would be possible to fix this error by adding additional checks for the `kind`, but instead we could just swap how our conditional checks work.

We'll check for a `square` first, then fall back to a `circle`:

```typescript
if (shape.kind === "square") {
  return shape.sideLength * shape.sideLength;
} else {
  return Math.PI * shape.radius * shape.radius;
}
```

By inspecting `square` first, all shape cases that aren't squares default to circles. The circle is treated as optional, which preserves our discriminated union and keeps the function flexible.

Sometimes, just flipping the runtime logic makes TypeScript happy!
