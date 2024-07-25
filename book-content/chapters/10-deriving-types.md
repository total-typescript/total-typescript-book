One of the most common pieces of advice for writing maintainable code is to "Keep code DRY", or more explicitly, "Don't Repeat Yourself".

One way to do this in JavaScript is to take repeating code and capture it in functions or variables. These variables and functions can be reused, composed and combined in different ways to create new functionality.

In TypeScript, we can apply this same principle to types.

In this section, we're going to look at deriving types from other types. This lets us reduce repetition in our code, and create a single source of truth for our types.

This allows us to make changes in one type, and have those changes propagate throughout our application without needing to manually update every instance.

We'll even look at how we can derive types from _values_, so that our types always represent the runtime behavior of our application.

## Derived Types

A derived type is a type which relies on, or inherits from, a structure of another type. We can create derived types using some of the tools we've used so far.

We could use `interface extends` to make one interface inherit from another:

```typescript
interface Album {
  title: string;
  artist: string;
  releaseYear: number;
}

interface AlbumDetails extends Album {
  genre: string;
}
```

`AlbumDetails` inherits all of the properties of `Album`. This means that any changes to `Album` will trickle down to `AlbumDetails`. `AlbumDetails` is derived from `Album`.

Another example is a union type.

```typescript
type Triangle = {
  type: "triangle";
  sideLength: number;
};

type Rectangle = {
  type: "rectangle";
  width: number;
  height: number;
};

type Shape = Triangle | Rectangle;
```

A derived type represents a relationship. That relationship is one-way. `Shape` can't go back and modify `Triangle` or `Rectangle`. But any changes to `Triangle` and `Rectangle` will ripple through to `Shape`.

When well-designed, derived types can create huge gains in productivity. We can make changes in one place and have them propagate throughout our application. This is a powerful way to keep our code DRY and to leverage TypeScript's type system to its fullest.

This has tradeoffs. We can think of deriving as a kind of coupling. If we change a type that other types depend on, we need to be aware of the impact of that change. We'll discuss deriving vs decoupling in more detail at the end of the chapter.

But for now, let's look at some of the tools TypeScript provides for deriving types.

## The `keyof` Operator

The `keyof` operator allows you to extract the keys from an object type into a union type.

Starting with our familiar `Album` type:

```typescript
interface Album {
  title: string;
  artist: string;
  releaseYear: number;
}
```

We can use `keyof Album` and end up with a union of the `"title"`, `"artist"`, and `"releaseYear"` keys:

```typescript
type AlbumKeys = keyof Album; // "title" | "artist" | "releaseYear"
```

Since `keyof` tracks the keys from a source, any changes made to the type will automatically be reflected in the `AlbumKeys` type.

```typescript
interface Album {
  title: string;
  artist: string;
  releaseYear: number;
  genre: string; // added 'genre'
}

type AlbumKeys = keyof Album; // "title" | "artist" | "releaseYear" | "genre"
```

The `AlbumKeys` type can then be used to help ensure a key being used to access a value in an `Album` is valid as seen in this function:

```typescript
function getAlbumDetails(album: Album, key: AlbumKeys) {
  return album[key];
}
```

If the key passed to `getAlbumDetails` is not a valid key of `Album`, TypeScript will show an error:

```ts twoslash
// @errors: 2345
function getAlbumDetails(album: Album, key: AlbumKeys) {
  return album[key];
}

interface Album {
  title: string;
  artist: string;
  releaseYear: number;
  genre: string; // added 'genre'
}

type AlbumKeys = keyof Album; // "title" | "artist" | "releaseYear" | "genre"

const album: Album = {
  title: "Kind of Blue",
  artist: "Miles Davis",
  releaseYear: 1959,
  genre: "Jazz",
};

// ---cut---
getAlbumDetails(album, "producer");
```

`keyof` is an important building block when creating new types from existing types. We'll see later how we can use it with `as const` to build our own type-safe enums.

## The `typeof` Operator

The `typeof` operator allows you to extract a type from a value.

Say we have an `albumSales` object containing a few album title keys and some sales statistics:

```typescript
const albumSales = {
  "Kind of Blue": 5000000,
  "A Love Supreme": 1000000,
  "Mingus Ah Um": 3000000,
};
```

We can use `typeof` to extract the type of `albumSales`, which will turn it into a type with the original keys as strings and their inferred types as values:

```ts twoslash
const albumSales = {
  "Kind of Blue": 5000000,
  "A Love Supreme": 1000000,
  "Mingus Ah Um": 3000000,
};

// ---cut---
type AlbumSalesType = typeof albumSales;
//   ^?
```

