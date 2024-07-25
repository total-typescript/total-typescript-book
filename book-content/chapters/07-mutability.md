In our chapter on unions and narrowing, we explored how TypeScript can infer types from the logical flow of our code. In this chapter, we'll see how mutability - whether a value can be changed or not - can affect type inference.

## Mutability and Inference

### Variable Declaration and Type Inference

How you declare your variables in TypeScript affects whether or not they can be changed.

#### How TypeScript Infers `let`

When using the `let` keyword, the variable is _mutable_ and can be reassigned.

Consider this `AlbumGenre` type: a union of literal values representing possible genres for an album:

```ts twoslash
type AlbumGenre = "rock" | "country" | "electronic";
```

Using `let`, we can declare a variable `albumGenre` and assign it the value `"rock"`. Then we can attempt to pass `albumGenre` to a function that expects an `AlbumGenre`:

```ts twoslash
// @errors: 2345
type AlbumGenre = "rock" | "country" | "electronic";

// ---cut---
let albumGenre = "rock";

const handleGenre = (genre: AlbumGenre) => {
  // ...
};

handleGenre(albumGenre);
```

Because `let` was used when declaring the variable, TypeScript understands that the value can later be changed. In this case, it infers `albumGenre` as a `string` rather than the specific literal type `"rock"`. In our code, we could do this:

```ts twoslash
let albumGenre = "rock";

// ---cut---
albumGenre = "country";
```

Therefore, it will infer a wider type in order to accommodate the variable being reassigned.

We can fix the error above by assigning a specific type to the `let`:

```ts twoslash
// @errors: 2345
type AlbumGenre = "rock" | "country" | "electronic";

// ---cut---
let albumGenre: AlbumGenre = "rock";

const handleGenre = (genre: AlbumGenre) => {
  // ...
};

handleGenre(albumGenre); // no more error
```

Now, `albumGenre` _can_ be reassigned, but only to a value that is a member of the `AlbumGenre` union. So, it will no longer show an error when passed to `handleGenre`.

But there's another interesting solution.

#### How TypeScript Infers `const`

When using `const`, the variable is _immutable_ and cannot be reassigned. When we change the variable declaration to use `const`, TypeScript will infer the type more narrowly:

```ts twoslash
// @errors: 2345
type AlbumGenre = "rock" | "country" | "electronic";

// ---cut---
const albumGenre = "rock";

const handleGenre = (genre: AlbumGenre) => {
  // ...
};

handleGenre(albumGenre); // No error
```

There is no longer an error in the assignment, and hovering over `albumGenre` inside of the `albumDetails` object shows that TypeScript has inferred it as the literal type `"rock"`.

If we try to change the value of `albumGenre` after declaring it as `const`, TypeScript will show an error:

```ts twoslash
// @errors: 2588
type AlbumGenre = "rock" | "country" | "electronic";

const albumGenre = "rock";

// ---cut---
albumGenre = "country";
```

TypeScript is mirroring JavaScript's treatment of const in order to prevent possible runtime errors. When you declare a variable with `const`, TypeScript infers it as the literal type you specified.

So, TypeScript uses how JavaScript works to its advantage. This will often encourage you to use `const` over `let` when declaring variables, as it's a little stricter.

### Object Property Inference

The picture with `const` and `let` becomes a bit more complicated when it comes to object properties.

Objects are mutable in JavaScript, meaning their properties can be changed after they are created.

For this example, we have an `AlbumAttributes` type that includes a `status` property with a union of literal values representing possible album statuses:

```typescript
type AlbumAttributes = {
  status: "new-release" | "on-sale" | "staff-pick";
};
```

Say we had an `updateStatus` function that takes an `AlbumAttributes` object:

```ts twoslash
// @errors: 2345
type AlbumAttributes = {
  status: "new-release" | "on-sale" | "staff-pick";
};
// ---cut---
const updateStatus = (attributes: AlbumAttributes) => {
  // ...
};

const albumAttributes = {
  status: "on-sale",
};

updateStatus(albumAttributes);
```

TypeScript gives us an error below `albumAttributes` inside of the `updateStatus` function call, with messages similar to what we saw before.

