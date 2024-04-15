# 16. The `/utils` Folder

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

```typescript
const obj = JSON.parse<{ hello: string }>('{"hello": "world"}');
// Red squiggly line under { hello: string }
// Expected 0 type arguments, but got 1.
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
type Identity = <T>(arg: T) => void;

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
type Identity = <T>(arg: T) => void;
//              ^^^
//              Type parameter belongs to the function

// Generic type
type Identity<T> = (arg: T) => void;
//           ^^^
//           Type parameter belongs to the type
```

It's all about the position of the type parameter. If it's attached to the type's name, it's a generic type. If it's attached to the function's parentheses, it's a type alias for a generic function.

### What Happens When We Don't Pass In A Type Argument?

When we looked at generic types, we saw that TypeScript _requires_ you to pass in all type arguments when you use a generic type:

```typescript
type StringArray = Array<string>;

type AnyArray = Array; // Red squiggly line under Array

// Hovering over Array shows:
// Generic type 'Array<T>' requires 1 type argument(s).
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

```typescript
const result = identity(42);

// Hovering over result shows:
// const result: 42
```

This means that every time the function is called, it can potentially return a different type:

```typescript
const result1 = identity("hello"); // result1: 'hello'
const result2 = identity({ hello: "world" }); // result2: { hello: 'world' }
const result3 = identity([1, 2, 3]); // result3: number[]
```

This ability means that your functions can understand what types they're working with, and alter their suggestions and errors accordingly. It's TypeScript at its most powerful and flexible.

### Specified Types Beat Inferred Types

Let's go back to specifying type arguments instead of inferring them. What happens if your type argument you pass conflicts with the runtime argument?

Let's try it with our `identity` function:

```typescript
const result = identity<string>(42); // Red squiggly line under 42

// Hovering over 42 shows:
// Argument of type '42' is not assignable to parameter of type 'string'.
```

Here, TypeScript is telling us that `42` is not a `string`. This is because we've explicitly told TypeScript that `T` should be a `string`, which conflicts with the runtime argument.

Passing type arguments is an instruction to TypeScript override inference. If you pass in a type argument, TypeScript will use it as the source of truth. If you don't, TypeScript will use the type of the runtime argument as the source of truth.

### The Problem Generic Functions Solve

Let's put what we've learned into practice.

Consider this function called `getFirstElement` that takes an array and returns the first element:

```typescript
const getFirstElement = (arr: any[]) => {
  return arr[0];
};
```

This function is dangerous. Because it takes an array of `any`, it means that the thing we get back from `getFirstElement` is also `any`:

```typescript
const first = getFirstElement([1, 2, 3]);

// Hovering over first shows:
const first: any;
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

```typescript
const firstNumber = getFirstElement([1, 2, 3]);
const firstString = getFirstElement(["a", "b", "c"]);

// hovering over firstNumber shows:
const firstNumber: number | undefined;

// hovering over firstString shows:
const firstString: string | undefined;
```

Now, we've made `getFirstElement` type-safe. The type of the array we pass in is the type of the thing we get back.

### Debugging The Inferred Type Of Generic Functions

When you're working with generic functions, it can be hard to know what type TypeScript has inferred. However, with a carefully-placed hover, you can find out.

When we call the `getFirstElement` function, we can hover over the function name to see what TypeScript has inferred:

```typescript
const first = getFirstElement([1, 2, 3]);

// Hovering over getFirstElement shows:
// const getFirstElement: <number>(arr: number[]) => number
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

```typescript
const defaultSet = createSet(); // Set<string>
```

The default doesn't impose a constraint on the type of `T`. This means we can still pass in any type we want:

```typescript
const numberSet = createSet<number>([1, 2, 3]); // Set<number>
```

If we don't specify a default, and TypeScript can't infer the type from the runtime arguments, it will default to `unknown`:

```typescript
const createSet = <T>(arr?: T[]) => {
  return new Set(arr);
};

const unknownSet = createSet(); // Set<unknown>
```

Here, we've removed the default type of `T`, and TypeScript has defaulted to `unknown`.

### Constraining Type Parameters

You can also add constraints to type parameters in generic functions. This can be useful when you want to ensure that a type has certain properties.

Let's imagine a `removeId` function that takes an object and removes the `id` property:

```typescript
const removeId = <TObj>(obj: TObj) => {
  const { id, ...rest } = obj; // red squiggly line under id
  return rest;
};

