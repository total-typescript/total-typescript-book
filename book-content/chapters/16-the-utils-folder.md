<!-- CONTINUE -->

# 16. Building Reusable Functions in TypeScript

There are three primary levels of complexity when it comes to TypeScript development.

Application development is the first level, and the one we've focused on the most so far in this book. This lower-complexity level involves using the fundamental features of TypeScript, such as type annotations, function parameters, object types, array types, tuples, and `as const`. At this level, the goal is to build a specific application or feature set.

Library development is at the opposite end of the spectrum. This level has the highest complexity, and is all about creating types for libraries that can be used by other developers. The types involved in library development are often complex and require numerous transformations. For example, if you look at the type definitions for Redux, you'll notice that they are several times longer than the actual runtime code.

In between the two extremes lies Utility Folder development. This level deals with shared code within your application or monorepo. It's all about creating utility functions, shared business logic, and helpers like `groupBy`. The code in the utilities folder is meant to be reused across your application rather than being published as a standalone library.

The TypeScript used for utility folder development are more advanced than those used for application development, but not as complex as those used for library development. In this chapter, we'll explore the techniques required for each of these levels and give you a glimpse of what's possible.

## Generic Functions

Just as types can be made generic, so can functions. Generic functions can work with a variety of types, providing flexibility and type safety. In this section, we'll explore the concept of generic functions and see how they can be used to write more flexible and type-safe code.

Consider this function called `getFirstElement` that takes an array and returns the first element:

```tsx
const getFirstElement = (arr: any[]) => {
  return arr[0];
};
```

While this function works, it's not very type-safe. We're using `any[]` as the type for the array, which means we can pass in an array of any type and the function will still compile.
However, we lose type information about the returned element.

If we pass in an array of numbers, we know the returned value should be a number, but the function's return type is `any`:

```tsx
const numbers = [1, 2, 3];

const firstNumber = getFirstElement(numbers);

// hovering over firstNumber shows:
const firstNumber: any;
```

By making the `getFirstElement` function generic, we can capture the type of the array and use it to define the return type.

To do this, we'll add a type parameter `T` before the function's parameter list, then use `T[]` as the type for the array:

```typescript
const getFirstElement = <T>(arr: T[]) => {
  return arr[0];
};
```

Now when we call `getFirstElement`, TypeScript will infer the type of `T` based on the argument we pass in:

```typescript
const numbers = [1, 2, 3];
const strings = ["a", "b", "c"];

const firstNumber = getFirstElement(numbers);
const firstString = getFirstElement(strings);

// hovering over firstNumber shows:
const firstNumber: number;

// hovering over firstString shows:
const firstString: string;
```

By making the function generic, we've ensured that the return type matches the type of the elements in the array.

### Inference in Generic Functions

TypeScript's type inference works seamlessly with generic functions. When you call a generic function without explicitly specifying the type arguments, TypeScript will attempt to infer the types based on the provided arguments. Let's look at some examples to understand what happens when you call a generic function with and without type arguments.

This generic `wrapInObject` function takes in an optional `arg` typed as `T`, and returns an object. The nullish coalescing operator (`??`) is used for the object's value. If `arg` exists, it will be set as the object's value, otherwise it will be an empty string. The type assertion `as T` is used to ensure the type of the value matches the type parameter `T`:

```typescript
const wrapInObject = <T>(arg?: T) => {
  return { value: arg ?? ("" as T) };
};
```

Calling `wrapInObject` with a string or number will have TypeScript infer the type of `T` based on the argument:

```typescript
const stringValue = wrapInObject("hello");
const numberValue = wrapInObject(42);

// hovering over stringValue shows:
const stringValue: {
  value: string;
};

// hovering over numberValue shows:
const numberValue: {
  value: number;
};
```

If we call `wrapInObject` without passing in an argument, TypeScript will infer the type of `T` as `unknown`:

```typescript
const unknownValue = wrapInObject();

// hovering over unknownValue shows:
const unknownValue: {
  value: unknown;
};
```

### Default Type Arguments

To change the default type for `T`, we can update `wrapInObject` to specify a default type using the `=` operator:

```typescript
const wrapInObject = <T = string>(arg?: T) => {
  return { value: arg ?? ("" as T) };
};
```

Now when we call `wrapInObject` without passing in an argument, TypeScript will infer the default type `string` for `T`:

```typescript
const valueWithoutArgument = wrapInObject();

// hovering over valueWithoutArgument shows:
const valueWithoutArgument: {
  value: string;
};
```

