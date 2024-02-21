# 04. Essential Types and Annotations

Now we've covered most of the why of TypeScript, it's time to start with the how. We'll cover key concepts like type annotations and type inference, as well as how to start writing type-safe functions.

It's important to build a solid foundation, as everything you'll learn later builds upon what you'll learn in this chapter.

## Basic Annotations

One of the most common things you'll need to do as a TypeScript developer is to annotate your code. Annotations tell TypeScript what type something is supposed to be.

Annotations will often use a `:` - this is used to tell TypeScript that a variable or function parameter is of a certain type.

### Function Parameter Annotations

One of the most important annotations you'll use is for function parameters.

For example, here is a `logAlbumInfo` function that takes in a `title` string, a `trackCount` number, and an `isReleased` boolean:

```typescript
const logAlbumInfo = (
  title: string,

  trackCount: number,

  isReleased: boolean,
) => {
  // implementation
};
```

Each parameter's type annotation enables TypeScript to check that the arguments passed to the function are of the correct type. If the type doesn't match up, TypeScript will show a squiggly red line under the offending argument.

```typescript
logAlbumInfo("Black Gold", false, 15); // red squiggly lines first under `false`, then under `15`
```

In the example above, we would first get an error under `false` because a boolean isn't assignable to a number.

```typescript
logAlbumInfo("Black Gold", 20, 15);
```

After fixing that, we would have an error under `15` because a number isn't assignable to a boolean.

### Variable Annotations

As well as function parameters, you can also annotate variables.

Here's an example of some variables, with their associated types.

```typescript
let albumTitle: string = "Midnights";
let isReleased: boolean = true;
let trackCount: number = 13;
```

Notice how each variable name is followed by a `:` and its primitive type before its value is set.

Variable annotations are used to explicitly tell TypeScript what we expect the types of our variables to be.

Once a variable has been declared with a specific type annotation, TypeScript will ensure the variable remains compatible with the type you specified.

For example, this reassignment would work:

```typescript
let albumTitle: string = "Midnights";

albumTitle = "1989";
```

But this one would show an error:

```typescript
let isReleased: boolean = true;

isReleased = "yes"; // red squiggly line under `isReleased`
```

TypeScript's static type checking is able to spot errors at compile time, which is happening behind the scenes as you write your code.

In the case of the `isReleased` example above, the error message reads:

```txt
Type 'string' is not assignable to type 'boolean'.
```

In other words, TypeScript is telling us that it expects `isReleased` to be a boolean, but instead received a `string`.

It's nice to be warned about these kinds of errors before we even run our code!

### The Basic Types

TypeScript has a number of basic types that you can use to annotate your code. Here are a few of the most common ones:

```typescript
let example1: string = "Hello World!";
let example2: number = 42;
let example3: boolean = true;
let example4: symbol = Symbol();
let example5: bigint = 123n;
let example6: null = null;
let example7: undefined = undefined;
```

Each of these types is used to tell TypeScript what type a variable or function parameter is supposed to be.

You can express much more complex types in TypeScript: arrays, objects, functions and much more. We'll cover these in later chapters.

### Type Inference

TypeScript gives you the ability to annotate almost any value, variable or function in your code. You might be thinking “wait, do I need to annotate everything? That's a lot of extra code.”

As it turns out, TypeScript can infer a lot from the context that your code is run.

#### Variables Don't Always Need Annotations

Let's look again at our variable annotation example, but drop the annotations:

```typescript
let albumTitle = "Midnights";
let isReleased = true;
let trackCount = 13;
```

We didn't add the annotations, but TypeScript isn't complaining. What's going on?

Try hovering your cursor over each variable.

```typescript
// hovering over each variable name

let albumTitle: string;
let isReleased: boolean;
let trackCount: number;
```

Even though they aren't annotated, TypeScript is still picking up the type that they're each supposed to be. This is TypeScript inferring the type of the variable from usage.

It behaves as if we'd annotated it, warning us if we try to assign it a different type from what it was assigned originally:

```typescript
let isReleased = true;

// Type 'string' is not assignable to type 'boolean'.(2322)

isReleased = "yes"; // red line under isReleased
```

And also giving us autocomplete on the variable:

```typescript
albumTitle.toUpper; // shows `toUpperCase` in autocomplete
```

This is an extremely powerful part of TypeScript. It means that you can mostly _not_ annotate variables and still have your IDE know what type things are.

#### Function Parameters Always Need Annotations

But type inference can't work everywhere. Let's see what happens if we remove the type annotations from the `logAlbumInfo` function's parameters:

```typescript
const logAlbumInfo = (
  title, // error: Parameter 'title' implicitly has an 'any' type.
  trackCount, // error: Parameter 'trackCount' implicitly has an 'any' type.
  isReleased, // error: Parameter 'isReleased' implicitly has an 'any' type.
) => {
  // rest of function body
};
```

On its own, TypeScript isn't able to infer the types of the parameters, so it shows an error under each parameter name:

```txt
// hovering over `title`

Parameter 'title' implicitly has an 'any' type.
```

This is because functions are very different to variables. TypeScript can see what value is assigned to which variable, so it can make a good guess about the type.

But TypeScript can't tell from a function parameter alone what type it's supposed to be. When you don't annotate it, it defaults the type to `any` - a scary, unsafe type.

It also can't detect it from usage. If we had an 'add' function that took two parameters, TypeScript wouldn't be able to tell that they were supposed to be numbers:

```typescript
function add(a, b) {
  return a + b;
}
```

`a` and `b` could be strings, booleans, or anything else. TypeScript can't know from the function body what type they're supposed to be.

So, when you're declaring a named function, their parameters always need annotations in TypeScript.

<!-- TODO - maybe add a caveat to talk about anonymous functions -->

### The `any` Type

The error we encountered in the 'Function Parameters Always Need Annotations' section was pretty scary:

```
Parameter 'title' implicitly has an 'any' type.
```

When TypeScript doesn't know what type something is, it assigns it the `any` type.

This type breaks TypeScript's type system. It turns off type safety on the thing it's assigned to.

This means that anything can be assigned to it, any property on it can be accessed/assigned to, and it can be called like a function.

```typescript
let anyVariable: any = "This can be anything!";

anyVariable(); // no error

anyVariable.deep.property.access; // no error
```

The code above will error at runtime, but TypeScript isn't giving us a warning!

So, using `any` can be used to turn off errors in TypeScript. It can be a useful escape hatch for when a type is too complex to describe.

But over-using `any` defeats the purpose of using TypeScript, so it's best to avoid using it whenever possible– whether implicitly or explicitly.

### Exercises

#### Exercise 1: Basic Types with Function Parameters

Let's start with an `add` function which takes two boolean parameters `a` and `b` and returns `a + b`:

```tsx
export const add = (a: boolean, b: boolean) => {
  return a + b; // red squiggly line under a + b
};
```

A `result` variable is created by calling the `add` function. The `result` variable is then checked to see if it is equal to a `number`:

```typescript
const result = add(1, 2); // red squiggly line under `1``

