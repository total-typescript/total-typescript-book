<!-- Fragments of text taken from the book that I may add into future sections -->

#### The Assignability of Union Types

Now that we have a basic understanding of union types, let's think about how they work in our apps.

Consider this chart:

![](images/image3.png)

At the top, we have `string | number`. Below are two boxes `string` and `number`, each with their own connecting arrow pointing to `string | number`. This diagram shows that both `string` and `number` are assignable to `string | number`.

However, this doesn't work in reverse. We can't pass `string | number` to a function that only accepts `string`.

For example, if we changed this `logId` function to only accept a `number`, TypeScript would throw an error when we try to pass `string | number` to it:

```tsx
function logId(id: number) {
  console.log(`The id is ${id}`);
}

type User = {
  id: string | number;
};

const user: User = {
  id: 123,
};

logId(user.id); // red squiggly line under user.id
```

Hovering over `user.id` shows:

```
Argument of type 'string | number' is not assignable to parameter of type 'number'.
  Type 'string' is not assignable to type 'number'.
```

This is because `user.id` _could_ be a `string`, and TypeScript is trying to protect us from accidentally passing a `string` to a function that only accepts a `number`.

#### Narrow Objects Can Be Passed to Wider Object Types

You might have a type called `User`:

```typescript
type User = {
  id: string;
  name: string;
  email: string;
};
```

Then, you could have another type called `UserWithoutId`:

```typescript
type UserWithoutId = {
  name: string;
  email: string;
};
```

Which is narrower? `User` or `UserWithoutId`?

The answer is that `User` is the narrower version of `UserWithoutId`. It's more specific. It has more properties than `UserWithoutId`, so it's a narrower type.

This means that anywhere we expect a `UserWithoutId`, we can also pass a `User`:

```typescript
const logUser = (user: UserWithoutId) => {
  console.log(user.name);
};

const user: User = {
  id: "123",
  name: "Waqas",
  email: "waqas@example.com",
};

logUser(user);
```

This is a bit counterintuitive, but it's a fundamental part of TypeScript's type system. We'll examine the implications of this in more detail in a later chapter.

#### Narrow Types Collapsing into Wider Types

<!-- MAYBE MOVE THIS TO THE WEIRD PARTS? -->

Let's look at how narrow types combine with their wider types inside unions.

Imagine we create an `IconSize` type:

```typescript
type IconSize = "small" | "medium" | "large" | string;
```

If we hover over `IconSize`, what will we see?

```ts
type IconSize = string;
```

It seems that our `IconSize` type has been reduced to just `string`. `"small"`, `"medium"`, and `"large"` are nowhere to be seen.

Let's revisit the assignability chart to see what's going on here.

Following the pattern we've seen in previous examples, we might draw the assignability chart like this:

![](images/image1.png)

However, this chart isn't quite accurate.

TypeScript see that `"small"` has all the properties of `string`. In other words, it's a 'subset' of string. So it collapses the union into the wider type, `string`. It does the same with `"medium"` and `"large"`. So, it means that the `IconSize` type is actually just `string`.

Here's what a more accurate assignability chart would look like:

![](images/image6.png)

We can see this behavior happening when trying to pass in a size into an imaginary function, `getResolvedIconSize`. There will not be autocompletion for the individual sizes as we're typing:

```typescript
const getResolvedIconSize = (
  iconSize: "small" | "medium" | "large" | string,
) => {
  // function body
};

getResolvedIconSize("small"); // no autocompletion for "small"
```

This is because TypeScript sees `iconSize` as just `string`, and not as a union of literal types.

This also happens when

#### Autocompletion Trick for Literal Types with Wider Types

There is a workaround that can be added to the function signature that will work when literal types are in a union with a wider type.

By wrapping the wider type in parentheses and including an ampersand with an empty object, we will get the desired behavior:

```typescript
const getResolvedIconSize = (
  iconSize: "small" | "medium" | "large" | (string & {}),
) => {
  // function body
};
```

While this trick is interesting, it's not something to be applied without proper thought and understanding of its implications. We'll look behind the scenes of this syntax later.

For now, the big takeaway here is that you shouldn't think about a union of literals and their wider types together as "this or that". Instead, think of them as just the wider type since that is what TypeScript will resolve to.

---

## When Narrowing Doesn't Work

<!-- MAYBE move to the weird parts? -->

### Narrowing with a `Map`

Here we have a `processUserMap` function that takes in an `eventMap` that is a `Map` containing a key of `string` and a value of the `Event` type, which has a `message` string on it:

```typescript
type Event = {
  message: string;
};

const processUserMap = (eventMap: Map<string, Event>) => {
  if (eventMap.has("error")) {
    const message = eventMap.get("error").message; // red squiggly line under `eventMap.get("error")`

    throw new Error(message);
  }
};
```

Hovering over the `eventMap.get("error")` error tells us `Object is possibly 'undefined'`.

We get this error because TypeScript doesn't understand the relationship between `.has` and `.get` on a `Map` like it does with a regular object.

In a Map, the `.has()` function just returns a boolean. TypeScript doesn't know that the boolean is related to the Map in any way, so when it tries to access the value with `.get()`, it returns `Event | undefined`, instead of just `Event`.

To fix this, we will refactor the code by extracting the `event` into a constant. Then we can check if the `event` exists and use scoping to our advantage:

```typescript
const processUserMap = (eventMap: Map<string, Event>) => {
  const event = eventMap.get("error");

  if (event) {
    const message = event.message;

    throw new Error(message);
  }
};
```

This refactored version of the code works a bit more closely to what TypeScript wants to do in figuring out the relationship between variables instead of using the Map's built in methods like `has` or `get`.

### `Boolean()` Doesn't Narrow as Expected

Narrowing can be done with a number of other type guards, but there are some situations where the process won't work as expected.

Consider this `canAttendRatedRMovies` function that isn't working as expected when using JavaScript's `Boolean()` function:

```typescript
function canAttendRatedRMovies(age: number | null): boolean {
  // Why isn't this working?

  const isOldEnough = Boolean(age && age >= 17);

  if (isOldEnough) {
    return true; // Supposed to indicate the customer can purchase explicit lyrics version
  }

  return false;
}
```

However, if we use a double bang `!!` to convert the age check into a boolean, everything works as expected:

```typescript
// Works as Expected!

const isOldEnough = !!(age && age >= 18);
```

This works because TypeScript is really good at understanding operator syntax for "not" (`!`), "or" (`||`), and "and" (`&&`). However, when looking at `Boolean(age && age >= 18)`, TypeScript only sees the `Boolean` part. It doesn't recognize that it's related to the `age`.

It's not just functions like `Boolean` that don't narrow as expected. Certain objects like `Map` also can have issues.

---

### Narrowing with the switch(true) Pattern

You may be familiar with the `switch (true)` pattern. This pattern is reminiscent of an `if` statement but can be adapted to fit into a switch statement construct.

Here's an example of a `categorizeAlbumSales` function that uses this pattern to return a string explaining the number of albums sold based on the Album's `certification` property:

```tsx
function categorizeAlbumSales(album: Album): string {
  switch (true) {
    case album.certification === "diamond": {
      return "Over 10,000,000 albums sold";
    }

    case album.certification === "multi-platinum": {
      return "2,000,000 to 9,999,999 albums sold";
    }

    case album.certification === "platinum": {
      return "1,000,000 to 1,999,999 albums sold";
    }

    case album.certification === "gold": {
      return "500,000 to 999,999 albums sold";
    }

    default: {
      return "Less than 500,000 albums sold";
    }
  }
}
```

The thing being passed into the case is the condition we're checking the truthiness of. In this case, each `album`'s `certification` property gets accurately narrowed down to return a specific string.

This pattern can be adapted to checking any properties, and helps to avoid complexity when working with multiple narrowing statements.

---

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
// Argument of type '"jazz"' is not assignable to parameter of type '"rock" | "pop" | "unclassifiable"'
```

##### Improve Read-only Array Handling with `ts-reset`

While this specific typing adds predictability for TypeScript, it can be limiting and annoying when compared to behavior you're used to in JavaScript.

Total TypeScript's `ts-reset` library can help with this. It globally adjusts some of TypeScript's types, including updating arrays to accept any string when using `includes` and `indexOf`:

```typescript
readOnlyGenresAsConst.indexOf("jazz"); // No error when `ts-reset` is imported
```

The `ts-reset` library offers a way of balancing between the strictness and flexibility that TypeScript provides. While some developers might prefer TypeScript's stricter approach, if you ever find read-only arrays troublesome, this library is a useful addition to your toolkit to make the TypeScript experience smoother. Find out [more about `ts-reset` on GitHub](https://github.com/total-typescript/ts-reset).

---

### Enums vs Unions

We've now seen two ways to represent a set of related values in TypeScript: enums and unions.

For example, we could represent the status of an album as an enum:

```typescript
enum AlbumStatus {
  NewRelease = "NewRelease",
  OnSale = "OnSale",
  StaffPick = "StaffPick",
}
```

Or we could represent it as a union:

```typescript
type AlbumStatus = "NewRelease" | "OnSale" | "StaffPick";
```

With a union, you pass string values manually to the function. With an enum, you pass the enum member.

```typescript
logStatus("NewRelease"); // Union
logStatus(AlbumStatus.NewRelease); // Album
```

So, when should you use an enum, and when should you use a union?

#### Refactoring

One of the main benefits of enums is that they can be refactored easily. If you need to change the name of a member, you only need to change it in one place.

For instance, if we wanted to change `NewRelease` to `NewAlbum`, we only need to change the enum definition. We could even use TypeScript's refactoring tools to do this automatically via Rename Symbol.

But if we wanted to change the string value in a union, we would need to change every place where it's used.

```typescript
// 3 Changes, one per function call

