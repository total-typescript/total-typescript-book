# 07. Mutability

The way you declare variables and object properties in TypeScript can significantly affect type inference and mutability. In this chapter, we'll explore the implications of using `let` and `const`, how to ensure proper object property inference, and techniques for enforcing immutability.

## How Mutability Affects Inference

### Variable Declaration and Type Inference

As with recent versions of JavaScript, TypeScript supports the `let` and `const` keywords for variable declaration.

When using the `let` keyword, the variable is mutable and can be reassigned. This mutability can lead to less precise type inference, as TypeScript must account for potential changes to the variable's value.

Using `const` indicates that the variable's value is immutable and cannot be changed once set. This immutability allows TypeScript to infer more precise types.

Consider this `AlbumGenre` type is a union of literal values representing possible genres for an album:

```typescript
type AlbumGenre = "rock" | "country" | "electronic";
```

Using `let`, we can declare a variable `albumGenre` and assign it the value `"rock"`:

```typescript
let albumGenre = "rock";

// hovering over albumGenre shows:
let albumGenre: string;
```

Then we can attempt to assign a genre inside of an `albumDetails` object:

```typescript
const albumDetails: { genre: AlbumGenre } = {
  genre: albumGenre, // red squiggly line under genre
};
```

TypeScript shows us an error below `genre` inside of the assignment:

```tsx
Type 'string' is not assignable to type 'AlbumGenre'.
```

Because `let` was used when declaring the variable, TypeScript sees that mutability has been implied. Therefore, it will infer a more general type in order to accommodate the variable being reassigned. In this case, it infers `albumGenre` as a `string` rather than the specific literal type `"rock"`.

When we change the variable declaration to use `const`, TypeScript will infer the type more precisely. There is no longer an error in the assignment, and hovering over `albumGenre` inside of the `albumDetails` object shows that TypeScript has inferred it as the literal type `"rock"`:

```typescript
const albumGenre = "rock";

const albumDetails: { genre: AlbumGenre } = {
  genre: albumGenre, // No error
};

// hovering over albumGenre shows:
const albumGenre: "rock";
```

If we try to change the value of `albumGenre` after declaring it as `const`, TypeScript will show an error:

```typescript
genre = "country"; // red squiggly line under genre

// Hovering over genre shows:
Error: Cannot assign to 'genre' because it is a constant
```

TypeScript is mirroring JavaScript's treatment of const in order to prevent possible runtime errors. When you declare a variable as `const`, TypeScript infers it as the literal type you specified.

Your choice between `let` and `const` when declaring variables impacts how TypeScript infers types. Using `let` is good for variables that you expect to change, while `const` is better for variables that won't.

### Object Property Inference

Just like in JavaScript, objects are mutable in TypeScript, meaning their properties can be changed after they are created. As we saw with variables, how you create objects in TypeScript can affect how well type inference works.

For this example, we have an `AlbumAttributes` type that includes a `status` property with a union of literal values representing possible album statuses:

```typescript
type AlbumAttributes = {
  status: "new release" | "on sale" | "staff pick";
};
```

