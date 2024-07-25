It's commonly thought that there are two levels of TypeScript complexity.

On one end, you have library development. Here, you take advantage of many of TypeScript's most arcane and powerful features. You'll need conditional types, mapped types, generics, and much more to create a library that's flexible enough to be used in a variety of scenarios.

On the other end, you have application development. Here, you're mostly concerned with making sure your code is type-safe. You want to make sure your types reflect what's happening in your application. Any complex types are housed in libraries you use. You'll need to know your way around TypeScript, but you won't need to use its advanced features much.

This is the rule of thumb most of the TypeScript community use. "It's too complex for application code". "You'll only need it in libraries". But there's a third level that's often overlooked: the `/utils` folder.

If your application gets big enough, you'll start capturing common patterns in a set of reusable functions. These functions, like `groupBy`, `debounce`, and `retry`, might be used hundreds of times across a large application. They're like mini-libraries within the scope of your application.

Understanding how to build these types of functions can save your team a lot of time. Capturing common patterns means your code becomes easier to maintain, and faster to build.

In this chapter we'll cover how to build these functions. We'll start with generic functions, then head to type predicates, assertion functions, and function overloads.

## Generic Functions

We've seen that in TypeScript, functions can receive not just values as arguments, but types too. Here, we're passing a _value_ and a _type_ to `new Set()`:

```typescript
const set = new Set<number>([1, 2, 3]);
//                 ^^^^^^^^ ^^^^^^^^^
//                 type     value
```

We pass the type in the angle brackets, and the value in the parentheses. This is because `new Set()` is a generic function. A function that can't receive types is a regular function, like `JSON.parse`:

```ts twoslash
// @errors: 2558
const obj = JSON.parse<{ hello: string }>('{"hello": "world"}');
```

Here, TypeScript is telling us that `JSON.parse` doesn't accept type arguments, because it's not generic.

### What Makes A Function Generic?

A function is generic if it declares a type parameter. Here's a generic function that takes a type parameter `T`:

```typescript
function identity<T>(arg: T): T {
  //                 ^^^ Type parameter
  return arg;
}
```

We can use the function keyword, or use arrow function syntax:

```typescript
const identity = <T>(arg: T): T => arg;
```

We can even declare a generic function as a type:

```typescript
type Identity = <T>(arg: T) => T;

const identity: Identity = (arg) => arg;
```

Now, we can pass a type argument to `identity`:

```typescript
identity<number>(42);
```

#### Generic Function Type Alias vs Generic Type

It's very important not to confuse the syntax for a generic type with the syntax for a type alias for a generic function. They look very similar to the untrained eye. Here's the difference:

```typescript
// Type alias for a generic function
type Identity = <T>(arg: T) => T;
//              ^^^
//              Type parameter belongs to the function

// Generic type
type Identity<T> = (arg: T) => T;
//           ^^^
//           Type parameter belongs to the type
```

It's all about the position of the type parameter. If it's attached to the type's name, it's a generic type. If it's attached to the function's parentheses, it's a type alias for a generic function.

### What Happens When We Don't Pass In A Type Argument?

When we looked at generic types, we saw that TypeScript _requires_ you to pass in all type arguments when you use a generic type:

```ts twoslash
// @errors: 2314
type StringArray = Array<string>;

type AnyArray = Array;
```

This is not true of generic functions. If you don't pass a type argument to a generic function, TypeScript won't complain:

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const result = identity(42); // No error!
```

Why is this? Well, it's the feature of generic functions that make them my favourite TypeScript tool. If you don't pass a type argument, TypeScript will attempt to _infer_ it from the function's runtime arguments.

Our `identity` function above simply takes in an argument and returns it. We've referenced the type parameter in the runtime parameter: `arg: T`. This means that if we don't pass in a type argument, `T` will be inferred from the type of `arg`.

So, `result` will be typed as `42`:

```ts twoslash
function identity<T>(arg: T): T {
  return arg;
}
// ---cut---
const result = identity(42);
//    ^?
```

This means that every time the function is called, it can potentially return a different type:

```ts twoslash
function identity<T>(arg: T): T {
  return arg;
}
// ---cut---
const result1 = identity("hello");
//    ^?

const result2 = identity({ hello: "world" });
//    ^?

const result3 = identity([1, 2, 3]);
//    ^?
```

This ability means that your functions can understand what types they're working with, and alter their suggestions and errors accordingly. It's TypeScript at its most powerful and flexible.

### Specified Types Beat Inferred Types

Let's go back to specifying type arguments instead of inferring them. What happens if your type argument you pass conflicts with the runtime argument?

Let's try it with our `identity` function:

```ts twoslash
// @errors: 2345
function identity<T>(arg: T): T {
  return arg;
}
// ---cut---
const result = identity<string>(42);
```

Here, TypeScript is telling us that `42` is not a `string`. This is because we've explicitly told TypeScript that `T` should be a `string`, which conflicts with the runtime argument.

Passing type arguments is an instruction to TypeScript override inference. If you pass in a type argument, TypeScript will use it as the source of truth. If you don't, TypeScript will use the type of the runtime argument as the source of truth.

### There Is No Such Thing As 'A Generic'

A quick note on terminology here. TypeScript 'generics' has a reputation for being difficult to understand. I think a large part of that is based on how people use the word 'generic'.

A lot of people think of a 'generic' as a part of TypeScript. They think of it like a noun. If you ask someone "where's the 'generic' in this piece of code?":

```typescript
const identity = <T>(arg: T) => arg;
```

They will probably point to the `<T>`. Others might describe the code below as "passing a 'generic' to `Set`":

```typescript
const set = new Set<number>([1, 2, 3]);
```

This terminology gets very confusing. Instead, I prefer to split them into different terms:

- Type Parameter: The `<T>` in `identity<T>`.
- Type Argument: The `number` passed to `Set<number>`.
- Generic Class/Function/Type: A class, function or type that declares a type parameter.

When you break generics down into these terms, it becomes much easier to understand.

### The Problem Generic Functions Solve

Let's put what we've learned into practice.

Consider this function called `getFirstElement` that takes an array and returns the first element:

```typescript
const getFirstElement = (arr: any[]) => {
  return arr[0];
};
```

This function is dangerous. Because it takes an array of `any`, it means that the thing we get back from `getFirstElement` is also `any`:

```ts twoslash
const getFirstElement = (arr: any[]) => {
  return arr[0];
};