### Overriding Defaults and Type Inference

It's also possible to explicitly specify the type argument when calling a generic function. This can be useful when you want to override TypeScript's type inference or enforce a specific type.

For example, we can call `wrapInObject` with `<Album>` to return an object with a `value` typed as `Album`:

```typescript
const albumValue = wrapInObject<Album>({
  title: "Some Cold Rock Stuff",
  artist: "J Rocc",
  year: 2011,
});

// hovering over albumValue shows:
const albumValue: {
  value: Album;
};
```

### Applying Type Constraints

As we've seen in other examples, the `extends` keyword can be used to ensure that the type argument meets certain criteria.

For example, if we didn't want to allow for an `Album` to be used as a type argument, we could add a constraint to the `T` type parameter so that it only will accept a number or string, while still defaulting to `string`:

```tsx
const wrapInObject = <T extends string | number = string>(arg?: T) => {
  return { value: arg ?? ("" as T) };
};
```

Now, when we call `wrapInObject` with an `Album`, TypeScript will raise an error:

```tsx
const albumValue = wrapInObject<Album>(); // red squiggly line under Album

// hovering over Album shows:
Type 'Album' does not satisfy the constraint 'string | number'.
```

## Combining Generic Types and Functions

Generic functions are useful on their own, but they really start to shine when combined with generic types. Let's look at a real-world example of how flexible this combination can be.

Here we have a regular, non-generic function that fetches an `Album`'s data from an API:

```tsx
type Album = {
  id: number;
  title: string;
  artist: string;
  year: number;
};

async function fetchAlbum(id: number): Promise<Album> {
  const response = await fetch(`https://api.example.com/albums/${id}`);
  return response.json();
}
```

If we wanted to fetch a `Song` or a `Playlist`, we would need to create similar functions with different types:

```tsx
type Song = {
  id: number;
  title: string;
  duration: number;
};

type Playlist = {
  id: number;
  name: string;
  songs: Song[];
};

async function fetchSong(id: number): Promise<Song> {
  const response = await fetch(`https://api.example.com/songs/${id}`);
  return response.json();
}

async function fetchPlaylist(id: number): Promise<Playlist> {
  const response = await fetch(`https://api.example.com/playlists/${id}`);
  return response.json();
}
```

These functions are almost identical, with the only difference being the type of data being fetched and the URL endpoint. This is a perfect opportunity to bring in generic types and functions.

### Refactoring to be Generic

To start, we'll make a generic `ApiResponse` type that represents the structure of the API response. This type will take a type parameter `T` to represent the type of data being returned, as well as a `status` and `message` property for additional metadata:

```typescript
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};
```

This `ApiResponse` type will support the `Album`, `Song`, and `Playlist` types, and ensure that all API responses have a consistent structure.

Next, we'll create a generic function that can fetch any type of data from the API. The `fetchData` function will take in a type parameter `T` that corresponds to `Album`, `Song`, or `Playlist`, along with an `endpoint` parameter that specifies the API endpoint. The return type will be a `Promise` that resolves to an `ApiResponse` object for the same type `T` being passed in:

```typescript
async function fetchData<T>(endpoint: string): Promise<ApiResponse<T>> {
  const response = await fetch(`https://api.example.com/${endpoint}`);
  const data = await response.json();
  return {
    data,
    status: response.status,
    message: response.statusText,
  };
}
```

Now we can use the generic `fetchData` function with any of our types by specifying the type argument and the endpoint:

```typescript
async function getAlbum(id: number): Promise<Album> {
  const response = await fetchData<Album>(`albums/${id}`);
  return response.data;
}

async function getSong(id: number): Promise<Song> {
  const response = await fetchData<Song>(`songs/${id}`);
  return response.data;
}