type test = Expect<Equal<typeof result, number>>; // red squiggly line under `Equal` through `number`
```

<!-- TODO - explain the Expect<Equal<>> syntax -->

Currently, there are a few errors in the code that are marked by red squiggly lines.

The first is on the `return` line of the `add` function, where we have `a + b`:

```
Operator '+' cannot be applied to types 'boolean' and 'boolean'
```

There's also an error below the `1` argument in the `add` function call:

```
Argument of type 'number' is not assignable to parameter of type 'boolean'
```

Finally, we can see that our `test` result has an error because the `result` is currently typed as `any`, which is not equal to `number`.

Your challenge is to consider how we can change the types to make the errors go away, and to ensure that `result` is a `number`. You can hover over `result` to check it.

#### Exercise 2: Annotating Empty Parameters

Here we have a `concatTwoStrings` function that is similar in shape to the `add` function. It takes two parameters, `a` and `b`, and returns a string.

```typescript
const concatTwoStrings = (a, b) => {
  // red squiggly lines under `a` and `b`

  return [a, b].join(" ");
};
```

There are currently errors on the `a` and `b` parameters, which have not been annotated with types:

```
Parameter 'a' implicitly has an 'any' type.

Parameter 'b' implicitly has an 'any' type.
```

The `result` of calling `concatTwoStrings` with `"Hello"` and `"World"` and checking if it is a `string` does not show any errors:

```typescript
const result = concatTwoStrings("Hello", "World");

type test = Expect<Equal<typeof result, string>>;
```

Your job is to add some function paramater annotations to the `concatTwoStrings` function to make the errors go away.

#### Exercise 3: The Basic Types

As we've seen, TypeScript will show errors when types don't match.

This set of examples shows us the basic types that TypeScript gives us to describe JavaScript:

```typescript
export let example1: string = "Hello World!";
export let example2: string = 42; // red squiggly line under `example2`
export let example3: string = true; // red squiggly line under `example3`
export let example4: string = Symbol(); // red squiggly line under `example4`
export let example5: string = 123n; // red squiggly line under `example5`
```

Note that the colon `:` is used to annotate the type of each variable, just like it was for typing the function parameters.

You'll also notice there are several errors.

Hovering over each of the underlined variables will display any associated error messages.

For example, hovering over `example2` will show:

```
Type 'number' is not assignable to type 'string'.
```

The type error for `example3` tells us:

```
Type 'boolean' is not assignable to type 'string'.
```

Change the types of the annotations on each variable to make the errors go away.

#### Exercise 4: The `any` Type

Here is a function called `handleFormData` that accepts an `e` typed as `any`. The function prevents the default form submission behavior, then creates an object from the form data and returns it:

```typescript
const handleFormData = (e: any) => {
  e.preventDefault();

  const data = new FormData(e.terget);

  const value = Object.fromEntries(data.entries());

  return value;
};
```

Here is a test for the function that creates a form, sets the `innerHTML` to add an input, and then manually submits the form. When it submits, we expect the value to equal the value that was in our form that we grafted in there:

```tsx
it("Should handle a form submit", () => {
  const form = document.createElement("form");

  form.innerHTML = `
<input name="name" value="John Doe" />
`;

  form.onsubmit = (e) => {
    const value = handleFormData(e);

    expect(value).toEqual({ name: "John Doe" });
  };

  form.requestSubmit();

  expect.assertions(1);
});
```

Note that this isn't the normal way you would test a form, but it provides a way to test the example `handleFormData` function more extensively.

In the code's current state, there are no red squiggly lines present.

However, when running the test with Vitest we get an error similar to the following:

```
This error originated in "any.problem.ts" test file. It doesn't mean the error was thrown inside the file itself, but while it was running.

The latest test that might've caused the error is "Should handle a form submit". It might mean one of the following:

- The error was thrown, while Vitest was running this test.

