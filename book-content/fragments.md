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

<!--  -->

### Exercise 8: Annotating a Function's Errors

Consider a function named `getUserFromLocalStorage` that takes an `id` and returns a user object from `localStorage`:

```typescript
const getUserFromLocalStorage = (id: string) => {
  const user = localStorage.getItem(id);
  if (!user) {
    return undefined;
  }

  return JSON.parse(user);
};
```

This function can throw errors in either of two scenarios: First, an error will be thrown when there's a `SyntaxError` due to the data retrieved from `localStorage` being incorrectly formatted. Second, if there's a `DOMException` that occurs from an abnormal DOM event.

We have tried to encapsulate these possible errors by defining a type `PossibleErrors` as follows:

```typescript
type PossibleErrors = SyntaxError | DOMException;
```

Ideally, we should be able to annotate that `getUserFromLocalStorage` will either return a `user` or throw one of the errors represented by the `PossibleErrors` type.

In practice, however, when we wrap this function call in a `try-catch` block, the `catch` block's error parameter `e` is typed as `unknown`.

```typescript
// outside of the function

try {
  const user = getUserFromLocalStorage("user-1");
} catch (
  // How do we make this typed as PossibleErrors?
  e
) {}
```

Your challenge is to determine how to type `e` as one of the types represented by `PossibleErrors`. Note that there isn't a specific annotation, so there are different approaches to solving this problem.

The best solution involves implementing a type that will either return `data` or the specific `error`, and updating the implementation of `getUserFromLocalStorage` to include its own try-catch.

This exercise is challenging, and might require you to revisit what you've learned in previous chapters!

### Solution 8: Annotating a Function's Errors

Unlike some languages, TypeScript doesn't employ the `throws` syntax that could describe potential errors. There's currently no way to specifically annotate what kind of errors a function might throw:

```tsx
// This won't work!
const getUserFromLocalStorage = (id: string): throws PossibleErrors => {
  // ...
};
```

Additionally, TypeScript does not allow for the annotation of the catch clause. You can't directly annotate that `e`, must be a specific type of error:

```typescript
// This won't work!

try {
  const user = getUserFromLocalStorage("user-1");
} catch (e) {
  // You can't annotate 'e' like this
  e: PossibleErrors; // red squiggly line under PossibleErrors
}
```

That means we have to do some extra work to handle the errors in a recognizable pattern.

#### Using `instanceof` to Handle Errors

One approach to solving this problem is to use `instanceof` to check if the error is of a specific type:

```tsx
// inside the `catch` block

if (e instanceof SyntaxError) {
  // Handle SyntaxError
}

if (e instanceof DOMException) {
  // Handle DOMException
}
```

This solution will work, but it requires the user of your function to handle the error instead of the function itself.

#### Using a Type to Handle Errors

The better solution is to use a type to capture the necessary information inside the function.

The `Result` type is a discriminated union that includes a `success` property that is `true` when the function is successful, and `false` when it's not. When the function is successful, the `data` property will contain the data. When it's not, the `error` property will contain the specific error:

```tsx
type Result =
  | {
      success: true;
      data: any;
    }
  | {
      success: false;
      error: SyntaxError | DOMException;
    };
```

With the `Result` type created, we can use it to annotate the return type of the `getUserFromLocalStorage` function. Inside the function, we can add a `try-catch` block that will safely access the `localStorage` and handle success and error cases appropriately:

```typescript
const getUserFromLocalStorage = (id: string): Result => {
  try {
    const user = localStorage.getItem(id);
    if (!user) {
      return {
        success: true,
        data: undefined,
      };
    }

    return {
      success: true,
      data: JSON.parse(user),
    };
  } catch (e) {
    if (e instanceof DOMException) {
      return {
        success: false,
        error: e,
      };
    }
    if (e instanceof SyntaxError) {
      return {
        success: false,
        error: e,
      };
    }
    throw e;
  }
};
```

While this is a verbose solution, it provides a better experience to the users. The function is less likely to throw an error, and if it does, the error will be handled. This `Result` type pattern is a good one to adopt in your own applications!

<!--  -->

