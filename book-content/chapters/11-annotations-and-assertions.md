<!-- CONTINUE -->

# Annotations and Assertions

We've seen throughout the book that TypeScript is pretty good at inferring types on its own. However, there are times when it doesn't quite get what we want. In these cases, we can use annotations and assertions to tell TypeScript how we want it to interpret our code.

In this chapter, we'll go beyond the standard type annotations we've seen so far. We'll also go deeper into assertions, which we use to tell TypeScript "trust me, I know what I'm doing."

There's a balance to strike between using annotations and assertions and letting TypeScript do its thing. We'll explore when to use each and how to use them effectively, but first let's do a quick review.

## Variable & Function Annotation Review

In many cases, TypeScript can infer the types of our variables and function return values without us needing to explicitly annotate them.

For example, in this code TypeScript is able to tell what's a number and what's a string:

```tsx
let albumSales = 5000000;
let albumPrice = 19.99;
let albumName = "Purple Rain";
```

Each of these variables can be reassigned since they were declared with `let`, but they will only be able to hold the same type of value as their initial assignment.

However, in this example the `albumSales` variable is declared but not immediately initialized, so it should have a type annotation added:

```tsx
let albumSales: number;
albumSales = 5000000;
albumSales = "a lot"; // Error: Type 'string' is not assignable to type 'number'
```

For function annotations, we do need to be a bit more explicit in order to avoid errors.

Consider this `calculateTotalSales` function:

```tsx
function calculateTotalSales(quantity: number, price: number): number {
  return quantity * price;
}
```

In this function, the `quantity` and `price` parameters are annotated with the `number` type, as is the return value of the function.

This ensures that the function can only be called with numbers and will return a number, which prevents runtime errors that would occur from passing a different type.

However, for this function TypeScript is smart enough to infer from the parameter types and the multiplication operation that the return type will be a number, so it's not strictly necessary to include the return type annotation:

```tsx
function calculateTotalSales(quantity: number, price: number) {
  return quantity * price;
}
```

The same is not true for this `findAlbumPrice` function:

```tsx
function findAlbumPrice(
  albums: { name: string; price: number }[],
  albumName: string,
): number | null {
  for (let album of albums) {
    if (album.name === albumName) {
      return album.price;
    }
  }
  return null;
}
```

Here, the `albums` parameter is an object with a `name` property of type `string` and a `price` property of type `number`. The `albumName` parameter is a `string`. The function returns a `number` if the album is found, or `null` if it's not.

In this case, TypeScript isn't able to infer the return type from the function's implementation, so it's necessary to include the return type annotation.

### General Rules for Annotations

Here are some general rules for when you should use annotations:

1. Add variable type annotations when it's declared but not immediately initialized.
2. Function parameters should pretty much always have type annotations. This avoids `implicit any` errors and helps TypeScript infer the return type.
3. Let TypeScript infer the return type of simple functions, but use annotations for more complex functions.

## The `as` Assertion

In the last chapter we saw how to use `as const` to create a read-only array of literal types. It just so happens that the `as` keyword can also be combined with any other type, giving us a way to tell TypeScript that we want to treat one type as another type when it isn't able to infer it on its own.

It's important to note that `as` doesn't actually cast or convert any types at runtime. It's just a way to tell TypeScript more about the type of a variable so that it can be inferred correctly.

Let's look at an example.

Here we have an `Album` interface with `title`, `artist`, and `releaseYear` properties, and an optional `sales` property. We then create a new album variable that we annotate as an `Album` type:

```tsx
interface Album {
  title: string;
  artist: string;
  releaseYear: number;
  sales?: number;
}

const newTab: Album = {
  title: "New Tab",
  artist: "Khotin",
  releaseYear: 2018,
  sales: 1000,
};
```

Then we create a new `AlbumWithSales` type that intersects `Album` with an object that has a `sales` property. This will essentially make the `sales` property required:

```tsx
type AlbumWithSales = Album & { sales: number };
```

When we go to create a `newTabWithSales` variable from `newTab`, TypeScript doesn't know that `newTab` has a `sales` property. This results in several errors:

```tsx
const newTabWithSales: AlbumWithSales = newTab; // red squiggly line under newTabWithSales

// hovering over newTabWithSales shows:
Type 'Album' is not assignable to type 'AlbumWithSales'.
Type 'Album' is not assignable to type '{ sales: number; }'.
Types of property 'sales' are incompatible.
Type 'number | undefined' is not assignable to type 'number'.
Type 'undefined' is not assignable to type 'number'.
```

However, since we know that `newTab` has a `sales` property, we can use the `as` assertion to tell TypeScript that it should be treated as an `AlbumWithSales`:

```tsx
const newTabWithSales: AlbumWithSales = newTab as AlbumWithSales;
```