Now that we have the `AlbumSalesType` type, we can create _another_ derived type from it. For example, we can use `keyof` to extract the keys from the `albumSales` object:

```typescript
type AlbumTitles = keyof AlbumSalesType; // "Kind of Blue" | "A Love Supreme" | "Mingus Ah Um"
```

A common pattern is to combine `keyof` and `typeof` to create a new type from an existing object type's keys and values:

```typescript
type AlbumTitles = keyof typeof albumSales;
```

We could use this in a function to ensure that the `title` parameter is a valid key of `albumSales`, perhaps to look up the sales for a specific album:

```typescript
function getSales(title: AlbumTitles) {
  return albumSales[title];
}
```

It's worth noting that `typeof` is not the same as the `typeof` operator used at runtime. TypeScript can tell the difference based on whether it's used in a type context or a value context:

```ts twoslash
const albumSales = {
  "Kind of Blue": 5000000,
  "A Love Supreme": 1000000,
  "Mingus Ah Um": 3000000,
};

// ---cut---
// Runtime typeof
const albumSalesType = typeof albumSales; // "object"

// Type typeof
type AlbumSalesType = typeof albumSales;
//   ^?
```

Use the `typeof` keyword whenever you need to extract types based on runtime values, including objects, functions, classes, and more. It's a powerful tool for deriving types from values, and it's a key building block for other patterns that we'll explore later.

### You Can't Create Runtime Types from Values

We've seen that `typeof` can create types from runtime values, but it's important to note that there is no way to create a value from a type.

In other words, there is no `valueof` operator:

```ts
type Album = {
  title: string;
  artist: string;
  releaseYear: number;
};

const album = valueof Album; // Does not work!
```

TypeScript's types disappear at runtime, so there's no built-in way to create a value from a type. In other words, you can move from the 'value world' to the 'type world', but not the other way around.

## Indexed Access Types

Indexed access types in TypeScript allow you to access a property of another type. This is similar to how you would access the value of a property in an object at runtime, but instead operates at the type level.

For example, we could use an indexed access type to extract the type of the `title` property from `AlbumDetails`:

```typescript
interface Album {
  title: string;
  artist: string;
  releaseYear: number;
}
```

If we try to use dot notation to access the `title` property from the `Album` type, TypeScript will throw an error:

```ts twoslash
// @errors: 2713
interface Album {
  title: string;
  artist: string;
  releaseYear: number;
}

// ---cut---
type AlbumTitle = Album.title;
```

In this case, the error message has a helpful suggestion: use `Album["title"]` to access the type of the `title` property in the `Album` type:

```ts twoslash
interface Album {
  title: string;
  artist: string;
  releaseYear: number;
}

// ---cut---
type AlbumTitle = Album["title"];
//   ^?
```

Using this indexed access syntax, the `AlbumTitle` type is equivalent to `string`, because that's the type of the `title` property in the `Album` interface.

This same approach can be used to extract types from a tuple, where the index is used to access the type of a specific element in the tuple:

```typescript
type AlbumTuple = [string, string, number];
type AlbumTitle = AlbumTuple[0];
```

Once again, the `AlbumTitle` will be a `string` type, because that's the type of the first element in the `AlbumTuple`.

### Chaining Multiple Indexed Access Types

Indexed access types can be chained together to access nested properties. This is useful when working with complex types that have nested structures.

For example, we could use indexed access types to extract the type of the `name` property from the `artist` property in the `Album` type:

```typescript
interface Album {
  title: string;
  artist: {
    name: string;
  };
}

type ArtistName = Album["artist"]["name"];
```

In this case, the `ArtistName` type will be equivalent to `string`, because that's the type of the `name` property in the `artist` object.

### Passing a Union to an Indexed Access Type

If you want to access multiple properties from a type, you might be tempted to create a union type containing multiple indexed accesses:

```typescript
type Album = {
  title: string;
  isSingle: boolean;
  releaseYear: number;
};

type AlbumPropertyTypes =
  | Album["title"]
  | Album["isSingle"]
  | Album["releaseYear"];
```

This will work, but you can do one better - you can pass a union type to an indexed access type directly:

```ts twoslash
type Album = {
  title: string;
  isSingle: boolean;
  releaseYear: number;
};
// ---cut---
type AlbumPropertyTypes = Album["title" | "isSingle" | "releaseYear"];
//   ^?
```

This is a more concise way to achieve the same result.

