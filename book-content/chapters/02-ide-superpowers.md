TypeScript works the same no matter what IDE you use, but for this book we'll assume you're using Visual Studio Code (VS Code).

When you open VS Code, the TypeScript server starts in the background. It will be active as long as you have a TypeScript file open.

Let's take a look at some of the awesome VS Code features that are powered by the TypeScript server.

## Autocomplete

If I were to name the single TypeScript feature I couldn't live without, it would be autocomplete.

TypeScript knows what type everything is inside your app. Because of that, it can give you suggestions when you're typing - speeding you up enormously.

In the example below, just typing 'p' after `audioElement` brings up all the properties which start with 'p'.

```typescript
const audioElement = document.createElement("audio");

audioElement.p; // play, pause, part etc
```

This is really powerful for exploring APIs you might not be familiar with, like the `HTMLAudioElement` API in this case.

### Manually Triggering Autocomplete

You'll often want to manually trigger autocomplete. In VS Code, the `Ctrl + Space` keyboard shortcut will show you a list of suggestions for what you're typing.

For example, if you were adding an event listener to an element, you would see a list of available events:

```typescript
document.addEventListener(
  "", // autocomplete here
);
```

Hitting the `Ctrl + Space` shortcut with the cursor inside the quotes will show you a list of events that can be listened for:

```
DOMContentLoaded
abort
animationcancel
...
```

If you wanted to narrow down the list to the events you were interested in, you could type "drag" before hitting `Ctrl + Space` and only the appropriate events would display:

```
drag
dragend
dragenter
dragleave
...
```

Autocomplete is an essential tool for writing TypeScript code, and it's available right out of the box in VS Code.

### Exercises

#### Exercise 1: Autocomplete

Here's an example of some code where autocomplete can be triggered:

```typescript
const acceptsObj = (obj: { foo: string; bar: number; baz: boolean }) => {};

acceptsObj({
  // Autocomplete in here!
});
```

Practice using the autocomplete shortcut to fill in the object when calling `acceptsObj`.

<Exercise title="Exercise 1: Autocomplete" filePath="/src/016.5-ide-superpowers/044-manually-triggering-autocomplete.problem.ts"></Exercise>

#### Solution 1: Autocomplete

When you hit `Ctrl + Space` inside the object, you'll see a list of the possible properties based on the `MyObj` type:

```typescript
bar;
baz;
foo;
```

As you select each property, the autocomplete list will update to show you the remaining properties.

## TypeScript Error Checking

The thing TypeScript is most famous for is its errors. These are a set of rules which TypeScript uses to make sure your code is doing what you think it's doing.

For every change you make to a file, the TypeScript server will check your code.

If the TypeScript server finds any errors, it will tell VS Code to draw a red squiggly line under the part of the code that has a problem. Hovering over the underlined code will show you the error message. Once you make a change, the TypeScript server will check again and remove the red squiggly line if the error is fixed.

I like to think of it like a teacher hovering over your shoulder, underlining your work in red pen while you type.

Let's look at these errors a bit more deeply.

### Catching Runtime Errors

Sometimes TypeScript will warn you about things that will definitely fail at runtime.

For example, consider the following code:

```ts twoslash
// @errors: 18047
const a = null;

a.toString();
```

TypeScript tells us that there is a problem with `a`. This tells us where the problem is, but it doesn't necessarily tell us what the problem is. In this case, we need to stop and think about why we can't call `toString()` on `null`. If we do, it will throw an error at runtime.

```
Uncaught TypeError: Cannot read properties of null (reading 'toString').
```

Here, TypeScript is telling us that an error might happen even without us needing to check it. Very handy.

### Warnings About Non-Runtime Errors

Not everything TypeScript warns us about will actually fail at runtime.

Take a look at this example where we're assigning a property to an empty object:

```ts twoslash
// @errors: 2339
const obj = {};

const result = obj.foo;
```

TypeScript draws a red squiggly line below `foo`. But if we think about it, this code won't actually cause an error at runtime. We're trying to assign a property that doesn't exist in this object: `foo`. This won't error, it will just mean that result is undefined.

It may seem strange that TypeScript would warn us about something that won't cause an error, but it's actually a good thing. If TypeScript didn't warn us about this, it would be saying that we can access any property on any object at any time. Over the course of an entire application, this could result in quite a few bugs.

It's best to think of TypeScript's rules as opinionated. They are a collection of helpful tips that will make your application safer as a whole.

### Warnings Close to the Source of the Problem

TypeScript will try to give you warnings as close to the source of the problem as possible.

Let's take a look at an example.