By asserting that the `newTab` variable should be treated as an `AlbumWithSales`, the errors go away and we can safely access the `sales` property:

```tsx
console.log(newTabWithSales.sales); // 1000
```

### Asserting `as any`

Many third-party libraries don't include type definitions, so it's common to see `as any` used to get around type errors.

For example TypeScript might prevent you from calling a function that doesn't have type definitions. Adding `as any` to the end of the function call will tell TypeScript to treat the function as the `any` type, which will allow the call to go through:

```tsx
const someValue = someJsLibrary.someFunction() as any;

someValue.someProperty; // No type errors
```

But on the other side of the coin, since using `as any` eliminates type checking and autocompletion features, it leaves you open to introducing runtime errors:

```tsx
someValue.someProperly; // typo will not be caught by TypeScript
```

The `as any` assertion should be used sparingly, and only when you're sure that the value you're asserting is safe to use as `any`. If you know what type something should be, it's better to use a more specific `as` assertion.

However, even `as` has its limitations.

### The Limits of `as`

Consider this example where `as` is used to assert that a string should be treated as a number:

```tsx
const albumSales = "Heroes" as number; // red squiggly line under "Heroes" as number
```

TypeScript realizes that even though we're using `as`, we might have made a mistake:

```tsx
// hovering over "Heroes" as number shows:
Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
```

The error message is telling us that a string and a number don't share any common properties, but if we really want to go through with it, we could double up on the `as` assertions to first assert the string as `unknown` and then as a `number`:

```tsx
const albumSales = "Heroes" as unknown as number; // no error

// alternative syntax options for the above
const albumSales = "Heroes" as any as number;
const albumSales = "Heroes" as never as number;
```

When using `as` to assert as `unknown`, `any`, or `never` before adding `as number`, the red squiggly line goes away but that doesn't mean the operation is safe. There's just no way to convert "Heroes" into a number that would make sense.

The same behavior applies to other types as well.

In this example, an `Album` interface and a `SalesData` interface don't share any common properties:

```tsx
interface Album {
  title: string;
  artist: string;
  releaseYear: number;
}

interface SalesData {
  sales: number;
  certification: string;
}

const paulsBoutique: Album = {
  title: "Paul's Boutique",
  artist: "Beastie Boys",
  releaseYear: 1989,
};

const paulsBoutiqueSales = paulsBoutique as SalesData; // red squiggly line under paulsBoutique as SalesData
```

Again, TypeScript shows us the warning about the lack of common properties:

```tsx
Conversion of type 'Album' to type 'SalesData' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
Type 'Album' is missing the following properties from type 'SalesData': sales, certification.
```

While `as` is great for telling TypeScript what you want to do, it's not a magic wand that can make any type be treated as any other type. Use it when you're sure that the type you're asserting is safe to use. When in doubt, use the most specific `as` assertion you can.

## The Non-null Assertion

Another assertion we can use is the non-null assertion, which is specified by using the `!` operator. This provides a quick way to tell TypeScript that a value is not `null` or `undefined`.

In this example, the `Album` interface has a `sales` property that is typed as either a number or `null`:

```tsx
interface Album {
  title: string;
  artist: string;
  releaseYear: number;
  sales: number | null;
}

const burgers: Album {
  title: "Burgers",
  artist: "Hot Tuna",
  releaseYear: 1972,
  sales: null
};
```

Here we have an `addASale` function that will log out an album's sales with one added to it. However, there's an error because `album.sales` could be `null`:

```tsx
function addASale(album: Album) {
  console.log(album.sales + 1); // red squiggly line under album.sales
}

// hovering over album.sales shows:
'album.sales' is possibly 'null'.
```

To fix this, we can update `album.sales` to use the non-null assertion:

```tsx
function addASale(album: Album) {
  console.log(album.sales! + 1); // no error
}

addASale(burgers); // logs: 1
```

In this situation, we knew that using a non-null assertion was safe because even if `album.sales` was `null`, it would be coerced to `0` before adding `1` to it. However, runtime errors will still occur in many other cases.

### Non-null Assertions with Optional Properties

It's also possible to use non-null assertions when working with optional properties.

Consider this `findSongsByArtist` function that accepts a `filterParams` object with an optional `artist` property, as well as an optional `songs` array:

```tsx
const findSongsByArtist = (
  filterParams?: { artist?: string | null },
  songs?: {
    id: string;
    title: string;
    artist: string;
  }[],
) => {
  if (filterParams.artist) { // red squiggly line under filterParams
    // rest of implementation
  }
  // rest of implementation
};

// hovering over filterParams shows:
'filterParams' is possibly 'undefined'.
```

Even though the function isn't completely implemented, TypeScript is able to infer that `filterParams` could be `undefined`.

One option to fix the error is to use the optional chaining operator:

```tsx
if (filterParams?.artist) {
  // rest of implementation
}
```