// ---cut---
const first = getFirstElement([1, 2, 3]);
//    ^?
```

As we've seen, `any` can cause havoc in your code. Anyone who uses this function will be unwittingly opting out of TypeScript's type safety. So, how can we fix this?

We need TypeScript to understand the type of the array we're passing in, and use it to type what's returned. We need to make `getFirstElement` generic:

To do this, we'll add a type parameter `TMember` before the function's parameter list, then use `TMember[]` as the type for the array:

```typescript
const getFirstElement = <TMember>(arr: TMember[]) => {
  return arr[0];
};
```

Just like generic functions, it's common to prefix your type parameters with `T` to differentiate them from normal types.

Now when we call `getFirstElement`, TypeScript will infer the type of `` based on the argument we pass in:

```ts twoslash
const getFirstElement = <TMember>(arr: TMember[]) => {
  return arr[0];
};
// ---cut---
const firstNumber = getFirstElement([1, 2, 3]);
//    ^?
const firstString = getFirstElement(["a", "b", "c"]);
//    ^?
```

Now, we've made `getFirstElement` type-safe. The type of the array we pass in is the type of the thing we get back.

### Debugging The Inferred Type Of Generic Functions

When you're working with generic functions, it can be hard to know what type TypeScript has inferred. However, with a carefully-placed hover, you can find out.

When we call the `getFirstElement` function, we can hover over the function name to see what TypeScript has inferred:

```ts twoslash
const getFirstElement = <TMember>(arr: TMember[]) => {
  return arr[0];
};
// ---cut---
const first = getFirstElement([1, 2, 3]);
//            ^?
```

We can see that within the angle brackets, TypeScript has inferred that `TMember` is `number`, because we passed in an array of numbers.

This can be useful when you have more complex functions with multiple type parameters to debug. I often find myself creating temporary function calls in the same file to see what TypeScript has inferred.

### Type Parameter Defaults

Just like generic types, you can set default values for type parameters in generic functions. This can be useful when runtime arguments to the function are optional:

```typescript
const createSet = <T = string>(arr?: T[]) => {
  return new Set(arr);
};
```

Here, we set the default type of `T` to `string`. This means that if we don't pass in a type argument, TypeScript will assume `T` is `string`:

```ts twoslash
const createSet = <T = string>(arr?: T[]) => {
  return new Set(arr);
};
// ---cut---
const defaultSet = createSet();
//    ^?
```

The default doesn't impose a constraint on the type of `T`. This means we can still pass in any type we want:

```ts twoslash
const createSet = <T = string>(arr?: T[]) => {
  return new Set(arr);
};
// ---cut---
const numberSet = createSet<number>([1, 2, 3]);
//    ^?
```

If we don't specify a default, and TypeScript can't infer the type from the runtime arguments, it will default to `unknown`:

```ts twoslash
const createSet = <T>(arr?: T[]) => {
  return new Set(arr);
};

const unknownSet = createSet();
//    ^?
```

Here, we've removed the default type of `T`, and TypeScript has defaulted to `unknown`.

### Constraining Type Parameters

You can also add constraints to type parameters in generic functions. This can be useful when you want to ensure that a type has certain properties.

Let's imagine a `removeId` function that takes an object and removes the `id` property:

```ts twoslash
// @errors: 2339
const removeId = <TObj>(obj: TObj) => {
  const { id, ...rest } = obj;
  return rest;
};
```

Our `TObj` type parameter, when used without a constraint, is treated as `unknown`. This means that TypeScript doesn't know if `id` exists on `obj`.

To fix this, we can add a constraint to `TObj` that ensures it has an `id` property:

```typescript
const removeId = <TObj extends { id: unknown }>(obj: TObj) => {
  const { id, ...rest } = obj;
  return rest;
};
```

Now, when we use `removeId`, TypeScript will error if we don't pass in an object with an `id` property:

```ts twoslash
// @errors: 2353
const removeId = <TObj extends { id: unknown }>(obj: TObj) => {
  const { id, ...rest } = obj;
  return rest;
};
// ---cut---
const result = removeId({ name: "Alice" });
```

But if we pass in an object with an `id` property, TypeScript will know that `id` has been removed:

```ts twoslash
const removeId = <TObj extends { id: unknown }>(obj: TObj) => {
  const { id, ...rest } = obj;
  return rest;
};
// ---cut---
const result = removeId({ id: 1, name: "Alice" });
//    ^?
```

Note how clever TypeScript is being here. Even though we didn't specify a return type for `removeId`, TypeScript has inferred that `result` is an object with all the properties of the input object, except `id`.

## Type Predicates

We were introduced to type predicates way back in chapter 5, when we looked at narrowing. They're used to capture reusable logic that narrows the type of a variable.

For example, say we want to ensure that a variable is an `Album` before we try accessing its properties or passing it to a function that requires an `Album`.

We can write an `isAlbum` function that takes in an input, and checks for all the required properties.

```typescript
function isAlbum(input: unknown) {
  return (
    typeof input === "object" &&
    input !== null &&
    "id" in input &&
    "title" in input &&
    "artist" in input &&
    "year" in input
  );
}
```

If we hover over `isAlbum`, we can see a rather ugly type signature:

```typescript
// hovering over isAlbum shows:
function isAlbum(
  input: unknown,
): input is object &
  Record<"id", unknown> &
  Record<"title", unknown> &
  Record<"artist", unknown> &
  Record<"year", unknown>;