#### Get An Object's Values With `keyof`

In fact, you may have noticed that we have another opportunity to reduce repetition here. We can use `keyof` to extract the keys from the `Album` type and use them as the union type:

```ts twoslash
type Album = {
  title: string;
  isSingle: boolean;
  releaseYear: number;
};
// ---cut---
type AlbumPropertyTypes = Album[keyof Album];
//   ^?
```

This is a great pattern to use when you want to extract all of the values from an object type. `keyof Obj` will give you a union of all the _keys_ in `Obj`, and `Obj[keyof Obj]` will give you a union of all the _values_ in `Obj`.

## Using `as const` For JavaScript-Style Enums

In our chapter on TypeScript-only features, we looked at the `enum` keyword. We saw that `enum` is a powerful way to create a set of named constants, but it has some downsides.

We now have all the tools available to us to see an alternative approach to creating enum-like structures in TypeScript.

First, let's use the `as const` assertion we saw in the chapter on mutability. This forces an object to be treated as read-only, and infers literal types for its properties:

```typescript
const albumTypes = {
  CD: "cd",
  VINYL: "vinyl",
  DIGITAL: "digital",
} as const;
```

We can now _derive_ the types we need from `albumTypes` using `keyof` and `typeof`. For instance, we can grab the keys using `keyof`:

```typescript
type UppercaseAlbumType = keyof typeof albumTypes; // "CD" | "VINYL" | "DIGITAL"
```

We can also grab the values using `Obj[keyof Obj]`:

```typescript
type AlbumType = (typeof albumTypes)[keyof typeof albumTypes]; // "cd" | "vinyl" | "digital"
```

We can now use our `AlbumType` type to ensure that a function only accepts one of the values from `albumTypes`:

```typescript
function getAlbumType(type: AlbumType) {
  // ...
}
```

This approach is sometimes called a "POJO", or "Plain Old JavaScript Object". While it takes a bit of TypeScript magic to get the types set up, the result is simple to understand and easy to work with.

Let's now compare this to the `enum` approach.

### Enums Require You To Pass The Enum Value

Our `getAlbumType` function behaves differently than if it accepted an `enum`. Because `AlbumType` is just a union of strings, we can pass a raw string to `getAlbumType`. But if we pass the incorrect string, TypeScript will show an error:

```ts twoslash
// @errors: 2345
function getAlbumType(type: AlbumType) {
  // ...
}

const albumTypes = {
  CD: "cd",
  VINYL: "vinyl",
  DIGITAL: "digital",
} as const;

type AlbumType = (typeof albumTypes)[keyof typeof albumTypes]; // "cd" | "vinyl" | "digital"

// ---cut---
getAlbumType(albumTypes.CD); // no error
getAlbumType("vinyl"); // no error
getAlbumType("cassette");
```

This is a tradeoff. With `enum`, you have to pass the enum value, which is more explicit. With our `as const` approach, you can pass a raw string. This can make refactoring a little harder.

### Enums Have To Be Imported

Another downside of `enum` is that they have to be imported into the module you're in to use them:

```typescript
import { AlbumType } from "./enums";

getAlbumType(AlbumType.CD);
```

With our `as const` approach, we don't need to import anything. We can pass the raw string:

```typescript
getAlbumType("cd");
```

Fans of enums will argue that importing the enum is a good thing, because it makes it clear where the enum is coming from and makes refactoring easier.

### Enums Are Nominal

One of the biggest differences between `enum` and our `as const` approach is that `enum` is _nominal_, while our `as const` approach is _structural_.

This means that with `enum`, the type is based on the name of the enum. This means that enums with the same values that come from different enums are not compatible:

```ts twoslash
// @errors: 2345
function getAlbumType(type: AlbumType) {
  // ...
}

// ---cut---
enum AlbumType {
  CD = "cd",
  VINYL = "vinyl",
  DIGITAL = "digital",
}

enum MediaType {
  CD = "cd",
  VINYL = "vinyl",
  DIGITAL = "digital",
}

getAlbumType(AlbumType.CD);
getAlbumType(MediaType.CD);
```

If you're used to enums from other languages, this is probably what you expect. But for developers used to JavaScript, this can be surprising.

With a POJO, where the value comes from doesn't matter. If two POJOs have the same values, they are compatible:

```typescript
const albumTypes = {
  CD: "cd",
  VINYL: "vinyl",
  DIGITAL: "digital",
} as const;

const mediaTypes = {
  CD: "cd",
  VINYL: "vinyl",
  DIGITAL: "digital",
} as const;

getAlbumType(albumTypes.CD); // no error
getAlbumType(mediaTypes.CD); // no error
```