However, if we know that `filterParams` exists, we can use the non-null assertion to tell TypeScript that it's safe. We could also use the non-null assertion inside of the filter if we know that the `songs` array exists as well:

```tsx
if (filterParams!.artist) {
  return songs!.filter((song) => song.artist === filterParams!.artist);
}
```

While the non-null assertion works in these cases, for the most part it would be better to rework your code to allow TypeScript to check for itself.

## The `satisfies` Operator

The `satisfies` operator lets us specify that a value needs to meet certain criteria. However, it won't affect TypeScript's ability to infer types.

In this example, we have a `Song` type that has a `title` and `artist` property. We can then create an array called `playlist` and use the `satisfies` operator to specify that each item in the array must be a `Song` type:

```tsx
type Song = {
  title: string;
  artist: string;
};

const playlist = [
  { title: "Year of the Cat", artist: "Al Stewart" },
  { title: "Stop That Train", artist: "Keith & Tex" },
  { title: "Magic Beams", artist: "Emperor Penguin" },
] satisfies Song[];
```

Now if we try to add an item to the `playlist` array that doesn't meet the `Song` type criteria, TypeScript will throw an error:

```tsx
playlist.push({ title: "Dreams" }); // red squiggly line under { title: "Dreams" }

// hovering over title shows:
Argument of type '{ title: string; }' is not assignable to parameter of type '{ title: string; artist: string; }'.
```

### Comparing `satisfies` with Type Annotations

Let's compare the `playlist` above that uses `satisfies` with this `playlist2` that specifies the `Song` type directly:

```tsx
const playlist2: Song[] = [
  { title: "Year of the Cat", artist: "Al Stewart" },
  { title: "Stop That Train", artist: "Keith & Tex" },
  { title: "Magic Beams", artist: "Emperor Penguin" }
];

playlist2.push({ title: "Dreams" }); // red squiggly line under { title: "Dreams" }

// hovering over title shows:
Argument of type '{ title: string; }' is not assignable to parameter of type 'Song'.
```

Both `playlist` and `playlist2` are essentially the same, but reading the error messages when trying to add incompatible items illustrates the difference.

When using `satisfies`, the type of `playlist` is being inferred based on the existing items in the array– objects with a `title` and `artist`. By adding `satisfies Song[]`, TypeScript will check that the items it inferred inside the `playlist` array meet the `Song` type criteria.

On the other hand, when using a type annotation TypeScript will check that the items in the array meet the `Song` type criteria directly, without inferring the type from the existing items.

In many cases, using `satisfies` can be more flexible than using type annotations, particularly with more complex data structures.

### Narrowing Literal Types with `satisfies`

TypeScript does not automatically narrow down object properties to their literal types.

For example, passing an object with a property `format: "Vinyl"` into a function expecting `"CD" | "Vinyl" | "Digital"` results in an error:

```tsx
type AlbumFormat = "CD" | "Vinyl" | "Digital";

const printMediaInfo = (format: AlbumFormat) => {
  console.log(`This album is available in ${format} format.`);
}

const album = {
  format: "Vinyl"
};

printMediaInfo(album); // red squiggly line under album

// hovering over album shows:
Argument of type '{ format: string; }' is not assignable to parameter of type 'AlbumFormat'.
```

We get the error because TypeScript infers the `album` object's `format` property as a string, which isn't compatible with the `AlbumFormat` type.

Using the `satisfies` operator, we can tell TypeScript that the `album` object must meet the `AlbumFormat` type criteria:

```tsx
const album = {
  format: "Vinyl",
} satisfies { format: AlbumFormat };
```

This fixes the error and allows the `album` object to be passed into the `printMediaInfo` function without issue.

Again, there are other options for solving this problem, but using `satisfies` lets TypeScript infer literals where it matters.

## Error Suppression Directives

The `as` and non-null assertion operators give us options for telling TypeScript that we know what we are doing in our code. We can also use directives to directly tell the compiler to expect errors to occur, or to ignore certain lines of code altogether.

### `@ts-expect-error`

Throughout the book's exercises we've seen several examples of `@ts-expect-error`. This directive gives us a way to tell TypeScript that we expect an error to occur on the next line of code.

If the line in question throws an error, TypeScript will be satisfied and won't throw any errors itself. However, if the line does not have an error, TypeScript will throw an error and fail compilation.

In this example, there is no error for `result` because we told TypeScript that we know passing a string to the `addOne` function will throw an error. However, the `@ts-expect-error` directive above `result2` has a red squiggly line under it because TypeScript expected an error to occur that didn't:

```tsx
function addOne(num: number) {
  return num + 1;
}

// @ts-expect-error
const result = addOne("one");

// @ts-expect-error // red squiggly line under @ts-expect-error
const result2 = addOne(1);

// hovering over @ts-expect-error shows:
Unused '@ts-expect-error' directive.
```

