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

<!--  -->

### Putting It All Together: A Generic `Result` Type

Let's put all of these concepts together to create a generic `Result` type. This is a common pattern in TypeScript for handling success and error states.

Let's start by defining the `Result` type:

```tsx
type Result<TResult, TError extends { message: string } = Error> =
  | {
      success: true;
      data: TResult;
    }
  | {
      success: false;
      error: TError;
    };
```

Here, `Result` is a generic type that accepts two type parameters `TResult` and `TError`, and returns a discriminated union where the first branch represents a successful operation and the second branch represents an unsuccessful operation.

The `TError` type parameter is constrained to an object with a `message` property, and defaults to the `Error` type. This means you can pass in more specific error types if you want, like `TypeError` or `SyntaxError`.

Now we can use the `Result` type to represent the result of an operation that can either succeed or fail:

```tsx
const createRandomNumber = (): Result<number> => {
  const num = Math.random();

  if (num > 0.5) {
    return {
      success: true,
      data: 123,
    };
  }

  return {
    success: false,
    error: new Error("Something went wrong"),
  };
};
```

In this example, `createRandomNumber` returns a `Result` type that represents a random number that is either successfully generated or an error if the number is less than 0.5.

When we use `createRandomNumber`, TypeScript will infer the type of the result based on the return value, and use narrowing on `.success` to determine whether the operation was successful or not:

```tsx
const result = createRandomNumber();

if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error.message);
}
```

This can be a powerful pattern for handling success and error states in your applications, and can help you avoid using `try-catch` blocks in favor of more explicit error handling.

<!--  -->

<!-- CONTINUE -->

# 15. CommonJS vs. ES Modules

JavaScript is still a very young language. Its youth is most obvious when looking at how you modularize your code. As of 2024, the time of writing, there are _two_ ways to modularize your code in JavaScript: CommonJS (CJS) and ECMAScript Modules (ESM).

Understanding the differences between these two module systems, and how they interoperate, is crucial for writing modern JavaScript applications.

## An Overview

CommonJS was the first to appear and was created for use with Node.js. It introduced the `require` function for importing modules, and the `module.exports` object for exporting functionality. CJS modules have their own scope, which helps prevent unintended interactions with the global scope.

```javascript
// an import statement in CommonJS:
const module = require("module");

// an export statement in CommonJS:
module.exports = "Hello, world!";
```

ECMAScript Modules, often referred to as ES Modules or ESM, arrived later as part of the ECMAScript standard. ESM introduced a more declarative syntax using `import` and `export` statements:

```javascript
// an import statement in ESM:
import module from "module";

// an export statement in ESM:
export default "Hello, world!";
```

The ESM system was designed to work seamlessly in both browser and Node.js environments, providing a unified module system for JavaScript.

However, there are still traces of CommonJS in the ecosystem. Many existing libraries and codebases rely heavily on CJS, and even when using a bundler and writing code in ESM syntax, you might find the output is still in CommonJS format. To make things more confusing, some NPM packages written in CommonJS can work in ESM, but not the other way around.

The goal of this chapter is to prepare you for a future where everything in your application code is ES Modules, while also providing you with the tools to handle any interoperability issues you might encounter.

## Importing ESM into a CommonJS System

Let's look at a very typical error that shows up when working with both CommonJS and ES Modules in the same project.

Consider these two JavaScript files:

Here we have `esm-module.js`, which is a module that employs `export default` to export a value in ESM syntax:

```tsx
// esm-module.js
const hello = () => {
  console.log("Hello from Matt!");
};
export default hello;
```

Then inside of `index.js`, a `require` statement is used to import the `esm-module.js` file:

```tsx
// index.js
const esModule = require("./esm-module.js"); // cjs require

const main = async () => {
  esModule.default();
};

main();
```

A `package.json` file with a `dev` script is also present. The script calls `nodemon`, a tool that automatically reruns our application whenever there's a modification in our files.

However, when the script is run with the `npm run dev` command, we get an error from the `esm-module.js` file:

```typescript
export default hello;
^^^^^^
SyntaxError: Unexpected token 'export'
```

The issue is that the `index.js` file is written with CommonJS syntax, and it attempting to import something that's exported with the ES Module syntax `export default`.

Here's a simplified view of these files:

```javascript
// index.js
const esModule = require("./es-module.js");

// esm-module.js
export default "Hello, world!";
```

### Fixing the Error with `await import`

In order to fix this error, we need to fix this way we import the `esm-module.js` file in `index.js`.

Instead of the original import statement in the CommonJS `require` syntax, we need to use the `await import` syntax. This is a dynamic import statement that promises to return the module namespace object of the specified module.

Because the syntax is async, it should be be used inside an async function like so:

```tsx
// inside index.js
const main = async () => {
  const esModule = await import("./esm-module.mjs");
  esModule.default();
};
main();
```

Using the `await import` syntax is the primary method for importing ES module-compatible material into a CommonJS system.

However, this modification alone doesn't eliminate the error. The `await import` syntax is capable of targeting both CommonJS and ES modules, and Node.js defaults to treating the target as a CommonJS file.

We need to tell Node.js explicitly that our file is an ES module. We can do this by changing the file extension to `.mjs`:

```tsx
const esModule = await import("./esm-module.mjs");
```

By using the `.mjs` extension, Node.js recognizes that the file is an ES module. This allows us to utilize `import` and `export` statements within it.

After making these changes, our code operates as expected.

## Importing CommonJS into an ESM System

While importing ESM into CJS takes a bit of work with the `await import` syntax and renaming the file to `.mjs`, importing CommonJS into ESM "just works".

Here we have an `index.mjs` file. It imports `hello` from `commonjs.cjs`, and uses it in a `main` function:

```tsx
//index.mjs
import hello from "./cjs-module.cjs";

const main = async () => {
  hello();
};

main();
```

The `cjs-module.js` file uses the CommonJS syntax of setting `module.exports` to the `hello` function:

```tsx
// cjs-module.cjs
const hello = () => {
  console.log("Hello!");
};

module.exports = hello;
```

Running this code works without errors.

The main point to remember here is that importing CommonJS into an ESM system directly is supported, but the opposite isn't true without additional steps.

## `This Expression is Not Callable`

When writing an ESM module in TypeScript, you might encounter an error that says `This expression is not callable`. This error occurs when you attempt to call a function that is being imported from a module.

For example, this `index.ts` uses the `await import` syntax to import a function from `esm-module.js`:

```tsx
// inside index.ts

const main = async () => {
  const esModule = await import("./esm-module.mjs");

esModule.default(); // red squiggly line under default
};
main();

// hovering over default shows:
This expression is not callable.
```

TypeScript knows that `esModule` is being imported from a module, as seen when hovering over it:

```tsx
// hovering over esModule shows:
const esModule: {
  default: typeof import("src/esm-module");
};
```

Inside of the `esm-module.ts` file, we have a function called `hello` that we are exporting as the default export:

```tsx
const hello = () => {
  console.log("Hello!");
};
export default hello;
```

Despite the file being a TypeScript file that is compiled into JavaScript, TypeScript does not recognize that it should regard the `esm-module.ts` file as an ES module.

### Name ES Modules as `.mts`

In order to resolve this issue, we need to tell TypeScript that the `esm-module` file being imported is an ES module. To do this, we need to rename the file to `esm-module.mts`.

With this change, when TypeScript compiles the file, it will generate an `esm-module.mjs` file. This means we also need to update the import in the `index.ts` file:

```tsx
// index.ts
const main = async () => {
  const esModule = await import("./esm-module.mjs"); // Dynamic import
  esModule.default();
};
main();
```

TypeScript does this compilation thanks to the `moduleNodeNext` and `moduleResolutionNodeNext` configurations in TypeScript:

```tsx
{
  compilerOptions: {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
}
```

Without these configurations, TypeScript will assume that the file is a CommonJS file and will require you to use `esModule.default.default()` to access the default export. If you've ever stumbled upon a double `default` in a codebase, now you know why.

However, when the file extension is `.mts`, `esModule.default()` will operate correctly.

Note that inside of the `index.ts` file, calling `esModule.default()` is enforced because because of the `export default` syntax inside of `esm-module.mts`. If change the export to `export const hello`, it would be accessed with `esModule.hello` in the `index.ts` file.

Understanding how TypeScript identifies CommonJS and ESM files is important for recognizing errors that come up when combining the two module systems.

## Browsers Can't Use CommonJS