This is happening because TypeScript has inferred the `status` property as a `string` rather than the specific literal type `"on-sale"`. Similar to with `let`, TypeScript understands that the property could later be reassigned:

```typescript
albumAttributes.status = "new-release";
```

This is true even though the `albumAttributes` object was declared with `const`. We get the error when calling `updateStatus` because `status: string` can't be passed to a function that expects `status: "new-release" | "on-sale" | "staff-pick"`. TypeScript is trying to protect us from potential runtime errors.

Let's look at a couple of ways to fix this issue.

#### Using an Inline Object

One approach is to inline the object when calling the `updateStatus` function instead of declaring it separately:

```typescript
updateStatus({
  status: "on-sale",
}); // No error
```

When inlining the object, TypeScript knows that there is no way that `status` could be changed before it is passed into the function, so it infers it more narrowly.

#### Adding a Type to the Object

Another option is to explicitly declare the type of the `albumAttributes` object to be `AlbumAttributes`:

```typescript
const albumAttributes: AlbumAttributes = {
  status: "on-sale",
};

updateStatus(albumAttributes); // No error
```

This works similarly to how it did with the `let`. While `albumAttributes.status` can still be reassigned, it can only be reassigned to a valid value:

```typescript
albumAttributes.status = "new-release"; // No error
```

This behaviour works the same for all object-like structures, including arrays and tuples. We'll examine those later in the exercises.

### Readonly Object Properties

In JavaScript, as we've seen, object properties are mutable by default. But TypeScript lets us be more specific about whether or not a property of an object can be mutated.

To make a property read-only (not writable), you can use the `readonly` modifier:

Consider this `Album` interface, where the `title` and `artist` are marked as `readonly`:

```typescript
interface Album {
  readonly title: string;
  readonly artist: string;
  status?: "new-release" | "on-sale" | "staff-pick";
  genre?: string[];
}
```

Once an `Album` object is created, its `title` and `artist` properties are locked in and cannot be changed. However, the optional `status` and `genre` properties can still be modified.

Note that this only occurs on the _type_ level. At runtime, the properties are still mutable. TypeScript is just helping us catch potential errors.

#### The `Readonly` Type Helper

If you want to specify that _all_ properties of an object should be read-only, TypeScript provides a type helper called `Readonly`.

To use it, you simply wrap the object type with `Readonly`.

Here's an example of using `Readonly` to create an `Album` object:

```typescript
const readOnlyWhiteAlbum: Readonly<Album> = {
  title: "The Beatles (White Album)",
  artist: "The Beatles",
  status: "staff-pick",
};
```

Because the `readOnlyWhiteAlbum` object was created using the `Readonly` type helper, none of the properties can be modified:

```ts twoslash
// @errors: 2540
type Album = {
  title: string;
  artist: string;
  status?: "new-release" | "on-sale" | "staff-pick";
  genre?: string[];
};

const readOnlyWhiteAlbum: Readonly<Album> = {
  title: "The Beatles (White Album)",
  artist: "The Beatles",
  status: "staff-pick",
};
// ---cut---
readOnlyWhiteAlbum.genre = ["rock", "pop", "unclassifiable"];
```

Note that like many of TypeScript's type helpers, the immutability enforced by `Readonly` only operates on the first level. It won't make properties read-only recursively.

### Readonly Arrays

As with object properties, arrays and tuples can also be made immutable by using the `readonly` modifier.

Here's how the `readonly` modifier can be used to create a read-only array of genres. Once the array is created, its contents cannot be modified:

```typescript
const readOnlyGenres: readonly string[] = ["rock", "pop", "unclassifiable"];
```

Similar to the `Array` syntax, TypeScript also offers a `ReadonlyArray` type helper that functions in the same way to using the above syntax:

```typescript
const readOnlyGenres: ReadonlyArray<string> = ["rock", "pop", "unclassifiable"];
```

Both of these approaches are functionally the same. Hovering over the `readOnlyGenres` variable shows that TypeScript has inferred it as a read-only array:

```typescript
// hovering over `readOnlyGenres` shows:
const readOnlyGenres: readonly string[];
```

Readonly arrays disallow the use of array methods that cause mutations, such as `push` and `pop`:

```ts twoslash
// @errors: 2339
const readOnlyGenres: readonly string[] = ["rock", "pop", "unclassifiable"];

// ---cut---
readOnlyGenres.push("experimental");
```

However, methods like `map` and `reduce` will still work, as they create a copy of the array and do not mutate the original.

```ts twoslash
// @errors: 2339
const readOnlyGenres: readonly string[] = ["rock", "pop", "unclassifiable"];

// ---cut---
const uppercaseGenres = readOnlyGenres.map((genre) => genre.toUpperCase()); // No error

readOnlyGenres.push("experimental");
```

Note that, just like the `readonly` for object properties, this doesn't affect the runtime behavior of the array. It's just a way to help catch potential errors.

#### How Read-Only and Mutable Arrays Work Together

To help drive the concept home, let's see how read-only and mutable arrays work together.

Here are two `printGenre` functions that are functionally identical, except `printGenresReadOnly` takes a read-only array of genres as a parameter whereas `printGenresMutable` takes a mutable array:

```typescript
function printGenresReadOnly(genres: readonly string[]) {
  // ...
}

function printGenresMutable(genres: string[]) {
  // ...
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

```ts twoslash
// @errors: 2345
function printGenresReadOnly(genres: readonly string[]) {
  // ...
}

function printGenresMutable(genres: string[]) {
  // ...
}

// ---cut---
const readOnlyGenres: readonly string[] = ["rock", "pop", "unclassifiable"];

printGenresReadOnly(readOnlyGenres);
printGenresMutable(readOnlyGenres);
```

This is because we might be mutating the array inside of `printGenresMutable`. If we passed a read-only array.

Essentially, read-only arrays can only be assigned to other read-only types. This can spread virally throughout your application: if a function deep down the call stack expects a `readonly` array, then that array must remain `readonly` throughout. But doing so brings benefits. It ensures that the array won't be mutated in any manner as it moves down the stack. Very useful.

The takeaway here is that even though you can assign mutable arrays to read-only arrays, you cannot assign read-only arrays to mutable arrays.

### Exercises

#### Exercise 1: Inference with an Array of Objects

Here we have a `modifyButtons` function that takes in an array of objects with `type` properties that are either `"button"`, `"submit"`, or `"reset"`.

When attempting to call `modifyButtons` with an array of objects that seem to meet the contract, TypeScript gives us an error:

```ts twoslash
// @errors: 2345
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

modifyButtons(buttonsToChange);
```

Your task is to determine why this error shows up, then resolve it.

<Exercise title="Exercise 1: Inference with an Array of Objects" filePath="/src/028-mutability/098-object-property-inference.problem.ts"></Exercise>

#### Exercise 2: Avoiding Array Mutation

This `printNames` function accepts an array of `name` strings and logs them to the console. However, there are also non-working `@ts-expect-error` comments that should not allow for names to be added or changed:

```ts twoslash
// @errors: 2578
function printNames(names: string[]) {
  for (const name of names) {
    console.log(name);
  }

  // @ts-expect-error
  names.push("John");

  // @ts-expect-error
  names[0] = "Billy";
}
```

Your task is to update the type of the `names` parameter so that the array cannot be mutated. There are two ways to solve this problem.

<Exercise title="Exercise 2: Avoiding Array Mutation" filePath="/src/028-mutability/103-readonly-arrays.problem.ts"></Exercise>

#### Exercise 3: An Unsafe Tuple

Here we have a `dangerousFunction` which accepts an array of numbers as an argument:

```typescript
const dangerousFunction = (arrayOfNumbers: number[]) => {
  arrayOfNumbers.pop();
  arrayOfNumbers.pop();
};
```

Additionally, we've defined a variable `myHouse` which is a tuple representing a `Coordinate`:

```typescript
type Coordinate = [number, number];
const myHouse: Coordinate = [0, 0];
```

Our tuple `myHouse` contains two elements, and the `dangerousFunction` is structured to pop two elements from the given array.

Given that `pop` removes the last element from an array, calling `dangerousFunction` with `myHouse` will remove its contents.

Currently, TypeScript does not alert us to this potential issue, as seen by the error line under `@ts-expect-error`:

```ts twoslash
// @errors: 2578
type Coordinate = [number, number];
const myHouse: Coordinate = [0, 0];