- This was the last recorded test before the error was thrown, if error originated after test finished its execution.
```

Why is this error happening? Why isn't TypeScript giving us an error here?

I'll give you a clue. I've hidden a nasty typo in there. Can you fix it?

#### Solution 1: Basic Types with Function Parameters

Common sense tells us that the `boolean`s in the `add` function should be replaced with some sort of `number` type.

If you are coming from another language, you might be tempted to try using `int` or `float`, but TypeScript only has the `number` type:

```typescript
function add(a: number, b: number) {
  return a + b;
}
```

Making this change resolves the errors, and also gives us some other bonuses.

If we try calling the `add` function with a string instead of a number, we'd get an error that type `string` is not assignable to type `number`:

```typescript
add("something", 2); // red squiggly line under `"something"`
```

Not only that, but the result of our function is now inferred for us:

```typescript
const result = add(1, 2); // result is a number!
```

So TypeScript can not only infer variables, but also the return types of functions.

#### Solution 2: Annotating Empty Parameters

As we know, function parameters always need annotations in TypeScript.

So, let's update the function declaration parameters so that `a` and `b` are both specified as `string`:

```typescript
const concatTwoStrings = (a: string, b: string) => {
  return [a, b].join(" ");
};
```

This change fixes the errors.

For a bonus point, what type will the return type be inferred as?

```typescript
const result = concatTwoStrings("Hello", "World"); // result is a string!
```

#### Solution 3: Updating Basic Types

Each of the examples represents the TypeScript's basic types, and would be annotated as follows:

```typescript
let example1: string = "Hello World!";
let example2: number = 42;
let example3: boolean = true;
let example4: symbol = Symbol();
let example5: bigint = 123n;
```

We've already seen `string`, `number`, and `boolean`. The `symbol` type is used for `Symbol`s which are used to ensure property keys are unique. The `bigint` type is used for numbers that are too large for the `number` type.

However, in practice you mostly won't annotate variables like this. If we remove the explicit type annotations, there won't be any errors at all:

```typescript
let example1 = "Hello World!";
let example2 = 42;
let example3 = true;
let example4 = Symbol();
let example5 = 123n;
```

These basic types are very useful to know, even if you don't always need them for your variable declarations.

#### Solution 4: The `any` Type

In this case, using `any` did not help us at all. In fact, `any` annotations seem to actually turn off type checking!

With the `any` type, we're free to do anything we want to the variable, and TypeScript will not prevent it.

Using `any` also disables useful features like autocompletion, which can help you avoid typos.

That's right-- the error in the above code was caused by a typo of `e.terget` instead of `e.target` when creating the `FormData`!

```typescript
const handleFormData = (e: any) => {
  e.preventDefault();

  const data = new FormData(e.terget); // e.terget! Whoops!

  const value = Object.fromEntries(data.entries());

  return value;
};
```

If `e` had been properly typed, this error would have been caught by TypeScript right away. We'll come back to this example in the future to see the proper typing.

Using `any` may seem like a quick fix when you have trouble figuring out how to properly type something, but it can come back to bite you later.

## Object Literal Types

Now that we've done some exploration with basic types, let's move on to object types.

Object types are used to describe the shape of objects. Each property of an object can have its own type annotation.

When defining an object type, we use curly braces to contain the properties and their types:

```typescript
const talkToAnimal = (animal: { name: string; type: string; age: number }) => {
  // rest of function body
};
```

This curly braces syntax is called an object literal type.

### Optional Object Properties

We can use `?` operator to mark the `age` property as optional:

```typescript
const talkToAnimal = (animal: { name: string; type: string; age?: number }) => {
  // rest of function body
};
```

One cool thing about type annotations with object literals is that they provide auto-completion for the property names while you're typing.

For instance, when calling `talkToAnimal`, it will provide you with an auto-complete dropdown with suggestions for the `name`, `type`, and `age` properties.

This feature can save you a lot of time, and also helps to avoid typos in a situation when you have several properties with similar names.

### Exercises

#### Exercise 1: Object Literal Types

Here we have a `concatName` function that accepts a `user` object with `first` and `last` keys:

```typescript
const concatName = (user) => {
  // squiggly line under `user`

  return `${user.first} ${user.last}`;
};
```

The test expects that the full name should be returned, and it is passing:

```typescript
it("should return the full name", () => {
  const result = concatName({
    first: "John",
    last: "Doe",
  });

  type test = Expect<Equal<typeof result, string>>;

  expect(result).toEqual("John Doe");
});
```

However, there is a familiar error on the `user` parameter in the `concatName` function:

```
Parameter 'user' implicitly has an 'any' type.
```

We can tell from the `concatName` function body that it expects `user.first` and `user.last` to be strings.

How could we type the `user` parameter to ensure that it has these properties and that they are of the correct type?

#### Exercise 2: Optional Property Types

Here's a version of the `concatName` function that has been updated to return just the first name if a last name wasn't provided:

```typescript
const concatName = (user: { first: string; last: string }) => {
  if (!user.last) {
    return user.first;
  }

  return `${user.first} ${user.last}`;
};
```

Like before, TypeScript gives us an error when testing that the function returns only the first name when no last name is provided passes:

```typescript
it("should only return the first name if last name not provided", () => {
  const result = concatName({
    first: "John",
  }); // red squiggly line under `{first: "John"}`

  type test = Expect<Equal<typeof result, string>>;

  expect(result).toEqual("John");
});
```

This time the entire `{first: "John"}` object is underlined in red, and the error message reads:

```
Argument of type '{ first: string; }' is not assignable to parameter of type '{ first: string; last: string; }'.
Property 'last' is missing in type '{ first: string; }' but required in type '{ first: string; last: string; }'.
```

The error tells us that we are missing a property, but the error is incorrect. We _do_ want to support objects that only include a `first` property. In other words, `last` needs to be optional.

How would you update this function to fix the errors?

#### Solution 1: Object Literal Types

In order to annotate the `user` parameter as an object, we can use the curly brace syntax `{}`.

Let's start by annotating the `user` parameter as an empty object:

```typescript
const concatName = (user: {}) => {
  return `${user.first} ${user.last}`; // red squiggly line under `.first` and `.last`
};
```

The errors change. This is progress, of a kind. The errors now show up under `.first` and `.last` in the function return.

```
Property 'first' does not exist on type '{}'.
Property 'last' does not exist on type '{}'.
```

In order to fix these errors, we need to add the `first` and `last` properties to the type annotation.

```typescript
const concatName = (user: { first: string; last: string }) => {
  return `${user.first} ${user.last}`;
};
```

Now TypeScript knows that both the `first` and `last` properties of `user` are strings, and the test passes.

#### Solution 2: Optional Property Types

Similar to when we set a function parameter as optional, we can use the `?` to specify that an object's property is optional.

As seen in a previous exercise, we can add a question mark to function parameters to make them optional:

```typescript
function concatName(user: { first: string; last?: string }) {
  // implementation
}
```

Adding `?:` indicates to TypeScript that the property doesn't need to be present.

If we hover over the `last` property inside of the function body, we'll see that the `last` property is `string | undefined`:

```
// hovering over `user.last`

(property) last?: string | undefined
```

This means it's `string` OR `undefined`. This is a useful feature of TypeScript that we'll see more of in the future.

## Type Aliases

So far, we've been declaring all of our types inline. This is fine for these simple examples, but in a real application we're going to have types which repeat a lot across our app.

These might be users, products, or other domain-specific types. We don't want to have to repeat the same type definition in every file that needs it.

This is where the `type` keyword comes in. It allows us to define a type once and use it in multiple places.

```typescript
type Animal = {
  name: string;
  type: string;
  age?: number;
};
```

This is what's called a type alias. It's a way to give a name to a type, and then use that name wherever we need to use that type.

To create a new variable with the `Animal` type, we'll add it as a type annotation after the variable name:

```typescript
let pet: Animal = {
  name: "Karma",
  type: "cat",
};
```

We can also use the `Animal` type alias in place of the object type annotation in a function:

```typescript
const getAnimalDescription = (animal: Animal) => {};
```

And call the function with our `pet` variable:

```typescript
const desc = getAnimalDescription(pet);
```

Type aliases can be objects, but they can also use basic types:

```typescript
type Id = string | number;
```

We'll look at this syntax later, but it's basically saying that an `Id` can be either a `string` or a `number`.

Using a type alias is a great way to ensure there's a single source of truth for a type definition, which makes it easier to make changes in the future.

### Sharing Types Across Modules

Type aliases can be created in their own `.ts` files and imported into the files where you need them. This is useful when sharing types in multiple places, or when a type definition gets too large:

```typescript
// In shared-types.ts

export type Animal = {
  width: number;
  height: number;
};

// In index.ts

import { Animal } from "./shared-types";
```

As a convention, you can even create your own `.types.ts` files. This can help to keep your type definitions separate from your other code.

### Exercises

#### Exercise 1: The `type` Keyword

Here's some code that uses the same type in multiple places:

```typescript
const getRectangleArea = (rectangle: { width: number; height: number }) => {
  return rectangle.width * rectangle.height;
};

const getRectanglePerimeter = (rectangle: {
  width: number;
  height: number;
}) => {
  return 2 * (rectangle.width + rectangle.height);
};
```

The `getRectangleArea` and `getRectanglePerimeter` functions both take in a `rectangle` object with `width` and `height` properties.

Tests for each function pass as expected:

```typescript
it("should return the area of a rectangle", () => {
  const result = getRectangleArea({
    width: 10,
    height: 20,
  });

  type test = Expect<Equal<typeof result, number>>;

  expect(result).toEqual(200);
});

it("should return the perimeter of a rectangle", () => {
  const result = getRectanglePerimeter({
    width: 10,
    height: 20,
  });

  type test = Expect<Equal<typeof result, number>>;

  expect(result).toEqual(60);
});
```

Even though everything is working as expected, there's an opportunity for refactoring to clean things up.

How could you use the `type` keyword to make this code more readable?

#### Solution 1: The `type` Keyword

You can use the `type` keyword to create a `Rectangle` type with `width` and `height` properties:

```typescript
type Rectangle = {
  width: number;
  height: number;
};
```

With the type alias created, we can update the `getRectangleArea` and `getRectanglePerimeter` functions to use the `Rectangle` type:

```typescript
const getRectangleArea = (rectangle: Rectangle) => {
  return rectangle.width * rectangle.height;
};