This is a tradeoff. Nominal typing can be more explicit and help catch bugs, but it can also be more restrictive and harder to work with.

### Which Approach Should You Use?

The `enum` approach is more explicit and can help you refactor your code. It's also more familiar to developers coming from other languages.

The `as const` approach is more flexible and easier to work with. It's also more familiar to JavaScript developers.

In general, if you're working with a team that's used to `enum`, you should use `enum`. But if I were starting a project today, I would use `as const` instead of enums.

## Exercises

### Exercise 1: Reduce Key Repetition

Here we have an interface named `FormValues`:

```typescript
interface FormValues {
  name: string;
  email: string;
  password: string;
}
```

This `inputs` variable is typed as a Record that specifies a key of either `name`, `email`, or `password` and a value that is an object with an `initialValue` and `label` properties that are both strings:

```typescript
const inputs: Record<
  "name" | "email" | "password", // change me!
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

Your task is to modify the `inputs` Record so its keys are derived from the `FormValues` interface.

<Exercise title="Exercise 1: Reduce Key Repetition" filePath="/src/040-deriving-types-from-values/125-keyof.problem.ts" resourceId="YgFRxBViy44CfW0H6uOLyz"></Exercise>

### Exercise 2: Derive a Type from a Value

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

<Exercise title="Exercise 2: Derive a Type from a Value" filePath="/src/040-deriving-types-from-values/126-typeof-keyword.problem.ts" resourceId="YgFRxBViy44CfW0H6uOMPr"></Exercise>

### Exercise 3: Accessing Specific Values

Here we have an `programModeEnumMap` object that keeps different groupings in sync. There is also a `ProgramModeMap` type that uses `typeof` to represent the entire enum mapping:

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

```ts twoslash
// @errors: 2344
import { Equal, Expect } from "@total-typescript/helpers";
// ---cut---
type Group = unknown;

type test = Expect<Equal<Group, "group">>;
```

Your task is to find the proper way to type `Group` so the test passes as expected.

<Exercise title="Exercise 3: Accessing Specific Values" filePath="/src/040-deriving-types-from-values/135-indexed-access-types.problem.ts" resourceId="5EnWog8KD1gKEzaFObJmOY"></Exercise>

### Exercise 4: Unions with Indexed Access Types

This exercise starts with the same `programModeEnumMap` and `ProgramModeMap` as the previous exercise:

```ts twoslash
// @errors: 2344
import { Equal, Expect } from "@total-typescript/helpers";
// ---cut---
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
>;
```

This time, your challenge is to update the `PlannedPrograms` type to use an indexed access type to extract a union of the `ProgramModeMap` values that included "`planned`".

<Exercise title="Exercise 4: Unions with Indexed Access Types" filePath="/src/040-deriving-types-from-values/136-pass-unions-to-indexed-access-types.problem.ts" resourceId="5EnWog8KD1gKEzaFObJmhp"></Exercise>

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
import { Equal, Expect } from "@total-typescript/helpers";
// ---cut---
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
>;
```

Using what you've learned so far, your task is to update the `AllPrograms` type to use an indexed access type to create a union of all the values from the `programModeEnumMap` object.

<Exercise title="Exercise 5: Extract a Union of All Values" filePath="/src/040-deriving-types-from-values/137-pass-keyof-into-an-indexed-access-type.problem.ts" resourceId="VtQChjOYAJCkX9MVx78MCb"></Exercise>

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
import { Equal, Expect } from "@total-typescript/helpers";
type AllPrograms = unknown;
// ---cut---

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
>;
```

Your task is to determine how to create the `AllPrograms` type in order for the test to pass as expected.

Note that just using `keyof` and `typeof` in an approach similar to the previous exercise's solution won't quite work to solve this one! This is tricky to find - but as a hint: you can pass primitive types to indexed access types.

<Exercise title="Exercise 6: Create a Union from an `as const` Array" filePath="/src/040-deriving-types-from-values/138-create-a-union-from-an-as-const-array.problem.ts" resourceId="AhnoaCs5v1qlRT7GjJoi5Y"></Exercise>

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

Now, if the `FormValues` interface changes, the `inputs` Record will automatically be updated to reflect those changes. `inputs` is derived from `FormValues`.

### Solution 2: Derive a Type from a Value

The solution is to use the `typeof` keyword in combination with `keyof` to create the `Environment` type.

You could use them together in a single line:

```typescript
type Environment = keyof typeof configurations;
```

Or you could first create a type from the `configurations` object and then update `Environment` to use `keyof` to extract the names of the keys:

```ts twoslash
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
// ---cut---
type Configurations = typeof configurations;
//   ^?