Note that `@ts-expect-error` doesn't let you expect a specific error, but instead just that an error will occur.

### `@ts-ignore`

The `@ts-ignore` directive behaves a bit differently than `@ts-expect-error`. Where `@ts-expect-error` will let you know if the next line does not have an error, the `@ts-ignore` directive just ignores any non-syntax issues all together without feedback.

When using `@ts-ignore` with the `addOne` function, we able to pass a string into the function that expects a number and the `result` variable ends up being concatenated:

```tsx
function addOne(num: number) {
  return num + 1;
}

// @ts-ignore
const result = addOne("one");

console.log(result); // "one1"
```

The `@ts-ignore` directive can also be thought of as a less-precise version of `as any` that doesn't provide any type checking or autocompletion features. Earlier we saw this example of using `as any` to bypass type errors when calling a function from a third-party library:

```tsx
const someValue = someJsLibrary.someFunction() as any;
```

The `@ts-ignore` directive could be used to achieve the same result:

```tsx
// @ts-ignore
const someValue = someJsLibrary.someFunction();
```

In the above example, using `as any` would be a safer choice, but the `@ts-ignore` directive can be useful when you want to bypass type errors without any type checking or autocompletion features.

### `@ts-nocheck`

Finally, The `@ts-nocheck` directive will completely remove type checking for a file.

To use it, add the directive at the top of your file:

```tsx
// @ts-nocheck
```

With all checking disabled, TypeScript won't show you any errors, but it also won't be able to protect you from any runtime issues that might show up when you run your code.

Generally speaking, you shouldn't use `@ts-nocheck`. It might be useful when incrementally migrating a large JavaScript codebase to TypeScript, but even then it would arguably be better to just keep the `.js` file until it can be rewritten all at once.

Really, all of these directives should be used sparingly and with caution. The `@ts-expect-error` works well for testing and illustrating examples, but in a real codebase it's better to use `as` or non-null assertions when you're sure that you know what you're doing.

## Exercises

### Exercise 1: Required vs. Unnecessary Annotations

There's a balance between not annotating enough and annotating too much. In this exercise, you'll be given a few examples of code and you'll need to decide whether the annotations are required or unnecessary.

Here we have a function `isProblemOrSolution` that includes numerous annotations:

```tsx
const isProblemOrSolution = (filename: string): boolean => {
  const splitFilename: string[] = filename.split(".");

  const finalIndex: number = splitFilename.length - 1;

  const extension: string | undefined = splitFilename[finalIndex];

  const isProblem: boolean = extension === "problem";

  const isSolution: boolean = extension === "solution";

  return isProblem || isSolution;
};
```

There is a return type annotation, as well as several variable type annotations on `splitFilename`, `finalIndex`, `extension`, `isProblem`, and `isSolution`.

Below the function are a `users` variable and `usersWithIds` variable with some annotations:

```tsx
const users: {
  name: string;
}[] = [
  {
    name: "Waqas",
  },
  {
    name: "Zain",
  },
];

const usersWithIds: {
  id: number;
  name: string;
}[] = users.map(
  (
    user: {
      name: string;
    },
    index: number,
  ) => ({
    ...user,
    id: index,
  }),
);
```

And finally, a test that checks the type of `usersWithIds`:

```tsx
type test2 = Expect<
  Equal<
    typeof usersWithIds,
    {
      id: number;
      name: string;
    }[]
  >
>;
```

Determine how many annotations can be removed while still having the test pass successfully.

### Exercise 2: Provide Additional Info to TypeScript

This `handleFormData` function accepts an argument `e` typed as `SubmitEvent`, which is a global type from the DOM typings that is emitted when a form is submitted.

Within the function we use the method `e.preventDefault()`, available on `SubmitEvent`, to stop the form from its default submission action. Then we attempt to create a new `FormData` object, `data`, with `e.target`:

```typescript
const handleFormData = (e: SubmitEvent) => {
  e.preventDefault();
  const data = new FormData(e.target); // red squiggly line under e.target
  const value = Object.fromEntries(data.entries());
  return value;
};
```

At runtime, this code works flawlessly. However, at the type level, TypeScript shows an error under `e.target`:

```typescript
// hovering over e.target shows:
Argument of type 'EventTarget | null' is not assignable to parameter of type 'HTMLFormElement | undefined'.
Type 'null' is not assignable to type 'HTMLFormElement | undefined'.
```

Your task is to provide TypeScript with additional information in order to resolve the error.

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

### Exercise 4: Solving Issues with Assertions

Here we'll revisit a previous exercise, but solve it in a different way.

The `findUsersByName` function takes in some `searchParams` as its first argument, where `name` is an optional string property. The second argument is `users`, which is an array of objects with `id` and `name` properties:

```typescript
const findUsersByName = (
  searchParams: { name?: string },
  users: {
    id: string;
    name: string;
  }[],
) => {
  if (searchParams.name) {
    return users.filter((user) => user.name.includes(searchParams.name)); // red squiggly line under searchParams.name
  }

  return users;
};
```

If `searchParams.name` is defined, we want to filter the `users` array using this `name`.

However, this currently has an error:

```typescript
Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
  Type 'undefined' is not assignable to type 'string'.
```

Your challenge is to adjust the code so that the error disappears.

Previously we solved this challenge by extracting `searchParams.name` into a const variable and performing the check against that.

However, this time you need to solve it two different ways: Once with `as` and once with non-null assertion.

Note that this is slightly less safe than the previous solution, but it's still a good technique to learn.

### Exercise 5: Improving Type Annotations with `satisfies`

Here we have a `config` object, defined as a Record. The keys in this Record are strings, and the values are a `Color` that can either be a string or an object with red, green, and blue properties:

```tsx
type Color =
  | string
  | {
      r: number;
      g: number;
      b: number;
    };

const config: Record<string, Color> = {
  foreground: { r: 255, g: 255, b: 255 },
  background: { r: 0, g: 0, b: 0 },
  border: "transparent",
};
```

However, TypeScript does not recognize that `border` is a string, so attempting string operations causes errors:

```ts
config.border.toUpperCase(); // red squiggly lines under config.border and toUpperCase()

// hovering over config.border shows:
'config.border' is possibly 'undefined'.ts(2532)

// hovering over toUpperCase() shows:
Property 'toUpperCase' does not exist on type 'Color'.
Property 'toUpperCase' does not exist on type '{ r: number; g: number; b: number; }'.
```

Similarly, trying to access properties from `foreground` also results in errors because TypeScript wrongly infers `foreground` to be a string:

```ts
console.log(config.foreground.r); // red squiggly line under r

// hovering over config.foreground shows:
'config.foreground' is possibly 'undefined'.

// hovering over r shows:
Property 'r' does not exist on type 'Color'.
Property 'r' does not exist on type 'string'.
```

Using the `@ts-expect-error` also directive does not work as expected:

```ts
// @ts-expect-error // red squiggly line under @ts-expect-error
config.primary;

// @ts-expect-error // red squiggly line under @ts-expect-error
config.secondary;
```

Your challenge is to find a way to better annotate the `config` object so that it still gives us type checking when we add things to it.

We should not be able to add numbers or objects without RGB values to the config object, and all tests should pass.

### Exercise 6: Enforcing Valid Configuration

We're back to the `configurations` object that includes `development`, `production`, and `staging`. Each of these members contains specific settings relevant to its environment:

```tsx
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
    // @ts-expect-error // red squiggly line under @ts-expect-error
    notAllowed: true,
  },
};
```

We also have an `Environment` type along with a passing test case that checks if `Environment` is equal to `"development" | "production" | "staging"`:

```typescript
type Environment = keyof typeof configurations;

type test = Expect<
  Equal<Environment, "development" | "production" | "staging">
>;
```

Even though the test case passes, we have an error in the `staging` object inside of `configurations`. We're expecting an error on `notAllowed: true`, but the `@ts-expect-error` directive is not working because TypeScript is not recognizing that `notAllowed` is not allowed.

Your task is to determine an appropriate way to annotate our `configurations` object to retain accurate `Environment` inference from it while simultaneously throwing an error for members that are not allowed. Hint: Consider using a helper type that allows you to specify a data shape.

### Exercise 7: Variable Annotation vs. `as` vs. `satisfies`

In this exercise, we are going to examine three different types of setups in TypeScript: variable annotations, `as`, and `satisfies`.

The first scenario consists of declaring a `const obj` as an empty object and then applying the keys `a` and `b` to it. Using `as Record<string, number>`, we're expecting the type of `obj` or `a` to be a number:

```typescript
const obj = {} as Record<string, number>;
obj.a = 1;
obj.b = 2;

type test = Expect<Equal<typeof obj.a, number>>;
```

Second, we have a `menuConfig` object that is assigned a Record type with `string` as the keys. The `menuConfig` is expected to have either an object containing `label` and `link` properties or an object with a `label` and `children` properties which include arrays of objects that have `label` and `link`:

```typescript
const menuConfig: Record<
  string,
  | {
      label: string;
      link: string;
    }
  | {
      label: string;
      children: {
        label: string;
        link: string;
      }[];
    }
> = {
  home: {
    label: "Home",
    link: "/home",
  },
  services: {
    label: "Services",
    children: [
      {
        label: "Consulting",
        link: "/services/consulting",
      },
      {
        label: "Development",
        link: "/services/development",
      },
    ],
  },
};
type tests = [
  Expect<Equal<typeof menuConfig.home.label, string>>, // red squiggly line under menuConfig.home
  Expect<
    Equal<
      typeof menuConfig.services.children, // red squiggly line under menuConfig.services and children
      {
        label: string;
        link: string;
      }[]
    >
  >,
];
```