const getRectanglePerimeter = (rectangle: Rectangle) => {
  return 2 * (rectangle.width + rectangle.height);
};
```

This makes the code a lot more concise, and gives us a single source of truth for the `Rectangle` type.

## Arrays and Tuples

### Arrays

You can also describe the types of arrays in TypeScript. There are two different syntaxes for doing this.

The first option is the square bracket syntax. This syntax is similar to the type annotations we've made so far, but with the addition of two square brackets at the end to indicate an array.

```typescript
let albums: string[] = [
  "Rubber Soul",
  "Revolver",
  "Sgt. Pepper's Lonely Hearts Club Band",
];

let dates: number[] = [1965, 1966, 1967];
```

The second option is to explicitly use the `Array` type with angle brackets containing the type of data the array will hold:

```typescript
let albums: Array<string> = [
  "Rubber Soul",
  "Revolver",
  "Sgt. Pepper's Lonely Hearts Club Band",
];
```

Both of these syntaxes are equivalent, but the square bracket syntax is a bit more concise when creating arrays. It's also the way that TypeScript presents error messages. Keep the angle bracket syntax in mind, though– we'll see more examples of it later on.

#### Arrays Of Objects

When specifying an array's type, you can use any built-in types, inline types, or type aliases:

```typescript
type Album = {
  artist: string;
  title: string;
  year: number;
};

let selectedDiscography: Album[] = [
  {
    artist: "The Beatles",
    title: "Rubber Soul",
    year: 1965,
  },
  {
    artist: "The Beatles",
    title: "Revolver",
    year: 1966,
  },
];
```

And if you try to update the array with an item that doesn't match the type, TypeScript will give you an error:

```typescript
selectedDiscography.push({name: "Karma", type: "cat"};) // red squiggly line under `name`
// error message:
// Argument of type '{ name: string; type: string; }' is not assignable to parameter of type 'Album'.
```

### Tuples

Tuples let you specify an array with a fixed number of elements, where each element has its own type.

Creating a tuple is similar to an array's square bracket syntax - except the square brackets contain the types instead of abutting the variable name:

```typescript
// Tuple
let album: [string, number] = ["Rubber Soul", 1965];

// Array
let albums: string[] = [
  "Rubber Soul",
  "Revolver",
  "Sgt. Pepper's Lonely Hearts Club Band",
];
```

Tuples are useful for grouping related information together without having to create a new type.

For example, if we wanted to group an album with its play count, we could do something like this:

```typescript
let albumWithPlayCount: [Album, number] = [
  {
    artist: "The Beatles",
    title: "Revolver",
    year: 1965,
  },
  10000,
];
```

#### Named Tuples

To add more clarity to the tuple, names for each of the types can be added inside of the square brackets:

```typescript
type MyTuple = [album: Album, playCount: number];
```

This can be helpful when you have a tuple with a lot of elements, or when you want to make the code more readable.

### Exercises

#### Exercise 1: Array Type

Consider the following shopping cart code:

```typescript
type ShoppingCart = {
  userId: string;
};

const processCart = (cart: ShoppingCart) => {
  // Do something with the cart in here
};

processCart({
  userId: "user123",
  items: ["item1", "item2", "item3"], // squiggly line under `items`
});
```

We have a type alias for `ShoppingCart` that currently has a `userId` property of type `string`.

The `processCart` function takes in a `cart` parameter of type `ShoppingCart`. Its implementation doesn't matter at this point.

What does matter is that when we call `processCart`, we are passing in an object with a `userId` and an `items` property that is an array of strings.

There is an error underneath `items` that reads:

```
Argument of type '{ userId: string; items: string[]; }' is not assignable to parameter of type 'ShoppingCart'.

Object literal may only specify known properties, and 'items' does not exist in type 'ShoppingCart'.
```

As the error message points out, there is not currently a property called `items` on the `ShoppingCart` type.

How would you fix this error?

#### Exercise 2: Arrays of Objects

Consider this `processRecipe` function which takes in a `Recipe` type:

```typescript
type Recipe = {
  title: string;
  instructions: string;
};

const processRecipe = (recipe: Recipe) => {
  // Do something with the recipe in here
};

processRecipe({
  title: "Chocolate Chip Cookies",
  ingredients: [
    { name: "Flour", quantity: "2 cups" },
    { name: "Sugar", quantity: "1 cup" },
  ],
  instructions: "...",
});
```

The function is called with an object containing `title`, `instructions`, and `ingredients` properties, but there are currently errors because the `Recipe` type doesn't currently have an `ingredients` property:

```
Argument of type '{title: string; ingredients: { name: string; quantity: string; }[]; instructions: string; }' is not assignable to parameter of type 'Recipe'.

Object literal may only specify known properties, and 'ingredients' does not exist in type 'Recipe'.
```

By combining what you've seen with typing object properties and working with arrays, how would you specify ingredients for the `Recipe` type?

#### Exercise 3: Tuples

Here we have a `setRange` function that takes in an array of numbers:

```typescript
const setRange = (range: Array<number>) => {
  const x = range[0];
  const y = range[1];

  // Do something with x and y in here
  // x and y should both be numbers!

  type tests = [
    Expect<Equal<typeof x, number>>, // red squiggly line under Equal<> statement
    Expect<Equal<typeof y, number>>, // red squiggly line under Equal<> statement
  ];
};
```

Inside the function, we grab the first element of the array and assign it to `x`, and we grab the second element of the array and assign it to `y`.

There are two tests inside the `setRange` function that are currently failing.

Using the `// @ts-expect-error` directive, we find there are a couple more errors that need fixing. Recall that this directive tells TypeScript we know there will be an error on the next line, so ignore it. However, if we say we expect an error but there isn't one, we will get the red squiggly lines on the actual `//@ts-expect-error` line.

```typescript
// both of these show red squiggly lines under the ts-expect-error directive

// @ts-expect-error too few arguments
setRange([0]);

// @ts-expect-error too many arguments
setRange([0, 10, 20]);
```

The code for the `setRange` function needs an updated type annotation to specify that it only accepts a tuple of two numbers.

#### Exercise 4: Optional Members of Tuples

This `goToLocation` function takes in an array of coordinates. Each coordinate has a `latitude` and `longitude`, which are both numbers, as well as an optional `elevation` which is also a number:

```typescript
const goToLocation = (coordinates: Array<number>) => {
  const latitude = coordinates[0];
  const longitude = coordinates[1];
  const elevation = coordinates[2];

  // Do something with latitude, longitude, and elevation in here

  type tests = [
    Expect<Equal<typeof latitude, number>>, // red squiggly line under Equal<> statement
    Expect<Equal<typeof longitude, number>>, // red squiggly line under Equal<> statement
    Expect<Equal<typeof elevation, number | undefined>>,
  ];
};
```

Your challenge is to update the type annotation for the `coordinates` parameter to specify that it should be a tuple of three numbers, where the third number is optional.

#### Solution 1: Array Type