type Environment = keyof Configurations;
//   ^?
```

### Solution 3: Accessing Specific Values

Using an indexed access type, we can access the `GROUP` property from the `ProgramModeMap` type:

```ts twoslash
export const programModeEnumMap = {
  GROUP: "group",
  ANNOUNCEMENT: "announcement",
  ONE_ON_ONE: "1on1",
  SELF_DIRECTED: "selfDirected",
  PLANNED_ONE_ON_ONE: "planned1on1",
  PLANNED_SELF_DIRECTED: "plannedSelfDirected",
} as const;

type ProgramModeMap = typeof programModeEnumMap;

// ---cut---
type Group = ProgramModeMap["GROUP"];
//   ^?
```

With this change, the `Group` type will be in sync with the `ProgramModeEnumMap`'s `group` value. This means our test will pass as expected.

### Solution 4: Unions with Indexed Access Types

In order to create the `PlannedPrograms` type, we can use an indexed access type to extract a union of the `ProgramModeMap` values that include "`planned`":

```typescript
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

```ts twoslash
export const programModeEnumMap = {
  GROUP: "group",
  ANNOUNCEMENT: "announcement",
  ONE_ON_ONE: "1on1",
  SELF_DIRECTED: "selfDirected",
  PLANNED_ONE_ON_ONE: "planned1on1",
  PLANNED_SELF_DIRECTED: "plannedSelfDirected",
} as const;

// ---cut---
type ProgramModeMap = typeof programModeEnumMap;
type AllPrograms = ProgramModeMap[keyof ProgramModeMap];
//   ^?
```

Either solution results in a union of all values from the `programModeEnumMap` object, which means our test will pass as expected.

### Solution 6: Create a Union from an `as const` Array

When using `typeof` and `keyof` with indexed access type, we can extract all of the values, but we also get some unexpected values like a `6` and an `IterableIterator` function:

```ts twoslash
export const programModes = [
  "group",
  "announcement",
  "1on1",
  "selfDirected",
  "planned1on1",
  "plannedSelfDirected",
] as const;

// ---cut---
type AllPrograms = (typeof programModes)[keyof typeof programModes];
//   ^?
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

## Deriving Types From Functions

So far, we've only looked at deriving types from objects and arrays. But deriving types from functions can help solve some common problems in TypeScript.

### `Parameters`

The `Parameters` utility type extracts the parameters from a given function type and returns them as a tuple.

For example, this `sellAlbum` function takes in an `Album`, a `price`, and a `quantity`, then returns a number representing the total price:

```typescript
function sellAlbum(album: Album, price: number, quantity: number) {
  return price * quantity;
}
```

Using the `Parameters` utility type, we can extract the parameters from the `sellAlbum` function and assign them to a new type:

```ts twoslash
type Album = {
  title: string;
  artist: string;
  releaseYear: number;
};

function sellAlbum(album: Album, price: number, quantity: number) {
  return price * quantity;
}
// ---cut---
type SellAlbumParams = Parameters<typeof sellAlbum>;
//   ^?
```

Note that we need to use `typeof` to create a type from the `sellAlbum` function. Passing `sellAlbum` directly to `Parameters` won't work on its own because `sellAlbum` is a value instead of a type:

```ts twoslash
// @errors: 2749
type Album = {
  title: string;
  artist: string;
  releaseYear: number;
};
function sellAlbum(album: Album, price: number, quantity: number) {
  return price * quantity;
}
// ---cut---
type SellAlbumParams = Parameters<sellAlbum>;
```

This `SellAlbumParams` type is a tuple type that holds the `Album`, `price`, and `quantity` parameters from the `sellAlbum` function.

If we need to access a specific parameter from the `SellAlbumParams` type, we can use indexed access types:

```typescript
type Price = SellAlbumParams[1]; // number
```

### `ReturnType`

The `ReturnType` utility type extracts the return type from a given function:

```ts twoslash
type Album = {
  title: string;
  artist: string;
  releaseYear: number;
};
function sellAlbum(album: Album, price: number, quantity: number) {
  return price * quantity;
}
// ---cut---
type SellAlbumReturn = ReturnType<typeof sellAlbum>;
//   ^?
```

In this case, the `SellAlbumReturn` type is a number, which derived from the `sellAlbum` function.

### `Awaited`

Earlier in the book, we used the `Promise` type when working with asynchronous code.

The `Awaited` utility type is used to unwrap the `Promise` type and provide the type of the resolved value. Think of it as a shortcut similar to using `await` or `.then()` methods.

This can be particularly useful for deriving the return types of `async` functions.

To use it, you would pass a `Promise` type to `Awaited` and it would return the type of the resolved value:

```typescript
type AlbumPromise = Promise<Album>;