# 14. Types You Don't Control

In the last chapter, we briefly discussed how to create declaration files can be used to add types to your projects. Now we'll expand this discussion to include types that you don't control. This includes types for JavaScript features, Node.js, the DOM, and popular third-party libraries.

## TypeScript Compiler Options

Let's begin by looking at some `tsconfig.json` options that determine the language features that TypeScript will let you use in your projects.

### `target`

The `target` option specifies the ECMAScript version that TypeScript should target when generating JavaScript code. TypeScript ships with a variety of `.d.ts` declaration files that correspond to different ECMAScript versions.

For example, if you are working on building a web application that must support older browsers, you might set the `target` to `ES5`:

```json
{
  "compilerOptions": {
    "target": "ES5"
    // other options...
  }
}
```

With `ES5` as the target, TypeScript will only allow you to use features that are compatible with ECMAScript 5. This means that you won't be able to use language features that were introduced later.

For example, trying to call the `.replaceAll()` string method will result in an error:

```tsx
const songTitle = "Run Run Run";

songTitle.replaceAll("Run", "Bye"); // red squiggly line under replaceAll

// hovering over replaceAll shows:
Property 'replaceAll' does not exist on type '"Run Run Run"'. Do you need to change your target library? Try changing the `lib` compiler option to es2021 or later.
```

As the error message suggests, TypeScript recognizes that the `replaceAll` method is not available in ECMAScript 5 and recommends changing it to a later version where it is supported.

In this case, changing the `target` to `ES2021` or later will allow you to use the `.replaceAll()` method.

### `lib`

The other suggestion in the error message was to update the `lib` compiler option. The `lib` option allows you to specify an array of the built-in type definitions that TypeScript should include during compilation, while still targeting a specific ECMAScript version. However, there's more that the `lib` setting will accept.

