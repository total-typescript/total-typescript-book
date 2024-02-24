# 07. Mutability

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

```typescript
const updateStatus = (attributes: AlbumAttributes) => {
  // ...
};

const albumAttributes = {
  status: "on-sale",
};

updateStatus(albumAttributes); // red squiggly line under albumAttributes
```

TypeScript gives us an error below `albumAttributes` inside of the `updateStatus` function call, with messages similar to what we saw before:

```
Argument of type '{ status: string; }' is not assignable to parameter of type 'AlbumAttributes'.
Types of property 'status' are incompatible.
Type 'string' is not assignable to type '"new-release" | "on-sale" | "staff-pick"'.
```

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

```typescript
readOnlyWhiteAlbum.genre = ["rock", "pop", "unclassifiable"]; // red squiggly line under genre
// Cannot assign to 'genre' because it is a read-only property
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

```typescript
readOnlyGenres.push("experimental"); // red squiggly line under push
// Property 'push' does not exist on type 'readonly string[]'
```

However, methods like `map` and `reduce` will still work, as they create a copy of the array and do not mutate the original.

```typescript
const uppercaseGenres = readOnlyGenres.map((genre) => genre.toUpperCase()); // No error

readOnlyGenres.push("experimental"); // red squiggly line under push

// hovering over push shows:
Property 'push' does not exist on type 'readonly string[]'
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

```typescript
const readOnlyGenres: readonly string[] = ["rock", "pop", "unclassifiable"];

printGenresReadOnly(readOnlyGenres);
printGenresMutable(readOnlyGenres); // red squiggly line under readOnlyGenres

// hovering over readOnlyGenres shows:
// Error: Argument of type 'readonly ["rock", "pop", "unclassifiable"]' is not assignable to parameter of type 'string[]'
```

This is because we might be mutating the array inside of `printGenresMutable`. If we passed a read-only array.

Essentially, read-only arrays can only be assigned to other read-only types. This can spread virally throughout your application: if a function deep down the call stack expects a `readonly` array, then that array must remain `readonly` throughout. But doing so brings benefits. It ensures that the array won't be mutated in any manner as it moves down the stack. Very useful.

The takeaway here is that even though you can assign mutable arrays to read-only arrays, you cannot assign read-only arrays to mutable arrays.

### Exercises

#### Exercise 1: Inference with an Array of Objects

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

#### Exercise 2: Avoiding Array Mutation

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

```typescript
dangerousFunction(
  // @ts-expect-error // red squiggly line under @ts-expect-error
  myHouse,
);
```

Your task is to adjust the type of `Coordinate` such that TypeScript triggers an error when we attempt to pass `myHouse` into `dangerousFunction`.

Note that you should only change `Coordinate`, and leave the function untouched.

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

##### Option 1: Add the `readonly` Keyword

The first approach solution is to add the `readonly` keyword before the `string[]` array. It applies to the entire `string[]` array, converting it into a read-only array:

```typescript
function printNames(names: readonly string[]) {
  ...
}
```

With this setup, you can't call `.push()` or modify elements in the array.

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

```typescript
const dangerousFunction = (arrayOfNumbers: number[]) => {
  arrayOfNumbers.pop();
  arrayOfNumbers.pop();
};

dangerousFunction(
  // @ts-expect-error
  myHouse, // red squiggly line under myHouse
);

// hovering over myHouse shows:
// Argument of type 'Coordinate' is not assignable to parameter of type 'number[]'.
//   The type 'Coordinate' is 'readonly' and cannot be assigned to the mutable type 'number[]'.
```

We get an error because the function's signature expects a modifiable array of numbers, but `myHouse` is a read-only tuple. TypeScript is protecting us against unwanted changes.

It's a good practice to use `readonly` tuples as much as possible to avoid problems like the one in this exercise.

<!-- CONTINUE -->

## Deep Immutability with `as const`

Earlier it was mentioned that the `Readonly` type helper only works on the first level of an object. However, TypeScript's `as const` assertion specifies that all of an object's properties should be treated as deeply read-only, no matter how deeply nested they are.

Let's revisit the example of the `AlbumAttributes` type that included a `status` property, along with a function to update it:

```typescript
type AlbumAttributes = {
  status: "new-release" | "on-sale" | "staff-pick";
};

const updateStatus = (attributes: AlbumAttributes) => {};

const albumAttributes = {
  status: "on-sale",
};

updateStatus(albumAttributes); // red squiggly line under albumAttributes
```

Recall that TypeScript presents an error when calling `updateStatus` because the `status` property was inferred as a `string` rather than the specific literal type `"on-sale"`. We looked at two ways to solve the issue: using an inline object, or adding a type to the object.

The `as const` assertion gives us a third way. It ensures that an object and all of its properties are treated as constants, meaning that they cannot be changed once they are created.

The assertion gets added at the end of the object declaration:

```typescript
const albumAttributes = {
  status: "on-sale",
} as const;
```

When using `as const`, TypeScript will add the `readonly` modifier to each of the object's properties. Hovering over the `albumAttributes` object, we can see that TypeScript has added the `readonly` modifier to the `status` property:

```typescript
// hovering over albumAttributes shows:
const albumAttributes: {
  readonly status: "on-sale";
};
```

As before, TypeScript can see that the `status` property can't be modified, so the error goes away.

There's no cost to using `as const` since it disappears at runtime. This makes it a very useful tool for your TypeScript applications, especially when configuring objects.

### Comparing `as const` with `Object.freeze`

In JavaScript, the `Object.freeze` method is a common way to create immutable objects. While it is also possible to be used in TypeScript, there are some significant differences between `Object.freeze` and `as const`.

For this example, we'll rework the `AlbumAttributes` with nested `status` property to an `AlbumStatus` type that will be used inside of a `ShelfLocations` object:

```typescript
type AlbumStatus = "new-release" | "on-sale" | "staff-pick";

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

Recall that the `Readonly` modifier only works on the first level of an object. If we try to add a new `backWall` property to the `shelfLocations` object, TypeScript will throw an error:

```typescript
shelfLocations.backWall = { status: "on-sale" }; // red squiggly line under backWall

// hovering over backWall shows:
Property 'backWall' does not exist on type 'Readonly<{ entrance: { status: string; }; frontCounter: { status: string; }; endCap: { status: string; }; }>'
```

However, we are able to change the nested `status` property of a specific location:

```typescript
shelfLocations.entrance.status = "new-release";
```

Again, using `as const` makes the entire object deeply read-only, including all nested properties:

```typescript
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

// hovering over shelfLocations shows:
const shelfLocations: {
  readonly entrance: {
    readonly status: "on-sale";
  };
  readonly frontCounter: {
    readonly status: "staff-pick";
  };
  readonly endCap: {
    readonly status: "new-release";
  };
};
```

While both `as const` and `Object.freeze` will enforce immutability, `as const` is the more convenient and efficient choice. Unless you specifically need an object to be frozen at runtime with `Object.freeze`, you should stick with `as const`.

#### `as const` for Immutable Arrays

The `as const` assertion can also be used to create read-only arrays:

```typescript
const readOnlyGenres = ["rock", "pop", "unclassifiable"] as const;
```

For the most part, the rules of read-only arrays discussed earlier in the chapter still apply– mutations like `push` and `pop` won't work, but methods like `map` and `reduce` will.

However, there is a key difference when using `as const` with arrays. When you use `as const` with an array, TypeScript will infer the array's elements as literal types.

Let's compare the behavior:

```typescript
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

```typescript
readOnlyGenres.indexOf("jazz"); // -1

readOnlyGenresAsConst.indexOf("jazz"); // red squiggly line under "jazz"

// hovering over "jazz" shows:
Argument of type '"jazz"' is not assignable to parameter of type '"rock" | "pop" | "unclassifiable"'
```

While this specific typing adds predictability for TypeScript, it can be limiting and annoying when compared to behavior you're used to in JavaScript.

##### Improve Read-only Array Handling with `ts-reset`

Total TypeScript's `ts-reset` library can help with this. It globally adjusts some of TypeScript's types, including updating arrays to accept any string when using `includes` and `indexOf`:

```typescript
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

```typescript
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

```typescript
buttonsToChange[0].type = "reset"; // No error
buttonsToChange[1].type = "panic"; // No error, but now can't be passed to modifyButtons
```

Similarly, if we were to add an additional object with a `type` property to `buttonsToChange` that isn't one of the specified literals in `ButtonAttributes`, TypeScript would show an error:

```typescript
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
