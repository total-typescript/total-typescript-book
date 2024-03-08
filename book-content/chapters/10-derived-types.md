<!-- CONTINUE -->

# Derived Types

One of the most common pieces of advice for writing maintainable code is to "Keep code DRY", or more explicitly, "Don't Repeat Yourself".

Through clever combinations of TypeScript's operators and utility types, we can follow this advice by deriving types from other types. This allows us to make changes in one place, and have those changes propagate throughout our application without needing to manually update every instance of a type.

In this chapter we will work through several different techniques of creating and manipulating types, as well as common conventions you can apply in your own projects.

## The `keyof` Operator

The `keyof` operator is a key tool for creating types from other types. It allows you to extract the keys from an object type into a union type.

Starting with our familiar `Album` interface:

```tsx
interface Album {
  title: string;
  artist: string;
  releaseYear: number;
}
```

We can use `keyof Album` and end up with a union of the `"title"`, `"artist"`, and `"releaseYear"` keys:

```tsx
type AlbumKeys = keyof Album; // "title" | "artist" | "releaseYear"
```

Since `keyof` dynamically extracts the keys from a source, any changes made to the interface will automatically be reflected in the `AlbumKeys` type.

The `AlbumKeys` type can then be used to help ensure a key being used to access a value in an `Album` is valid as seen in this function:

```tsx
function getAlbumDetails(album: Album, key: AlbumKeys) {
  return album[key];
}
```

If the key passed to `getAlbumDetails` is not a valid key of `Album`, TypeScript will throw an error. Otherwise, the appropriate value will be returned.

While this example `Album` interface only has a few keys and autocompletion makes it easy to manually write them out, you can imagine how useful `keyof` becomes when you have a large interface with many keys.

## The `typeof` Operator

The `typeof` operator is like a sibling to `keyof`, but it allows you to extract the type of a variable or property.

Say we have an `albumSales` object containing a few album title keys and some sales statistics:

```tsx
const albumSales = {
  "Kind of Blue": 5000000,
  "A Love Supreme": 1000000,
  "Mingus Ah Um": 3000000,
};
```

We can use `typeof` to extract the type of `albumSales`, which will turn it into a type with the original keys as strings and their inferred types as values:

```tsx
type AlbumSalesType = typeof albumSales;

// hovering over AlbumSalesType shows:
type AlbumSalesType = {
  "Kind of Blue": number;
  "A Love Supreme": number;
  "Mingus Ah Um": number;
};
```

The `typeof` operator is useful when you're not sure what the exact shape of an object will be ahead of time.

For example, this `getSales` function uses `typeof` to ensure that the `album` parameter is an object with keys that match the `albumSales` object:

```tsx
function getSales(albumSales: AlbumSalesType, title: string) {
  return albumSales[title];
}
```

Note that the `getSales` function will not throw an error if the `title` parameter is not a valid key of `albumSales`. This is because TypeScript does not have a built-in way to enforce that a string parameter is a valid key of an object type.

However, trying to pass in an object that doesn't match the `albumSales` type will throw an error:

```tsx
getSales({ "Echoes": 2000000 }, "Kind of Blue"); // red squiggly line under "Echoes"

// hovering over Echoes shows:
Object literal may only specify known properties, and '"Echoes"' does not exist in type '{ "Kind of Blue": number; "A Love Supreme": number; "Mingus Ah Um": number; }'.
```

Use the `typeof` keyword whenever you need to extract types based on runtime values, including objects, functions, classes, and more.

### You Can't Create Runtime Types from Values

We've seen that `typeof` can create types from runtime values, but it's important to note that there is no way to to create a value from a type.

In other words, there is no `valueof` operator:

```tsx
// This will not work!
const albumSalesValues = valueof AlbumSalesType; // red squiggly line under valueof

// hovering over valueof shows:
Cannot find name 'valueof'.
```

The reason this type of operation isn't supported is because TypeScript aims to avoid inference at runtime. For the failed `albumSalesValues` example above, TypeScript wouldn't know what specific string or number to generate.

If you're in a situation where you need to create values from a type, tools like Faker and other data generation libraries can create data based on types or schemas. Even though they don't use TypeScript types directly, they can be helpful.