An important thing to know is that browsers can't run CommonJS's `require` calls. This issue becomes particularly noticeable when using TypeScript.

Here we have an `example.ts` file that imports a function from `run.js` and executes it:

```tsx
// example.ts
import run from "./run.js";
run("Hello!");
```

While this code looks like it uses ES6 import syntax, by default TypeScript will transpile this to CommonJS syntax with `require()` calls:

```tsx
// dist/example.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const run_js_1 = require("./run.js");
(0, run_js_1.run)("Hello!");
```

Let's see what happens when we attempt to run this in the browser by adding `dist/example.js` to a script tag in an `index.html` file:

```html
<script src="dist/example.js"></script>
```

Upon attempting to load this in a browser environment, an error occurs: `exports is not defined`.

This error happens because the transpiled JavaScript code includes references to `exports`, which is a global object provided by the Node.js runtime. However, `exports` does not exist in a browser environment, causing the JavaScript code to fail.

### Configure TypeScript to Output ESM

In order to fix this, we need to tell TypeScript to output ES6 modules instead of CommonJS.

First, rename the `.ts` file to `.mts` to denote it is a TypeScript module file. This change will make TypeScript output an `.mjs` file with the ES6 import/export syntax, which is supported by modern browsers.

After compiling the `.mts` file, the `script` tag needs updating to point to the `.mjs` file along with adding the `type="module"` attribute:

```html
<script type="module" src="dist/example.mjs"></script>
```

Now when reloading the page in the browser, `hello` is printed to the console as expected. The browser understands ESM, and loads the resources appropriately.

## Enforcing Correct Module Syntax

As we've seen in the above examples, it can be confusing to know whether the code you're emitting in TypeScript is going to be CommonJS or ESM code.

It's not sufficient to just write `export default` or `export =`, because TypeScript conforms to Node's framework, which has its distinct interpretation of what a CommonJS or an ESM module is.

TypeScript conforms to Node's framework, which has a distinct interpretation of what a CommonJS or an ESM module is. That's why it's not enough to just write `export default` or `export =` on their own.

In order to tell TypeScript to enforce the correct module syntax, the `verbatimModuleSyntax` option can be added to the `tsconfig.json` file:

```tsx
// tsconfig.json
{
  "compilerOptions": {
    "module": "NodeNext",
    "verbatimModuleSyntax": true
    ...
```

Once `verbatimModuleSyntax` has been added and set to true, TypeScript will show an error when the incorrect syntax is used.

For example, consider this file `cjs-module.ts` that uses the `export default` syntax:

```tsx
// cjs-module.ts
const hello = () => {
  console.log("Hello!");
};

export default hello; // red squiggly line under export default hello
```

When `verbatimModuleSyntax` is enabled, TypeScript will show an error under the `export default` line that tells us we're mixing the syntaxes together:

```tsx
// hovering over export default hello shows:
ESM syntax is not allowed in a CommonJS module when 'verbatimModuleSyntax' is enabled.
```

In order to fix the issue, we need to use the `export =` syntax instead:

```tsx
// cjs-module.ts

const hello = () => {
  console.log("Hello!");
};
export = hello;
```

The warnings will show when trying to use an ESM import as well:

```tsx
import { z } from "zod"; // rsl under import statement

// hovering over the import shows:
ESM syntax is not allowed in a CommonJS module when 'verbatimModuleSyntax' is enabled.
```

This functionality is helpful when you want to be precise about the syntax you're employing and the JavaScript you're generating.

In the following sections, we'll keep Verbatim Module Syntax enabled as we discover how to adjust some of the default settings when you want to entirely adopt either ESM or CommonJS. We'll also look at how to make both TypeScript and Node.js understand what's happening.

## Treating `.ts` Files as ESM by Default

In order to configure TypeScript to adopt ESM by default in TypeScript and Node, there is a quick configuration change that can be made.

Inside of the `package.json` file, add a `type` field and set it to `module`:

```json
// package.json
{
  "name": "my-project",
  // ... other settings ...
  "type": "module"
}
```

After this change, TypeScript and NodeJS will treat your files as ESM by default, without having to rename all of your files to `.mts`.

The reason for this change is that TypeScript follows Node's behavior when handling module types. By default, Node will look at the nearest `package.json` file to a file that it's importing. If it sees the `type` set to `module`, Node will treat the file as if it has `import` and `export` statements in it. Otherwise, it will default to CommonJS.