```ts twoslash
// @errors: 2561
type Album = {
  artist: string;
  title: string;
  year: number;
};

const album: Album = {
  artsist: "Television",
  title: "Marquee Moon",
  year: 1977,
};
```

We define an 'Album' type - an object with three properties. Then, we say that const album needs to be of that type via `const album: Album`. Don't worry if you don't understand all the syntax yet - we'll cover it all later.

Can you see the problem? There's a typo of the `artist` property when creating an album. That's because we've said that the `album` variable needs to be of type `Album`, but we've misspelled `artist` as `artsist`. TypeScript is telling us that we've made a mistake, and even suggests the correct spelling.

### Dealing With Multi-Line Errors

However, sometimes TypeScript will give you an error in a more unhelpful spot.

In this example, we have a function called `logUserJobTitle` that logs the job title of a user:

```typescript
const logUserJobTitle = (user: {
  job: {
    title: string;
  };
}) => {
  console.log(user.job.title);
};
```

Don't worry about the syntax for now - we'll cover it later. The important thing is that `logUserJobTitle` takes a user object with a `job` property that has a `title` property.

Now, let's call `logUserJobTitle` with a user object where the `job.title` is a number, not a string.

```ts twoslash
// @errors: 2345
const logUserJobTitle = (user: {
  job: {
    title: string;
  };
}) => {
  console.log(user.job.title);
};

// ---cut---
const exampleUser = {
  job: {
    title: 123,
  },
};

logUserJobTitle(exampleUser);
```

It might seem like TypeScript should give us an error on `title` in the `exampleUser` object. But instead, it gives us an error on the `exampleUser` variable itself.

It's multiple lines long, which can feel pretty scary. A good rule of thumb with multi-line errors is to start at the bottom:

```
Type 'number' is not assignable to type 'string'.
```

This tells us that a `number` is being passed into a slot where a `string` is expected. This is the root of the problem.

Let's go to the next line:

```
The types of 'job.title' are incompatible between these types.
```

This tells us that the `title` property in the `job` object is the problem.

Already, we understand the issue without needing to see the top line, which is usually a long summary of the problem.

Reading errors bottom-to-top can be a helpful strategy when dealing with multi-line TypeScript errors.

## Introspecting Variables and Declarations

You can hover over more than just error messages. Any time you hover over a variable or declaration, VS Code will show you information about it.

In this example, we could hover over `thing` and see that it's of type `number`:

```ts twoslash
let thing = 123;
//  ^?
```

Hovering works for more involved examples as well. Here `otherObject` spreads in the properties of `otherThing` as well as adding `thing`:

```typescript
let otherThing = {
  name: "Alice",
};

const otherObject = {
  ...otherThing,
  thing: "abc",
};

otherObject.thing;
```

Hovering over `otherObject` will give us a computed readout of all of its properties:

```ts twoslash
let otherThing = {
  name: "Alice",
};

const otherObject = {
  ...otherThing,
  thing: "abc",
};

// ---cut---
console.log(otherObject);
//          ^?
```

Depending on what you hover over, VS Code will show you different information. For example, hovering over `otherObject` will show you all of its properties, while hovering over `thing` will show you its type.

Get used to the ability to float around your codebase introspecting variables and declarations, because it's a great way to understand what the code is doing.

### Exercises

#### Exercise 1: Hovering a Function Call

In this code snippet we're trying to grab an element using `document.getElementById` with an ID of `12`. However, TypeScript is complaining.

```ts twoslash
// @errors: 2345
let element = document.getElementById(12);
```

How can hovering help to determine what argument `document.getElementById` actually requires? And for a bonus point, what type is `element`?

<Exercise title="Exercise 1: Hovering a Function Call" filePath="/src/016.5-ide-superpowers/041-hovering-a-function-call.problem.ts"></Exercise>

#### Solution 1: Hovering a Function Call

First of all, we can hover over the red squiggly error itself. In this case, hovering over `12`, we get the following error message:

```
Argument of type 'number' is not assignable to parameter of type 'string'.
```

We'll also get a readout of the `getElementById` function:

```
(method) Document.getElementById(elementId: string): HTMLElement | null
```

In the case of `getElementById`, we can see that it requires a string as an argument, and it returns an `HTMLElement | null`. We'll look at this syntax later, but it basically means either a `HTMLElement` or `null`.

This tells us that we can fix the error by changing the argument to a string:

```ts twoslash
let element = document.getElementById("12");
//  ^?
```

We also know that `element`'s type will be what `document.getElementById` returns, which we can confirm by hovering over `element`.

So, hovering in different places reveals different information. When I'm working in TypeScript, I hover constantly to get a better sense of what my code is doing.

## JSDoc Comments