Being unable to generate values from types aligns with TypeScript's fundamental principle of not adding too much code.

### Combining `keyof` and `typeof`

The `keyof` and `typeof` operators can be combined into a single operation to create a new type from an existing object type's keys and values.

For example, we can create a new `albumTitles` union type based on the keys from the `albumSales` object:

```tsx
type AlbumTitles = keyof typeof albumSales;

// hovering over AlbumTitles shows:
type AlbumTitles = "Kind of Blue" | "A Love Supreme" | "Mingus Ah Um";
```

First, `typeof albumSales` extracts the type of the `albumSales` object, which is an object type with string keys and number values. Then `keyof` extracts those string keys to create the union type.

This is just one example of how new types can be created without having to manually write them out or create intermediate types.

## Indexed Access Types

Indexed access types in TypeScript allow you to specify a key to access the type of a property within another type. This feature is similar to how you would access the value of a property in an object at runtime, but instead operates at the type level.

For example, we could use an indexed access type to extract the type of the `title` property from `AlbumDetails`:

```tsx
interface Album {
  title: string;
  artist: string;
  releaseYear: number;
}
```

If we try to use dot notation to access the `title` property from the `Album` type, TypeScript will throw an error:

```tsx
type AlbumTitle = Album.title; // red squiggly line under Album.title

// hovering over Album.title shows:
Cannot access 'Album.title' because 'Album' is a type, but not a namespace. Did you mean to retrieve the type of the property 'title' in 'Album' with 'Album["title"]'?
```

In this case, the error message has a helpful suggestion: use `Album["title"]` to access the type of the `title` property in the `Album` type:

```typescript
type AlbumTitle = Album["title"];

// hovering over AlbumTitle shows:
type AlbumTitle = string;
```

Using this indexed access syntax, the `AlbumTitle` type is equivalent to `string`, because that's the type of the `title` property in the `Album` interface.

This same approach can be used to extract types from a tuple, where the index is used to access the type of a specific element in the tuple:

```tsx
type AlbumTuple = [string, string, number];
type AlbumTitle = AlbumTuple[0];
```

Once again, the `AlbumTitle` will be a `string` type, because that's the type of the first element in the `AlbumTuple`.

### Dynamic Type Creation

Indexed access types are particularly useful for helping you create types based on a known structure like you might get back from a database or API. They also support indexing with more than just strings. Many types including unions can be used with indexed access types, as we'll see in this example.

Say we have an `albumDetails` object with the following structure:

```tsx
const albumDetails = {
  "Kind of Blue": ["Kind of Blue", "Miles Davis", 1959],
  "A Love Supreme": ["A Love Supreme", "John Coltrane", 1965],
  "Mingus Ah Um": ["Mingus Ah Um", "Charles Mingus", 1959],
};
```

Since `albumDetails` is a value instead of a type, we'll use `typeof` to create a type from it:

```tsx
type AlbumDetailsType = typeof albumDetails;

// hovering over AlbumDetailsType shows:
type AlbumDetailsType = {
  "Kind of Blue": [string, string, number];
  "A Love Supreme": [string, string, number];
  "Mingus Ah Um": [string, string, number];
};
```

Then we'll create an `AlbumNames` type by using `keyof` to extract the keys from `AlbumDetailsType`:

```tsx
type AlbumNames = keyof albumDetails;

// hovering over AlbumNames shows:
type AlbumNames = "Kind of Blue" | "A Love Supreme" | "Mingus Ah Um";
```

Once we have an `AlbumNames` type, we can use an indexed access type to create a new type based on the original `albumDetails` object. This type will be a tuple that can hold either a string or number:

```tsx
type AlbumInfoTuple = AlbumDetailsType[AlbumNames];

// hovering over AlbumInfoTuple shows:
type AlbumInfoTuple = (string | number)[];
```

This means we can now use the `AlbumInfoTuple` type for any other object that has the same structure as the `albumDetails` values:

```tsx
function printAlbumDetails(album: AlbumInfoTuple) {
  const [name, artist, year] = album;
  console.log(`"${name}" by ${artist}, released in ${year}`);
}

const outToLunch: AlbumInfoTuple = ["Out to Lunch", "Eric Dolphy", 1964];

printAlbumDetails(outToLunch); // "Out to Lunch" by Eric Dolphy, released in 1964
```