```

This is technically correct: a big intersection between an `object` and a bunch of `Record`s. But it's not very helpful.

When we try to use `isAlbum` to narrow the type of a value, TypeScript won't infer it correctly:

```ts twoslash
// @errors: 18046
function isAlbum(input: unknown) {
  return (
    typeof input === "object" &&
    input !== null &&
    "id" in input &&
    "title" in input &&
    "artist" in input &&
    "year" in input
  );
}

// ---cut---
const run = (maybeAlbum: unknown) => {
  if (isAlbum(maybeAlbum)) {
    maybeAlbum.name.toUpperCase();
  }
};
```

To fix this, we'd need to add even more checks to `isAlbum` to ensure we're checking the types of all the properties:

```typescript
function isAlbum(input: unknown) {
  return (
    typeof input === "object" &&
    input !== null &&
    "id" in input &&
    "title" in input &&
    "artist" in input &&
    "year" in input &&
    typeof input.id === "number" &&
    typeof input.title === "string" &&
    typeof input.artist === "string" &&
    typeof input.year === "number"
  );
}
```

But at this point, something frustrating happens - TypeScript _stops_ inferring the return value of the function. We can see this by hovering over `isAlbum`:

```typescript
// hovering over isAlbum shows:
function isAlbum(input: unknown): boolean;
```

This is because TypeScript's type predicate inference has limits - it can only process a certain level of complexity.

Not only that, but our code is now _extremely_ defensive. We're checking the existence _and_ type of every property. This is a lot of boilerplate, and might not be necessary. In fact, code like this should probably be encapsulated in a library like [Zod](https://zod.dev/).

### Writing Your Own Type Predicates

To solve this, we can manually annotate our `isAlbum` function with a type predicate:

```typescript
function isAlbum(input: unknown): input is Album {
  return (
    typeof input === "object" &&
    input !== null &&
    "id" in input &&
    "title" in input &&
    "artist" in input &&
    "year" in input
  );
}
```

This annotation tells TypeScript that when `isAlbum` returns `true`, the type of the value has been narrowed to `Album`.

Now, when we use `isAlbum`, TypeScript will infer it correctly:

```typescript
const run = (maybeAlbum: unknown) => {
  if (isAlbum(maybeAlbum)) {
    maybeAlbum.name.toUpperCase(); // No error!
  }
};
```

This can ensure that you get the same type behavior from complex type guards.

### Type Predicates Can be Unsafe

Authoring your own type predicates can be a little dangerous. TypeScript doesn't track if the type predicate's runtime behavior matches the type predicate's type signature.

```typescript
function isNumber(input: unknown): input is number {
  return typeof input === "string";
}
```

In this case, TypeScript _thinks_ that `isNumber` checks if something is a number. But in fact, it checks if something is a string! There are no guarantees that the runtime behavior of the function matches the type signature.

This is a common pitfall when working with type predicates - it's important to consider them about as unsafe as `as` and `!`.

## Assertion Functions

Assertion functions look similar to type predicates, but they're used slightly differently. Instead of returning a boolean to indicate whether a value is of a certain type, assertion functions throw an error if the value isn't of the expected type.

Here's how we could rework the `isAlbum` type predicate to be an `assertIsItem` assertion function:

```typescript
function assertIsAlbum(input: unknown): asserts input is Album {
  if (
    typeof input === "object" &&
    input !== null &&
    "id" in input &&
    "title" in input &&
    "artist" in input &&
    "year" in input
  ) {
    throw new Error("Not an Album!");
  }
}
```

The `assertIsAlbum` function takes in a `input` of type `unknown` and asserts that it is an `Album` using the `asserts input is Album` syntax.

This means that the narrowing is more aggressive. Instead of checking within an `if` statement, the function call itself is enough to assert that the `input` is an `Album`.

```ts twoslash
type Album = {
  id: number;
  title: string;
  artist: string;
  year: number;
};

function assertIsAlbum(input: unknown): asserts input is Album {
  if (
    typeof input === "object" &&
    input !== null &&
    "id" in input &&
    "title" in input &&
    "artist" in input &&
    "year" in input
  ) {
    throw new Error("Not an Album!");
  }
}
// ---cut---
function getAlbumTitle(item: unknown) {
  console.log(item);
  //          ^?

  assertIsAlbum(item);

  console.log(item.title);
  //          ^?
}
```

Assertion functions can be useful when you want to ensure that a value is of a certain type before proceeding with further operations.

### Assertion Functions Can Lie

Just like type predicates, assertion functions can be misused. If the assertion function doesn't accurately reflect the type being checked, it can lead to runtime errors.

For example, if the `assertIsAlbum` function doesn't check for all the required properties of an `Album`, it can lead to unexpected behavior:

```typescript
function assertIsAlbum(input: unknown): asserts input is Album {
  if (typeof input === "object") {
    throw new Error("Not an Album!");
  }
}

let item = null;

assertIsAlbum(item);