const dangerousFunction = (arrayOfNumbers: number[]) => {
  arrayOfNumbers.pop();
  arrayOfNumbers.pop();
};

// ---cut---
dangerousFunction(
  // @ts-expect-error
  myHouse,
);
```

Your task is to adjust the type of `Coordinate` such that TypeScript triggers an error when we attempt to pass `myHouse` into `dangerousFunction`.

Note that you should only change `Coordinate`, and leave the function untouched.

<Exercise title="Exercise 3: An Unsafe Tuple" filePath="/src/028-mutability/104.5-fixing-unsafe-tuples.problem.ts"></Exercise>

#### Solution 1: Inference with an Array of Objects

Hovering over the `buttonsToChange` variable shows us that it is being inferred as an array of objects with a `type` property of type `string`:

```typescript
// hovering over buttonsToChange shows:
const buttonsToChange: {
  type: string;
}[];
```

This inference is happening because our array is mutable. We could change the type of the first element in the array to something different:

```typescript
buttonsToChange[0].type = "something strange";
```

This wider type is incompatible with the `ButtonAttributes` type, which expects the `type` property to be one of `"button"`, `"submit"`, or `"reset"`.

The fix here is to specify that `buttonsToChange` is an array of `ButtonAttributes`:

```typescript
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

Or, we could pass the array directly to the `modifyButtons` function:

```typescript
modifyButtons([
  {
    type: "button",
  },
  {
    type: "submit",
  },
]); // No error
```

By doing this, TypeScript will infer the `type` property more narrowly, and the error will go away.

#### Solution 2: Avoiding Array Mutation

Here are a couple ways to solve this problem.

##### Option 1: Add the `readonly` Keyword

The first approach solution is to add the `readonly` keyword before the `string[]` array. It applies to the entire `string[]` array, converting it into a read-only array:

```typescript
function printNames(names: readonly string[]) {
  ...
}
```

With this setup, TypeScript won't allow you to add items with `.push()` or perform any other modifications on the array.

##### Option 2: Use the `ReadonlyArray` Type Helper

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

Both work equally well at preventing the array from being modified.

#### Solution 3: An Unsafe Tuple

The best way to prevent unwanted changes to the `Coordinate` tuple is to make it a `readonly` tuple:

```typescript
type Coordinate = readonly [number, number];
```

Now, `dangerousFunction` throws a TypeScript error when we try to pass `myHouse` to it:

```ts twoslash
// @errors: 2345
type Coordinate = readonly [number, number];
const myHouse: Coordinate = [0, 0];

// ---cut---
const dangerousFunction = (arrayOfNumbers: number[]) => {
  arrayOfNumbers.pop();
  arrayOfNumbers.pop();
};

dangerousFunction(myHouse);
```

We get an error because the function's signature expects a modifiable array of numbers, but `myHouse` is a read-only tuple. TypeScript is protecting us against unwanted changes.

It's a good practice to use `readonly` tuples as much as possible to avoid problems like the one in this exercise.

## Deep Immutability with `as const`

We've seen so far that objects and arrays are mutable in JavaScript. This leads to their properties being inferred _widely_ by TypeScript.

We can get around this by giving the property a type annotation. But it still doesn't infer the literal type of the property.

```typescript
const albumAttributes: AlbumAttributes = {
  status: "on-sale",
};

// hovering over albumAttributes shows:
const albumAttributes: {
  status: "new-release" | "on-sale" | "staff-pick";
};
```

Instead of `albumAttributes.status` being inferred as `"on-sale"`, it's inferred as `"new-release" | "on-sale" | "staff-pick"`.

One way we could get TypeScript to infer it properly would be to somehow mark the entire object, and all its properties, as immutable. This would tell TypeScript that the object and its properties can't be changed, so it would be free to infer the literal types of the properties.

This is where the `as const` assertion comes in. We can use it to mark an object and all of its properties as constants, meaning that they can't be changed once they are created.

```typescript
const albumAttributes = {
  status: "on-sale",
} as const;

// hovering over albumAttributes shows:
const albumAttributes: {
  readonly status: "on-sale";
};
```