Combining indexed access types with `keyof` and `typeof` provides a very nice development experience for dynamically creating types from structured values.

## Exercises

### Exercise 1: Reduce Key Repetition

Here we have an interface named `FormValues`:

```tsx
interface FormValues {
  name: string;
  email: string;
  password: string;
}
```

This `inputs` variable is typed as a Record that specifies a key of either `name`, `email`, or `password` and a value that is an object with an `initialValue` and `label` properties that are both strings:

```tsx
const inputs: Record<
  "name" | "email" | "password",
  {
    initialValue: string;
    label: string;
  }
> = {
  name: {
    initialValue: "",
    label: "Name",
  },
  email: {
    initialValue: "",
    label: "Email",
  },
  password: {
    initialValue: "",
    label: "Password",
  },
};
```

Notice there is a lot of duplication here. Both the `FormValues` interface and `inputs` Record contain `name`, `email`, and `password`.

Your task is to modify the `inputs` Record so its keys are inherited from the `FormValues` interface.

### Exercise 2: Create a Type from a Value

Here, we have an object named `configurations` that comprises a set of deployment environments for `development`, `production`, and `staging`.

Each environment has its own url and timeout settings:

```typescript
const configurations = {
  development: {
    apiBaseUrl: "http://localhost:8080",
    timeout: 5000,
  },
  production: {
    apiBaseUrl: "https://api.example.com",
    timeout: 10000,
  },
  staging: {
    apiBaseUrl: "https://staging.example.com",
    timeout: 8000,
  },
};
```

An `Environment` type has been declared as follows:

```typescript
type Environment = "development" | "production" | "staging";
```

We want to use the `Environment` type across our application. However, the `configurations` object should be used as the source of truth.

Your task is to update the `Environment` type so that it is derived from the `configurations` object.

### Exercise 3: Accessing Specific Values

Here were have an `programModeEnumMap` object that keeps different groupings in sync. There is also a `ProgramModeMap` type that uses `typeof` to represent the entire enum mapping:

```typescript
export const programModeEnumMap = {
  GROUP: "group",
  ANNOUNCEMENT: "announcement",
  ONE_ON_ONE: "1on1",
  SELF_DIRECTED: "selfDirected",
  PLANNED_ONE_ON_ONE: "planned1on1",
  PLANNED_SELF_DIRECTED: "plannedSelfDirected",
} as const;

type ProgramModeMap = typeof programModeEnumMap;
```

The goal is to have a `Group` type that is always in sync with the `ProgramModeEnumMap`'s `group` value. Currently it is typed as `unknown`:

```typescript
type Group = unknown;

type test = Expect<Equal<Group, "group">>; // red squiggly line under Equal<>
```

Your task is to find the proper way to type `Group` so the test passes as expected.

### Exercise 4: Unions with Indexed Access Types

This exercise starts with the same `programModeEnumMap` and `PropgramModeMap` as the previous exercise:

```tsx
export const programModeEnumMap = {
  GROUP: "group",
  ANNOUNCEMENT: "announcement",
  ONE_ON_ONE: "1on1",
  SELF_DIRECTED: "selfDirected",
  PLANNED_ONE_ON_ONE: "planned1on1",
  PLANNED_SELF_DIRECTED: "plannedSelfDirected",
} as const;

type ProgramModeMap = typeof programModeEnumMap;

type PlannedPrograms = unknown;

type test = Expect<
  Equal<PlannedPrograms, "planned1on1" | "plannedSelfDirected">
>; // red squiggly line under Equal<>
```

This time, your challenge is to update the `PlannedPrograms` type to use an indexed access type to extract a union of the `ProgramModeMap` values that included "`planned`".

### Exercise 5: Extract a Union of All Values

We're back with the `programModeEnumMap` and `ProgramModeMap` type:

```typescript
export const programModeEnumMap = {
  GROUP: "group",
  ANNOUNCEMENT: "announcement",
  ONE_ON_ONE: "1on1",
  SELF_DIRECTED: "selfDirected",
  PLANNED_ONE_ON_ONE: "planned1on1",
  PLANNED_SELF_DIRECTED: "plannedSelfDirected",
} as const;

type ProgramModeMap = typeof programModeEnumMap;
```