Say we had an `updateStatus` function that takes an `AlbumAttributes` object and updates its `status` property (though for illustration purposes, we won't define the function here):

```typescript
const updateStatus = (attributes: AlbumAttributes) => {};

const albumAttributes = {
  status: "on sale",
};

updateStatus(albumAttributes); // red squiggly line under albumAttributes
```

TypeScript gives us an error below `albumAttributes` inside of the `updateStatus` function call, with messages similar to what we saw before:

```tsx
Argument of type '{ status: string; }' is not assignable to parameter of type 'AlbumAttributes'.
Types of property 'status' are incompatible.
Type 'string' is not assignable to type '"new release" | "on sale" | "staff pick"'.
```

Even though the `albumAttributes` object was declared with `const`, TypeScript treats object properties as mutable. We get the error when calling `updateStatus` because the `status` property is inferred as a `string` rather than the specific literal type `"on sale"`.

### Resolving Property Inference Errors

Let's look at a couple of ways to fix this inference issue.

#### Using an Inline Object

One approach is to inline the object when calling the `updateStatus` function instead of declaring it separately:

```typescript
updateStatus({
  status: "onSale",
}); // No error
```

When inlining the object, TypeScript knows that there is no way that `status` could be changed before it is passed into the function.

#### Adding a Type to the Object

Another option is to explicitly declare the type of the `albumAttributes` object to be `AlbumAttributes`:

```tsx
const albumAttributes: AlbumAttributes = {
  status: "on sale",
};

updateStatus(albumAttributes); // No error
```

When the object's type is specified, TypeScript can confidently infer that the `status` property matches one of the allowed literals from the union.

Whether working with a single object or an array of objects, these techniques for ensuring proper object property inference will help you avoid inference errors.

## Readonly Object Properties

For times when you want to ensure that an object's properties cannot be changed after they are set, TypeScript provides the `readonly` modifier.

Consider this `Album` interface, where the `title` and `artist` are marked as `readonly`:

```typescript
interface Album {
  readonly title: string;
  readonly artist: string;
  status?: "new release" | "on sale" | "staff pick";
  genre?: string[];
}
```

Once an `Album` object is created, its `title` and `artist` properties are locked in and cannot be changed. However, the optional `status` and `genre` properties can still be modified.

### The `Readonly` Type Helper

If you want to specify that all properties of an object should be read-only, TypeScript provides a type helper called `Readonly`.

To use it, you simply wrap the object type with `Readonly`.

Here's an example of using `Readonly` to create an `Album` object:

```typescript
const readOnlyWhiteAlbum: Readonly<Album> = {
  title: "The Beatles (White Album)",
  artist: "The Beatles",
  status: "staff pick",
};
```

Because the `readOnlyWhiteAlbum` object was created using the `Readonly` type helper, none of the properties can be modified:

```tsx
readOnlyWhiteAlbum.genre = ["rock", "pop", "unclassifiable"]; // red squiggly line under genre

// hovering over genre shows:
Cannot assign to 'genre' because it is a read-only property
```

Note that like many of TypeScript's type helpers, the immutability enforced by `Readonly` only operates on the first level. It won't make properties read-only recursively.

## Readonly Arrays

As with object properties, arrays and tuples can be made immutable by using the `readonly` modifier.

Here's how the `readonly` modifier can be used to create a read-only array of genres. Once the array is created, its contents cannot be modified:

```typescript
const readOnlyGenres: readonly string[] = ["rock", "pop", "unclassifiable"];
```

TypeScript also offers a `ReadonlyArray` type helper that functions in the same way to using the above syntax:

```tsx
const readOnlyGenres: ReadonlyArray<string> = ["rock", "pop", "unclassifiable"];
```

Both of these approaches are functionally the same. Hovering over the `readOnlyGenres` variable shows that TypeScript has inferred it as a read-only array:

```typescript
// hovering over `readOnlyGenres` shows:
const readOnlyGenres: readonly string[];
```

Note that while calling array methods that cause mutations will result in errors, methods like `map()` and `reduce()` will still work, as they create a copy of the array and do not mutate the original.

```tsx
const uppercaseGenres = readOnlyGenres.map((genre) => genre.toUpperCase()); // No error

readOnlyGenres.push("experimental"); // red squiggly line under push

// hovering over push shows:
Property 'push' does not exist on type 'readonly string[]'
```

### Distinguishing Assignability Between Read-Only and Mutable Arrays

To help drive the concept home, let's take compare assignability between read-only and mutable arrays.

Here are two `printGenre` functions that are functionally identical, except `printGenresReadOnly` takes a read-only array of genres as a parameter whereas `printGenresMutable` takes a mutable array:

```typescript
function printGenresReadOnly(genres: readonly string[]) {
  for (const genre of genres) {
    console.log(genre);
  }
}

function printGenresMutable(genres: string[]) {
  for (const genre of genres) {
    console.log(genre);
  }
}
```

When we create a mutable array of genres, it can be passed as an argument to both of these functions without error:

```typescript
const mutableGenres = ["rock", "pop", "unclassifiable"];

printGenresReadOnly(mutableGenres);
printGenresMutable(mutableGenres);
```

This works because specifying `readonly` on the `printGenresReadOnly` function parameter only guarantees that it won't alter the array's content. Thus, it doesn't matter if we pass a mutable array because it won't be changed.

However, the reverse is not true.

If we declare a read-only array, we can only pass it to `printGenresReadOnly`. Attempting to pass it to `printGenresMutable` will yield an error:

```typescript
const readOnlyGenres: readonly string[] = ["rock", "pop", "unclassifiable"];

printGenresReadOnly(readOnlyGenres);
printGenresMutable(readOnlyGenres); // red squiggly line under readOnlyGenres

// hovering over readOnlyGenres shows:
Error: Argument of type 'readonly ["rock", "pop", "unclassifiable"]' is not assignable to parameter of type 'string[]'
```

The error arises due to the potential for a mutable array to be altered inside of the function, which isn't acceptable for a read-only array.

Essentially, read-only arrays can only be assigned to other read-only types. This characteristic is somewhat viral: if a function deep down the call stack expects a `readonly` array, then that array must remain `readonly` throughout. Doing so ensures that the array won't be mutated in any manner as it moves down the stack.

The big takeaway here is that even though you can assign mutable arrays to read-only arrays, you cannot assign read-only arrays to mutable arrays.

## Exercises

### Exercise 1: Inference with an Array of Objects

Here we have a `modifyButtons` function that takes in an array of objects with `type` properties that are either `"button"`, `"submit"`, or `"reset"`.

When attempting to call `modifyButtons` with an array of objects that seem to meet the contract, TypeScript gives us an error:

```typescript
type ButtonAttributes = {
  type: "button" | "submit" | "reset";
};

const modifyButtons = (attributes: ButtonAttributes[]) => {};

const buttonsToChange = [
  {
    type: "button",
  },
  {
    type: "submit",
  },
];

modifyButtons(buttonsToChange); // red squiggly line under buttonsToChange
```

Your task is to determine why this error shows up, then resolve it.

### Exercise 2: Avoiding Array Mutation

This `printNames` function accepts an array of `name` strings and logs them to the console. However, there are also non-working `@ts-expect-error` comments that should not allow for names to be added or changed:

```typescript
function printNames(names: string[]) {
  for (const name of names) {
    console.log(name);
  }

  // @ts-expect-error // red squiggly line
  names.push("John");

  // @ts-expect-error // red squiggly line
  names[0] = "Billy";
}
```

Your task is to update the type of the `names` parameter so that the array cannot be mutated. There are two ways to solve this problem.

### Exercise 3: An Unsafe Tuple

Here we have a `dangerousFunction` which accepts an array of numbers as an argument:

```tsx
const dangerousFunction = (arrayOfNumbers: number[]) => {
  arrayOfNumbers.pop();
  arrayOfNumbers.pop();
};
```

Additionally, we've defined a variable `myHouse` which is a tuple representing a `Coordinate`:

```tsx
type Coordinate = [number, number];
const myHouse: Coordinate = [0, 0];
```

Our tuple `myHouse` contains two elements, and the `dangerousFunction` is structured to pop two elements from the given array.

Given that `pop` removes the last element from an array, calling `dangerousFunction` with `myHouse` will remove its contents.

Currently, TypeScript does not alert us to this potential issue, as seen by the error line under `@ts-expect-error`:

```tsx
dangerousFunction(
  // @ts-expect-error // red squiggly line under @ts-expect-error
  myHouse,
);
```

Your task is to adjust the type of `Coordinate` such that TypeScript triggers an error when we attempt to pass `myHouse` into `dangerousFunction`.

Note that you should only change `Coordinate`, and leave the function untouched.

### Solution 1: Inference with an Array of Objects

Hovering over the `buttonsToChange` variable shows us that it is being inferred as an array of objects with a `type` property of type `string`:

```typescript
// hovering over buttonsToChange shows:
const buttonsToChange: {
  type: string;
}[];
```

This means that we could change the type of the first element in the array to something different:

```tsx
buttonsToChange[0].type = "something strange";
```

TypeScript doesn't like this, so it won't infer properly.

The fix here is to specify that `buttonsToChange` is an array of `ButtonAttributes`:

```tsx
type ButtonAttributes = {
  type: "button" | "submit" | "reset";
};

const modifyButton = (attributes: ButtonAttributes[]) => {};

const buttonsToChange: ButtonAttributes[] = [
  {
    type: "button",
  },
  {
    type: "submit",
  },
];

modifyButtons(buttonsToChange); // No error
```

### Solution 2: Avoiding Array Mutation

#### Option 1: Add the `readonly` Keyword

The first approach solution is to add the `readonly` keyword before the `string[]` array. It applies to the entire `string[]` array, converting it into a read-only array:

```typescript
function printNames(names: readonly string[]) {
  ...
}
```

With this setup, you can't call `.push()` or modify elements in the array. However, methods like `map()` and `reduce()` remain accessible since these create a copy of the array, and do not mutate the original.

#### Option 2: Use the `ReadonlyArray` Type Helper

Alternatively, you could use the `ReadonlyArray` type helper:

```typescript
function printNames(names: ReadonlyArray<string>) {
  ...
}
```

Regardless of which of these two methods you use, TypeScript will still display `readonly string[]` when hovering over the `names` parameter:

```typescript
// hovering over `names` shows:
(parameter) names: readonly string[]
```

### Solution 3: An Unsafe Tuple

The best way to prevent unwanted changes to the `Coordinate` tuple is to make it a `readonly` tuple:

```tsx
type Coordinate = readonly [number, number];
```

Now, `dangerousFunction` throws a TypeScript error when we try to pass `myHouse` to it:

```tsx
const dangerousFunction = (arrayOfNumbers: number[]) => {
  arrayOfNumbers.pop();
  arrayOfNumbers.pop();
};

dangerousFunction(
  // @ts-expect-error
  myHouse, // red squiggly line under myHouse
);

// hovering over myHouse shows:
Argument of type 'Coordinate' is not assignable to parameter of type 'number[]'.
  The type 'Coordinate' is 'readonly' and cannot be assigned to the mutable type 'number[]'.
```

We get an error because the function's signature expects a modifiable array of numbers, but `myHouse` is a read-only tuple. TypeScript is protecting us against unwanted changes.

It's a good practice to use `readonly` tuples as much as possible to avoid problems like the one in this exercise.

## Deep Immutability with `as const`

Earlier it was mentioned that the `Readonly` type helper only works on the first level of an object. However, TypeScript's `as const` assertion specifies that all of an object's properties should be treated as deeply read-only, no matter how deeply nested they are.

Let's revisit the example of the `AlbumAttributes` type that included a `status` property, along with a function to update it:

```typescript
type AlbumAttributes = {
  status: "new release" | "on sale" | "staff pick";
};

const updateStatus = (attributes: AlbumAttributes) => {};

const albumAttributes = {
  status: "on sale",
};

updateStatus(albumAttributes); // red squiggly line under albumAttributes
```

Recall that TypeScript presents an error when calling `updateStatus` because the `status` property was inferred as a `string` rather than the specific literal type `"on sale"`. We looked at two ways to solve the issue: using an inline object, or adding a type to the object.

The `as const` assertion gives us a third way. It ensures that an object and all of its properties are treated as constants, meaning that they cannot be changed once they are created.

The assertion gets added at the end of the object declaration:

```typescript
const albumAttributes = {
  status: "on sale",
} as const;
```

When using `as const`, TypeScript will add the `readonly` modifier to each of the object's properties. Hovering over the `albumAttributes` object, we can see that TypeScript has added the `readonly` modifier to the `status` property:

```tsx
// hovering over albumAttributes shows:
const albumAttributes: {
  readonly status: "on sale";
};
```

As before, TypeScript can see that the `status` property can't be modified, so the error goes away.

There's no cost to using `as const` since it disappears at runtime. This makes it a very useful tool for your TypeScript applications, especially when configuring objects.

### Comparing `as const` with `Object.freeze`

In JavaScript, the `Object.freeze` method is a common way to create immutable objects. While it is also possible to be used in TypeScript, there are some significant differences between `Object.freeze` and `as const`.

For this example, we'll rework the `AlbumAttributes` with nested `status` property to an `AlbumStatus` type that will be used inside of a `ShelfLocations` object:

```tsx
type AlbumStatus = "new release" | "on sale" | "staff pick";

type ShelfLocations = {
  entrance: {
    status: AlbumStatus;
  };
  frontCounter: {
    status: AlbumStatus;
  };
  endCap: {
    status: AlbumStatus;
  };
};
```

First, we'll create a `shelfLocations` object that uses `Object.freeze`:

```tsx
const shelfLocations = Object.freeze({
  entrance: {
    status: "on sale",
  },
  frontCounter: {
    status: "staff pick",
  },
  endCap: {
    status: "new release",
  },
});
```

Hovering over `shelfLocations` shows that the object has the `Readonly` modifier applied to it:

```tsx
// hovering over shelfLocations shows:
const shelfLocations: Readonly<{
  entrance: {
    status: string;
  };
  frontCounter: {
    status: string;
  };
  endCap: {
    status: string;
  };
}>;
```

Recall that the `Readonly` modifier only works on the first level of an object. If we try to add a new `backWall` property to the `shelfLocations` object, TypeScript will throw an error:

```tsx
shelfLocations.backWall = { status: "on sale" }; // red squiggly line under backWall

// hovering over backWall shows:
Property 'backWall' does not exist on type 'Readonly<{ entrance: { status: string; }; frontCounter: { status: string; }; endCap: { status: string; }; }>'
```

However, we are able to change the nested `status` property of a specific location:

```tsx
shelfLocations.entrance.status = "new release";
```

Again, using `as const` makes the entire object deeply read-only, including all nested properties:

```tsx
const shelfLocations = {
  entrance: {
    status: "on sale",
  },
  frontCounter: {
    status: "staff pick",
  },
  endCap: {
    status: "new release",
  },
} as const;

// hovering over shelfLocations shows:
const shelfLocations: {
  readonly entrance: {
    readonly status: "on sale";
  };
  readonly frontCounter: {
    readonly status: "staff pick";
  };
  readonly endCap: {
    readonly status: "new release";
  };
};
```

While both `as const` and `Object.freeze` will enforce immutability, `as const` is the more convenient and efficient choice. Unless you specifically need an object to be frozen at runtime with `Object.freeze`, you should stick with `as const`.

#### `as const` for Immutable Arrays

The `as const` assertion can also be used to create read-only arrays:

```tsx
const readOnlyGenres = ["rock", "pop", "unclassifiable"] as const;
```

For the most part, the rules of read-only arrays discussed earlier in the chapter still apply– mutations like `push` and `pop` won't work, but methods like `map` and `reduce` will.

However, there is a key difference when using `as const` with arrays. When you use `as const` with an array, TypeScript will infer the array's elements as literal types.

Let's compare the behavior:

```tsx
const readOnlyGenres: readonly string[] = ["rock", "pop", "unclassifiable"];

// hovering over readOnlyGenres shows:
const readOnlyGenres: readonly string[];

const readOnlyGenresAsConst = ["rock", "pop", "unclassifiable"] as const;

// hovering over readOnlyGenresAsConst shows:
const readOnlyGenresAsConst: readonly ["rock", "pop", "unclassifiable"];
```

Not only is `readOnlyGenresAsConst` an immutable array, but TypeScript has also inferred the array's elements as literal types. This means that the array can only contain the exact strings `"rock"`, `"pop"`, and `"unclassifiable"`.

This means that array methods like `includes` and `indexOf` won't behave as expected in all situations.

For example, when calling `indexOf` with a string that isn't in the array, the regular `readonly` array will return `-1`, but the `as const` array will return an error:

```tsx
readOnlyGenres.indexOf("jazz"); // -1

readOnlyGenresAsConst.indexOf("jazz"); // red squiggly line under "jazz"

// hovering over "jazz" shows:
Argument of type '"jazz"' is not assignable to parameter of type '"rock" | "pop" | "unclassifiable"'
```

While this specific typing adds predictability for TypeScript, it can be limiting and annoying when compared to behavior you're used to in JavaScript.

##### Improve Read-only Array Handling with `ts-reset`

Total TypeScript's `ts-reset` library can help with this. It globally adjusts some of TypeScript's types, including updating arrays to accept any string when using `includes` and `indexOf`:

```tsx
readOnlyGenresAsConst.indexOf("jazz"); // No error when `ts-reset` is imported
```

The `ts-reset` library offers a way of balancing between the strictness and flexibility that TypeScript provides. While some developers might prefer TypeScript's stricter approach, if you ever find read-only arrays troublesome, this library is a useful addition to your toolkit to make the TypeScript experience smoother. Find out [more about `ts-reset` on GitHub](https://github.com/total-typescript/ts-reset).

### Exercises

#### Exercise 1: Inferring a Tuple

In this exercise, we are dealing with an async function named `fetchData` that fetches data from a URL and returns a result.

If the fetch operation fails, this function returns a tuple. The first member of this tuple contains the error message and the second member is irrelevant in this case.

If the operation is successful, the function also returns a tuple. However, this time, the first member is `undefined` and the second member contains the fetched data.

Here's how the function is currently implemented:

```typescript
const fetchData = async () => {
  const result = await fetch("/");

  if (!result.ok) {
    return [new Error("Could not fetch data.")];
  }

  const data = await result.json();

  return [undefined, data];
};
```

Here's an async `example` function that uses `fetchData` and includes a couple of test cases:

```typescript
const example = async () => {
  const [error, data] = await fetchData();

  type Tests = [
    Expect<Equal<typeof error, Error | undefined>>, // red squiggly line under Equal<>
    Expect<Equal<typeof data, any>>,
  ];
};
```

Currently, both members of the tuple are inferred as `any`, which isn't ideal.

```typescript
const [error, data] = await fetchData();

// hovering over error and data shows:
const error: any;
const data: any;
```

Your challenge is to modify the `fetchData` function implementation so that TypeScript infers a Promise with a tuple for its return type.

Depending on whether or not the fetch operation is successful, the tuple should contain either an error message or a pair of `undefined` and the data fetched.

Hint: There are two possible approaches to solve this challenge. One way would be to define an explicit return type for the function. Alternatively, you could attempt to add or change type annotations for the `return` values within the function.

#### Exercise 2: Inferring Literal Values

#### Exercise 3: Ensuring Literal Type Inference

Let's revisit a previous exercise and evolve our solution.

The `modifyButtons` function accepts an array of objects with a `type` property:

```typescript
type ButtonAttributes = {
  type: "button" | "submit" | "reset";
};

const modifyButtons = (attributes: ButtonAttributes[]) => {};

const buttonsToChange = [
  {
    type: "button",
  },
  {
    type: "submit",
  },
];

modifyButtons(buttonsToChange); // red squiggly line under buttonsToChange
```

Previously, the error was solved by updating `buttonsToChange` to be specified as an array of `ButtonAttributes`:

```typescript
const buttonsToChange: ButtonAttributes[] = [
  {
    type: "button",
  },
  {
    type: "submit",
  },
];
```

This time, your challenge is to solve the error by making alternative updates to `buttonsToChange`.

Try to find two ways to make modifications: one that makes the `type` property immutable, and one that infers a literal value and allows for changing the `type` to any that has been specified in the `ButtonAttributes` type.

You should not alter the `ButtonAttributes` type definition or the `modifyButtons` function.

#### Solution 1: Inferring a Tuple

As mentioned, there are two different solutions to this challenge.

##### Option 1: Defining a Return Type

The first solution is to define a return type for the `fetchData` function.

Inside the `Promise` type, a tuple is defined with either `Error` or `undefined` as the first member, and an optional `any` as the second member:

```typescript
const fetchData = async (): Promise<[Error | undefined, any?]> => {
  ...
```

This technique works, but it's a little cumbersome.

##### Option 2: Using `as const`

Instead of specifying a return type, the second solution is to use `as const` on the return values:

```typescript
import { Equal, Expect } from "@total-typescript/helpers";

const fetchData = async () => {
  const result = await fetch("/");

  if (!result.ok) {
    return [new Error("Could not fetch data.")] as const; // added as const here
  }

  const data = await result.json();

  return [undefined, data] as const; // added as const here
};
```

With these changes in place, when we check the return type of `fetchData` in the `example` function, we can see that `error` is inferred as `Error | undefined`, and `data` is `any`:

```tsx
const example = async () => {
  const [error, data] = await fetchData();
  ...

// hovering over error shows:
const error: Error | undefined

// hovering over data shows:
const data: any
```

Using `as const` sets a variable is read-only, which assists TypeScript in accurately assigning the type of tuples.

In the case of this challenge, without `as const`, TypeScript could misinterpret the return value as `Promise<any[]>`. However, by using `as const`, TypeScript correctly observes the return value as a tuple (`Promise<[string | undefined, any]>`).

Overall, both solutions offer unique benefits. The first technique provides a straightforward approach to type definition, while the second leverages TypeScript's inference capabilities.

#### Solution 2: Ensuring Literal Type Inference

The `as const` assertion can be used to solve this challenge in a couple of ways– one with immutable `type` properties, and one that infers the literal type of the `type` property while allowing for changes.

#### Option 1: Making the `type` Property Immutable

Recall that adding `as const` to an object makes all of its properties read-only. This means that the `type` property of the objects inside of `buttonsToChange` can't be changed, so TypeScript will allow for the call to `modifyButtons`:

```typescript
const buttonsToChange = [
  {
    type: "button",
  } as const,
  {
    type: "submit",
  } as const,
];

// hovering over buttonsToChange shows:
const buttonsToChange: (
  | {
      readonly type: "button";
    }
  | {
      readonly type: "submit";
    }
)[];
```

#### Option 2: Infer the Literal Type

By adding `as const` directly to the `type` property of each of the objects, TypeScript will infer the literal type:

```typescript
const buttonsToChange = [
  {
    type: "button" as const,
  },
  {
    type: "submit" as const,
  },
];

// hovering over buttonsToChange shows:
const buttonsToChange: (
  | {
      type: "button";
    }
  | {
      type: "submit";
    }
)[];
```

Because the `type` properties in `buttonsToChange` are being inferred as literal types instead of strings, TypeScript no longer shows an error when calling `modifyButtons`.

Note that because the `type` properties inside of `buttonsToChange` are not marked as `readonly`, we are able to change them. However, assigning a value that isn't one of the specified literals in `ButtonAttributes` will result in an error when it is passed to `modifyButtons`:

```tsx
buttonsToChange[0].type = "reset"; // No error
buttonsToChange[1].type = "panic"; // No error, but now can't be passed to modifyButtons
```

Similarly, if we were to add an additional object with a `type` property to `buttonsToChange` that isn't one of the specified literals in `ButtonAttributes`, TypeScript would show an error:

```tsx
const buttonsToChange = [
  {
    type: "button" as const,
  },
  {
    type: "submit" as const,
  },
  {
    type: "panic" as const,
};

modifyButtons(buttonsToChange); // red squiggly line under buttonsToChange

// hovering over buttonsToChange shows:
Argument of type '({ type: "button"; } | { type: "submit"; } | { type: "panic"; })[]' is not assignable to parameter of type 'ButtonAttributes[]'.
```

Both of these solutions show how useful `as const` can be for helping TypeScript give us the best type inference possible.