In the third scenario, we're trying to use `satisfies` with `document.getElementById('app')` and `HTMLElement`, but it's resulting in errors:

```typescript
// Third Scenario
const element = document.getElementById("app") satisfies HTMLElement; // red squiggly line under satisfies

type test3 = Expect<Equal<typeof element, HTMLElement>>; // red squiggly line under Equal<>
```

Your job is to rearrange the annotations to correct these issues.

At the end of this exercise, you should have used `as`, variable annotations, and `satisfies` once each.

### Exercise 8: Create a Deeply Read-Only Object

Here we have a `routes` object:

```tsx
const routes = {
  "/": {
    component: "Home",
  },
  "/about": {
    component: "About",
    // @ts-expect-error // red squiggly line under @ts-expect-error
    search: "?foo=bar",
  },
};

// @ts-expect-error // red squiggly line under @ts-expect-error
routes["/"].component = "About";
```

When adding a `search` field under the `/about` key, it should raise an error, but it currently doesn't. We also expect that once the `routes` object is created, it should not be able to be modified. For example, assigning `About` to the `Home component` should cause an error, but the `@ts-expect-error` directive tells us there is no problem.

Inside of the tests we expect that accessing properties of the `routes` object should return `Home` and `About` instead of interpreting these as literals, but those are both currently failing:

```tsx
type tests = [
  Expect<Equal<(typeof routes)["/"]["component"], "Home">>, // red squiggly line under Equal<>
  Expect<Equal<(typeof routes)["/about"]["component"], "About">>, // red squiggly line under Equal<>
];
```

Your task is to update the `routes` object typing so that all errors are resolved. This will require you to use `satisfies` as well as another annotation that ensures the object is deeply read-only.

### Solution 1: Required vs. Unnecessary Annotations

#### Removing Function Annotations

The first annotation we can remove is the `splitFilename` annotation. The `split()` function returns an array of strings, so the type is inferred as an array of strings whether we annotate it or not.

The same is true for the `finalIndex` annotation. `splitFilename.length - 1` is always going to be a number, so the annotation is unnecessary.

The `extension` annotation can also be removed. Since we're doing an indexed access, the extension might be a string or it might be undefined. TypeScript can infer this without an annotation.

Similarly, in the case of logical comparators like the triple equals (`===`), the outcome will always be a boolean. This means we can remove the boolean annotation from `isSolution`.

The return type annotation is also unnecessary, because TypeScript recognizes that when evaluating `isProblem || isSolution`, a boolean variable will be returned.

The return type annotation could also be pruned while maintaining the correct inference. TypeScript recognizes that when evaluating `isProblem || isSolution`, a boolean variable will be returned, rendering the annotation needless.

The only annotation that needs to say in the `isProblemOrSolution` function is the one for the function parameter:

```typescript
const isProblemOrSolution = (filename: string) => {
  const splitFilename = filename.split(".");
  ...
```

We need this annotation because without it, TypeScript will give the "implicit `any`" error on the parameter, as well as an error on `filename.split()` inside of the function.

Remember, parameters should pretty much always be annotated.

#### Removing Variable Annotations

The `users` array is inferred as an array of objects with a `name` property even if we remove its annotation.:

```typescript
// removing the annotation from users:
const users = [
  {
    name: "Waqas",
  },
  {
    name: "Zain",
  },
];

// hovering over users shows:
const users: {
  name: string;
}[];
```

For the `usersWithIds` variable, we can remove the annotations because TypeScript is able to infer it from the return value of the `.map()` function:

```typescript
const usersWithIds = users.map((user, index) => ({
  ...user,
  id: index,
}));
```

This now looks like regular JavaScript code, but our test passes as expected.

Type annotations serve to guide the TypeScript interpreter. However, properly utilizing inference system can remove the need for most annotations.

The big takeaway is to annotate with intention. You should provide annotations when necessary, and avoid them when TypeScript can figure things out on its own.

### Solution 2: Provide Additional Info to TypeScript

The error we encountered in this challenge was that the `EventTarget | null` type was incompatible with the required parameter of type `HTMLFormElement`. The problem stems from the fact that these types don't match, and `null` is not permitted:

```typescript
const data = new FormData(e.target); // red squiggly line under e.target

// hovering over e.target shows:
Argument of type 'EventTarget | null' is not assignable to parameter of type 'HTMLFormElement | undefined'.
Type 'null' is not assignable to type 'HTMLFormElement | undefined'.
```

First and foremost, it's necessary to ensure `e.target` is not null.

#### Using `as`

We can use the `as` keyword to recast `e.target` to a specific type.