This time we're interested in extracting all of the values from the `programModeEnumMap` object:

```typescript
type AllPrograms = unknown;

type test = Expect<
  Equal<
    AllPrograms,
    | "group"
    | "announcement"
    | "1on1"
    | "selfDirected"
    | "planned1on1"
    | "plannedSelfDirected"
  >
>; // red squiggly line under Equal<>
```

Using what you've learned so far, your task is to update the `AllPrograms` type to use an indexed access type to create a union of all the values from the `programModeEnumMap` object.

### Exercise 6: Create a Union from an `as const` Array

Here's an array of `programModes` wrapped in an `as const`:

```typescript
export const programModes = [
  "group",
  "announcement",
  "1on1",
  "selfDirected",
  "planned1on1",
  "plannedSelfDirected",
] as const;
```

A test has been written to check if an `AllPrograms` type is a union of all the values in the `programModes` array:

```typescript
type test = Expect<
  Equal<
    AllPrograms,
    | "group"
    | "announcement"
    | "1on1"
    | "selfDirected"
    | "planned1on1"
    | "plannedSelfDirected"
  >
>; // red squiggly line under Equal<>
```

Your task is to determine how to create the `AllPrograms` type in order for the test to pass as expected.

Note that just using `keyof` and `typeof` in an approach similar to the previous exercise's solution won't quite work to solve this one! As a hint, remember that primitive types can be passed into indexed access types.

### Solution 1: Reduce Key Repetition

The solution is to use `keyof` to extract the keys from the `FormValues` interface and use them as the keys for the `inputs` Record:

```typescript
const inputs: Record<
  keyof FormValues, // "name" | "email" | "password"
  {
    initialValue: string;
    label: string;
  } = {
    // object as before
  };
```

### Solution 2: Create a Type from a Value

The solution is to use the `typeof` keyword in combination with `keyof` to create the `Environment` type.

You could use them together in a single line:

```tsx
type Environment = keyof typeof configurations;
```

Or you could first create a type from the `configurations` object and then update `Environment` to use `keyof` to extract the names of the keys:

```tsx
type Configurations = typeof configurations;
type Environment = keyof Configurations;

// hovering over Configurations shows:
type Configurations = {
  development: {
    apiBaseUrl: string;
    timeout: number;
  };
  production: {
    apiBaseUrl: string;
    timeout: number;
  };
  staging: {
    apiBaseUrl: string;
    timeout: number;
  };
};

// hovering over Environment shows:
type Environment = "development" | "production" | "staging";
```

### Solution 3: Accessing Specific Values

Using an indexed access type, we can access the `GROUP` property from the `ProgramModeMap` type:

```typescript
type Group = ProgramModeMap["GROUP"];

// hovering over Group shows:
type Group = "group";
```

With this change, the `Group` type will be in sync with the `ProgramModeEnumMap`'s `group` value. This means our test will pass as expected.

### Solution 4: Unions with Indexed Access Types

In order to create the `PlannedPrograms` type, we can use an indexed access type to extract a union of the `ProgramModeMap` values that include "`planned`":

```tsx
type Key = "PLANNED_ONE_ON_ONE" | "PLANNED_SELF_DIRECTED";
type PlannedPrograms = ProgramModeMap[Key];
```

With this change, the `PlannedPrograms` type will be a union of `planned1on1` and `plannedSelfDirected`, which means our test will pass as expected.

### Solution 5: Extract a Union of All Values

Using `keyof` and `typeof` together is the solution to this problem.

The most condensed solution looks like this:

```typescript
type AllPrograms = (typeof programModeEnumMap)[keyof typeof programModeEnumMap];
```

Using an intermediate type, you could first use `typeof programModeEnumMap` to create a type from the `programModeEnumMap` object, then use `keyof` to extract the keys:

```tsx
type ProgramModeMap = typeof programModeEnumMap;
type AllPrograms = ProgramModeMap[keyof ProgramModeMap];
```