Adding `type: module` is a recommended practice for all new projects, and even when migrating old projects to ESM.

## Translating ESM Syntax to CJS Syntax

For this example, assume that we do not have the `type: module` field specified in the `package.json` file. This means that TypeScript will default to treating the file as a CommonJS file.

Here we have `index.ts` that uses the ESM `import` statement to import a module from `other-module.ts` but with the error message from TypeScript:

```tsx
// index.ts
import otherModule from "./other-module.js"; // red squiggly line under otherModule

const main = async () => {
  otherModule();
};

main();

// hovering over otherModule shows:
ESM syntax is not allowed in a CommonJS module when 'verbatimModuleSyntax' is enabled.
```

Here's what `other-module.js` looks like, including an error for using ESM syntax for the export:

```tsx
const hello = () => {
  console.log("Hello!");
};
export default hello; // red squiggly line under export statement

// hovering over export statement shows:
ESM syntax is not allowed in a CommonJS module when 'verbatimModuleSyntax' is enabled.
```

### Using `require` will be Typed as `any`

The traditional fix to this issue would be to use `require` instead of `import` in `index.ts`, and to use `module.exports` instead of `export default` in `other-module.ts`:

```tsx
// index.ts
const otherModule = require("./other-module.js");
const main = async () => {
  otherModule();
};
main();

// other-module.ts
const hello = () => {
  console.log("Hello!");
};

module.exports = hello;
```

However, with these changes when we hover over `otherModule` in `index.ts`, we can see that TypeScript has typed `otherModule` as `any`:

```tsx
// hovering over otherModule shows:
const otherModule: any;
```

This is because TypeScript treats `require` as a function that returns `any`:

```tsx
// hovering over require shows:
var require: NodeRequire (id: string) => any
```

In order to get better typing when importing and exporting CommonJS modules, there's a better syntax to use.

### Importing and Exporting CommonJS Modules

When exporting a CommonJS module, TypeScript prefers that you use the `export =` syntax instead of `module.exports`:

```tsx
// other-module.ts
const hello = () => {
  console.log("Hello!");
};

export = hello;
```

Then when you go to import the CJS module, instead of using `const` to create a variable with `require`, use `import` with the `require` function like this:

```tsx
// index.ts
import otherModule = require("./other-module.js");
const main = async () => {
  otherModule(); // red squiggly line under otherModule
};
main();
```

These syntax changes will allow TypeScript to infer the correct type of the exported module, but it only supports top-level imports.

### Multiple Exports and Imports

In order to export multiple things, an object can be used for the `export =` syntax:

```tsx
// other-module.ts

export = {
  hello: helloFunction,
  goodbye: goodbyeFunction,
};
```

Then the top-level `otherModule` would be imported then destructured from:

```tsx
// index.ts
import otherModule = require("./other-module.js");
const { hello, goodbye } = otherModule;
```

Now when the code is compiled, the import and export statements will be transformed into the familiar CommonJS `require` and `module.exports` syntax.

This syntax might seem odd at first, but it's part of TypeScript's strategy to bridge the gap between CommonJS and ECMAScript modules.

## Configuring Output for Node.js Projects

As we've seen, TypeScript will directly compile a `.cts` file into a `.cjs` file with the correct imports and exports. Similarly, an `.mts` file with ESM imports and exports will be compiled into an `.mjs` file. If your project only has `.ts` files, TypeScript will check `package.json` for the `"type": module` setting. If there isn't one, it will default to treating the file as a CommonJS file, which results in a `.cjs` file.

However, when working on a Node.js project, it's important that your files are all compiled into `.js` files with the correct module syntax.

This is where it's important to use the `NodeNext` option for both the `module` and `moduleResolution` settings in the `tsconfig.json` file:

```tsx
// tsconfig.json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    ...
```

Using `NodeNext` for the `module` and `moduleResolution` options guarantees that TypeScript will generate `.js` files that are compatible with Node.js.

The `module` option tells TypeScript the to emit ESM syntax, and the `moduleResolution` option tells TypeScript to resolve modules using the ESM resolution algorithm.