However, if we recast it as `EventTarget`, an error will continue to occur:

```typescript
const data = new FormData(e.target as EventTarget); // red squiggly line under `e.target as EventTarget`
```

The error message states that the argument of type `EventTarget` is not assignable to the parameter of type `HTMLFormElement`:

```typescript
// hovering over e.target shows:
Argument of type 'EventTarget' is not assignable to parameter of type 'HTMLFormElement'.
```

Since we know that the code works at runtime and has tests covering it, we can force `e.target` to be of type `HTMLFormElement`:

```typescript
const data = new FormData(e.target as HTMLFormElement);
```

Optionally, we can create a new variable, `target`, and assign the casted value to it:

```typescript
const target = e.target as HTMLFormElement;
const data = new FormData(target);
```

Either way, this change resolves the error and `target` is now inferred as an `HTMLFormElement` and the code functions as expected.

#### Using `as any`

A quicker solution would be to use `as any` for the `e.target` variable, to tell TypeScript that we don't care about the type of the variable:

```typescript
const data = new FormData(e.target as any);
```

While using `as any` can get us past the error message more quickly, it does have its drawbacks.

For example, we wouldn't be able to leverage autocompletion or have type checking for other `e.target` properties that would come from the `HTMLFormElement` type.

When faced with a situation like this, it's better to use the most specific `as` assertion you can. This communicates that you have a clear understanding of what `e.target` is not only to TypeScript, but to other developers who might read your code.

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

### Solution 4: Solving Issues with Assertion

Inside the `findUsersByName` function, TypeScript is complaining about `searchParams.name` because it thinks we could be modifying it back to `undefined` inside the `filter` callback. This is why we were previously able to solve this problem by extracting `searchParams.name` into a constant variable and performing the check against that.

However, this time we will solve it differently.

Currently, `searchParams.name` is typed as `string | undefined`. We want to tell TypeScript that we know more than it does, and that we know that `searchParams.name` will never be `undefined` inside the `filter` callback.

```typescript
// inside findUsersByName function

if (searchParams.name) {
  return users.filter((user) => user.name.includes(searchParams.name)); // red squiggly line under searchParams.name
}
```

#### Adding `as string`

One way to solve this is to add `as string` to `searchParams.name`:

```typescript
// inside findUsersByName function
return users.filter((user) => user.name.includes(searchParams.name as string));
```

This removes `undefined` and it's now just a `string`.

#### Adding a Non-null Assertion

Another way to solve this is to add a non-null assertion to `searchParams.name`. This is done by adding a `!` postfix operator to the property we are trying to access:

```typescript
// inside findUsersByName function
return users.filter((user) => user.name.includes(searchParams.name!));
```

The `!` operater tells TypeScript to remove any `null` or `undefined` types from the variable. This would leave us with just `string`.

### Solution 5: Improving Type Annotations with `satisfies`

When starting on this challenge, you might have observed something interesting.

Removing the `Record` annotation from `config` led to all of the errors disappearing:

```tsx
type Color =
  | string
  | {
      r: number;
      g: number;
      b: number;
    };
const config = {
  foreground: { r: 255, g: 255, b: 255 },
  background: { r: 0, g: 0, b: 0 },
  border: "transparent",
};
```

This works because without an explicit annotation, TypeScript infers the value of `config` to be the value that's assigned to it. In turn, this allows access to all properties and methods using autocomplete.

However, this raises a problem when `config` is required to meet a specific criteria but still be inferred as what's passed to it.

Instead of annotating `config` as `Record<string, Color>`, we can use the `satisfies` operator to specify that `config` needs to satisfy the `Record<string, Color>` type constraint:

```typescript
const config = {
  foreground: { r: 255, g: 255, b: 255 },
  background: { r: 0, g: 0, b: 0 },
  border: "transparent",
} satisfies Record<string, Color>;
```

With this change, errors will appearing as required, ensuring that the value in `config` meets the necessary conditions.

The `satisfies` operator is great for declaring configuration objects.

### Solution 6: Enforcing Valid Configuration

The first step is to determine the structure of our `configurations` object.

In this case, it makes sense for it to be a `Record` where the keys will be `string` and the values will be an object with `apiBaseUrl` and `timeout` properties.

```typescript
const configurations: Record<
  string,
  {
    apiBaseUrl: string;
    timeout: number
  }
> = {
  ...
```

This change makes the `@ts-expect-error` directive work as expected, but we now have an error related to the `Environment` type not being inferred correctly:

```typescript
type Environment = keyof typeof configurations;

// hovering over Environment shows:
// type Environment = string

// The test now fails:
type test = Expect<
  Equal<Environment, "development" | "production" | "staging"> // red squiggly line under Equal<>
```

We need to make sure that `configurations` is still being inferred as its type, while also type checking the thing being passed to it.

This is the perfect application for the `satisfies` keyword.