item.title;
// ^?
```

In this case, the `assertIsAlbum` function doesn't check for the required properties of an `Album` - it just checks if `typeof input` is `"object"`. This means we've left ourselves open to a stray `null`. The famous JavaScript quirk where `typeof null === 'object'` will cause a runtime error when we try to access the `title` property.

## Function Overloads

Function overloads provide a way to define multiple function signatures for a single function implementation. In other words, you can define different ways to call a function, each with its own set of parameters and return types. It's an interesting technique for creating a flexible API that can handle different use cases while maintaining type safety.

To demonstrate how function overloads work, we'll create a `searchMusic` function that allows for different ways to perform a search based on the provided arguments.

### Defining Overloads

To define function overloads, the same function definition is written multiple times with different parameter and return types. Each definition is called an overload signature, and is separated by semicolons. You'll also need to use the `function` keyword each time.

For the `searchMusic` example, we want to allow users to search by providing an artist, genre and year. But for legacy reasons, we want them to be able to pass them as a single object or as separate arguments.

Here's how we could define these function overload signatures. The first signature takes in three separate arguments, while the second signature takes in a single object with the properties:

```ts twoslash
// @errors: 2391
function searchMusic(artist: string, genre: string, year: number): void;
function searchMusic(criteria: {
  artist: string;
  genre: string;
  year: number;
}): void;
```

But we're getting an error. We've declared some ways this function should be declared, but we haven't provided the implementation yet.

### The Implementation Signature

The implementation signature is the actual function declaration that contains the actual logic for the function. It is written below the overload signatures, and must be compatible with all the defined overloads.

In this case, the implementation signature will take in a parameter called `queryOrCriteria` that can be either a `string` or an object with the specified properties. Inside the function, we'll check the type of `queryOrCriteria` and perform the appropriate search logic based on the provided arguments:

```typescript
function searchMusic(artist: string, genre: string, year: number): void;
function searchMusic(criteria: {
  artist: string;
  genre: string;
  year: number;
}): void;
function searchMusic(
  artistOrCriteria: string | { artist: string; genre: string; year: number },
  genre?: string,
  year?: number,
): void {
  if (typeof artistOrCriteria === "string") {
    // Search with separate arguments
    search(artistOrCriteria, genre, year);
  } else {
    // Search with object
    search(
      artistOrCriteria.artist,
      artistOrCriteria.genre,
      artistOrCriteria.year,
    );
  }
}
```

Now we can call the `searchMusic` function with the different arguments defined in the overloads:

```typescript
searchMusic("King Gizzard and the Lizard Wizard", "Psychedelic Rock", 2021);
searchMusic({
  artist: "Tame Impala",
  genre: "Psychedelic Rock",
  year: 2015,
});
```

However, TypeScript will warn us if we attempt to pass in an argument that doesn't match any of the defined overloads:

```ts twoslash
// @errors: 2575
function searchMusic(artist: string, genre: string, year: number): void;
function searchMusic(criteria: {
  artist: string;
  genre: string;
  year: number;
}): void;
function searchMusic(
  artistOrCriteria: string | { artist: string; genre: string; year: number },
  genre?: string,
  year?: number,
): void {}
// ---cut---
searchMusic(
  {
    artist: "Tame Impala",
    genre: "Psychedelic Rock",
    year: 2015,
  },
  "Psychedelic Rock",
);
```

This error shows us that we're trying to call `searchMusic` with two arguments, but the overloads only expect one or three arguments.

### Function Overloads vs Unions

Function overloads can be useful when you have multiple call signatures spread over different sets of arguments. In the example above, we can either call the function with one argument, or three.

When you have the same number of arguments but different types, you should use a union type instead of function overloads. For example, if you want to allow the user to search by either artist name or criteria object, you could use a union type:

```typescript
function searchMusic(
  query: string | { artist: string; genre: string; year: number },
): void {
  if (typeof query === "string") {
    // Search by artist
    searchByArtist(query);
  } else {
    // Search by all
    search(query.artist, query.genre, query.year);
  }
}
```

This uses far fewer lines of code than defining two overloads and an implementation.

## Exercises

### Exercise 1: Make a Function Generic

Here we have a function `createStringMap`. The purpose of this function is to generate a `Map` with keys as strings and values of the type passed in as arguments:

```typescript
const createStringMap = () => {
  return new Map();
};
```

As it currently stands, we get back a `Map<any, any>`. However, the goal is to make this function generic so that we can pass in a type argument to define the type of the values in the `Map`.

For example, if we pass in `number` as the type argument, the function should return a `Map` with values of type `number`:

```ts twoslash
// @errors: 2558 2578
const createStringMap = () => {
  return new Map();
};
// ---cut---
const numberMap = createStringMap<number>();

numberMap.set("foo", 123);
```

Likewise, if we pass in an object type, the function should return a `Map` with values of that type:

```ts twoslash
// @errors: 2558 2578
const createStringMap = () => {
  return new Map();
};
// ---cut---
const objMap = createStringMap<{ a: number }>();

objMap.set("foo", { a: 123 });

objMap.set(
  "bar",
  // @ts-expect-error
  { b: 123 },
);
```

The function should also default to `unknown` if no type is provided:

```ts twoslash
// @errors: 2344
import { Equal, Expect } from "@total-typescript/helpers";
const createStringMap = () => {
  return new Map();
};
// ---cut---
const unknownMap = createStringMap();

type test = Expect<Equal<typeof unknownMap, Map<string, unknown>>>;
```

Your task is to transform `createStringMap` into a generic function capable of accepting a type argument to describe the values of Map. Make sure it functions as expected for the provided test cases.

<Exercise title="Exercise 1: Make a Function Generic" filePath="/src/085-the-utils-folder/215-generic-functions-without-inference.problem.ts"></Exercise>

### Exercise 2: Default Type Arguments

After making the `createStringMap` function generic in Exercise 1, calling it without a type argument defaults to values being typed as `unknown`:

```typescript
const stringMap = createStringMap();