logStatus("NewRelease");
logStatus("NewRelease");
logStatus("NewRelease");

// 1 Change, in the enum definition

logStatus(AlbumStatus.NewRelease);
logStatus(AlbumStatus.NewRelease);
logStatus(AlbumStatus.NewRelease);
```

#### Enum Members Can Have JSDoc Comments

TypeScript supports enums having JSDoc comments, which can be useful for documenting the enum members.

```typescript
enum AlbumStatus {
  /**
   * A new release
   */
  NewRelease = "NewRelease",
  /**
   * An album that is on sale
   */
  OnSale = "OnSale",
  /**
   * An album that is a staff pick
   */
  StaffPick = "StaffPick",
}
```

This can then be seen in the editor when you hover over the enum member:

```typescript
logStatus(AlbumStatus.NewRelease); // Hover over NewRelease to see the JSDoc comment
```

While you can add JSDoc comments to union members, they won't be displayed in the editor when you pass them to a function call.

```typescript
logStatus("NewRelease"); // No information provided when hovering over NewRelease
```

#### Enums Must Be Imported

<!--  -->

### Exercise 3: Global Typings Introduce `any` Types

In this exercise, we are working with a function named `getObj`. This function parses a JSON string and assigns the parsed object to `const obj`:

```typescript
const getObj = () => {
  const obj = JSON.parse('{ "a": 123, "b": 456 }');

  return obj;
};
```

Currently the inferred type for `obj` is `any`.

Down in the test case, there is an expectation that TypeScript should throw an error if we try to access `obj.c`. However, the `@ts-expect-error` directive is not working as expected:

```typescript
it("Should return an obj", () => {
  const obj = getObj();

  expect(obj.b).toEqual(456);

  expect(
    // @ts-expect-error c doesn't exist on obj // red squiggly line under @ts-expect-error line
    obj.c,
  ).toEqual(undefined);
});
```

TypeScript isn't able to dynamically break down the JSON object to figure out exactly what's returned from it. Your task is to add an annotation to `obj` that will make the test case pass while ensuring we are only able to access existing properties.

### Solution 3: Global Typings Introduce `any` Types

Functions like `JSON.parse()` return `any` by default. This is why the `@ts-expect-error` directive doesn't find an error when trying to access `obj.c` in the test case.

In order to solve this challenge, we need to make sure that the `any` type on `obj` is suppressed.

By adding a type annotation to `obj` inside of the `getObj` function, we can override the `any` type without any issues. In this case, `a` and `b` are both numbers:

```tsx
const getObj = () => {
  const obj: {
    a: number;
    b: number;
  } = JSON.parse('{ "a": 123, "b": 456 }');

  return obj;
};
```

With this change, the test passes as expected.

#### Using the `ts-reset` Library

There are risks associated with the approach of adding type annotations to `obj`. For example, if `JSON.parse` is called on an object that doesn't include the properties in the `obj` type annotation, TypeScript wouldn't raise an error until runtime.

To combat this issue, the `ts-reset` library can be used:

```typescript
import "@total-typescript/ts-reset";
```

This library overrides some global typings for various functions. With `ts-reset`, `JSON.parse()` now returns the `unknown` type instead of `any`. This forces you to narrow down the types before using the parsed data, preventing accidental `any` types from spreading in your application.

The `ts-reset` library also works well with Zod, as well as plain old narrowing techniques, such as using an `if` statement with `in`.

Whether you're using Zod or plain old narrowing techniques, the `ts-reset` library is a great way to keep your types under control.