This resolution algorithm tells TypeScript where to look for modules that are being imported. Inside of the file doing the importing, if the import points to a relative or absolute path, it will be resolved the path directly. Otherwise, the import will be treated as a package name and be looked for in the `node_modules` directory, moving into parent directories as necessary. If the module isn't found at all, the resolution will fail and TypeScript will throw an error.

These `NodeNext` settings also play nice with the `verbatimModuleSyntax` `tsconfig.json` option we enabled in earlier examples. This tells TypeScript to enforce proper import syntax and throws errors if your TypeScript files are not recognized as ESM.

In short, for Node.js applications, set `ModuleNodeNext`, `ModuleResolutionNodeNext`, and `verbatimModuleSyntax: true` in your `tsconfig.json` file.

## Importing Types in ESM

When the `verbatimModuleSyntax` option is enabled, you need to use a specific syntax to import types from a module.

Consider this `module-containing-types.ts` file that exports an `Example` type, along with having a `console.log` side effect:

```tsx
// module-containing-types.ts

console.log("Hello from ESM Module");

export type Example = string;
```

When attempting to import the `Example` type using the `import` syntax, TypeScript will show an error:

```tsx
import { Example } from "./module-containing-types.js"; // red squiggly line under Example

// hovering over Example shows:
'Example' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.ts
```

To fix this error, use the `import type` syntax:

```tsx
import type { Example } from "./module-containing-types.js";
```

This syntax tells TypeScript that you only want the type from the imported file, and not the module itself. When TypeScript compiles the code, it will not include the module in the emitted JavaScript. Since the type gets erased at runtime, all that's left from the `module-containing-types` file is an `export` with an empty object.

### Keeping Side Effects in ESM

When `verbatimModuleSyntax` is enabled, the `console.log` side effect won't make it into the emitted JavaScript because only the type is being exported.

However, if you did want the side effect to be included, you would have to import the module itself in addition to the exported type:

```tsx
import type { Example } from "./module-containing-types.js";
import "./module-containing-types.js";

type OtherExample = Example;

// emitted JavaScript:

import "./module-containing-types.js";
type Example2 = string;
console.log("Hello from ESM Module");
```

To summarize, the `import type` syntax in TypeScript allows you to expressly control what's included in the emitted by only bringing in types that disappear from the transpiled code. . If a line has nothing specific to runtime, you can immediately tell that it will be erased at runtime. On the other hand, a standard import statement will always persist at runtime.

This is an interesting quirk of using the `verbatimModuleSyntax` in TypeScript.

## Choosing Between CJS and ESM

We've talked a lot about using CommonJS and ESM, and how to configure TypeScript so that errors are presented early and the correct code is emitted.

But the question remains: _Which one should you choose?_

Your goal should be to use and emit ESM.

ES Modules are the future direction of how JavaScript code is to be written. The ESM system works seamlessly, whether it's in the browser, Node.js, or in experimental runtimes like Bun and Deno. It's a universally accepted standard.

However, some developers like to stick with CommonJS. Their reasons often revolve around how CommonJS resolves modules.

For example, CommonJS doesn't require you to specify the file extension when importing a file, but ESM does. However, CommonJS is harder to bundle split than ESM, which can result in obstacles when minimizing packages for production.

Given the choice and an understanding of what you're shipping, you should be shipping ESM. Add `"type": "module"` to your `package.json` if your chosen framework permits it.

Embracing ESM now will simplify your life in the future, especially when developing libraries for distribution on NPM.

By now you should feel comfortable with both CommonJS (CJS) and ECMAScript Modules (ESM) enough to debug issues and configure TypeScript for smooth operation from the application development side.

Remember, the JavaScript ecosystem is constantly evolving, and what's considered best practice today might change tomorrow. Stay connected with the community, keep learning, and don't be afraid to experiment.

Should you encounter any stumbling blocks, don't hesitate to connect on the Total TypeScript Discord! The community there is always eager to help and share their experiences with publishing TypeScript applications and libraries.

<!--  -->

### Importing Inside `declare module`

There's an interesting edge case you can run into when using `declare module`. What if you want to keep the file you're working in a script, but import some types to use inside the `declare module` block?

You won't be able to `import` at the top of the file, because that will turn the file into a module. But you can use `import` inside the `declare module` block:

```typescript
// inside express.d.ts

declare module "express" {
  import { Request } from "express";

  export interface MyType {
    hello: string;
  }
}
```