// hovering over stringMap shows:
const stringMap: Map<string, unknown>;
```

Your goal is to add a default type argument to the `createStringMap` function so that it defaults to `string` if no type argument is provided. Note that you will still be able to override the default type by providing a type argument when calling the function.

<Exercise title="Exercise 2: Default Type Arguments" filePath="/src/085-the-utils-folder/216-type-parameter-defaults-in-generic-functions.problem.ts"></Exercise>

### Exercise 3: Inference in Generic Functions

Consider this `uniqueArray` function:

```typescript
const uniqueArray = (arr: any[]) => {
  return Array.from(new Set(arr));
};
```

The function accepts an array as an argument, then converts it to a `Set`, then returns it as a new array. This is a common pattern for when you want to have unique values inside your array.

While this function operates effectively at runtime, it lacks type safety. It transforms any array passed in into `any[]`.

```ts twoslash
// @errors: 2344
import { Equal, Expect } from "@total-typescript/helpers";
import { it, expect } from "vitest";
const uniqueArray = (arr: any[]) => {
  return Array.from(new Set(arr));
};
// ---cut---
it("returns an array of unique values", () => {
  const result = uniqueArray([1, 1, 2, 3, 4, 4, 5]);

  type test = Expect<Equal<typeof result, number[]>>;

  expect(result).toEqual([1, 2, 3, 4, 5]);
});

it("should work on strings", () => {
  const result = uniqueArray(["a", "b", "b", "c", "c", "c"]);

  type test = Expect<Equal<typeof result, string[]>>;

  expect(result).toEqual(["a", "b", "c"]);
});
```

Your task is to boost the type safety of the `uniqueArray` function by making it generic.

Note that in the tests, we do not explicitly provide type arguments when invoking the function. TypeScript should be able to infer the type from the argument.

Adjust the function and insert the necessary type annotations to ensure that the `result` type in both tests is inferred as `number[]` and `string[]`, respectively.

<Exercise title="Exercise 3: Inference in Generic Functions" filePath="/src/085-the-utils-folder/217-generic-functions-with-inference.problem.ts"></Exercise>

### Exercise 4: Type Parameter Constraints

Consider this function `addCodeToError`, which accepts a type parameter `TError` and returns an object with a `code` property:

```ts twoslash
// @errors: 2339
const UNKNOWN_CODE = 8000;

const addCodeToError = <TError>(error: TError) => {
  return {
    ...error,
    code: error.code ?? UNKNOWN_CODE,
  };
};
```

If the incoming error doesn't include a `code`, the function assigns a default `UNKNOWN_CODE`. Currently there is an error under the `code` property.

Currently, there are no constraints on `TError`, which can be of any type. This leads to errors in our tests:

```ts twoslash
// @errors: 2344
import { Equal, Expect } from "@total-typescript/helpers";
import { it, expect } from "vitest";

const UNKNOWN_CODE = 8000;

const addCodeToError = <TError>(error: TError) => {
  return {
    ...error,
    code: (error as any).code ?? UNKNOWN_CODE,
  };
};
// ---cut---
it("Should accept a standard error", () => {
  const errorWithCode = addCodeToError(new Error("Oh dear!"));

  type test1 = Expect<Equal<typeof errorWithCode, Error & { code: number }>>;

  console.log(errorWithCode.message);

  type test2 = Expect<Equal<typeof errorWithCode.message, string>>;
});

it("Should accept a custom error", () => {
  const customErrorWithCode = addCodeToError({
    message: "Oh no!",
    code: 123,
    filepath: "/",
  });

  type test3 = Expect<
    Equal<
      typeof customErrorWithCode,
      {
        message: string;
        code: number;
        filepath: string;
      } & {
        code: number;
      }
    >
  >;

  type test4 = Expect<Equal<typeof customErrorWithCode.message, string>>;
});
```

Your task is to update the `addCodeToError` type signature to enforce the required constraints so that `TError` is required to have a `message` property and can optionally have a `code` property.

<Exercise title="Exercise 4: Type Parameter Constraints" filePath="/src/085-the-utils-folder/216-type-parameter-defaults-in-generic-functions.problem.ts"></Exercise>

### Exercise 5: Combining Generic Types and Functions

Here we have `safeFunction`, which accepts a function `func` typed as `PromiseFunc` that returns a function itself. However, if `func` encounters an error, it is caught and returned instead:

```typescript
type PromiseFunc = () => Promise<any>;

const safeFunction = (func: PromiseFunc) => async () => {
  try {
    const result = await func();
    return result;
  } catch (e) {
    if (e instanceof Error) {
      return e;
    }
    throw e;
  }
};
```

In short, the thing that we get back from `safeFunction` should either be the thing that's returned from `func` or an `Error`.

However, there are some issues with the current type definitions.

The `PromiseFunc` type is currently set to always return `Promise<any>`. This means that the function returned by `safeFunction` is supposed to return either the result of `func` or an `Error`, but at the moment, it's just returning `Promise<any>`.

There are several tests that are failing due to these issues:

```ts twoslash
// @errors: 2344
import { Equal, Expect } from "@total-typescript/helpers";
import { it, expect } from "vitest";

type PromiseFunc = () => Promise<any>;

const safeFunction = (func: PromiseFunc) => async () => {
  try {
    const result = await func();
    return result;
  } catch (e) {
    if (e instanceof Error) {
      return e;
    }
    throw e;
  }
};

// ---cut---
it("should return an error if the function throws", async () => {
  const func = safeFunction(async () => {
    if (Math.random() > 0.5) {
      throw new Error("Something went wrong");
    }
    return 123;
  });

  type test1 = Expect<Equal<typeof func, () => Promise<Error | number>>>;

  const result = await func();

  type test2 = Expect<Equal<typeof result, Error | number>>;
});