The `as const` assertion has made the entire object deeply read-only, including all of its properties. This means that `albumAttributes.status` is now inferred as the literal type `"on-sale"`.

Attempting to change the `status` property will result in an error:

```ts twoslash
// @errors: 2540
const albumAttributes = {
  status: "on-sale",
} as const;

// ---cut---
albumAttributes.status = "new-release";
```

This makes `as const` ideal for large config objects that you don't expect to change.

Just like the `readonly` modifier, `as const` only affects the type level. At runtime, the object and its properties are still mutable.

### `as const` vs Variable Annotation

You might be wondering what would happen if we combined `as const` with a variable annotation. How would it be inferred?

```typescript
const albumAttributes: AlbumAttributes = {
  status: "on-sale",
} as const;
```

You can think of this code as a competition between two forces: the `as const` assertion operating on the value, and the annotation operating on the variable.

When you have a competition like this, the variable annotation wins. The variable _owns_ the value, and forgets whatever the explicit value was before.

This means, curiously, that the `status` property is inferred as being mutable:

```typescript
albumAttributes.status = "new-release"; // No error
```

The `as const` assertion is being overridden by the variable annotation. Not fun.

We'll explore this interaction between variables and values further in our chapter on annotations and assertions.

### Comparing `as const` with `Object.freeze`

In JavaScript, the `Object.freeze` method is a way to create immutable objects at runtime. There are some significant differences between `Object.freeze` and `as const`.

For this example, we'll create a `shelfLocations` object that uses `Object.freeze`:

```typescript
const shelfLocations = Object.freeze({
  entrance: {
    status: "on-sale",
  },
  frontCounter: {
    status: "staff-pick",
  },
  endCap: {
    status: "new-release",
  },
});
```

Hovering over `shelfLocations` shows that the object has the `Readonly` modifier applied to it:

```typescript
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

Recall that the `Readonly` modifier only works on the _first level_ of an object. If we try to modify the `frontCounter` property, TypeScript will throw an error:

```ts twoslash
// @errors: 2540
const shelfLocations = Object.freeze({
  entrance: {
    status: "on-sale",
  },
  frontCounter: {
    status: "staff-pick",
  },
  endCap: {
    status: "new-release",
  },
});

// ---cut---
shelfLocations.frontCounter = {
  status: "new-release",
};
```

However, we are able to change the nested `status` property of a specific location:

```typescript
shelfLocations.entrance.status = "new-release";
```

This is in line with how `Object.freeze` works in JavaScript. It only makes the object and its properties read-only at the first level. It doesn't make the entire object deeply read-only.

Using `as const` makes the entire object deeply read-only, including all nested properties:

```ts twoslash
const shelfLocations = {
  entrance: {
    status: "on-sale",
  },
  frontCounter: {
    status: "staff-pick",
  },
  endCap: {
    status: "new-release",
  },
} as const;

console.log(shelfLocations);
//          ^?
```

Of course, this is just a type-level annotation. `Object.freeze` gives you runtime immutability, while `as const` gives you type-level immutability. I actually prefer the latter - doing less work at runtime is always a good thing.

So while both `as const` and `Object.freeze` will enforce immutability, `as const` is the more convenient and efficient choice. Unless you specifically need the top level of an object to be frozen at runtime, you should stick with `as const`.

### Exercises

#### Exercise 1: Returning A Tuple From A Function

In this exercise, we are dealing with an async function named `fetchData` that fetches data from a URL and returns a result.

Whether the function succeeds or fails, it returns a tuple. The first member of the tuple contains an error message if the fetch operation fails, and the second member contains the fetched data if the operation is successful.

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

```ts twoslash
// @errors: 2344
import { Equal, Expect } from "@total-typescript/helpers";