JSDoc is a syntax for adding documentation to the types and functions in your code. It allows VS Code to show additional information in the popup that shows when hovering.

This is extremely useful when working with a team

Here's an example of how a `logValues` function could be documented:

````typescript
/**
 * Logs the values of an object to the console.
 *
 * @param obj - The object to log.
 *
 * @example
 * ```ts
 * logValues({ a: 1, b: 2 });
 * // Output:
 * // a: 1
 * // b: 2
 * ```
 */

const logValues = (obj: any) => {
  for (const key in obj) {
    console.log(`${key}: ${obj[key]}`);
  }
};
````

The `@param` tag is used to describe the parameters of the function. The `@example` tag is used to provide an example of how the function can be used, using markdown syntax.

There are many, many more tags available for use in JSDoc comments. You can find a full list of them in the [JSDoc documentation](https://jsdoc.app/).

Adding JSDoc comments is a useful way to communicate the purpose and usage of your code, whether you're working on a library, a team, or your own personal projects.

### Exercises

#### Exercise 1: Adding Documentation for Hovers

Here's a simple function that adds two numbers together:

```typescript
const myFunction = (a: number, b: number) => {
  return a + b;
};
```

In order to understand what this function does, you'd have to read the code.

Add some documentation to the function so that when you hover over it, you can read a description of what it does.

<Exercise title="Exercise 1: Adding Documentation For Hovers" filePath="/src/016.5-ide-superpowers/042-adding-tsdoc-comments-for-hovers.problem.ts"></Exercise>

#### Solution 1: Adding Documentation for Hovers

In this case, we'll specify that the function "Adds two numbers together". We can also use an `@example` tag to show an example of how the function is used:

```typescript
/**
 * Adds two numbers together.
 * @example
 * myFunction(1, 2);
 * // Will return 3
 */

const myFunction = (a: number, b: number) => {
  return a + b;
};
```

Now whenever you hover over this function, the signature of the function along with the comment and full syntax highlighting for anything below the `@example` tag:

```
// hovering over myFunction shows:

const myFunction: (a: number, b: number) => number

Adds two numbers together.

@example

myFunction(1, 2);

// Will return 3
```

While this example is trivial (we could, of course, just name the function better), this can be an extremely important tool for documenting your code.

## Navigating with Go To Definition and Go To References

The TypeScript server also provides the ability to navigate to the definition of a variable or declaration.

In VS Code, this "Go to Definition" shortcut is used with `Command + Click` on a Mac or `F12` on Windows for the current cursor position. You can also right click and select "Go to Definition" from the context menu on either platform. For the sake of brevity, we'll use the Mac shortcut.

Once you've arrived at the definition location, repeating the `Command + Click` shortcut will show you everywhere that the variable or declaration is used. This is called "Go To References". This is especially useful for navigating around large codebases.

The shortcut can also be used for finding the type definitions for built-in types and libraries. For example, if you `Command + Click` on `document` when using the `getElementById` method, you'll be taken to the type definitions for `document` itself.

This is a great feature for understanding how built-in types and libraries work.

## Rename Symbol

In some situations, you might want to rename a variable across your entire codebase. Let's imagine that a database column changes from 'id' to 'entityId'. A simple find and replace won't work, because 'id' is used in many places for different purposes.

A TypeScript-enabled feature called 'Rename Symbol' allows you to do that with a single action.

Let's take a look at an example.

```typescript
const filterUsersById = (id: string) => {
  return users.filter((user) => user.id === id);
};
```

Right click on the `id` parameter of the `findUsersById` function and select "Rename Symbol".

A panel will be displayed that prompts for the new name. Type in `userIdToFilterBy` and hit `enter`. VS Code is smart enough to realize that we only want to rename the `id` parameter for the function, and not the `user.id` property:

```typescript
const filterUsersById = (userIdToFilterBy: string) => {
  return users.filter((user) => user.id === userIdToFilterBy);
};
```

The rename symbol feature is a great tool for refactoring code, and it works across multiple files as well.

## Automatic Imports

Large JavaScript applications can be composed of many, many modules. Manually importing from other files can be tedious. Fortunately, TypeScript supports automatic imports.

When you start typing the name of a variable you want to import, TypeScript will show a list of suggestions when you use the `Ctrl + Space` shortcut. Select a variable from the list, and TypeScript will automatically add an import statement to the top of the file.

You do need to be a little bit careful when using autocompletion in the middle of a name since the rest of the line could be unintentionally altered. To avoid this issue, make sure your cursor is at the end of the name before hitting `Ctrl + Space`.

## Quick Fixes

VS Code also offers a "Quick Fix" feature that can be used to run quick refactor scripts. For now, let's use it to import multiple missing imports at the same time.

To open the Quick Fix menu, hit `Command + .`. If you do this on a line of code which references a value that hasn't been imported yet, a popup will show.

```ts twoslash
// @errors: 2552
const triangle = new Triangle();
```

One of the options in the Quick Fix menu will be 'Add All Missing Imports'. Selecting this option will add all the missing imports to the top of the file.

```typescript
import { Triangle } from "./shapes";

const triangle = new Triangle();
```

We'll look at the Quick Fixes menu again in the exercises. It provides a lot of options for refactoring your code, and it's a great way to learn about TypeScript's capabilities.

## Restarting the VS Code Server

We've looked at several examples of the cool things that TypeScript can do for you in VS Code. However, running a language server is not a simple task. The TypeScript server can sometimes get into a bad state and stop working properly. This might happen if configuration files are changed or when working with a particularly large codebase.

If you're experiencing strange behavior, it's a good idea to restart the TypeScript server. To do this, open the VS Code Command Palette with `Shift + Command + P`, then search for "Restart TS Server".

After a couple of seconds, the server should kick back into gear and ensure that errors are being reported properly.

## Working in JavaScript

If you're a JavaScript user, you might have noticed that lots of these features are already available without using TypeScript. Autocomplete, organizing imports, auto imports and hovering all work in JavaScript. Why is that?

It's because of TypeScript. TypeScript's IDE server is not just running on TypeScript files, but on JavaScript files too. That means that some of TypeScript's amazing IDE experience is also available in JavaScript.

Some features aren't available in JavaScript out of the box. The most prominent is in-IDE errors. Without type annotations, TypeScript isn't confident enough about the shape of your code to give you accurate warnings.

> TIP: There is a system for adding types to `.js` files using JSDoc comments which TypeScript supports, but it isn't enabled by default. We'll learn how to configure it later.

The reason TypeScript does this is, first of all, to support a better experience working in JavaScript for VS Code users. A subset of TypeScript's features is better than nothing at all.

But the upshot is that moving to TypeScript should feel extremely familiar for JavaScript users. It's the same IDE experience, just better.

## Exercises

### Exercise 1: Quick Fix Refactoring

Let's revisit VS Code's Quick Fixes menu we looked at earlier.

In this example, we have a function that contains a `randomPercentage` variable, which is created by calling `Math.random()` and converting the result to a fixed number:

```typescript
const func = () => {
  // Refactor this to be its own function
  const randomPercentage = `${(Math.random() * 100).toFixed(2)}%`;

  console.log(randomPercentage);
};
```

The goal here is to refactor the logic that generates the random percentage into its own separate function.

Highlight a variable, line, or entire code block then hit `Command + .` to open the Quick Fix menu. There will be several options for modifying the code, depending on where your cursor is when you open the menu.

Experiment with different options to see how they affect the example function.

<Exercise title="Exercise 1: Quick Fix Refactoring" filePath="/src/016.5-ide-superpowers/050-refactor.problem.ts"></Exercise>

### Solution 1: Quick Fix Refactoring

The Quick Fix menu will show different refactoring options depending on where your cursor is when you open it.

#### Inlining Variables

If you target `randomPercentage`, you can select an "Inline variable" option.

This would remove the variable and inline its value into the `console.log`:

```typescript
const func = () => {
  console.log(`${(Math.random() * 100).toFixed(2)}%`);
};
```

#### Extracting Constants

When selecting a smaller portion of code like `Math.random() * 100`, the option to "Extract constant in enclosing scope" will appear.

Selecting this option creates a new local variable that you are prompted to name, and assigns the selected value to it. After saving and running a code formatter, everything is cleaned up nicely:

```typescript
const func = () => {
  const randomTimes100 = Math.random() * 100;

  const randomPercentage = `${randomTimes100.toFixed(2)}%`;

  console.log(randomPercentage);
};
```

Similarly, the "Extract to Constant in Module Scope" option will create a new constant in the module scope:

```typescript
const randomTimes100 = Math.random() * 100;

const func = () => {
  const randomPercentage = `${randomTimes100.toFixed(2)}%`;

  console.log(randomPercentage);
};
```

#### Inlining and Extracting Functions

Selecting the entire random percentage logic enables some other extraction options.

The "Extract to function in module scope" option will act similarly to the constant option, but create a function instead:

```typescript
const func = () => {
  const randomPercentage = getRandomPercentage();

  console.log(randomPercentage);
};

function getRandomPercentage() {
  return `${(Math.random() * 100).toFixed(2)}%`;
}
```

These are just some of the options provided by the Quick Fix menu. There's so much you can achieve with them, and we're only scratching the surface. Keep exploring and experimenting to discover their full potential!