it("should return the result if the function succeeds", async () => {
  const func = safeFunction(() => {
    return Promise.resolve(`Hello!`);
  });

  type test1 = Expect<Equal<typeof func, () => Promise<string | Error>>>;

  const result = await func();

  type test2 = Expect<Equal<typeof result, string | Error>>;

  expect(result).toEqual("Hello!");
});
```

Your task is to update `safeFunction` to have a generic type parameter, and update `PromiseFunc` to not return `Promise<any>`. This will require you to combine generic types and functions to ensure that the tests pass successfully.

<Exercise title="Exercise 5: Combining Generic Types and Functions" filePath="/src/085-the-utils-folder/219-combining-generic-types-with-generic-functions.problem.ts"></Exercise>

### Exercise 6: Multiple Type Arguments in a Generic Function

After making the `safeFunction` generic in Exercise 5, it's been updated to allow for passing arguments:

```typescript
const safeFunction =
  <TResult>(func: PromiseFunc<TResult>) =>
  async (...args: any[]) => {
    //   ^^^^^^^^^^^^^^ Now can receive args!
    try {
      const result = await func(...args);
      return result;
    } catch (e) {
      if (e instanceof Error) {
        return e;
      }
      throw e;
    }
  };
```

Now that the function being passed into `safeFunction` can receive arguments, the function we get back should _also_ contain those arguments and require you to pass them in.

However, as seen in the tests, this isn't working:

```ts twoslash
// @errors: 2344
import { Equal, Expect } from "@total-typescript/helpers";
import { it, expect } from "vitest";

type PromiseFunc<T> = (...args: any[]) => Promise<T>;

const safeFunction =
  <TResult>(func: PromiseFunc<TResult>) =>
  async (...args: any[]) => {
    //   ^^^^^^^^^^^^^^ Now can receive args!
    try {
      const result = await func(...args);
      return result;
    } catch (e) {
      if (e instanceof Error) {
        return e;
      }
      throw e;
    }
  };
// ---cut---
it("should return the result if the function succeeds", async () => {
  const func = safeFunction((name: string) => {
    return Promise.resolve(`hello ${name}`);
  });

  type test1 = Expect<
    Equal<typeof func, (name: string) => Promise<Error | string>>
  >;
});
```

For example, in the above test the `name` isn't being inferred as a parameter of the function returned by `safeFunction`. Instead, it's actually saying that we can pass in as many arguments as we want to into the function, which isn't correct.

```typescript
// hovering over func shows:
const func: (...args: any[]) => Promise<string | Error>;
```

Your task is to add a second type parameter to `PromiseFunc` and `safeFunction` to infer the argument types accurately.

As seen in the tests, there are cases where no parameters are necessary, and others where a single parameter is needed:

```ts twoslash
// @errors: 2344
import { Equal, Expect } from "@total-typescript/helpers";
import { it, expect } from "vitest";

type PromiseFunc<T> = (...args: any[]) => Promise<T>;

const safeFunction =
  <TResult>(func: PromiseFunc<TResult>) =>
  async (...args: any[]) => {
    try {
      const result = await func(...args);
      return result;
    } catch (e) {
      if (e instanceof Error) {
        return e;
      }
      throw e;
    }
  };
// ---cut---
it("should return an error if the function throws", async () => {
  const func = safeFunction(async () => {
    if (Math.random() > 0.5) {
      throw new Error("Something went wrong");
    }
    return 123;
  });

  type test1 = Expect<Equal<typeof func, () => Promise<Error | number>>>;

  const result = await func();

  type test2 = Expect<Equal<typeof result, Error | number>>;
});

it("should return the result if the function succeeds", async () => {
  const func = safeFunction((name: string) => {
    return Promise.resolve(`hello ${name}`);
  });

  type test1 = Expect<
    Equal<typeof func, (name: string) => Promise<Error | string>>
  >;

  const result = await func("world");

  type test2 = Expect<Equal<typeof result, string | Error>>;

  expect(result).toEqual("hello world");
});
```

Update the types of the function and the generic type, and make these tests pass successfully.

<Exercise title="Exercise 6: Multiple Type Arguments in a Generic Function" filePath="/src/085-the-utils-folder/220-multiple-type-arguments-in-generic-functions.problem.ts"></Exercise>

### Exercise 8: Assertion Functions

This exercise starts with an interface `User`, which has properties `id` and `name`. Then we have an interface `AdminUser`, which extends `User`, inheriting all its properties and adding a `roles` string array property:

```typescript
interface User {
  id: string;
  name: string;
}

interface AdminUser extends User {
  roles: string[];
}
```

The function `assertIsAdminUser` accepts either a `User` or `AdminUser` object as an argument. If the `roles` property isn't present in the argument, the function throws an error:

```typescript
function assertIsAdminUser(user: User | AdminUser) {
  if (!("roles" in user)) {
    throw new Error("User is not an admin");
  }
}
```

This function's purpose is to verify we are able to access properties that are specific to the `AdminUser`, such as `roles`.

In the `handleRequest` function, we call `assertIsAdminUser` and expect the type of `user` to be narrowed down to `AdminUser`.

But as seen in this test case, it doesn't work as expected:

```ts twoslash
// @errors: 2344 2339
import { Equal, Expect } from "@total-typescript/helpers";

interface User {
  id: string;
  name: string;
}

interface AdminUser extends User {
  roles: string[];
}

function assertIsAdminUser(user: User | AdminUser) {
  if (!("roles" in user)) {
    throw new Error("User is not an admin");
  }
}