Either solution results in a union of all values from the `programModeEnumMap` object, which means our test will pass as expected.

```typescript
// hovering over AllPrograms shows:
type AllPrograms =
  | "group"
  | "announcement"
  | "1on1"
  | "selfDirected"
  | "planned1on1"
  | "plannedSelfDirected";
```

### Solution 6: Create a Union from an `as const` Array

When using `typeof` and `keyof` with indexed access type, we can extract all of the values, but we also get some unexpected values like a `6` and an `IterableIterator` function:

```typescript
type AllPrograms = (typeof programModes)[keyof typeof programModes];

// hovering over AllPrograms shows:
type AllPrograms =
  | "group"
  | "announcement"
  | "1on1"
  | "selfDirected"
  | "planned1on1"
  | "plannedSelfDirected"
  | 6
  | (() => IterableIterator<"group" | "announcement" | "1on1" | "selfDirected" | "planned1on1" | "plannedSelfDirected">)
  | ... 23 more ...
  | ((index: number) => "group" | ... 5 more ... | undefined);
```

The additional stuff being extracted causes the test to fail because it is only expecting the original values instead of numbers and functions.

Recall that we can access the first element using `programModes[0]`, the second element using `programModes[1]`, and so on. This means that we could use a union of all possible index values to extract the values from the `programModes` array:

```typescript
type AllPrograms = (typeof programModes)[0 | 1 | 2 | 3 | 4 | 5];
```

This solution makes the test pass, but it doesn't scale well. If the `programModes` array were to change, we would need to update the `AllPrograms` type manually.

Instead, we can use the `number` type as the argument to the indexed access type to represent all possible index values:

```typescript
type AllPrograms = (typeof programModes)[number];
```

Now new items can be added to the `programModes` array without needing to update the `AllPrograms` type manually. This solution makes the test pass as expected, and is a great pattern to apply in your own projects.

## Utility & Helper Types for Deriving Types

Throughout the book so far, you've seen examples of several utility types that TypeScript provides. Let's add a few more to the list that are especially useful when deriving types from other types.

### `Parameters`

The `Parameters` utility type extracts the parameters from a given function type and returns them as a tuple type.

For example, this `sellAlbum` function takes in an `Album`, a `price`, and a `quantity`, then returns a number representing the total price:

```typescript
function sellAlbum(album: Album, price: number, quantity: number) {
  return price * quantity;
}
```

Using the `Parameters` utility type, we can extract the parameters from the `sellAlbum` function and assign them to a new type:

```typescript
type SellAlbumParams = Parameters<typeof sellAlbum>;

// hovering over SellAlbumParams shows:
type SellAlbumParams = [Album, number, number];
```

This `SellAlbumParams` type is a tuple type that holds the `Album`, `price`, and `quantity` parameters from the `sellAlbum` function.

The `Parameters` utility type is great when you need to extract the parameters from a function that you don't have direct access to, like when working with third-party libraries.

### `ReturnType`

After seeing the `Parameters` type, it follows that the `ReturnType` utility type extracts the return type from a given function:

```tsx
type SellAlbumReturn = ReturnType<typeof sellAlbum>;

// hovering over SellAlbumReturn shows:
type SellAlbumReturn = number;
```

In this case, the `SellAlbumReturn` type is a number, which corresponds to the inferred return type of the `sellAlbum` function.

### `Awaited`

Earlier in the book, we used the `Promise` type when working with asynchronous code. Recall that in TypeScript, the result of any async operation will be wrapped in a `Promise` object.

The `Awaited` utility type is used to unwrap the `Promise` type and provide the type of the resolved value. Think of it as a shortcut similar to using `await` or `.then()` methods.

To use it, you would pass a `Promise` type to `Awaited` and it would return the type of the resolved value:

```typescript
type AlbumPromise = Promise<Album>;
type AlbumResolved = Awaited<AlbumPromise>;
```

## Exercises

### Exercise 7: A Single Source of Truth

Here we have a `makeQuery` function that takes two parameters: a `url` and an optional `opts` object.

```typescript
const makeQuery = (
  url: string,
  opts?: {
    method?: string;
    headers?: {
      [key: string]: string;
    };
    body?: string;
  },
) => {};
```