For example, if you're building a web application, you'll want to include the `DOM` and `DOM.Iterable` options in the `lib` array:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
    // other options...
  }
}
```

The `DOM` option brings in type definitions from `lib.dom.d.ts` that correspond to the DOM API, while `DOM.Iterable` adds global interfaces that infuse `symbol.iterator` into DOM nodes to make them iterable:

It's worth pointing out that by default, the `lib` option is set based on the `target` setting, but the TypeScript team recommends explicitly specifying all of the options as a best practice.

#### `target` and `lib` Won't Polyfill

With `target` specifying an ECMAScript version and `lib` specifying type definitions to include, it may seem like the following configuration would bring newer features to an older version of JavaScript:

```tsx
// inside tsconfig.json
{
  "compilerOptions": {
    "target": "ES5",
    "lib": ["ES5", "DOM", "DOM.Iterable"],
    // other options...
```

However, TypeScript is not able to "down-level" or polyfill features that aren't supported in older environments.

Consider this example, where we want to use newer JS features like `string.replaceAll`, optional chaining with `?.`, and nullish coalescing with `??`, while targeting `ES5`:

```tsx
// API's are NOT transformed
const str = "Hello, world!";

str.replaceAll("Hello,", "Goodbye, cruel");

// Syntax IS transformed:
const searchSongs = (input?: { search?: string }) => {
  // Optional chaining
  const search = input?.search;

  // Nullish coalescing
  const defaultedSearch = search ?? "Hello";
};
```

When TypeScript transpiles this code, it will only transform the syntax– in this case, the optional chaining and nullish coalescing.

API methods are not polyfilled or transformed in any way, and are left as is. This could lead to runtime errors if the code is run in an environment that doesn't support these features. In this case, `replaceAll` will not be transformed, and will throw an error in an ES5-only environment that doesn't support it.

As mentioned before, it's a good idea to keep your `target` and `lib` options in sync. This ensures that you're only using features that are available in your target environment and helps avoid potential issues with unsupported APIs.

### `skipLibCheck`

Even if you exclude `node_modules` from being checked by TypeScript, the compiler will still check the type definitions for the libraries that you're using.

This behavior is controlled by the `skipLibCheck` option in the `tsconfig.json` file. By default, `skipLibCheck` is set to `false`, which means that TypeScript will perform type checking for all of the `.d.ts` files in your project.

However, it's a good idea to set it for `true` in your TypeScript projects:

```json
{
  "compilerOptions": {
    "skipLibCheck": true
    // other options...
  }
}
```

Setting `skipLibCheck` to `true` can significantly speed up the compilation process. Most projects won't have many custom declaration files, and you aren't likely to be making changes to the `.d.ts` files that come with your dependencies.

There's a balance between speed and ensuring type correctness, but in this case the benefits of enabling `skipLibCheck` outweigh the disadvantages of having it turned off.

## Type Third-Party Libraries with DefinitelyTyped

TypeScript ships with types for the most essential libraries, but it doesn't cover every library out there. You've seen how to create your own `.d.ts` files for adding types to your projects, but chances are there's an easier solution.

The [`DefinitelyTyped` GitHub repository](https://github.com/DefinitelyTyped/DefinitelyTyped) houses high-quality type definitions for numerous popular JavaScript libraries that don't ship definitions of their own.

By installing a package with `@types/` and your library as a dev dependency, you can add type definitions that TypeScript will be able to use immediately.

For example, say you're using the `diff` library to check for the difference between two strings:

```tsx
import Diff from "diff"; // red squiggly line under "diff"

const message1 = "Now playing: 'Run Run Run'";
const message2 = "Now playing: 'Bye Bye Bye'";

const differences = Diff.diffChars(message1, message2);
```

TypeScript reports an error underneath the `import` statement because it can't find type definitions, even though the library is installed over 40 million times a week from NPM:

```tsx
// hovering over "diff" shows:
Could not find a declaration file for module 'diff'. Try `npm install --save-dev @types/diff` if it exists or add a new declaration (.d.ts) file containing `declare module 'diff';`
```

Since we're using `pnpm` instead of `npm`, our installation command looks like this:

```bash
pnpm i -D @types/diff
```

Once the type definitions from DefinitelyTyped are installed, TypeScript will recognize the `diff` library and provide type checking and autocompletion for it:

```tsx
// hovering over differences shows:
const differences: Diff.Change[];
```

### Typing Node.js with `@types/node`

It's not just specialized libraries that have type definitions in `DefinitelyTyped`.

Even though Node.js itself is written in JavaScript, it has its own set of APIs that TypeScript doesn't know about by default.

The `DefinitelyTyped` repo includes a package called `@types/node` that brings type definitions for Node.js-specific APIs, including global objects like `process` and `fs` for file system functionality.

If you're building a Node.js application, you'll definitely want to install `@types/node` as a dev dependency.

The `DefinitelyTyped` repository has types for thousands of popular libraries, but if you end up finding a library that isn't covered you can always create your own type definitions to contribute!

## Types that Ship with Libraries

Now that we've talked about how to add types to third-party libraries, let's look at how libraries ship with their own types.

For example, we'll look at Zod– a popular library that allows for constructing and validating data objects at runtime.

After running the installation command `pnpm i zod`, a new `zod` subdirectory will be created inside of `node_modules`. Inside, you'll find a `package.json` file with a `types` key that points to the type definitions for the library:

```tsx
// inside node_modules/zod/package.json
{
  "types": "index.d.ts",
  // other keys...
}
```

Inside of `index.d.ts` are the type definitions for the `zod` library:

```tsx
// inside node_modules/zod/index.d.ts
import * as z from "./external";
export * from "./external";
export { z };
export default z;
```

Additionally, every `.js` file inside of the `lib` folder has a corresponding `.d.ts` file that contains the type definitions for the JavaScript code.

While it isn't necessary for a library to include the `types` key in its `package.json` file, it does make it easier for developers to follow the library's type definitions.

Whether it's inside of `node_modules` or your own code, as long as you have `.js` files with corresponding `.d.ts` files, TypeScript will be able to provide type checking and autocompletion for the library.

### Typing Non-Code Files

In some environments like Webpack, it's possible to import non-code files like images that will end up being incorporated into the bundle with a string identifier.

Consider this example where several `.png` images are imported. TypeScript doesn't typically recognize PNG files as modules, so it reports an error underneath each import statement:

```tsx
import pngUrl1 from "./example1.png"; // red squiggly line under "./example1.png"
import pngUrl2 from "./example2.png"; // red squiggly line under "./example2.png"
import pngUrl3 from "./example3.png"; // red squiggly line under "./example3.png"
import pngUrl4 from "./example4.png"; // red squiggly line under "./example4.png"

// hovering over "./example1.png" shows:
Cannot find module './example1.png' or its corresponding type declarations.
```

As it happens, the `declare module` syntax can also be used to declare types for non-code files like images or JSON files.

To add support for the `.png` imports, create a new file `png.d.ts`. Inside of the file, we'll start with `declare module` but since we can't use relative module names, we'll use a wildcard `*` to match any `*.png` file. Inside of the declaration, we'll say that `png` is a string and export it as the default:

```tsx
// inside png.d.ts
declare module "*.png" {
  const png: string;

  export default png;
}
```

With the `png.d.ts` file in place, TypeScript will recognize the imported `.png` files as strings without reporting any errors.

Using wildcards in module declarations is a good trick to know for working with non-JavaScript files in a TypeScript project.

## A Declaration File Misconception

Now that we've seen multiple examples of the "hows" and "whys" behind declaration files, we'll close this chapter with some final thoughts on the topic.

There's a common misconception that TypeScript projects should have all of their type definitions inside of `.d.ts` files. The thought is that an `index.ts` file would have the implementation file, and a `types.d.ts` file would contain the type definitions for the implementation:

```tsx
// index.ts
import { Example } from "./types";

type Example2 = Example;

// types.d.ts
export type Example = string;
```

This is not a good way to do things. Declaration files are not meant to be a catch-all location for types. A `.d.ts` file is supposed to be used for making global modifications to TypeScript's scope, or for describing JavaScript to add type checking. After all, declaration files provide an ambient context, which is global by nature.

A better approach is to keep types inside of `.ts` files as if they were regular modules. Because the `skipLibCheck` should be set to `true` in your `tsconfig.json` files, TypeScript will not perform type checking on the `.d.ts` files in your project. Keeping your types in `.ts` files will ensure that your code is properly type-checked.

The good news is that transitioning from `.d.ts` to `.ts` files is simple– just rename `types.d.ts` to `types.ts` and update the import statements in your project. If TypeScript finds an error, it will alert you, which wouldn't happen if you were using `.d.ts` files.

The rule of thumb to remember is that you should keep type definitions in `.ts` files and only use `.d.ts` files for global modifications or JavaScript descriptions.

## Exercises

### Exercise 2: Iterating DOM Nodes

Here we're selecting all the `div` elements present on a page with `document.querySelectorAll`. This results in a `NodeList` comprising `HTMLDivElement`:

```tsx
const elements = document.querySelectorAll("div");
```

Next, we attempt to loop over each element within `elements`:

```tsx
for (const element of elements) {
  // red squiggly line under elements
  element.innerHTML = "Hello World!";
}
```

But, TypeScript raises an error under `elements`:

```tsx
// hovering over "elements" shows:
Type 'NodeListOf<HTMLDivElement>' must have a '[Symbol.iterator]()' method that returns an iterator.
```

This error is due to a misconfiguration in our TypeScript configuration file `tsconfig.json`.

Currently, the configuration appears as follows:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "esModuleInterop": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "lib": ["ES2022", "DOM"]
  }
}
```

Your task is to determine the cause behind this error, and update tsconfig.json to get the code running as intended.

### Solution 2: Iterating DOM Nodes

TypeScript was giving us an error since it does not recognize `elements` as an iterable object. In order to make DOM nodes iterable, we need to explicitly include `DOM.Iterable` in the `lib` option:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "esModuleInterop": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  }
}
```

It's worth noting that `DOM.Iterable` is included by default if you don't specify the `lib` option. However, explicitly stating which libraries are included can help ward off potential problems later on, particularly when operating in diverse environments like Node.js. By including `ES2022`, `DOM`, and `DOM.Iterable` in your TypeScript configuration, you'll be adequately prepared to handle DOM iteration in your web development projects.