// ---cut---
const handleRequest = (user: User | AdminUser) => {
  type test1 = Expect<Equal<typeof user, User | AdminUser>>;

  assertIsAdminUser(user);

  type test2 = Expect<Equal<typeof user, AdminUser>>;

  user.roles;
};
```

The `user` type is `User | AdminUser` before `assertIsAdminUser` is called, but it doesn't get narrowed down to just `AdminUser` after the function is called. This means we can't access the `roles` property.

Your task is to update the `assertIsAdminUser` function with the proper type assertion so that the `user` is identified as an `AdminUser` after the function is called.

<Exercise title="Exercise 8: Assertion Functions" filePath="/src/085-the-utils-folder/222-assertion-functions.problem.ts"></Exercise>

### Solution 1: Make a Function Generic

The first thing we'll do to make this function generic is to add a type parameter `T`:

```typescript
const createStringMap = <T>() => {
  return new Map();
};
```

With this change, our `createStringMap` function can now handle a type argument `T`.

The error has disappeared from the `numberMap` variable, but the function is still returning a `Map<any, any>`:

```typescript
const numberMap = createStringMap<number>();

// hovering over createStringMap shows:
const createStringMap: <number>() => Map<any, any>;
```

We need to specify the types for the map entries.

Since we know that the keys will always be strings, we'll set the first type argument of `Map` to `string`. For the values, we'll use our type parameter `T`:

```typescript
const createStringMap = <T>() => {
  return new Map<string, T>();
};
```

Now the function can correctly type the map's values.

If we don't pass in a type argument, the function will default to `unknown`:

```typescript
const objMap = createStringMap();

// hovering over objMap shows:
const objMap: Map<string, unknown>;
```

Through these steps, we've successfully transformed `createStringMap` from a regular function into a generic function capable of receiving type arguments.

### Solution 2: Default Type Arguments

The syntax for setting default types for generic functions is the same as for generic types:

```typescript
const createStringMap = <T = string>() => {
  return new Map<string, T>();
};
```

By using the `T = string` syntax, we tell the function that if no type argument is supplied, it should default to `string`.

Now when we call `createStringMap()` without a type argument, we end up with a `Map` where both keys and values are `string`:

```typescript
const stringMap = createStringMap();

// hovering over stringMap shows:
const stringMap: Map<string, string>;
```

If we attempt to assign a number as a value, TypeScript gives us an error because it expects a string:

```ts twoslash
// @errors: 2345
const createStringMap = <T = string>() => {
  return new Map<string, T>();
};

const stringMap = createStringMap();

// ---cut---
stringMap.set("bar", 123);
```

However, we can still override the default type by providing a type argument when calling the function:

```typescript
const numberMap = createStringMap<number>();
numberMap.set("foo", 123);
```

In the above code, `numberMap` will result in a `Map` with `string` keys and `number` values, and TypeScript will give an error if we try assigning a non-number value:

```typescript
numberMap.set(
  "bar",
  // @ts-expect-error
  true,
);
```

### Solution 3: Inference in Generic Functions

The first step is to add a type parameter onto `uniqueArray`. This turns `uniqueArray` into a generic function that can receive type arguments:

```typescript
const uniqueArray = <T>(arr: any[]) => {
  return Array.from(new Set(arr));
};
```

Now when we hover over a call to `uniqueArray`, we can see that it is inferring the type as `unknown`:

```ts twoslash
const uniqueArray = <T>(arr: any[]) => {
  return Array.from(new Set(arr));
};

// ---cut---
const result = uniqueArray([1, 1, 2, 3, 4, 4, 5]);
//             ^?
```

This is because we haven't passed any type arguments to it. If there's no type argument and no default, it defaults to unknown.

We want the type argument to be inferred as a number because we know that the thing we're getting back is an array of numbers.

So what we'll do is add a return type of `T[]` to the function:

```typescript
const uniqueArray = <T>(arr: any[]): T[] => {
  return Array.from(new Set(arr));
};
```

Now the result of `uniqueArray` is inferred as an `unknown` array:

```ts twoslash
const uniqueArray = <T>(arr: any[]): T[] => {
  return Array.from(new Set(arr));
};