type AlbumResolved = Awaited<AlbumPromise>;
```

### Why Derive Types From Functions?

Being able to derive types from functions might not seem very useful at first. After all, if we control the functions then we can just write the types ourselves, and reuse them as needed:

```typescript
type Album = {
  title: string;
  artist: string;
  releaseYear: number;
};

const sellAlbum = (album: Album, price: number, quantity: number) => {
  return price * quantity;
};
```

There's no reason to use `Parameters` or `ReturnType` on `sellAlbum`, since we defined the `Album` type and the return type ourselves.

But what about functions you don't control?

A common example is a third-party library. A library might export a function that you can use, but might not export the accompanying types. An example I recently came across was a type from the library `@monaco-editor/react`.

```tsx
import { Editor } from "@monaco-editor/react";

// This is JSX component, for our purposes equivalent to...
<Editor
  onMount={(editor) => {
    // ...
  }}
/>;

// ...calling the function directly with an object
Editor({
  onMount: (editor) => {
    // ...
  },
});
```

In this case, I wanted to know the type of `editor` so I could reuse it in a function elsewhere. But the `@monaco-editor/react` library didn't export its type.

First, I extracted the type of the object the component expected:

```typescript
type EditorProps = Parameters<typeof Editor>[0];
```

Then, I used an indexed access type to extract the type of the `onMount` property:

```typescript
type OnMount = EditorProps["onMount"];
```

Finally, I extracted the first parameter from the `OnMount` type to get the type of `editor`:

```typescript
type Editor = Parameters<OnMount>[0];
```

This allowed me to reuse the `Editor` type in a function elsewhere in my code.

By combining indexed access types with TypeScript's utility types, you can work around the limitations of third-party libraries and ensure that your types stay in sync with the functions you're using.

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

<Exercise title="Exercise 7: A Single Source of Truth" filePath="/src/040-deriving-types-from-values/132-parameters-type-helper.problem.ts" resourceId="YgFRxBViy44CfW0H6uOO1f"></Exercise>

### Exercise 8: Typing Based on Return Value

Say we're working with a `createUser` function from a third-party library:

```typescript
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

```ts twoslash
// @errors: 2344
import { Equal, Expect } from "@total-typescript/helpers";
// ---cut---
type User = unknown;

type test = Expect<
  Equal<
    User,
    {
      id: string;
      name: string;
      email: string;
    }
  >
>;
```

Your task is to update the `User` type so the test passes as expected.

<Exercise title="Exercise 8: Typing Based on Return Value" filePath="/src/040-deriving-types-from-values/133-return-type.problem.ts" resourceId="YgFRxBViy44CfW0H6uOPRx"></Exercise>

### Exercise 9: Unwrapping a Promise

This time the `createUser` function from the third-party library is asynchronous:

```ts twoslash
// @errors: 2344 2304
import { Equal, Expect } from "@total-typescript/helpers";
// ---cut---
const fetchUser = async (id: string) => {
  return {
    id,
    name: "John Doe",
    email: "example@email.com",
  };
};

type test = Expect<
  Equal<
    User,
    {
      id: string;
      name: string;
      email: string;
    }
  >
>;
```

Like before, assume that you do not have access to the implementation of the `fetchUser` function.

Your task is to update the `User` type so the test passes as expected.

<Exercise title="Exercise 9: Unwrapping a Promise" filePath="/src/040-deriving-types-from-values/134-awaited-type-helper.problem.ts" resourceId="AhnoaCs5v1qlRT7GjJofuY"></Exercise>

### Solution 7: A Single Source of Truth

The `Parameters` utility type is key to this solution, but there is an additional step to follow.

Passing `makeQuery` directly to `Parameters` won't work on its own because `makeQuery` is a value instead of a type:

```ts twoslash
// @errors: 2749
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
// ---cut---
type MakeQueryParameters = Parameters<makeQuery>;
```

As the error message suggests, we need to use `typeof` to create a type from the `makeQuery` function, then pass that type to `Parameters`:

```ts twoslash
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
// ---cut---
type MakeQueryParameters = Parameters<typeof makeQuery>;
//   ^?
```

We now have `MakeQueryParameters` representing a tuple where the first member is a `url` string, and the second is the optional `opts` object.

Indexing into the type would allow us to create an `Opts` type that represents the `opts` object:

```typescript
type Opts = MakeQueryParameters[1];
```

### Solution 8: Typing Based on Return Value

Using the `ReturnType` utility type, we can extract the return type from the `createUser` function and assign it to a new type. Remember that since `createUser` is a value, we need to use `typeof` to create a type from it:

```ts twoslash
const createUser = (id: string) => {
  return {
    id,
    name: "John Doe",
    email: "example@email.com",
  };
};

// ---cut---
type User = ReturnType<typeof createUser>;
//   ^?
```

This `User` type is a match for the expected type, which means our test will pass as expected.

### Solution 9: Unwrapping a Promise

When using the `ReturnType` utility type with an async function, the resulting type will be wrapped in a `Promise`:

```ts twoslash
const fetchUser = async (id: string) => {
  return {
    id,
    name: "John Doe",
    email: "example@email.com",
  };
};

// ---cut---
type User = ReturnType<typeof fetchUser>;
//   ^?
```

In order to unwrap the `Promise` type and provide the type of the resolved value, we can use the `Awaited` utility type:

```typescript
type User = Awaited<ReturnType<typeof fetchUser>>;
```

Like before, the `User` type is now a match for the expected type, which means our test will pass as expected.

It would also be possible to create intermediate types, but combining operators and type derivation gives us a more succinct solution.

## Transforming Derived Types

In the previous section we looked at how to derive types from functions you don't control. Sometimes, you'll also need to do the same with _types_ you don't control.

### `Exclude`

The `Exclude` utility type is used to remove types from a union. Let's imagine that we have a union of different states our album can be in:

```typescript
type AlbumState =
  | {
      type: "released";
      releaseDate: string;
    }
  | {
      type: "recording";
      studio: string;
    }
  | {
      type: "mixing";
      engineer: string;
    };
```

We want to create a type that represents the states that are not "released". We can use the `Exclude` utility type to achieve this:

```ts twoslash
type AlbumState =
  | {
      type: "released";
      releaseDate: string;
    }
  | {
      type: "recording";
      studio: string;
    }
  | {
      type: "mixing";
      engineer: string;
    };

// ---cut---
type UnreleasedState = Exclude<AlbumState, { type: "released" }>;
//   ^?
```

In this case, the `UnreleasedState` type is a union of the `recording` and `mixing` states, which are the states that are not "released". `Exclude` filters out any member of the union with a `type` of `released`.

We could have done it by checking for a `releaseDate` property instead:

```typescript
type UnreleasedState = Exclude<AlbumState, { releaseDate: string }>;
```

This is because `Exclude` works by pattern matching. It will remove any type from the union that matches the pattern you provide.

This means we can use it to remove all strings from a union:

```ts twoslash
type Example = "a" | "b" | 1 | 2;

type Numbers = Exclude<Example, string>;
//   ^?
```

### `NonNullable`

`NonNullable` is used to remove `null` and `undefined` from a type. This can be useful when extracting a type from a partial object:

```ts twoslash
type Album = {
  artist?: {
    name: string;
  };
};

type Artist = NonNullable<Album["artist"]>;
//   ^?
```

This operates similarly to `Exclude`:

```typescript
type Artist = Exclude<Album["artist"], null | undefined>;
```

But `NonNullable` is more explicit and easier to read.

### `Extract`

`Extract` is the opposite of `Exclude`. It's used to extract types from a union. For example, we can use `Extract` to extract the `recording` state from the `AlbumState` type:

```ts twoslash
type AlbumState =
  | {
      type: "released";
      releaseDate: string;
    }
  | {
      type: "recording";
      studio: string;
    }
  | {
      type: "mixing";
      engineer: string;
    };

// ---cut---
type RecordingState = Extract<AlbumState, { type: "recording" }>;
//   ^?
```

This is useful when you want to extract a specific type from a union you don't control.

Similarly to `Exclude`, `Extract` works by pattern matching. It will extract any type from the union that matches the pattern you provide.

This means that, to reverse our `Extract` example earlier, we can use it to extract all strings from a union:

```ts twoslash
type Example = "a" | "b" | 1 | 2 | true | false;

type Strings = Extract<Example, string>;
//   ^?
```