const fetchData = async () => {
  const result = await fetch("/");

  if (!result.ok) {
    return [new Error("Could not fetch data.")];
  }

  const data = await result.json();

  return [undefined, data];
};
// ---cut---
const example = async () => {
  const [error, data] = await fetchData();

  type Tests = [
    Expect<Equal<typeof error, Error | undefined>>,
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

<Exercise title="Exercise 1: Returning A Tuple From A Function" filePath="/src/028-mutability/106-as-const-to-make-functions-infer-a-tuple.problem.ts"></Exercise>

#### Exercise 2: Inferring Literal Values In Arrays

Let's revisit a previous exercise and evolve our solution.

The `modifyButtons` function accepts an array of objects with a `type` property:

```ts twoslash
// @errors: 2345
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

modifyButtons(buttonsToChange);
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

This time, your challenge is to solve the error by finding a different solution. Specifically, you should modify the `buttonsToChange` array so that TypeScript infers the literal type of the `type` property.

You should not alter the `ButtonAttributes` type definition or the `modifyButtons` function.

<Exercise title="Exercise 2: Inferring Literal Values In Arrays" filePath="/src/028-mutability/107-as-const-can-make-strings-infer-as-their-literals-in-objects.explainer.ts"></Exercise>

#### Solution 1: Returning A Tuple From A Function

As mentioned, there are two different solutions to this challenge.

##### Option 1: Defining a Return Type

The first solution is to define a return type for the `fetchData` function.

Inside the `Promise` type, a tuple is defined with either `Error` or `undefined` as the first member, and an optional `any` as the second member:

```typescript
const fetchData = async (): Promise<[Error | undefined, any?]> => {
  ...
```

This technique works perfectly well.

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

```typescript
const example = async () => {
  const [error, data] = await fetchData();

  // ...
};

// hovering over error shows:
const error: Error | undefined;

// hovering over data shows:
const data: any;
```

In the case of this challenge, without `as const`, TypeScript is making two mistakes. Firstly, it's inferring each of the returned arrays as _arrays_, not tuples. This is TypeScript's default behaviour:

```typescript
const data = await result.json();

const result = [undefined, data];

// hovering over result shows:
const result: any[];
```

We can also see that when `undefined` is placed into an array with `any`, TypeScript infers the array as `any[]`. This is TypeScript's second mistake - collapsing our `undefined` value so it all but disappears.

However, by using `as const`, TypeScript correctly infers the return value as a tuple (`Promise<[string | undefined, any]>`). This is a great example of how `as const` can help TypeScript give us the best type inference possible.

#### Solution 2: Inferring Literal Values In Arrays

Let's look at some different options for solving this challenge.

##### Option 1: Annotate the Entire Array

The `as const` assertion can be used to solve this problem. By annotating the entire array with `as const`, TypeScript will infer the literal type of the `type` property:

```typescript
const buttonsToChange = [
  {
    type: "button",
  },
  {
    type: "submit",
  },
] as const;
```

Hovering over `buttonsToChange` shows that TypeScript has inferred the `type` property as a literal type, and `modifyButtons` will no longer show an error when `buttonsToChange` is passed to it:

```typescript
// hovering over buttonsToChange shows:
const buttonsToChange: readonly [
  {
    readonly type: "button";
  },
  {
    readonly type: "submit";
  },
];
```

##### Option 2: Annotate the members of the array

Another way to solve this problem is to annotate each member of the array with `as const`:

```typescript
const buttonsToChange = [
  {
    type: "button",
  } as const,
  {
    type: "submit",
  } as const,
];
```

Hovering over `buttonsToChange` shows something interesting. Each object is now inferred as `readonly`, but the array itself is not:

```typescript
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

The `buttonsToChange` array is also no longer being inferred as a tuple with a fixed length, so we can modify it by pushing new objects to it:

```typescript
buttonsToChange.push({
  type: "button",
});
```

This behavior stems from tagging the individual members of the array with `as const`, instead of the entire array.

However, this inference is good enough to satisfy `modifyButtons`, because it matches the `ButtonAttributes` type.

##### Option 3: `as const` on strings

The last solution we'll look at is using `as const` on the string literals to infer the literal type:

```typescript
const buttonsToChange = [
  {
    type: "button" as const,
  },
  {
    type: "submit" as const,
  },
];
```

Now when we hover over `buttonsToChange` we've lost the `readonly` modifier, because `as const` is only being targeted at the string inside of the object, not the object itself:

```typescript
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

But again, this is still typed strongly enough to satisfy `modifyButtons`.

When using `as const` like this acts like a hint to TypeScript that it should infer a literal type where it wouldn't otherwise. This can be occasionally useful for when you want to allow mutation, but still want to infer a literal type.