// ---cut---
const result = uniqueArray([1, 1, 2, 3, 4, 4, 5]);
//    ^?
```

Again, the reason for this is that we haven't passed any type arguments to it. If there's no type argument and no default, it defaults to unknown.

If we add a `<number>` type argument to the call, the `result` will now be inferred as a number array:

```ts twoslash
const uniqueArray = <T>(arr: any[]): T[] => {
  return Array.from(new Set(arr));
};
// ---cut---
const result = uniqueArray<number>([1, 1, 2, 3, 4, 4, 5]);
//       ^?
```

However, at this point there's no relationship between the things we're passing in and the thing we're getting out. Adding a type argument to the call returns an array of that type, but the `arr` parameter in the function itself is still typed as `any[]`.

What we need to do is tell TypeScript that the type of the `arr` parameter is the same type as what is passed in.

To do this, we'll replace `arr: any[]` with `arr: T[]`:

```typescript
const uniqueArray = <T>(arr: T[]): T[] => {
  ...
```

The function's return type is an array of `T`, where `T` represents the type of elements in the array supplied to the function.

Thus, TypeScript can infer the return type as `number[]` for an input array of numbers, or `string[]` for an input array of strings, even without explicit return type annotations. As we can see, the tests pass successfully:

```typescript
// number test
const result = uniqueArray([1, 1, 2, 3, 4, 4, 5]);

type test = Expect<Equal<typeof result, number[]>>;

// string test
const result = uniqueArray(["a", "b", "b", "c", "c", "c"]);

type test = Expect<Equal<typeof result, string[]>>;
```

If you explicitly pass a type argument, TypeScript will use it. If you don't, TypeScript attempts to infer it from the runtime arguments.

### Solution 4: Type Parameter Constraints

The syntax to add constraints is the same as what we saw for generic types.

We need to use the `extends` keyword to add constraints to the generic type parameter `TError`. The object passed in is required to have a `message` property of type `string`, and can optionally have a `code` of type `number`:

```typescript
const UNKNOWN_CODE = 8000;

const addCodeToError = <TError extends { message: string; code?: number }>(
  error: TError,
) => {
  return {
    ...error,
    code: error.code ?? UNKNOWN_CODE,
  };
};
```

This change ensures that `addCodeToError` must be called with an object that includes a `message` string property. TypeScript also knows that `code` could either be a number or `undefined`. If `code` is absent, it will default to `UNKNOWN_CODE`.

These constraints make our tests pass, including the case where we pass in an extra `filepath` property. This is because using `extends` in generics does not restrict you to only passing in the properties defined in the constraint.

### Solution 5: Combining Generic Types and Functions

Here's the starting point of our `safeFunction`:

```typescript
type PromiseFunc = () => Promise<any>;

const safeFunction = (func: PromiseFunc) => async () => {
  try {
    const result = await func();
    return result;
  } catch (e) {
    if (e instanceof Error) {
      return e;
    }
    throw e;
  }
};
```

The first thing we'll do is update the `PromiseFunc` type to be a generic type. We'll call the type parameter `TResult` to represent the type of the value returned by the promise, and and it to the return type of the function:

```typescript
type PromiseFunc<TResult> = () => Promise<TResult>;
```

With this update, we now need to update the `PromiseFunc` in the `safeFunction` to include the type argument:

```typescript
const safeFunction =
  <TResult>(func: PromiseFunc<TResult>) =>
  async () => {
    try {
      const result = await func();
      return result;
    } catch (e) {
      if (e instanceof Error) {
        return e;
      }
      throw e;
    }
  };
```

With these changes in place, when we hover over the `safeFunction` call in the first test, we can see that the type argument is inferred as `number` as expected:

```typescript
it("should return an error if the function throws", async () => {
  const func = safeFunction(async () => {
    if (Math.random() > 0.5) {
      throw new Error("Something went wrong");
    }
    return 123;
  });
  ...

// hovering over safeFunction shows:
const safeFunction: <number>(func: PromiseFunc<number>) => Promise<() => Promise<number | Error>>
```

The other tests pass as well.

Whatever we pass into `safeFunction` will be inferred as the type argument for `PromiseFunc`. This is because the type argument is being inferred _inside_ the generic function.

This combination of generic functions and generic types can make your generic functions a lot easier to read.

### Solution 6: Multiple Type Arguments in a Generic Function

Here's how `PromiseFunc` is currently defined:

```typescript
type PromiseFunc<TResult> = (...args: any[]) => Promise<TResult>;
```

The first thing to do is figure out the types of the arguments being passed in. Currently, they're set to one value, but they need to be different based on the type of function being passed in.

Instead of having `args` be of type `any[]`, we want to spread in all of the `args` and capture the entire array.

To do this, we'll update the type to be `TArgs`. Since `args` needs to be an array, we'll say that `TArgs extends any[]`. Note that this doesn't mean that `TArgs` will be typed as `any`, but rather that it will accept any kind of array:

```typescript
type PromiseFunc<TArgs extends any[], TResult> = (
  ...args: TArgs
) => Promise<TResult>;
```

You might have tried this with `unknown[]` - but `any[]` is the only thing that works in this scenario.

Now we need to update the `safeFunction` so that it has the same arguments as `PromiseFunc`. To do this, we'll add `TArgs` to its type parameters.

Note that we also need to update the args for the `async` function to be of type `TArgs`:

```typescript
const safeFunction =
  <TArgs extends any[], TResult>(func: PromiseFunc<TArgs, TResult>) =>
  async (...args: TArgs) => {
    try {
      const result = await func(...args);
      return result;
    } catch (e) {
      ...
```

This change is necessary in order to make sure the function returned by `safeFunction` has the same typed arguments as the original function.

With these changes, all of our tests pass as expected.

### Solution 8: Assertion Functions

The solution is to add a type annotation onto the return type of `assertIsAdminUser`.

If it was a type predicate, we would say `user is AdminUser`:

```ts twoslash
// @errors: 2355
type User = {
  id: string;
  name: string;
};
type AdminUser = {
  id: string;
  name: string;
  roles: string[];
};

// ---cut---
function assertIsAdminUser(user: User): user is AdminUser {
  if (!("roles" in user)) {
    throw new Error("User is not an admin");
  }
}
```

However, this leads to an error. We get this error because `assertIsAdminUser` is returning `void`, which is different from a type predicate that requires you to return a Boolean.

Instead, we need to add the `asserts` keyword to the return type:

```typescript
function assertIsAdminUser(user: User | AdminUser): asserts user is AdminUser {
  if (!("roles" in user)) {
    throw new Error("User is not an admin");
  }
}
```

By adding the `asserts` keyword, just by the fact that `assertIsAdminUser` is called we can assert that the user is an `AdminUser`. We don't need to put it inside an `if` statement or anywhere else.

With the `asserts` change in place, the `user` type is narrowed down to `AdminUser` after `assertIsAdminUser` is called and the test passes as expected:

```typescript
const handleRequest = (user: User | AdminUser) => {
  type test1 = Expect<Equal<typeof user, User | AdminUser>>;

  assertIsAdminUser(user);

  type test2 = Expect<Equal<typeof user, AdminUser>>;

  user.roles;
};

// hovering over roles shows:
user: AdminUser;
```