For the `ShoppingCart` example, defining an array of `item` strings would looks like this when using the square bracket syntax:

```typescript
type ShoppingCart = {
  userId: string;
  items: string[];
};
```

With this in place, we must pass in `items` as an array. A single string or other type would result in a type error.

The other syntax is to explicitly write `Array` and pass it a type inside the angle brackets:

```typescript
type ShoppingCart = {
  userId: string;
  items: Array<string>;
};
```

#### Solution 2: Arrays of Objects

There are a few different ways to express an array of objects.

One approach would be to to create a new `Ingredient` type that we can use to represent the objects in the array:

```typescript
type Ingredient = {
  name: string;
  quantity: string;
};
```

Then the `Recipe` type can be updated to include an `ingredients` property of type `Ingredient[]`:

```typescript
type Recipe = {
  title: string;
  instructions: string;
  ingredients: Ingredient[];
};
```

This solution reads nicely, fixes the errors, and helps to create a mental map of our domain model.

As seen previously, using the `Array<Ingredient>` syntax would also work:

```typescript
type Recipe = {
  title: string;
  instructions: string;
  ingredients: Array<Ingredient>;
};
```

It's also possible to specify the `ingredients` property as an inline object literal on the `Recipe` type using the square brackets:

```typescript
type Recipe = {
  title: string;
  instructions: string;
  ingredients: {
    name: string;
    quantity: string;
  }[];
};
```

Or using `Array<>`:

```typescript
type Recipe = {
  title: string;
  instructions: string;
  ingredients: Array<{
    name: string;
    quantity: string;
  }>;
};
```

The inline approaches are useful, but I prefer extracting them out to a new type. This means that if another part of your application needs to use the `Ingredient` type, it can.

#### Solution 3: Tuples

In this case, we would update the `setRange` function to use the tuple syntax instead of the array syntax:

```typescript
const setRange = (range: [number, number]) => {
  // rest of function body
};
```

If you want to add more clarity to the tuple, you can add names for each of the types:

```typescript
const setRange = (range: [x: number, y: number]) => {
  // rest of function body
};
```

#### Solution 4: Optional Members of Tuples

A good start would be to change the `coordinates` parameter to a tuple of `[number, number, number | undefined]`:

```tsx
const goToLocation = (coordinates: [number, number, number | undefined]) => {};
```

The problem here is that while the third member of the tuple is able to be a number or `undefined`, the function still is expecting something to be passed in. It's not a good solution to have to pass in `undefined` manually.

Using a named tuple in combination with the optional operator `?` is a better solution:

```tsx
const goToLocation = (
  coordinates: [latitude: number, longitude: number, elevation?: number],
) => {};
```

The values are clear, and using the `?` operator specifies the `elevation` is an optional number. It almost looks like an object, but it's still a tuple.

Alternatively, if you don't want to use named tuples, you can use the `?` operator after the definition:

```tsx
const goToLocation = (coordinates: [number, number, number?]) => {};
```

## Passing Types To Functions

Let's take a quick look back at the `Array` type we saw earlier.

```ts
Array<string>;
```

This type describes an array of strings. To make that happen, we're passing a type (`string`) as an argument to another type (`Array`).

There are lots of other types that can receive types, like `Promise<string>`, `Record<string, string>`, and others. In each of them, we use the angle brackets to pass a type to another type.

But we can also use that syntax to pass types to functions.

### Passing Types To `Set`

A `Set` is JavaScript feature that represents a collection of unique values.

To create a `Set`, use the `new` keyword and call `Set`:

```typescript
const formats = new Set();
```

If we hover over the `formats` variable, we can see that it is typed as `Set<unknown>`:

```typescript
// hovering over `formats` shows:

const formats: Set<unknown>;
```

That's because the `Set` doesn't know what type it's supposed to be! We haven't passed it any values, so it defaults to an `unknown` type.

One way to fix this would be to pass some values to `Set` so it understands what type it's supposed to be:

```typescript
const formats = new Set(["CD", "DVD"]);
```

But, we might not _want_ to pass any values to it initially.

We can get around this by passing a _type_ to `Set` when we call it, using the angle brackets syntax:

```typescript
const formats = new Set<string>();
```

Now, `formats` understands that it's a set of strings, and adding anything other than a string will fail:

```typescript
formats.add("Digital"); // this works

formats.add(8); // red squiggly line under `8`

// Error message:

// Argument of type 'number' is not assignable to parameter of type 'string'.ts
```

This is a really important thing to understand in TypeScript. You can pass types, as well as values, to functions.

### Not All Functions Can Receive Types

Most functions in TypeScript _can't_ receive types. A common example where you might want to pass a type is when calling `document.getElementById`.

```typescript
const audioElement = document.getElementById("player");
```

We know that `audioElement` is going to be a `HTMLAudioElement`. This type comes from the DOM typings, which we'll talk about later.

So, it makes sense that we should be able to pass it to `document.getElementById`:

```typescript
// Red line under HTMLAudioElement
// Expected 0 type arguments, but got 1.
const audioElement = document.getElementById<HTMLAudioElement>("player");
```

But unfortunately, we can't. We get an error saying that `.getElementById` expects zero type arguments.

We can see whether a function can receive type arguments by hovering over it. Let's try hovering `.getElementById`:

```
(method) Document.getElementById(elementId: string): HTMLElement | null
```

`.getElementById` contains no angle brackets (`<>`) in its hover. Let's contrasting it with a function that _can_ receive type arguments, like `document.querySelector`:

```
(method) ParentNode.querySelector<Element>(selectors: string): Element | null
```

`.querySelector` has some angle brackets before the parentheses. It shows the default value inside them - in this case, `Element`.

So, to fix our code above we could replace `.getElementById` with `.querySelector`.

```typescript
const audioElement = document.querySelector<HTMLAudioElement>("#player");
```

And everything works.

So, to tell whether a function can receive a type argument, hover it and check whether it has any angle brackets.

### Exercises

#### Exercise 1: Passing Types to Map

Here we are creating a `Map`, a JavaScript feature which represents a dictionary.

In this case we want to pass in a number for the key, and an object for the value:

```typescript
const userMap = new Map();

userMap.set(1, { name: "Max", age: 30 });

userMap.set(2, { name: "Manuel", age: 31 });

// @ts-expect-error  // red squiggly line under `@ts-expect-error`
userMap.set("3", { name: "Anna", age: 29 });

// @ts-expect-error // red squiggly line under `@ts-expect-error`
userMap.set(3, "123");
```

There are red lines on the `@ts-expect-error` directives because currently any type of key and value is allowed in the `Map`.

```typescript

// hovering over Map shows:
var Map: MapConstructor

new () => Map<any, any> (+3 overloads)

```

How would we type the `userMap` so the key must be a number and the value is an object with `name` and `age` properties?

#### Exercise 2: `JSON.parse()` Can't Receive Type Arguments

Consider the following code, which uses `JSON.parse` to parse some JSON:

```typescript
const parsedData = JSON.parse<{
  name: string; // red squiggly lines for the full {} argument
  age: number;
}>('{"name": "Alice", "age": 30}');
```