It's worth noting the similarities between `Exclude`/`Extract` and `Omit/Pick`. A common mistake is to think that you can `Pick` from a union, or use `Exclude` on an object. Here's a little table to help you remember:

| Name      | Used On | Action              | Example                     |
| --------- | ------- | ------------------- | --------------------------- |
| `Exclude` | Unions  | Excludes members    | `Exclude<'a' \| 1, string>` |
| `Extract` | Unions  | Extracts members    | `Extract<'a' \| 1, string>` |
| `Omit`    | Objects | Excludes properties | `Omit<UserObj, 'id'>`       |
| `Pick`    | Objects | Extracts properties | `Pick<UserObj, 'id'>`       |

## Deriving vs Decoupling

Thanks to the tools in these chapters, we now know how to derive types from all sorts of sources: functions, objects and types. But there's a tradeoff to consider when deriving types: coupling.

When you derive a type from a source, you're coupling the derived type to that source. If you derive a type from another derived type, this can create long chains of coupling throughout your app that can be hard to manage.

### When Decoupling Makes Sense

Let's imagine we have a `User` type in a `db.ts` file:

```typescript
export type User = {
  id: string;
  name: string;
  imageUrl: string;
  email: string;
};
```

We'll say for this example that we're using a component-based framework like React, Vue or Svelte. We have a `AvatarImage` component that renders an image of the user. We could pass in the `User` type directly:

```tsx
import { User } from "./db";

export const AvatarImage = (props: { user: User }) => {
  return <img src={props.user.imageUrl} alt={props.user.name} />;
};
```

But as it turns out, we're only using the `imageUrl` and `name` properties from the `User` type. It's a good idea to make your functions and components only require the data they need to run. This helps prevent you from passing around unnecessary data.

Let's try deriving. We'll create a new type called `AvatarImageProps` that only includes the properties we need:

```tsx
import { User } from "./db";

type AvatarImageProps = Pick<User, "imageUrl" | "name">;
```

But let's think for a moment. We've now coupled the `AvatarImageProps` type to the `User` type. `AvatarImageProps` now not only depends on the shape of `User`, but its _existence_ in the `db.ts` file. This means if we ever move the location of the `User` type, or split it into separate interfaces, we'll need to think about `AvatarImageProps`.

Let's try the other way around. Instead of deriving `AvatarImageProps` from `User`, we'll decouple them. We'll create a new type which just has the properties we need:

```tsx
type AvatarImageProps = {
  imageUrl: string;
  name: string;
};
```

Now, `AvatarImageProps` is decoupled from `User`. We can move `User` around, split it into separate interfaces, or even delete it, and `AvatarImageProps` will be unaffected.

In this particular case, decoupling feels like the right choice. This is because `User` and `AvatarImage` are separate concerns. `User` is a data type, while `AvatarImage` is a UI component. They have different responsibilities and different reasons to change. By decoupling them, `AvatarImage` becomes more portable and easier to maintain.

What can make decoupling a difficult decision is that deriving can make you feel 'clever'. `Pick` tempts us because it uses a more advanced feature of TypeScript, which makes us feel good for applying the knowledge we've gained. But often, it's smarter to do the simple thing, and keep your types decoupled.

### When Deriving Makes Sense

Deriving makes most sense when the code you're coupling shares a common concern. The examples in this chapter are good examples of this. Our `as const` object, for instance:

```typescript
const albumTypes = {
  CD: "cd",
  VINYL: "vinyl",
  DIGITAL: "digital",
} as const;

type AlbumType = (typeof albumTypes)[keyof typeof albumTypes];
```

Here, `AlbumType` is derived from `albumTypes`. If we were to decouple it, we'd have to maintain two closely related sources of truth:

```typescript
type AlbumType = "cd" | "vinyl" | "digital";
```

Because both `AlbumType` and `albumTypes` are closely related, deriving `AlbumType` from `albumTypes` makes sense.

Another example is when one type is directly related to another. For instance, our `User` type might have a `UserWithoutId` type derived from it:

```typescript
type User = {
  id: string;
  name: string;
  imageUrl: string;
  email: string;
};

type UserWithoutId = Omit<User, "id">;

const updateUser = (id: string, user: UserWithoutId) => {
  // ...
};
```

Again, these concerns are closely related. Decoupling them would make our code harder to maintain and introduce more busywork into our codebase.

The decision to derive or decouple is all about reducing your future workload.

Are the two types so related that updates to one will need to ripple to the other? Derive.

Are they so unrelated that coupling them could result in more work down the line? Decouple.