// hovering over id shows:
// Property 'id' does not exist on type 'unknown'.
```

Our `TObj` type parameter, when used without a constraint, is treated as `unknown`. This means that TypeScript doesn't know if `id` exists on `obj`.

To fix this, we can add a constraint to `TObj` that ensures it has an `id` property:

```typescript
const removeId = <TObj extends { id: any }>(obj: TObj) => {
  const { id, ...rest } = obj;
  return rest;
};
```

Now, when we use `removeId`, TypeScript will error if we don't pass in an object with an `id` property:

```typescript
const result = removeId({ name: "Alice" }); // red squiggly line under name

// hovering over name shows:
// Object literal may only specify known properties, and 'name' does not exist in type '{ id: any; }'
```

But if we pass in an object with an `id` property, TypeScript will know that `id` has been removed:

```typescript
const result = removeId({ id: 1, name: "Alice" });

// hovering over result shows:
const result: Omit<
  {
    id: number;
    name: string;
  },
  "id"
>;
```

Note how clever TypeScript is being here. Even though we didn't specify a return type for `removeId`, TypeScript has inferred that `result` is an object with all the properties of the input object, except `id`.

<!-- CONTINUE -->

### Combining Generic Types and Functions

Generic functions are useful on their own, but they really start to shine when combined with generic types. Let's look at a real-world example of how flexible this combination can be.

Here we have a regular, non-generic function that fetches an `Album`'s data from an API:

```typescript
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

```typescript
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

#### Refactoring to be Generic

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

```typescript
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

```typescript
function getAlbumTitle(item: unknown) {
  if (isAlbum(item)) {
    return item.title;
  }
  return "Unknown Album";
}
```

In this case, the `getAlbumTitle` function takes an `item` of type `unknown`. Inside the function, we use the `isAlbum` type predicate to check if the `item` is an `Album`. If it is, TypeScript narrows the type of `item` to `Album` within the conditional block, allowing us to access the `title` property without any type errors:

```typescript
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

```typescript
function isAlbum(input): input is Album {
  return typeof input === "object";
}
```

In this case, any object passed to `isAlbum` will be considered an `Album`, even if it doesn't have the required properties. This is a common pitfall when working with type predicates, and it's important to ensure that the type predicate accurately reflects the type being checked.

## Assertion Functions

Assertion functions are similar to type predicates, but they use the `asserts` keyword instead of `is`. They are used to assert that a condition is true and to narrow the type of a variable, and will throw an error if the condition is false.

Here's how we could rework the `isAlbum` type predicate to be an `assertIsItem` assertion function:

```typescript
function assertIsAlbum(input: unknown): asserts input is Album {
  if (!isAlbum(input)) {
    throw new Error("Not an Album!");
  }
}
```

The `assertIsAlbum` function takes in a `input` of type `unknown` and asserts that it is an `Album` using the `asserts input is Album` syntax. If the `isAlbum` function returns `false`, an error is thrown.

Narrowing with assertion functions also works similarly to type predicates, with a notable difference:

```typescript
function getAlbumTitle(item: unknown) {
  assertIsAlbum(item);
  // At this point, 'item' is of type 'Album'
  console.log(item.title);
}
```

There's no need to use a conditional statement when calling `assertIsAlbum` because the function will throw an error if the `item` isn't an `Album`. If the function doesn't throw an error, we can access the `item`'s properties without any type errors.

However, it's important to note that TypeScript won't alert you of the an error until the code is compiled.

Creating a variable by calling `getAlbumTitle` with a string will not raise an error until the code is compiled:

```typescript
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

```typescript
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

```typescript
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

```typescript
searchMusic("King Gizzard and the Lizard Wizard"); // Valid
searchMusic({ genre: "Psychedelic Rock" }); // Valid
```

However, TypeScript will warn us if we attempt to pass in an argument that doesn't match any of the defined overloads:

```typescript
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

```typescript
const createStringMap = () => {
  return new Map();
};
```

As it currently is, the keys and values for the Map can be of any type.

However, the goal is to make this function generic so that we can pass in a type argument to define the type of the values in the `Map`.

For example, if we pass in `number` as the type argument, the function should return a `Map` with values of type `number`:

```typescript
const numberMap = createStringMap<number>(); // red squiggly line under number

numberMap.set("foo", 123);
numberMap.set(
  "bar",
  // @ts-expect-error
  true,
);
```

Likewise, if we pass in an object type, the function should return a `Map` with values of that type:

```typescript
const objMap = createStringMap<{ a: number }>(); // red squiggly line under { a: number }

objMap.set("foo", { a: 123 });

objMap.set(
  "bar",
  // @ts-expect-error // red squiggly line under @ts-expect-error
  { b: 123 },
);
```

The function should also default to `unknown` if no type is provided:

```typescript
const unknownMap = createStringMap();