There is currently an error under the type argument for `JSON.parse`:

```
Expected 0 type arguments, but got 1.
```

A test that checks the type of `parsedData` is currently failing, since it is typed as `any` instead of the expected type:

```typescript
type test = Expect<
  Equal<
    // red squiggly lines for the full Equal<>
    typeof parsedData,
    {
      name: string;
      age: number;
    }
  >
>;

it("Should be the correct shape", () => {
  expect(parsedData).toEqual({
    name: "Alice",
    age: 30,
  });
});
```

We've tried to pass a type argument to the `JSON.parse` function. But it doesn't appear to be working in this case.

The test errors tell us that the type of `parsed` is not what we expect. The properties `name` and `age` are not being recognized.

Why this is happening? What would be an different way to correct these type errors?

#### Solution 1: Passing Types to Map

There are a few different ways to solve this problem, but we'll start with the most straightforward one.

The first thing to do is to create a `User` type:

```typescript
type User = {
  name: string;
  age: number;
};
```

Following the patterns we've seen so far, we can pass `number` and `User` as the types for the `Map`:

```typescript
const userMap = new Map<number, User>();
```

That's right - some functions can receive _multiple_ type arguments. In this case, the `Map` constructor can receive two types: one for the key, and one for the value.

With this change, the errors go away, and we can no longer pass in incorrect types into the `userMap.set` function.

You can also express the `User` type inline:

```typescript
const userMap = new Map<number, { name: string; age: number }>();
```

#### Solution 2: `JSON.parse()` Can't Receive Type Arguments

Let's look a bit closer at the error message we get when passing a type argument to `JSON.parse`:

```
Expected 0 type arguments, but got 1.
```

This message indicates that TypeScript is not expecting anything inside the angle braces when calling `JSON.parse`. To resolve this error, we can remove the angle braces:

```typescript
const parsedData = JSON.parse('{"name": "Alice", "age": 30}');
```

Now that `.parse` is receiving the correct number of type arguments, TypeScript is happy.

However, we want our parsed data to have the correct type. Hovering over `JSON.parse`, we can see its type definition:

```typescript

JSON.parse(text: string, reviver?: ((this: any, key: string, value: any) => any)  undefined): any

```

It always returns `any`, which is a bit of a problem.

To get around this issue, we can give `parsedData` a variable type annotation with `name: string` and `age: number`:

```typescript
const parsedData: {
  name: string;
  age: number;
} = JSON.parse('{"name": "Alice", "age": 30}');
```

Now we have `parsedData` typed as we want it to be.

The reason this works is because `any` disables type checking. So, we can assign it any type we want to. We could assign it something that doesn't make sense, like `number`, and TypeScript wouldn't complain:

```typescript
const parsedData: number = JSON.parse('{"name": "Alice", "age": 30}');
```

So, this is more 'type faith' than 'type safe'. We are hoping that `parsedData` is the type we expect it to be. We'll explore this idea more later in the book.

## Typing Functions

### Optional Parameters

For cases where a function parameter is optional, we can add the `?` operator before the `:`.

Say we wanted to add an optional `releaseDate` parameter to the `logAlbumInfo` function. We could do so like this:

```typescript
const logAlbumInfo = (
  title: string,
  trackCount: number,
  isReleased: boolean,
  releaseDate?: string,
) => {
  // rest of function body
};
```

Now we can call `logAlbumInfo` and include a release date string, or leave it out:

```typescript
logAlbumInfo("Midnights", 13, true, "2022-10-21");

logAlbumInfo("American Beauty", 10, true);
```

Hovering over the optional `releaseDate` parameter in VS Code will show us that it is now typed as `string | undefined`.

We'll discuss the `|` symbol more later, but this means that the parameter could either be a `string` or `undefined`. It would be acceptable to literally pass `undefined` as a second argument, or it can be omitted all together.

### Default Parameters

In addition to marking parameters as optional, you can set default values for parameters by using the `=` operator.

For example, we could set the `format` to default to `"CD"` if no format is provided:

```typescript
const logAlbumInfo = (
  title: string,
  trackCount: number,
  isReleased: boolean,
  format: string = "CD",
) => {
  // rest of function body
};
```

The annotation of `: string` can also be omitted:

```typescript
const logAlbumInfo = (
  title: string,
  trackCount: number,
  isReleased: boolean,
  format = "CD",
) => {
  // rest of function body
};
```

Since it can infer the type of the `format` parameter from the value provided. This is another nice example of type inference.

### Function Return Types

In addition to setting parameter types, we can also set the return type of a function.

The return type of a function can be annotated by placing a `:` and the type after the closing parentheses of the parameter list. For the `logAlbumInfo` function, we can specify that the function will return a string:

```typescript
const logAlbumInfo = (
  title: string,
  trackCount: number,
  isReleased: boolean,
): string => {
  // rest of function body
};
```

If the value returned from a function doesn't match the type that was specified, TypeScript will show an error.

```typescript
const logAlbumInfo = (
  title: string,
  trackCount: number,
  isReleased: boolean,
): string => {
  return 123; // red squiggly line under `123`
};
```

Return types useful for when you want to ensure that a function returns a specific type of value.

### Rest Parameters

Just like in JavaScript, TypeScript supports rest parameters by using the `...` syntax for the final parameter. This allows you to pass in any number of arguments to a function.

For example, this `printAlbumFormats` is set up to accept an `album` and any number of `formats`:

```typescript
function getAlbumFormats(album: Album, ...formats: string[]) {
  return `${album.title} is available in the following formats: ${formats.join(
    ", ",
  )}`;
}
```

Declaring the parameter with the `...formats` syntax combined with an array of strings lets us pass in any number of strings to the function:

```typescript
getAlbumFormats(
  { artist: "Radiohead", title: "OK Computer", year: 1997 },
  "CD",
  "LP",
  "Cassette",
);
```

Or even by spreading in an array of strings:

```typescript
const albumFormats = ["CD", "LP", "Cassette"];

getAlbumFormats(
  { artist: "Radiohead", title: "OK Computer", year: 1997 },
  ...albumFormats,
);
```

As an alternative, we can use the `Array<>` syntax instead.

```typescript
function getAlbumFormats(album: Album, formats: Array<string>) {
  // function body
}
```

### Function Types

We've used type annotations to specify the types of function parameters, but we can also use TypeScript to describe the types of functions themselves.

We can do this using this syntax:

```typescript
type Mapper = (item: string) => number;
```

This is a type alias for a function that takes in a `string` and returns a `number`.

We could then use this to describe a callback function passed to another function:

```typescript
const mapOverItems = (items: string[], map: Mapper) => {
  return items.map(map);
};
```

Or, declare it inline:

```typescript
const mapOverItems = (items: string[], map: (item: string) => number) => {
  return items.map(map);
};
```

This lets us pass a function to `mapOverItems` that changes the value of the items in the array.

```typescript
const arrayOfNumbers = mapOverItems(["1", "2", "3"], (item) => {
  return parseInt(item) * 100;
});
```