We want to specify these parameters as a tuple called `MakeQueryParameters` where the first argument of the tuple would be the string, and the second member would be the optional `opts` object.

Manually specifying the `MakeQueryParameters` would look something like this:

```typescript
type MakeQueryParameters = [
  string,
  {
    method?: string;
    headers?: {
      [key: string]: string;
    };
    body?: string;
  }?,
];
```

In addition to being a bit annoying to write and read, the other problem with the above is that we now have two sources of truth: one is the `MakeQueryParameters` type, and the other is in the `makeQuery` function.

Your task is to use a utility type to fix this problem.

### Exercise 8: Typing Based on Return Value

Say we're working with a `createUser` function from a third-party library:

```tsx
const createUser = (id: string) => {
  return {
    id,
    name: "John Doe",
    email: "example@email.com",
  };
};
```

For the sake of this exercise, assume we don't know the implementation of the function.

The goal is to create a `User` type that represents the return type of the `createUser` function. A test has been written to check if the `User` type is a match:

```tsx
type User = unknown;

type test = Expect<
  Equal<
    // red squiggly line under Equal<>
    User,
    {
      id: string;
      name: string;
      email: string;
    }
  >
>; // red squiggly line under Equal<>
```

Your task is to update the `User` type so the test passes as expected.

### Exercise 9: Unwrapping a Promise

This time the `createUser` function from the third-party library is asynchronous:

```tsx
const fetchUser = async (id: string) => {
  return {
    id,
    name: "John Doe",
    email: "example@email.com",
  };
};

type test = Expect<
  Equal<
    // red squiggly line under Equal<>
    User,
    {
      id: string;
      name: string;
      email: string;
    }
  >
>; // red squiggly line under Equal<>
```

Like before, assume that you do not have access to the implementation of the `fetchUser` function.

Your task is to update the `User` type so the test passes as expected.

### Solution 7: A Single Source of Truth

The `Parameters` utility type is key to this solution, but there is an additional step to follow.

Passing `makeQuery` directly to `Parameters` won't work on its own because `makeQuery` is a value instead of a type:

```tsx
type MakeQueryParameters = Parameters<makeQuery>; // red squiggly line under makeQuery

// hovering over makeQuery shows:
'makeQuery' refers to a value, but is being used as a type here. Did you mean 'typeof makeQuery'?
```

As the error message suggests, we need to use `typeof` to create a type from the `makeQuery` function, then pass that type to `Parameters`:

```typescript
type MakeQueryParameters = Parameters<typeof makeQuery>;

// hovering over MakeQueryParameters shows:
type MakeQueryParameters = [
  url: string,
  opts?:
    | {
        method?: string | undefined;
        headers?:
          | {
              [key: string]: string;
            }
          | undefined;
        body?: string | undefined;
      }
    | undefined,
];
```

We now have `MakeQueryParameters` representing a tuple where the first member is a `url` string, and the second is the optional `opts` object.

Indexing into the type would allow us to create an `Opts` type that represents the `opts` object:

```typescript
type Opts = MakeQueryParameters[1];
```

### Solution 8: Typing Based on Return Value

Using the `ReturnType` utility type, we can extract the return type from the `createUser` function and assign it to a new type. Remember that since `createUser` is a value, we need to use `typeof` to create a type from it:

```typescript
type User = ReturnType<typeof createUser>;

// hovering over User shows:
type User = {
  id: string;
  name: string;
  email: string;
};
```

This `User` type is a match for the expected type, which means our test will pass as expected.

### Solution 9: Unwrapping a Promise

When using the `ReturnType` utility type with an async function, the resulting type will be wrapped in a `Promise`:

```tsx
type User = ReturnType<typeof fetchUser>;

// hovering over User shows:
type User = Promise<{
  id: string;
  name: string;
  email: string;
}>;
```

In order to unwrap the `Promise` type and provide the type of the resolved value, we can use the `Awaited` utility type:

```tsx
type User = Awaited<ReturnType<typeof fetchUser>>;
```

Like before, the `User` type is now a match for the expected type, which means our test will pass as expected.

It would also be possible to create intermediate types, but combining operators and type derivation gives us a more succinct solution.