type test = Expect<Equal<typeof unknownMap, Map<string, unknown>>>; // red squiggly line under Equal<>
```

Your task is to transform `createStringMap` into a generic function capable of accepting a type argument for the values of Map. Make sure it functions as expected for the provided test cases.

### Exercise 2: Default Type Arguments

After making the `createStringMap` function generic in Exercise 1, calling it without a type argument defaults to values being typed as `unknown`:

```typescript
const stringMap = createStringMap();

// hovering over stringMap shows:
const stringMap: Map<string, unknown>;
```

Your goal is to add a default type argument to the `createStringMap` function so that it defaults to `string` if no type argument is provided. Note that you will still be able to override the default type by providing a type argument when calling the function.

### Exercise 3: Inference in Generic Functions

Consider this `uniqueArray` function:

```typescript
const uniqueArray = (arr: any[]) => {
  return Array.from(new Set(arr));
};
```

The function accepts an array as an argument, then converts it to a `Set`, then returns it as a new array. This is a common pattern for when you want to have unique values inside your array.

While this function operates effectively at runtime, it lacks type safety. It currently allows an array of `any` type, and as seen in the tests, the return type is also typed as `any`:

```typescript
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

```typescript
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

```typescript
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

The `PromiseFunc` type is currently set to always return `Promise<any>`, which doesn't provide much information.

Also, the function returned by `safeFunction` is supposed to return either the result of `func` or an `Error`, but at the moment, it's just returning `Promise<any>`.

There are several tests that are failing due to these issues:

```typescript
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

```typescript
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

```typescript
it("should return the result if the function succeeds", async () => {
  const func = safeFunction((name: string) => {
    return Promise.resolve(`hello ${name}`);
  });

  type test1 = Expect<
    Equal<typeof func, (name: string) => Promise<Error | string>>
  >; // red squiggly line under Equal<>
```

For example, in the above test the `name` isn't being inferred as a parameter of the function returned by `safeFunction`. Instead, it's actually saying that we can pass in as many arguments as we want to into the function, which isn't correct.

```typescript
// hovering over func shows:
const func: (...args: any[]) => Promise<string | Error>;
```

Your task is to add a second type parameter to `PromiseFunc` and `safeFunction` to infer the argument types accurately.

As seen in the tests, there are cases where no parameters are necessary, and others where a single parameter is needed:

```typescript
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

```typescript
const isString = (input: unknown) => {
  return typeof input === "string";
};
```

In this case, the `unknown` type is appropriate as we don't possess any prior knowledge about the type of `input`.

The function is then applied in the context of a `filter` function:

```typescript
const mixedArray = [1, "hello", [], {}];

const stringsOnly = mixedArray.filter(isString);
```

We would anticipate that the `filter` function would return an array of strings since it only retains the elements from `mixedArray` that pass the `isString` test.

However, this doesn't work as expected on the type level.

We end up with an array of empty objects instead, because an empty object is being passed to the `isString` function, and all the other types are assignable to an empty object.

```typescript
// hovering over stringsOnly shows:
const stringsOnly: {}[];
```

In order to make `isString` function as we expect, we need to use a type guard function and add a type predicate to it.

Your task is to adjust the `isString` function to incorporate a type guard and type predicate that will ensure the `filter` function correctly identifies strings as well as assigning the accurate type to the output array.

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

```typescript
const handleRequest = (user: User | AdminUser) => {
  type test1 = Expect<Equal<typeof user, User | AdminUser>>;

  assertIsAdminUser(user);

  type test2 = Expect<Equal<typeof user, AdminUser>>; // red squiggly line under Equal<>

  user.roles; // red squiggly line under roles
};
```

The `user` type is `User | AdminUser` before `assertIsAdminUser` is called, but it doesn't get narrowed down to just `AdminUser` after the function is called. This means we can't access the `roles` property.

```typescript
// hovering over .roles shows:
Property 'roles' does not exist on type 'User | AdminUser'.
```

Your task is to update the `assertIsAdminUser` function with the proper type assertion so that the `user` is identified as an `AdminUser` after the function is called.

### Solution 1: Make a Function Generic

The first thing we'll do to make this function generic is to add a type parameter `T`:

```typescript
const createStringMap = <T>() => {
  return new Map();
};
```

With this change, our `createStringMap` function can now handle a type argument `T`.

The error has disappeared from the `numberMap` variable, but the function is still returning a `Map` of type `any, any`:

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

Through these steps, we've successfully transformed `createStringMap` from a regular function into a generic function capable of handling type arguments.

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
const stringMap: <string>() => Map<string, string>;
```

If we attempt to assign a number as a value, TypeScript gives us an error because it expects a string:

```typescript
stringMap.set(
  "bar",
  123, // red squiggly line under 123
);
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

Now when we hover over a call to `uniqueArray`, we can see that it is typed as unknown:

```typescript
const result = uniqueArray([1, 1, 2, 3, 4, 4, 5]);

// hovering over uniqueArray shows:
const uniqueArray: <unknown>(arr: any[]) => any[];
```

This is because we haven't passed any type arguments to it. If there's no type argument and no default, it defaults to unknown.

We want the type argument to be inferred as a number because we know that the thing we're getting back is an array of numbers.

So what we'll do is add a return type of `T[]` to the function:

```typescript
const uniqueArray = <T>(arr: any[]): T[] => {
  ...
```

Now the call to `uniqueArray` is inferred as returning an `unknown` array:

```typescript
const result = uniqueArray([1, 1, 2, 3, 4, 4, 5]);

// hovering over uniqueArray shows:
const uniqueArray: <unknown>(arr: any[]) => unknown[];
```

Again, the reason for this is that we haven't passed any type arguments to it. If there's no type argument and no default, it defaults to unknown.

If we add a `<number>` type argument to the call, the `result` will now be inferred as a number array:

```typescript
const result = uniqueArray<number>([1, 1, 2, 3, 4, 4, 5]);

// hovering over uniqueArray shows:
const uniqueArray: <number>(arr: any[]) => number[];
```

However, at this point there's no relationship between the things we're passing in and the thing we're getting out. Adding a type argument to the call returns an array of that type, but the `arr` parameter in the function itself is still typed as `any[]`.

What we need to do is tell TypeScript that the type of the `arr` parameter is the same type as what is passed in.

To do this, we'll replace `arr: any[]` with `arr: T[]`:

```typescript
const uniqueArray = <T>(arr: T[]): T[] => {
  ...
```

The function's return type is an array of `T`, where `T` represents the type of elements supplied to the function.

Thus, TypeScript can infer the return type as `number[]` for an input array of numbers, or `string[]` for an input array of strings, even without explicit return type annotation. As we can see, the tests pass successfully:

```typescript
// number test
const result = uniqueArray([1, 1, 2, 3, 4, 4, 5]);

type test = Expect<Equal<typeof result, number[]>>;

// string test
const result = uniqueArray(["a", "b", "b", "c", "c", "c"]);

type test = Expect<Equal<typeof result, string[]>>;
```

If you explicitly pass a type argument, TypeScript will use it. If you don't, TypeScript attempts to deduce it from the runtime arguments.

For example, if you try to pass a boolean in with the number array when providing a type argument, TypeScript will throw an error:

```typescript
const result = uniqueArray<number>([1, 1, 2, 3, 4, 4, 5, true]); // red squiggly line under true

// hovering over true shows:
Type 'boolean' is not assignable to type 'number'.
```

However, without the type argument there will be no error and the type will be inferred as an array of `number | boolean`:

```typescript
const result = uniqueArray([1, 1, 2, 3, 4, 4, 5, true]);

// hovering over uniqueArray shows:
const uniqueArray: <number | boolean>(arr: (number | boolean)[]) => (number | boolean)[]
```

The flexibility of generics and inference allows for dynamic code while still ensuring type safety.

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

These constraints have our tests passing, including the case where we pass in an extra `filepath` property. This is because using `extends` in generics does not restrict you to only passing in the properties defined in the constraint.

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
    ...
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

Whatever we pass into `safeFunction` will be inferred as the type argument for `PromiseFunc`. This is because the type argument is being inferred as the identity of the generic function.

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

The big takeaway is that when you're doing inference with function parameters, you want to make sure that you're capturing the entire arguments as a tuple with `TArgs extends any[]` instead of using just an array `TArgs[]`. Otherwise, you won't get the correct type inference.

### Solution 7: Type Predicates

For the `isString` function, we know that the `input` will be a string, but TypeScript can't infer that logic on its own. To help, we can add a type predicate that says `input is string`:

```typescript
const isString = (input: unknown): input is string => {
  return typeof input === "string";
};
```

With this change, the `isString` function can be used with `filter` and the test passes as expected:

```typescript
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

```typescript
function assertIsAdminUser(user: User): user is AdminUser {
  // red squiggly line under user is AdminUser
  if (!("roles" in user)) {
    throw new Error("User is not an admin");
  }
}
```

However, this leads to an error under `user is AdminUser`:

```typescript
// hovering over user is AdminUser shows:
A function whose declared type is neither 'undefined', 'void', nor 'any' must return a value.
```

We get this error because `assertIsAdminUser` is returning `void`, which is different from a type predicate that requires you to return a Boolean.

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