Instead of annotating the `configurations` object as a `Record`, we'll instead use the `satisfies` keyword for the type constraint:

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
    // @ts-expect-error
    notAllowed: true,
  },
} satisfies Record<
  string,
  {
    apiBaseUrl: string;
    timeout: number;
  }
>;
```

This allows us to specify that the values we pass to our configuration object must adhere to the criteria defined in the type, while still allowing the type system to infer the correct types for our development, production, and staging environments.

### Solution 7: Variable Annotation vs. `as` vs. `satisfies`

Let's work through the solutions for `satisfies`, `as`, and variable annotations.

#### When to Use `satifies`

For the first scenario that uses a `Record`, the `satisfies` keyword won't work because we can't add dynamic members to an empty object.

```typescript
const obj = {} satisfies Record<string, number>;

obj.a = 1; // red squiggly line under `a`

// Hovering over `a` shows:
Property 'a' does not exist on type '{}'.
```

In the second scenario with the `menuConfig` object, we started with errors about `menuConfig.home` and `menuConfig.services` not existing on both members.

This is a clue that we need to use `satisfies` to make sure a value is checked without changing the inference:

```typescript
const menuConfig = {
  home: {
    label: "Home",
    link: "/home",
  },
  services: {
    label: "Services",
    children: [
      {
        label: "Consulting",
        link: "/services/consulting",
      },
      {
        label: "Development",
        link: "/services/development",
      },
    ],
  },
} satisfies Record<
  string,
  | {
      label: string;
      link: string;
    }
  | {
      label: string;
      children: {
        label: string;
        link: string;
      }[];
    }
>;
```

With this use of `satisfies`, the tests pass as expected.

Just to check the third scenario, `satisfies` doesn't work with `document.getElementById("app")` because it's inferred as `HTMLElement | null`:

```typescript
const element = document.getElementById("app") satisfies HTMLElement; // red squiggly line under `satisfies`

Type 'HTMLElement | null' does not satisfy the expected type 'HTMLElement'.
  Type 'null' is not assignable to type 'HTMLElement'.
```

#### When to Use `as`

If we try to use variable annotation in the third example, we get the same error as with `satisfies`:

```typescript
const element: HTMLElement = document.getElementById("app"); // red squiggly line under element

// Hovering over element shows:
Type 'HTMLElement | null' is not assignable to type 'HTMLElement'.
  Type 'null' is not assignable to type 'HTMLElement'.
```

By process of elimination, `as` is the correct choice for this scenario:

```typescript
const element = document.getElementById("app") as HTMLElement;
```

With this change, `element` is inferred as `HTMLElement`.

#### Using Variable Annotations

This takes us to the first scenario, where using variable annotations is the correct choice:

```typescript
const obj: Record<string, number> = {};
```

Note that we could use `as` here, but it's less safe and may lead to complications as we're forcing a value to be of a certain type. A variable annotation simply denotes a variable as that certain type and checks anything that's passed to it, which is the more correct, safer approach.

Generally when you do have a choice between `as` or a variable annotation, opt for the variable annotation.

#### The Big Takeaway

The key takeaway in this exercise is to grasp the mental model for when to use `as`, `satisfies`, and variable annotations:

Use `as` when you want to tell TypeScript that you know more than it does.

Use `satisfies` when you want to make sure a value is checked without changing the inference on that value.

The rest of the time, use variable annotations.

### Solution 8: Create a Deeply Read-Only Object

We started with an `@ts-expect-error` directive inside of `routes` that was not working as expected.

Because we wanted a configuration object to be in a certain shape while still being able to access certain pieces of it, this was a perfect use case for `satisfies`.

At the end of the `routes` object, add a `satisfies` that will be a `Record` of `string` and an object with a `component` property that is a `string`:

```tsx
const routes = {
  "/": {
    component: "Home",
  },
  "/about": {
    component: "About",
    // @ts-expect-error
    search: "?foo=bar",
  },
} satisfies Record<
  string,
  {
    component: string;
  }
>;
```

This change solves the issue of the `@ts-expect-error` directive inside of the `routes` object, but we still have an error related to the `routes` object not being read-only.

To address this, we need to apply `as const` to the `routes` object. This will make `routes` read-only and add the necessary immutability.

If we try adding `as const` after the `satisfies`, we'll get the following error:

```typescript
A 'const' assertion can only be applied to references to enum members, or string, number, boolean, array, or object literals.
```

In other words, `as const` can only be applied to a value and not a type.

The correct way to use `as const` is to put it before the `satisfies`:

```tsx
const routes = {
  // routes as before
} as const satisfies Record<
  string,
  {
    component: string;
  }
>;
```

Now our tests pass expected.

This setup of combining `as const` and `satisfies` is ideal when you need a particular shape for a configuration object and want while enforcing immutability.