async function getPlaylist(id: number): Promise<Playlist> {
  const response = await fetchData<Playlist>(`playlists/${id}`);
  return response.data;
}
```

Each function will return the fetched data of the specified type, and the `ApiResponse` type ensures that the response has a consistent structure.

## Type Predicates

A type predicate is a special return type that tells TypeScript that a function returns a Boolean value that says something about the type of one of its parameters.

For example, say we want to ensure that a variable is an `Album` before we try accessing its properties or passing it to a function that requires an `Album`.

We can write an `isAlbum` function that takes in an input, and specifies a return type of `input is Album`. The body of the function will check that the `input` passed in is a non-null object with the required properties of an `Album`:

```tsx
function isAlbum(input): input is Album {
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

The `input is Album` return type is the type predicate that tells TypeScript that if the function returns `true`, then the `input` parameter is of type `Album`. Otherwise, it isn't.

### Narrowing with Type Predicates

Type predicates are often used in conditional statements to narrow the type of a variable to become more specific.

For example, we can use the `isAlbum` type predicate to check if an `item` is an `Album` before accessing its `title` property:

```tsx
function getAlbumTitle(item: unknown) {
  if (isAlbum(item)) {
    return item.title;
  }
  return "Unknown Album";
}
```

In this case, the `getAlbumTitle` function takes an `item` of type `unknown`. Inside the function, we use the `isAlbum` type predicate to check if the `item` is an `Album`. If it is, TypeScript narrows the type of `item` to `Album` within the conditional block, allowing us to access the `title` property without any type errors:

```tsx
let title = getAlbumTitle({
  id: 1,
  title: "Dummy",
  artist: "Portishead",
  year: 1994,
});

console.log(title); // "Dummy"

let notAnAlbumTitle = getAlbumTitle("Some string");

console.log(notAnAlbumTitle); // "Unknown Album"
```

Type predicates are a great technique to be aware of, and are particularly useful when working with union types.

However, there are situations where they aren't as type-safe as they may appear.

For example, if the type predicate doesn't match the actual type being checked, TypeScript won't catch that discrepancy:

```tsx
function isAlbum(input): input is Album {
  return typeof input === "object";
}
```

In this case, any object passed to `isAlbum` will be considered an `Album`, even if it doesn't have the required properties. This is a common pitfall when working with type predicates, and it's important to ensure that the type predicate accurately reflects the type being checked.

## Assertion Functions

Assertion functions are similar to type predicates, but they use the `asserts` keyword instead of `is`. They are used to assert that a condition is true and to narrow the type of a variable, and will throw an error if the condition is false.

Here's how we could rework the `isAlbum` type predicate to be an `assertIsItem` assertion function:

```tsx
function assertIsAlbum(input: unknown): asserts input is Album {
  if (!isAlbum(input)) {
    throw new Error("Not an Album!");
  }
}
```

The `assertIsAlbum` function takes in a `input` of type `unknown` and asserts that it is an `Album` using the `asserts input is Album` syntax. If the `isAlbum` function returns `false`, an error is thrown.

Narrowing with assertion functions also works similarly to type predicates, with a notable difference:

```tsx
function getAlbumTitle(item: unknown) {
  assertIsAlbum(item);
  // At this point, 'item' is of type 'Album'
  console.log(item.title);
}
```

There's no need to use a conditional statement when calling `assertIsAlbum` because the function will throw an error if the `item` isn't an `Album`. If the function doesn't throw an error, we can access the `item`'s properties without any type errors.

However, it's important to note that TypeScript won't alert you of the an error until the code is compiled.

Creating a variable by calling `getAlbumTitle` with a string will not raise an error until the code is compiled:

```tsx
let title = getAlbumTitle("Some string"); // no error in VS Code

// during compilation, TypeScript will raise an error:
Error: Not an Album!
```

Assertion functions are particularly useful when you want to validate the type of a variable and throw an error if the validation fails. As with type predicates, it's important to ensure that the assertion function accurately reflects the type being checked in order to avoid any potential runtime issues.

## Function Overloads

Function overloads provide a way to define multiple function signatures for a single function implementation. In other words, you can define different ways to call a function, each with its own set of parameters and return types. It's an interesting technique for creating a flexible API that can handle different use cases while maintaining type safety.

To demonstrate how function overloads work, we'll create a `searchMusic` function that allows for different ways to perform a search based on the provided arguments.

### Defining Overloads

To define function overloads, the same function definition is written multiple times with different parameter and return types. Each definition is called an overload signature, and is separated by semicolons.

For the `searchMusic` example, we want to allow users to search by providing a string with keywords that will match songs, albums, or artists. We also want to allow for an advanced search by accepting an object with properties for `artist`, `genre`, and `year`.

Here's how we could define these function overload signatures:

```tsx
function searchMusic(query: string): void;
function searchMusic(criteria: {
  artist?: string;
  genre?: string;
  year?: number;
}): void;
```

With the overloads in place, we can now define the implementation signature.

### The Implementation Signature

The implementation signature is the actual function declaration that contains the actual logic for the function. It is written below the overload signatures, and must be compatible with all the defined overloads.

In this case, the implementation signature will take in a parameter called `queryOrCriteria` that can be either a `string` or an object with the specified properties. Inside the function, we'll check the type of `queryOrCriteria` and perform the appropriate search logic based on the provided arguments:

```tsx
function searchMusic(query: string): void;
function searchMusic(criteria: {
  artist?: string;
  genre?: string;
  year?: number;
}): void;
function searchMusic(
  queryOrCriteria: string | { artist?: string; genre?: string; year?: number },
): void {
  if (typeof queryOrCriteria === "string") {
    console.log(`Searching for music with query: ${queryOrCriteria}`);
    // general search logic
  } else {
    const { artist, genre, year } = queryOrCriteria;
    console.log(
      `Searching for music with criteria: ${JSON.stringify({
        artist,
        genre,
        year,
      })}`,
    );
    // specific search logic
  }
}
```

Now we can call the `searchMusic` function with the different arguments defined in the overloads:

```tsx
searchMusic("King Gizzard and the Lizard Wizard"); // Valid
searchMusic({ genre: "Psychedelic Rock" }); // Valid
```

However, TypeScript will warn us if we attempt to pass in an argument that doesn't match any of the defined overloads:

```tsx
searchMusic(1337); // red squiggly line under 1337

// hovering over 1337 shows:
No overload matches this call.
  Overload 1 of 2, '(query: string): void', gave the following error.
    Argument of type 'number' is not assignable to parameter of type 'string'.
  Overload 2 of 2, '(criteria: { artist?: string | undefined; genre?: string | undefined; year?: number | undefined; }): void', gave the following error.
    Type '1337' has no properties in common with type '{ artist?: string | undefined; genre?: string | undefined; year?: number | undefined; }'.
```

While there aren't too many use cases for function overloads in typical application development, it can be useful for adding support for multiple arguments to your utilities and libraries. However, you'll want to use them sparingly since too many overloads can make a function difficult to understand and maintain. If you get to a point where a function has too many overloads, look into refactoring it into more focused functions or using other patterns like optional parameters or union types.

## Exercises

### Exercise 1: Make a Function Generic

Here we have a function `createStringMap`. The purpose of this function is to generate a `Map` with keys as strings and values of the type passed in as arguments:

```tsx
const createStringMap = () => {
  return new Map();
};
```

As it currently is, the keys and values for the Map can be of any type.

However, the goal is to make this function generic so that we can pass in a type argument to define the type of the values in the `Map`.

For example, if we pass in `number` as the type argument, the function should return a `Map` with values of type `number`:

```tsx
const numberMap = createStringMap<number>(); // red squiggly line under number

numberMap.set("foo", 123);
numberMap.set(
  "bar",
  // @ts-expect-error
  true,
);
```

Likewise, if we pass in an object type, the function should return a `Map` with values of that type:

```tsx
const objMap = createStringMap<{ a: number }>(); // red squiggly line under { a: number }

objMap.set("foo", { a: 123 });

objMap.set(
  "bar",
  // @ts-expect-error // red squiggly line under @ts-expect-error
  { b: 123 },
);
```

The function should also default to `unknown` if no type is provided:

```tsx
const unknownMap = createStringMap();

type test = Expect<Equal<typeof unknownMap, Map<string, unknown>>>; // red squiggly line under Equal<>
```

Your task is to transform `createStringMap` into a generic function capable of accepting a type argument for the values of Map. Make sure it functions as expected for the provided test cases.

### Exercise 2: Default Type Arguments

After making the `createStringMap` function generic in Exercise 1, calling it without a type argument defaults to values being typed as `unknown`:

```tsx
const stringMap = createStringMap();

// hovering over stringMap shows:
const stringMap: Map<string, unknown>;
```

Your goal is to add a default type argument to the `createStringMap` function so that it defaults to `string` if no type argument is provided. Note that you will still be able to override the default type by providing a type argument when calling the function.

### Exercise 3: Inference in Generic Functions

Consider this `uniqueArray` function:

```tsx
const uniqueArray = (arr: any[]) => {
  return Array.from(new Set(arr));
};
```

The function accepts an array as an argument, then converts it to a `Set`, then returns it as a new array. This is a common pattern for when you want to have unique values inside your array.

While this function operates effectively at runtime, it lacks type safety. It currently allows an array of `any` type, and as seen in the tests, the return type is also typed as `any`:

```tsx
it("returns an array of unique values", () => {
  const result = uniqueArray([1, 1, 2, 3, 4, 4, 5]);

  type test = Expect<Equal<typeof result, number[]>>; // red squiggly line under Equal<>

  expect(result).toEqual([1, 2, 3, 4, 5]);
});

it("should work on strings", () => {
  const result = uniqueArray(["a", "b", "b", "c", "c", "c"]);

  type test = Expect<Equal<typeof result, string[]>>; // red squiggly line under Equal<>

  expect(result).toEqual(["a", "b", "c"]);
});
```

Your task is to boost the type safety of the `uniqueArray` function. To accomplish this, you'll need to incorporate a type parameter into the function.

Note that in the tests, we do not explicitly provide type arguments when invoking the function. TypeScript should be able to deduce the type from the argument.

Adjust the function and insert the necessary type annotations to ensure that the `result` type in both tests is inferred as `number[]` and `string[]`, respectively.

### Exercise 4: Type Parameter Constraints

Consider this function `addCodeToError`, which accepts a type parameter `TError` and returns an object with a `code` property:

```tsx
const UNKNOWN_CODE = 8000;

const addCodeToError = <TError>(error: TError) => {
  return {
    ...error,
    code: error.code ?? UNKNOWN_CODE, // red squiggly line under code
  };
};

// hovering over code shows
Property 'code' does not exist on type 'TError'.
```

If the incoming error doesn't include a `code`, the function assigns a default `UNKNOWN_CODE`. Currently there is an error under the `code` property.

Currently, there are no constraints on `TError`, which can be of any type. This leads to errors in our tests:

```tsx
it("Should accept a standard error", () => {
  const errorWithCode = addCodeToError(new Error("Oh dear!"));

  type test1 = Expect<Equal<typeof errorWithCode, Error & { code: number }>>; // red squiggly line under Equal<>

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
  >; // red squiggly line under Equal<>

  type test4 = Expect<Equal<typeof customErrorWithCode.message, string>>;
});
```

Your task is to update the `addCodeToError` type signature to enforce the required constraints so that `TError` is required to have a `message` property and can optionally have a `code` property.

### Exercise 5: Combining Generic Types and Functions

Here we have `safeFunction`, which accepts a function `func` typed as `PromiseFunc` that returns a function itself. However, if `func` encounters an error, it is caught and returned instead:

```tsx
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

The `PromiseFunc` type is currently set to always return `Promise<any>`, which doesn't provide much information.

Also, the function returned by `safeFunction` is supposed to return either the result of `func` or an `Error`, but at the moment, it's just returning `Promise<any>`.

There are several tests that are failing due to these issues:

```tsx
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

Your task is to update `safeFunction` to have a generic type parameter, and update `PromiseFunc` to not return `Promise<Any>`. This will require you to combine generic types and functions to ensure that the tests pass successfully.

### Exercise 6: Multiple Type Arguments in a Generic Function

After making the `safeFunction` generic in Exercise 5, it's been updated to allow for passing arguments:

```tsx
// inside of safeFunction
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
```

Since the thing being passed into `safeFunction` can receive arguments, the function we get back should also contain those arguments and require you to pass them in.

However, as seen in the tests, the type is currently a bit too wide:

```tsx
it("should return the result if the function succeeds", async () => {
  const func = safeFunction((name: string) => {
    return Promise.resolve(`hello ${name}`);
  });

  type test1 = Expect<
    Equal<typeof func, (name: string) => Promise<Error | string>>
  >; // red squiggly line under Equal<>
```

For example, in the above test the `name` isn't being inferred as a parameter of the function returned by `safeFunction`. Instead, it's actually saying that we can pass in as many arguments as we want to into the function, which isn't correct.

```tsx
// hovering over func shows:
const func: (...args: any[]) => Promise<string | Error>;
```

Your task is to add a second type parameter to `PromiseFunc` and `safeFunction` to infer the argument types accurately.

As seen in the tests, there are cases where no parameters are necessary, and others where a single parameter is needed:

```tsx
it("should return an error if the function throws", async () => {
  const func = safeFunction(async () => {
    if (Math.random() > 0.5) {
      throw new Error("Something went wrong");
    }
    return 123;
  });

  type test1 = Expect<Equal<typeof func, () => Promise<Error | number>>>; // red squiggly line under Equal<>

  const result = await func();

  type test2 = Expect<Equal<typeof result, Error | number>>;
});

it("should return the result if the function succeeds", async () => {
  const func = safeFunction((name: string) => {
    return Promise.resolve(`hello ${name}`);
  });

  type test1 = Expect<
    Equal<typeof func, (name: string) => Promise<Error | string>>
  >; // red squiggly line under Equal<>

  const result = await func("world");

  type test2 = Expect<Equal<typeof result, string | Error>>;

  expect(result).toEqual("hello world");
});
```

Update the types of the function and the generic type, and make these tests pass successfully.

### Exercise 7: Type Predicates

Here we have an `isString` function that accepts an input of `unknown` type, and returns a boolean based on whether the `input` is of type string or not:

```tsx
const isString = (input: unknown) => {
  return typeof input === "string";
};
```

In this case, the `unknown` type is appropriate as we don't possess any prior knowledge about the type of `input`.

The function is then applied in the context of a `filter` function:

```tsx
const mixedArray = [1, "hello", [], {}];

const stringsOnly = mixedArray.filter(isString);
```

We would anticipate that the `filter` function would return an array of strings since it only retains the elements from `mixedArray` that pass the `isString` test.

However, this doesn't work as expected on the type level.

We end up with an array of empty objects instead, because an empty object is being passed to the `isString` function, and all the other types are assignable to an empty object.

```tsx
// hovering over stringsOnly shows:
const stringsOnly: {}[];
```

In order to make `isString` function as we expect, we need to use a type guard function and add a type predicate to it.

Your task is to adjust the `isString` function to incorporate a type guard and type predicate that will ensure the `filter` function correctly identifies strings as well as assigning the accurate type to the output array.

### Exercise 8: Assertion Functions

This exercise starts with an interface `User`, which has properties `id` and `name`. Then we have an interface `AdminUser`, which extends `User`, inheriting all its properties and adding a `roles` string array property:

```tsx
interface User {
  id: string;
  name: string;
}

interface AdminUser extends User {
  roles: string[];
}
```

The function `assertIsAdminUser` accepts either a `User` or `AdminUser` object as an argument. If the `roles` property isn't present in the argument, the function throws an error:

```tsx
function assertIsAdminUser(user: User | AdminUser) {
  if (!("roles" in user)) {
    throw new Error("User is not an admin");
  }
}
```

This function's purpose is to verify we are able to access properties that are specific to the `AdminUser`, such as `roles`.

In the `handleRequest` function, we call `assertIsAdminUser` and expect the type of `user` to be narrowed down to `AdminUser`.

But as seen in this test case, it doesn't work as expected:

```tsx
const handleRequest = (user: User | AdminUser) => {
  type test1 = Expect<Equal<typeof user, User | AdminUser>>;

  assertIsAdminUser(user);

  type test2 = Expect<Equal<typeof user, AdminUser>>; // red squiggly line under Equal<>

  user.roles; // red squiggly line under roles
};
```

The `user` type is `User | AdminUser` before `assertIsAdminUser` is called, but it doesn't get narrowed down to just `AdminUser` after the function is called. This means we can't access the `roles` property.

```tsx
// hovering over .roles shows:
Property 'roles' does not exist on type 'User | AdminUser'.
```

Your task is to update the `assertIsAdminUser` function with the proper type assertion so that the `user` is identified as an `AdminUser` after the function is called.

### Solution 1: Make a Function Generic

The first thing we'll do to make this function generic is to add a type parameter `T`:

```tsx
const createStringMap = <T,>() => {
  return new Map();
};
```

With this change, our `createStringMap` function can now handle a type argument `T`.

The error has disappeared from the `numberMap` variable, but the function is still returning a `Map` of type `any, any`:

```tsx
const numberMap = createStringMap<number>();

// hovering over createStringMap shows:
const createStringMap: <number>() => Map<any, any>;
```

We need to specify the types for the map entries.

Since we know that the keys will always be strings, we'll set the first type argument of `Map` to `string`. For the values, we'll use our type parameter `T`:

```tsx
const createStringMap = <T,>() => {
  return new Map<string, T>();
};
```

Now the function can correctly type the map's values.

If we don't pass in a type argument, the function will default to `unknown`:

```tsx
const objMap = createStringMap();

// hovering over objMap shows:
const objMap: Map<string, unknown>;
```

Through these steps, we've successfully transformed `createStringMap` from a regular function into a generic function capable of handling type arguments.

### Solution 2: Default Type Arguments

The syntax for setting default types for generic functions is the same as for generic types:

```tsx
const createStringMap = <T = string,>() => {
  return new Map<string, T>();
};
```

By using the `T = string` syntax, we tell the function that if no type argument is supplied, it should default to `string`.

Now when we call `createStringMap()` without a type argument, we end up with a `Map` where both keys and values are `string`:

```tsx
const stringMap = createStringMap();

// hovering over stringMap shows:
const stringMap: <string>() => Map<string, string>;
```

If we attempt to assign a number as a value, TypeScript gives us an error because it expects a string:

```tsx
stringMap.set(
  "bar",
  123, // red squiggly line under 123
);
```

However, we can still override the default type by providing a type argument when calling the function:

```tsx
const numberMap = createStringMap<number>();
numberMap.set("foo", 123);
```

In the above code, `numberMap` will result in a `Map` with `string` keys and `number` values, and TypeScript will give an error if we try assigning a non-number value:

```tsx
numberMap.set(
  "bar",
  // @ts-expect-error
  true,
);
```

### Solution 3: Inference in Generic Functions

The first step is to add a type parameter onto `uniqueArray`. This turns `uniqueArray` into a generic function that can receive type arguments:

```tsx
const uniqueArray = <T,>(arr: any[]) => {
  return Array.from(new Set(arr));
};
```

Now when we hover over a call to `uniqueArray`, we can see that it is typed as unknown:

```tsx
const result = uniqueArray([1, 1, 2, 3, 4, 4, 5]);

// hovering over uniqueArray shows:
const uniqueArray: <unknown>(arr: any[]) => any[];
```

This is because we haven't passed any type arguments to it. If there's no type argument and no default, it defaults to unknown.

We want the type argument to be inferred as a number because we know that the thing we're getting back is an array of numbers.

So what we'll do is add a return type of `T[]` to the function:

```tsx
const uniqueArray = <T>(arr: any[]): T[] => {
  ...
```

Now the call to `uniqueArray` is inferred as returning an `unknown` array:

```tsx
const result = uniqueArray([1, 1, 2, 3, 4, 4, 5]);

// hovering over uniqueArray shows:
const uniqueArray: <unknown>(arr: any[]) => unknown[];
```

Again, the reason for this is that we haven't passed any type arguments to it. If there's no type argument and no default, it defaults to unknown.

If we add a `<number>` type argument to the call, the `result` will now be inferred as a number array:

```tsx
const result = uniqueArray<number>([1, 1, 2, 3, 4, 4, 5]);

// hovering over uniqueArray shows:
const uniqueArray: <number>(arr: any[]) => number[];
```

However, at this point there's no relationship between the things we're passing in and the thing we're getting out. Adding a type argument to the call returns an array of that type, but the `arr` parameter in the function itself is still typed as `any[]`.

What we need to do is tell TypeScript that the type of the `arr` parameter is the same type as what is passed in.

To do this, we'll replace `arr: any[]` with `arr: T[]`:

```tsx
const uniqueArray = <T>(arr: T[]): T[] => {
  ...
```

The function's return type is an array of `T`, where `T` represents the type of elements supplied to the function.

Thus, TypeScript can infer the return type as `number[]` for an input array of numbers, or `string[]` for an input array of strings, even without explicit return type annotation. As we can see, the tests pass successfully:

```tsx
// number test
const result = uniqueArray([1, 1, 2, 3, 4, 4, 5]);

type test = Expect<Equal<typeof result, number[]>>;

// string test
const result = uniqueArray(["a", "b", "b", "c", "c", "c"]);

type test = Expect<Equal<typeof result, string[]>>;
```

If you explicitly pass a type argument, TypeScript will use it. If you don't, TypeScript attempts to deduce it from the runtime arguments.

For example, if you try to pass a boolean in with the number array when providing a type argument, TypeScript will throw an error:

```tsx
const result = uniqueArray<number>([1, 1, 2, 3, 4, 4, 5, true]); // red squiggly line under true

// hovering over true shows:
Type 'boolean' is not assignable to type 'number'.
```

However, without the type argument there will be no error and the type will be inferred as an array of `number | boolean`:

```tsx
const result = uniqueArray([1, 1, 2, 3, 4, 4, 5, true]);

// hovering over uniqueArray shows:
const uniqueArray: <number | boolean>(arr: (number | boolean)[]) => (number | boolean)[]
```

The flexibility of generics and inference allows for dynamic code while still ensuring type safety.

### Solution 4: Type Parameter Constraints

The syntax to add constraints is the same as what we saw for generic types.

We need to use the `extends` keyword to add constraints to the generic type parameter `TError`. The object passed in is required to have a `message` property of type `string`, and can optionally have a `code` of type `number`:

```tsx
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

These constraints have our tests passing, including the case where we pass in an extra `filepath` property. This is because using `extends` in generics does not restrict you to only passing in the properties defined in the constraint.

### Solution 5: Combining Generic Types and Functions

Here's the starting point of our `safeFunction`:

```tsx
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

```tsx
type PromiseFunc<TResult> = () => Promise<TResult>;
```

With this update, we now need to update the `PromiseFunc` in the `safeFunction` to include the type argument:

```tsx
const safeFunction =
  <TResult>(func: PromiseFunc<TResult>) =>
  async () => {
    ...
```

With these changes in place, when we hover over the `safeFunction` call in the first test, we can see that the type argument is inferred as `number` as expected:

```tsx
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

Whatever we pass into `safeFunction` will be inferred as the type argument for `PromiseFunc`. This is because the type argument is being inferred as the identity of the generic function.

### Solution 6: Multiple Type Arguments in a Generic Function

Here's how `PromiseFunc` is currently defined:

```tsx
type PromiseFunc<TResult> = (...args: any[]) => Promise<TResult>;
```

The first thing to do is figure out the types of the arguments being passed in. Currently, they're set to one value, but they need to be different based on the type of function being passed in.

Instead of having `args` be of type `any[]`, we want to spread in all of the `args` and capture the entire array.

To do this, we'll update the type to be `TArgs`. Since `args` needs to be an array, we'll say that `TArgs extends any[]`. Note that this doesn't mean that `TArgs` will be typed as `any`, but rather that it will accept any kind of array:

```tsx
type PromiseFunc<TArgs extends any[], TResult> = (
  ...args: TArgs
) => Promise<TResult>;
```

Now we need to update the `safeFunction` so that it has the same arguments as `PromiseFunc`. To do this, we'll add `TArgs` to its type parameters.

Note that we also need to update the args for the `async` function to be of type `TArgs`:

```tsx
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

The big takeaway is that when you're doing inference with function parameters, you want to make sure that you're capturing the entire arguments as a tuple with `TArgs extends any[]` instead of using just an array `TArgs[]`. Otherwise, you won't get the correct type inference.

### Solution 7: Type Predicates

For the `isString` function, we know that the `input` will be a string, but TypeScript can't infer that logic on its own. To help, we can add a type predicate that says `input is string`:

```tsx
const isString = (input: unknown): input is string => {
  return typeof input === "string";
};
```

With this change, the `isString` function can be used with `filter` and the test passes as expected:

```tsx
it("Should be able to be passed to .filter and work", () => {
  const mixedArray = [1, "hello", [], {}];

  const stringsOnly = mixedArray.filter(isString);

  type test1 = Expect<Equal<typeof stringsOnly, string[]>>;

  expect(stringsOnly).toEqual(["hello"]);
});
```

### Solution 8: Assertion Functions

The solution is to add a type annotation onto the return type of `assertIsAdminUser`.

If it was a type predicate, we would say `user is AdminUser`:

```tsx
function assertIsAdminUser(user: User): user is AdminUser {
  // red squiggly line under user is AdminUser
  if (!("roles" in user)) {
    throw new Error("User is not an admin");
  }
}
```

However, this leads to an error under `user is AdminUser`:

```tsx
// hovering over user is AdminUser shows:
A function whose declared type is neither 'undefined', 'void', nor 'any' must return a value.
```

We get this error because `assertIsAdminUser` is returning `void`, which is different from a type predicate that requires you to return a Boolean.

Instead, we need to add the `asserts` keyword to the return type:

```tsx
function assertIsAdminUser(user: User | AdminUser): asserts user is AdminUser {
  if (!("roles" in user)) {
    throw new Error("User is not an admin");
  }
}
```

By adding the `asserts` keyword, just by the fact that `assertIsAdminUser` is called we can assert that the user is an `AdminUser`. We don't need to put it inside an `if` statement or anywhere else.

With the `asserts` change in place, the `user` type is narrowed down to `AdminUser` after `assertIsAdminUser` is called and the test passes as expected:

```tsx
const handleRequest = (user: User | AdminUser) => {
  type test1 = Expect<Equal<typeof user, User | AdminUser>>;

  assertIsAdminUser(user);

  type test2 = Expect<Equal<typeof user, AdminUser>>;

  user.roles;
};

// hovering over roles shows:
user: AdminUser;
```