Function types are as flexible as function definitions. You can declare multiple parameters, rest parameters, and optional parameters.

```typescript
// Optional parameters
type WithOptional = (index?: number) => number;

// Rest parameters
type WithRest = (...rest: string[]) => number;

// Multiple parameters
type WithMultiple = (first: string, second: string) => number;
```

### The `void` Type

Some functions don't return anything. They perform some kind of action, but they don't produce a value.

A great example is a `console.log`:

```typescript
const logResult = console.log("Hello!");
```

What type do you expect `logResult` to be? In JavaScript, the value is `undefined`. If we were to `console.log(logResult)`, that's what we'd see in the console.

But TypeScript has a special type for these situations - where a function's return value should be deliberately ignored. It's called `void`.

If we hover over `.log` in `console.log`, we'll see that it returns `void`:

```
(method) Console.log(...data: any[]): void
```

So, `logResult` is also `void`.

This is TypeScript's way of saying "ignore the result of this function call".

### Typing Async Functions

We've looked at how to strongly type what a function returns, via a return type:

```typescript
const getUser = (id: string): User => {
  // function body
};
```

But what about when the function is asynchronous?

```typescript
// The return type of an async function or method must
// be the global Promise<T> type. Did you mean to write
// 'Promise<User>'?
// red squiggle under User
const getUser = async (id: string): User => {
  // function body
};
```

Fortunately, TypeScript's error message is helpful here. It's telling us that the return type of an async function must be a `Promise`.

So, we can pass `User` to a `Promise`:

```typescript
const getUser = async (id: string): Promise<User> => {
  const user = await db.users.get(id);

  return user;
};
```

Now, our function must return a `Promise` that resolves to a `User`.

### Exercises

#### Exercise 1: Optional Function Parameters

Here we have a `concatName` function, whose implementation takes in two `string` parameters `first` and `last`.

If there's no `last` name passed, the return would be just the `first` name. Otherwise, it would return `first` concatenated with `last`:

```typescript
const concatName = (first: string, last: string) => {
  if (!last) {
    return first;
  }

  return `${first} ${last}`;
};
```

When calling `concatName` with a first and last name, the function works as expected without errors:

```typescript
const result = concatName("John", "Doe");
```

However, when calling `concatName` with just a first name, we get an error:

```typescript
const result2 = concatName("John"); // red squiggly line under `concatName("John")`
```

The error message reads:

```
Expected 2 arguments, but got 1.
```

Try to use an optional parameter annotation to fix the error.

#### Exercise 2: Default Function Parameters

Here we have the same `concatName` function as before, where the `last` name is optional:

```typescript
const concatName = (first: string, last?: string) => {
  if (!last) {
    return first;
  }

  return `${first} ${last}`;
};
```

We also have a couple of tests. This test checks that the function returns the full name when passed a first and last name:

```typescript
it("should return the full name", () => {
  const result = concatName("John", "Doe");

  type test = Expect<Equal<typeof result, string>>;

  expect(result).toEqual("John Doe");
});
```

However, the second test expects that when `concatName` is called with just a first name as an argument, the function should use `Pocock` as the default last name:

```typescript
it("should return the first name", () => {
  const result = concatName("John");

  type test = Expect<Equal<typeof result, string>>;

  expect(result).toEqual("John Pocock");
});
```

This test currently fails, with the output from `vitest` indicating the error is on the `expect` line:

```

AssertionError: expected 'John' to deeply equal 'John Pocock'

- Expected

+ Received

— John Pocock

+ John

expect(result).toEqual("John Pocock");

^

```

Update the `concatName` function to use `Pocock` as the default last name if one is not provided.

#### Exercise 3: Rest Parameters

Here we have a `concatenate` function that takes in a variable number of strings:

```typescript
export function concatenate(...strings) {
  // red squiggly line under `...strings`

  return strings.join("");
}

it("should concatenate strings", () => {
  const result = concatenate("Hello", " ", "World");

  expect(result).toEqual("Hello World");

  type test = Expect<Equal<typeof result, string>>;
});
```

The test passes, but there's an error on the `...strings` rest parameter:

```
Rest parameter 'strings' implicitly has an 'any[]' type.
```

How would you update the rest parameter to specify that it should be an array of strings?

#### Exercise 4: Function Types

Here, we have a `modifyUser` function that takes in an array of `users`, an `id` of the user that we want to change, and a `makeChange` function that makes that change:

```typescript
type User = {
  id: string;
  name: string;
};

const modifyUser = (user: User[], id: string, makeChange) => {
  // red squiggly line under `makeChange`

  return user.map((u) => {
    if (u.id === id) {
      return makeChange(u);
    }

    return u;
  });
};
```

Currently there is an error under `makeChange`:

```
Parameter `makeChange` implicitly has an `any` type.
```

Here's an example of how this function would be called:

```typescript
const users: User[] = [
  { id: "1", name: "John" },
  { id: "2", name: "Jane" },
];

modifyUser(users, "1", (user) => {
  // red squiggly line under `user`
  return { ...user, name: "Waqas" };
});
```

In the above example, the `user` parameter to the error function also has the "implicit `any`" error.

The `modifyUser` type annotation for the `makeChange` function to be updated. It should return a modified user. For example, we should not be able to return a `name` of `123`, because in the `User` type, `name` is a `string`:

```typescript
modifyUser(
  users,
  "1",
  // @ts-expect-error
  (user) => {
    return { ...user, name: 123 };
  },
);
```

How would you type `makeChange` as a function takes in a `User` and returns a `User`?

#### Exercise 5: Functions Returning `void`

Here we explore a classic web development example.

We have an `addClickEventListener` function that takes in a listener function and adds it to the document:

```typescript
const addClickEventListener = (listener) => {
  // red squiggly line under `listener`

  document.addEventListener("click", listener);
};

addClickEventListener(() => {
  console.log("Clicked!");
});
```

Currently there is an error under `listener` because it doesn't have a type signature.

We're also _not_ getting an error when we pass an incorrect value to `addClickEventListener`.

```typescript
addClickEventListener(
  // @ts-expect-error // red squiggly line under `@ts-expect-error`
  "abc",
);
```

This is triggering our `@ts-expect-error` directive.

How should `addClickEventListener` be typed so that each error is resolved?

#### Exercise 6: `void` vs `undefined`

We've got a function that accepts a callback and calls it. The callback doesn't return anything, so we've typed it as `() => undefined`:

```typescript
const acceptsCallback = (callback: () => undefined) => {
  callback();
};
```

But we're getting an error when we try to pass in `returnString`, a function that _does_ return something:

```typescript
const returnString = () => {
  return "Hello!";
};

// Argument of type '() => string' is not
// assignable to parameter of type '() => undefined'.
acceptsCallback(returnString); // red squiggly line under `returnString`
```

Why is this happening? Can we alter the type of `acceptsCallback` to fix this error?

#### Exercise 7: Typing Async Functions

This `fetchData` function awaits the `response` from a call to `fetch`, then gets the `data` by calling `response.json()`:

```typescript
async function fetchData() {
  const response = await fetch("https://api.example.com/data");

  const data = await response.json();

  return data;
}
```

There are a couple of things worth noting here.

Hovering over `response`, we can see that it has a type of `Response`, which is a globally available type:

```typescript
// hovering over response
const response: Response;
```

When hovering over `response.json()`, we can see that it returns a `Promise<any>`:

```typescript
// hovering over response.json()

const response.json(): Promise<any>
```

If we were to remove the `await` keyword from the call to `fetch`, the return type would also become `Promise<any>`:

```typescript
const response = fetch("https://api.example.com/data");

// hovering over response shows

const response: Promise<any>;
```

Consider this `example` and its test:

```typescript
const example = async () => {
  const data = await fetchData();

  type test = Expect<Equal<typeof data, number>>; // red squiggly line under Equal<>
};
```

The test is currently failing because `data` is typed as `any` instead of `number`.

How can we type `data` as a number without changing the calls to `fetch` or `response.json()`?

There are two possible solutions here.

#### Solution 1: Optional Function Parameters

By adding a question mark `?` to the end of a parameter, it will be marked as optional:

```typescript
function concatName(first: string, last?: string) {
  // ...implementation
}
```

#### Solution 2: Default Function Parameters

To add a default parameter in TypeScript, we would use the `=` syntax that is also used in JavaScript.

In this case, we will update `last` to default to "Pocock" if no value is provided:

```typescript
export const concatName = (first: string, last?: string = "Pocock") => {
  return `${first} ${last}`;
};
```

##### "Parameter cannot have question mark and initializer."

While this passes our runtime tests, it actually fails in TypeScript:

```
Parameter cannot have question mark and initializer.
```

This is because TypeScript doesn't allow us to have both an optional parameter and a default value. The optionality is already implied by the default value.

To fix the error, we can remove the question mark from the `last` parameter:

```typescript
export const concatName = (first: string, last = "Pocock") => {
  return `${first} ${last}`;
};
```

#### Solution 3: Rest Parameters

When using rest parameters, all of the arguments passed to the function will be collected into an array. This means that the `strings` parameter can be typed as an array of strings:

```typescript
export function concatenate(...strings: string[]) {
  return strings.join("");
}
```

Or, of course, using the `Array<>` syntax:

```typescript
export function concatenate(...strings: Array<string>) {
  return strings.join("");
}
```

#### Solution 4: Function Types

Let's start by annotating the `makeChange` parameter to be a function. For now, we'll specify that it returns `any`:

```typescript
const modifyUser = (user: User[], id: string, makeChange: () => any) => {
  return user.map((u) => {
    if (u.id === id) {
      return makeChange(u); // red squiggly line under `u`
    }

    return u;
  });
};
```

With this first change in place, we get an error under `u` when calling `makeChange` since we said that `makeChange` takes in no arguments:

```
// inside the `user.map()` function

return makeChange(u)

// hovering over `u` shows:

Expected 0 arguments, but got 1.
```

This tells us we need to add a parameter to the `makeChange` function type.

In this case, we will specify that `user` is of type `User`.

```typescript
const modifyUser = (
  user: User[],
  id: string,
  makeChange: (user: User) => any,
) => {
  // function body
};
```

This is pretty good, but we also need to make sure our `makeChange` function returns a `User`:

```typescript
const modifyUser = (
  user: User[],
  id: string,
  makeChange: (user: User) => User,
) => {
  // function body
};
```

Now the errors are resolved, and we have autocompletion for the `User` properties when writing a `makeChange` function.

Optionally, we can clean up the code a bit by creating a type alias for the `makeChange` function type:

```typescript
type MakeChangeFunc = (user: User) => User;

const modifyUser = (user: User[], id: string, makeChange: MakeChangeFunc) => {
  // function body
};
```

Both techniques behave the same, but if you need to reuse the `makeChange` function type, a type alias is the way to go.

#### Solution 5: Functions Returning `void`

Let's start by annotating the `listener` parameter to be a function. For now, we'll specify that it returns a string:

```typescript
const addClickEventListener = (listener: () => string) => {
  document.addEventListener("click", listener);
};
```

The problem is that we now have an error when we call `addClickEventListener` with a function that returns nothing:

```typescript
addClickEventListener(() => {
  // red squiggly line under `() => {`

  console.log("Clicked!");
});
```

When we hover over the error, we see the following message:

```
Argument of type '() => void' is not assignable to parameter of type '() => string'.

Type 'void' is not assignable to type 'string'.
```

The error message tells us that the `listener` function is returning `void`, which is not assignable to `string`.

This suggests that instead of typing the `listener` parameter as a function that returns a string, we should type it as a function that returns `void`:

```typescript
const addClickEventListener = (listener: () => void) => {
  document.addEventListener("click", listener);
};
```

This is a great way to tell TypeScript that we don't care about the return value of the `listener` function.

#### Solution 6: `void` vs `undefined`

The solution is to change the of `callback` to `() => void`:

```typescript
const acceptsCallback = (callback: () => void) => {
  callback();
};
```

Now we can pass in `returnString` without any issues. This is because `returnString` returns a `string`, and `void` tells TypeScript to ignore the return value when comparing them.

So if you really don't care about the result of a function, you should type it as `() => void`.

#### Solution 7: Typing Async Functions

You might be tempted to try passing a type argument to `fetch`, similar to how you would with `Map` or `Set`.

However, hovering over `fetch`, we can see that it doesn't accept type arguments:

```typescript
// this won't work!

const response = fetch<number>("https://api.example.com/data"); // red squiggly line under number

// Hovering over fetch shows:

function fetch(
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
): Promise<Response>;
```

We also can't add a type annotation to `response.json()` because as it doesn't accept type arguments either:

```
// this won't work!

const data: number = await response.json<number>(); // red squiggly line under number

// Hovering over number shows:

Expected 0 type arguments, but got 1.
```

One thing that will work is to specify that `data` is a `number`:

```typescript
const data: number = await response.json();
```

This works because `data` was `any` before, and `await response.json()` returns `any`. So now we're putting `any` into a slot that requires a `number`.

However, the best way to solve this problem is to add a return type to the function. In this case, it should be a `number`:

```typescript
// red squiggly line under number
async function fetchData(): number {
  // function body
}
```

Now `data` is typed as a `number`, except we have an error under our return type annotation:

```
The return type of an async function or method must be the global Promise<T> type. Did you mean to write 'Promise<number>'?
```

So, we should change the return type to `Promise<number>`:

```typescript
async function fetchData(): Promise<number> {
  const response = await fetch("https://api.example.com/data");

  const data = await response.json();

  return data;
}
```

By wrapping the `number` inside of `Promise<>`, we make sure that the `data` is awaited before the type is figured out.

##### "Type Safe" vs "Type Faith"

An interesting note here is that TypeScript is not really enforcing the return type of `fetchData`. It's just assuming that `data` is a `number` because we've told it to be.

This is a good example of "type faith" - we're telling TypeScript to trust us that `data` is a `number`. But if it's not, TypeScript won't catch it at runtime.

We'll return to this topic later in the book.

---
