Part 1: Introduction

---

# 01. Kickstart Your TypeScript Setup

Before diving into TypeScript, let's take a moment to talk about its foundation — JavaScript.

JavaScript is the language that makes web pages interactive. Any modern website will utilize some amount of it. And the more complex the site, the more complex the JavaScript.

But, unlike other coding languages, JavaScript was not built for building complex systems.

If you were building JavaScript apps in the 2000's, you were often having a bad time. Your IDE (integrated development environment) was lacking basic features. Autocomplete. Inline errors. There was no way to know if you were passing the right arguments to the right function. As users began demanding more complex experiences online, this made working with JavaScript a nightmare.

This was especially true for refactoring code. If you had to change a function signature, you had to manually find and update every place that function was called throughout your entire codebase. This could take hours, and with no guarantee that you'd fixed everything before you pushed to production.

## TypeScript's Beginnings

As limitations like these became more apparent, developers started looking for a better way to write JavaScript.

Around 2010, Microsoft noticed that a lot of their teams were using a community project called Script# (ScriptSharp) to build their JavaScript apps. This library allowed developers to write code in C#, and then turn it to JavaScript. C# had excellent features for building large applications - so it made the experience of building these apps more pleasant. In fact, many teams had found this was the only way they could build complex applications in large teams.

Anders Hejlsberg, the creator of C#, was tasked to investigate this phenomenon. He was astonished. People were so annoyed with JavaScript that they were willing to code in a completely different language in order to get the powerful IDE features they were used to.

So he thought: what if we create a new language that was closer to JavaScript, but that enabled all the IDE features that JavaScript is missing?

Thus, TypeScript was born. (And yes, the inventor of C# was also the inventor of TypeScript. Not bad.)

In the decade or so since its introduction, TypeScript has grown to become a staple of modern development. In many metrics, it is even more popular than JavaScript.

In this book, you'll learn why it has become so popular, and how it can help you develop better applications while making your life as a developer easier.

## How TypeScript Works

With a JavaScript-only project, you would typically write your code in files with a `.js` or `.jsx` file extension. These files are then able to be directly executed in the browser or a runtime environment like Node.js (which is used to run JavaScript on servers, or on your laptop). The JavaScript you write is the JavaScript that gets executed.

![](images/image5.png)

If you're testing whether your code works, you need to test it inside the runtime - the browser or Node.js.

For a TypeScript project, your code is primarily inside of `.ts` or `.tsx` files.

Inside your IDE, these files are monitored by TypeScript's 'language server'. This server watches you as you type, and powers IDE features like autocompletion and error checking, among others.

Unlike a `.js` file, `.ts` files can't usually be executed directly by the browser or a runtime. Instead, they require an initial build process.

This is where TypeScript's `tsc` CLI comes in, which transforms your `.ts` files into `.js` files. You are able to take advantage of TypeScript's features while writing your code, but the output is still plain JavaScript.

![](images/image4.png)

The great benefit of this system is that you get in a feedback loop with TypeScript. You write code. The in-IDE server gives you feedback. You adjust based on the feedback. And all of this happens before your code goes into the browser. This loop is much faster than JavaScript's, so can help you create higher-quality code faster.

> Automated testing can also provide a high-quality feedback loop. While we won't cover this in this book, automated tests are a great companion to TypeScript for creating extremely high-quality code.

So, while TypeScript's build process is more complex than JavaScript's, the benefits are well worth it.

## What's Different About TypeScript?

The thing that makes TypeScript from JavaScript different can be summed up in a single word: types.

But there's a common misconception here. People think that TypeScript's core mission is to make JavaScript a strongly typed language, like C# or Rust. This is not quite accurate.

TypeScript wasn't invented to make JavaScript strongly typed. It was built to allow amazing tooling for JavaScript.

Imagine you're building an IDE, and you want to give people warnings when they mis-type a function name or an object property. If you don't know the shapes of the variables, parameters and objects in your code, you'd have to resort to guesswork.

But if you do know the types of everything in your app, you can begin implementing powerful IDE features like autocomplete, inline errors and automatic refactors.

So, TypeScript aims to provide just enough strong typing to make working with JavaScript more pleasant and productive.

## Tools for TypeScript Development

Let's break down the tools you need in order to work with TypeScript:

- An IDE: In order to write code, you need an editor or Integrated Development Environment. While you can use any IDE, the assumption in this book is that you are using Microsoft's Visual Studio Code. The TypeScript integration with VS Code is excellent, as you will see shortly. Install it from https://code.visualstudio.com if you haven't already.
- An Execution Environment: You need somewhere to run your emitted JavaScript. This could be Node.js or a web browser like Chrome.
- The TypeScript CLI: Node.js is needed in order to run the TypeScript CLI (command line interface). This tool converts your TypeScript to JavaScript, and warns you of any issues in your project.

### Installing Node.js

The Node.js installer can be downloaded from the [Node.js website](https://nodejs.org/).

When you visit the site, you'll see two options: LTS and Current.

LTS is short for "Long Term Support". This is the recommended version for production use. It's the most stable version, and the one we'll be using in this book.

The Current version contains the latest features, but it's not recommended for production use.

Click the LTS button to download the installer and follow the installation instructions.

After running the installer, you can verify it installed correctly by opening a terminal and running the following command:

```
node -v
```

If Node.js is installed correctly, this command will display the version number. If you see an error message like "node command not found," it means the installation was not successful, and you should try again.

### Alternative Package Management with PNPM

Node.js includes the `npm` package manager by default.

If you've worked with JavaScript repositories, you're likely familiar with `npm` and the `package.json` file. The `package.json` file represents all the packages we need to install to run the code in the repository.

For example, in the repository for this material, we have a special CLI for running exercises along with helper packages and various other dependencies like `cross-fetch` and `nodemon`:

```json
// package.json

{
  "devDependencies": {
    "@total-typescript/exercise-cli": "0.4.0",
    "@total-typescript/helpers": "~0.0.1",
    "cross-fetch": "~3.1.5",
    "nodemon": "~3.0.1",
    "npm-run-all": "~4.1.5",
    "prettier": "~2.8.7",
    "typescript": "~5.2.2",
    "vite-tsconfig-paths": "~4.0.7",
    "vitest": "0.34.4"
  }
}
```

To install these packages, you would typically run the `npm install` command, which downloads them from the npm registry into your `node_modules` folder. The `node_modules` folder contains JavaScript files that the exercises in the `src` directory need to run.

However, for the book's repository we will be using the PNPM package manager instead.

`pnpm` is used the same way as `npm`, but it is more efficient. Instead of having individual `node_modules` folders for each project, `pnpm` uses a single location on your computer and hard links the dependencies from there. This makes it run faster and use less disk space. I use PNPM in all my projects.

To install PNPM, follow the instructions provided in the [official documentation](https://pnpm.io/installation).

## Installing TypeScript

TypeScript and its dependencies are contained within a single package, called typescript.

You can install it globally with either pnpm or npm:

```
pnpm add -g typescript
```

or

```
npm install –-global typescript
```

TypeScript is usually also installed in your `package.json` to make sure that all developers using the project are using the same version. For the purposes of this book, a global installation will do just fine.

# 02. IDE Superpowers

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

```typescript
const a = null;

a.toString(); // red squiggly line under `a`
```

TypeScript tells us that there is a problem with `a`. Hovering over it shows the following error message:

```
'a' is possibly 'null'.
```

This tells us where the problem is, but it doesn't necessarily tell us what the problem is. In this case, we need to stop and think about why we can't call `toString()` on `null`. If we do, it will throw an error at runtime.

```
Uncaught TypeError: Cannot read properties of null (reading 'toString').
```

Here, TypeScript is telling us that an error might happen even without us needing to check it. Very handy.

### Warnings About Non-Runtime Errors

Not everything TypeScript warns us about will actually fail at runtime.

Take a look at this example where we're assigning a property to an empty object:

```typescript
const obj = {};

const result = obj.foo; // red squiggly line under `foo`
```

TypeScript draws a red squiggly line below `foo`. But if we think about it, this code won't actually cause an error at runtime. We're trying to assign a property that doesn't exist in this object: `foo`. This won't error, it will just mean that result is undefined.

It may seem strange that TypeScript would warn us about something that won't cause an error, but it's actually a good thing. If TypeScript didn't warn us about this, it would be saying that we can access any property on any object at any time. Over the course of an entire application, this could result in quite a few bugs.

It's best to think of TypeScript's rules as opinionated. They are a collection of helpful tips that will make your application safer as a whole.

### Warnings Close to the Source of the Problem

<!-- TODO Consider moving this and the next section to later, perhaps the weird parts -->

TypeScript will try to give you warnings as close to the source of the problem as possible.

Let's take a look at an example.

```typescript
type Album = {
  artist: string;
  title: string;
  year: number;
};

const album: Album = {
  artsist: "Television", // red squiggly line under `artsist`
  title: "Marquee Moon",
  year: 1977,
};
```

We define an 'Album' type - an object with three properties. Then, we say that const album needs to be of that type via `const album: Album`. Don't worry if you don't understand all the syntax yet - we'll cover it all later.

Can you see the problem? There's a typo of the `artist` property when creating an album. Hovering over `artsist` shows the following error message:

```
Type '{ artsist: string; title: string; year: number; }' is not assignable to type 'Album'.

Object literal may only specify known properties, but 'artsist' does not exist in type 'Album'. Did you mean to write 'artist'?
```

That's because we've said that the `album` variable needs to be of type `Album`, but we've misspelled `artist` as `artsist`. TypeScript is telling us that we've made a mistake, and even suggests the correct spelling.

### Dealing With Far-Away Errors

However, sometimes TypeScript will give you an error in a more unhelpful spot.

In this example, we have a `FunctionThatReturnsString` type that represents a function that returns a string. An `exampleFunction` that is given that type is defined, but it returns a number instead of a string.

```typescript
type FunctionThatReturnsString = () => string;

const exampleFunction: FunctionThatReturnsString = () => {
  // red squiggly line under `exampleFunction`

  // Imagine lots more code here...

  return 123;
};
```

It might seem like TypeScript should give us an error on the `return` line, but it gives us an error on the line where we define `exampleFunction` instead.

The reason why the error is on the function declaration line instead of the `return` line is because of how TypeScript checks functions. We'll look at this later. But the important thing is that while TypeScript does its best to locate errors, sometimes they might not be where you expect.

## Introspecting Variables and Declarations

You can hover over more than just error messages. Any time you hover over a variable or declaration, VS Code will show you information about it.

In this example, we could hover over `thing` and see that it's of type `number`:

```typescript
let thing = 123;

// hovering over `thing` shows:

let thing: number;
```

Hovering works for more involved examples as well. Here `otherObject` spreads in the properties of `otherThing` as well as adding `thing`:

```typescript
let otherThing = {
  name: "Alice",
};

const otherObject = {
  ...otherThing,
  thing,
};

otherObject.thing;
```

Hovering over `otherObject` will give us a computed readout of all of its properties:

```typescript
// hovering over `otherObject` shows:

const otherObject: {
  thing: number;
  name: string;
};
```

Depending on what you hover over, VS Code will show you different information. For example, hovering over `.thing` in `otherObject.thing` will show you the type of `thing`:

```
(property) thing: number
```

Get used to the ability to float around your codebase introspecting variables and declarations, because it's a great way to understand what the code is doing.

### Exercises

#### Exercise 1: Hovering a Function Call

In this code snippet we're trying to grab an element using `document.getElementById` with an ID of `12`. However, TypeScript is complaining.

```javascript
let element = document.getElementById(12); // red squiggly line under 12
```

How can hovering help to determine what argument `document.getElementById` actually requires? And for a bonus point, what type is `element`?

#### Solution 1: Hovering a Function Call

First of all, we can hover over the red squiggly error itself. In this case, hovering over `12`, we get the following error message:

```
Argument of type 'number' is not assignable to parameter of type 'string'.
```

We'll also get a readout of the `getElementById` function:

```
(method) Document.getElementById(elementId: string): HTMLElement | null
```

In the case of `getElementById`, we can see that it requires a string as an argument, and it returns an `HTMLElement | null`. We'll look at this syntax later, but it basically means either a `HTMLElement` or `null`.

This tells us that we can fix the error by changing the argument to a string:

```typescript
let element = document.getElementById("12");
```

We also know that `element`'s type will be what `document.getElementById` returns, which we can confirm by hovering over `element`:

```typescript
// hovering over element shows:

const element: HTMLElement | null;
```

So, hovering in different places reveals different information. When I'm working in TypeScript, I hover constantly to get a better sense of what my code is doing.

## JSDoc Comments

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

<!-- We could convert this to an exercise? -->

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

```typescript
const triangle = new Triangle(); // red squiggly line under `Triangle`
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

If you're a JavaScript user, you might have noticed that lots of these features are already available without using TypeScript. Autocomplete, organizing imports, auto imports and hovering all work in JavaScript. Why is that?

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

# 03. TypeScript In The Development Pipeline

We've explored the relationship between JavaScript and TypeScript, and also how TypeScript improves your life as a developer. But let's go a bit deeper. In this chapter we'll get the TypeScript CLI up and running, and see how it fits into the development pipeline.

As an example, we'll be looking at using TypeScript to build a web application. But TypeScript can also be used anywhere JavaScript can - in a Node, Electron, React Native or any other app.

## The Problem with TypeScript in the Browser

Consider this TypeScript file `example.ts` that contains a `run` function that logs a message to the console:

```typescript
const run = (message: string) => {
  console.log(message);
};

run("Hello!");
```

Alongside the `example.ts` file, we have a basic `index.html` file that references the `example.ts` file in a script tag.

```html
<!DOCTYPE html>

<html lang="en">
  <head>
    <meta charset="UTF-8" />

    <title>My App</title>
  </head>

  <body>
    <script src="example.ts"></script>
  </body>
</html>
```

However, when we try to open the `index.html` file in a browser, you'll see an error in the console:

```
Unexpected token ':'
```

There aren't any red lines in the TypeScript file, so why is this happening?

### Runtimes Can't Run TypeScript

The problem is that browsers (and other runtimes like Node.js) can't understand TypeScript on their own. They only understand JavaScript.

In the case of the `run` function, the `: string` after `message` in the function declaration is not valid JavaScript:

```typescript
const run = (message: string) => {
  // `: string` is not valid JavaScript!

  console.log(message);
};
```

Removing `: string` gives us something that looks a bit more like JavaScript, but now TypeScript displays an error underneath `message`:

```typescript
const run = (message) => {}; // red squiggly line under message
```

Hovering over the red squiggly line in VS Code, we can see that TypeScript's error message is telling us that `message` implicitly has an `any` type.

We'll get into what that particular error means later, but for now the point is that our `example.ts` file contains syntax that the browser can't understand, but the TypeScript CLI isn't happy when we remove it.

So, in order to get the browser to understand our TypeScript code, we need to turn it into JavaScript.

## Transpiling TypeScript

The process of turning JavaScript to TypeScript (called 'transpilation') can be handled by the TypeScript CLI `tsc`, which is installed when you install TypeScript. But before we can use `tsc`, we need to set up our TypeScript project.

Open a terminal, and navigate to the parent directory of `example.ts` and `index.html`.

To double check that you have TypeScript installed properly, run `tsc --version` in your terminal. If you see a version number, you're good to go. Otherwise, install TypeScript globally with PNPM by running:

```bash
pnpm add -g typescript
```

With our terminal open to the correct directory and TypeScript installed, we can initialize our TypeScript project.

### Initializing a TypeScript Project

In order for TypeScript to know how to transpile our code, we need to create a `tsconfig.json` file in the root of our project.

Running the following command will generate the `tsconfig.json` file:

```bash
tsc --init
```

Inside of the newly created `tsconfig.json` file, you will find a number of useful starter configuration options as well as many other commented out options.

For now, we'll just stick with the defaults:

```json
// excerpt from tsconfig.json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

With our `tsconfig.json` file in place, we can begin transpilation.

### Running `tsc`

Running the `tsc` command in the terminal without any arguments will take advantage of the defaults in `tsconfig.json` and transpile all TypeScript files in the project to JavaScript.

```bash
tsc
```

In this case, this means that our TypeScript code in `example.ts` file will become JavaScript code inside of `example.js`.

Inside of `example.js`, we can see that the TypeScript syntax has been transpiled into JavaScript:

```javascript
// Inside of the example.js file

"use strict";

const run = (message) => {
  console.log(message);
};

run("Hello!");
```

Now that we have our JavaScript file, we can update the `index.html` file to reference `example.js` instead of `example.ts`:

```html
// inside of index.html

<script src="example.js"></script>
```

Opening the `index.html` file in the browser will now show the expected "Hello!" output in the console without any errors!

### Does TypeScript Change My JavaScript?

Looking at our JavaScript file, we can see how little has changed from the TypeScript code.

```javascript
"use strict";

const run = (message) => {
  console.log(message);
};

run("Hello!");
```

It's removed the `: string` from the `run` function, and added `"use strict";` to the top of the file. But other than that, the code is identical.

This is a key guiding principle for TypeScript - it gives you a thin layer of syntax on top of JavaScript, but it doesn't change the way your code works. It doesn't add runtime validation. It doesn't attempt to optimise your code's performance.

It just adds types (to give you better DX), and then removes them when it's time to turn your code into JavaScript.

> There are some exceptions to this guiding principle, such as enums, namespaces and class parameter properties - but we'll cover those later.

### A Note on Version Control

We've successfully transpiled our TypeScript code to JavaScript, but we've also added a new file to our project. Adding a `.gitignore` file to the root of the project and including `*.js` will prevent the JavaScript files from being added to version control.

This is important, because it communicates to other developers using the repo that the `*.ts` files are the source of truth for the JavaScript.

## Running TypeScript in Watch Mode

You might have noticed something. If you make some changes to your TypeScript file, you'll need to run `tsc` again in order to see the changes in the browser.

This will get old fast. You might forget it, and wonder why your changes aren't yet in the browser. Fortunately, the TypeScript CLI has a `--watch` flag that will automatically recompile your TypeScript files on save:

```
tsc --watch
```

To see it in action, open VS Code with the `example.ts` and `example.js` files side by side.

If you change the `message` being passed to the `run` function in `example.ts` to something else, you'll see the `example.js` file update automatically.

## Errors In The TypeScript CLI

If `tsc` encounters an error, it will display the error in the terminal and the file with the error will be marked with a red squiggly line in VS Code.

For example, try changing the `message: string` to `message: number` in the `run` function inside of `example.ts`:

```typescript
const run = (message: number) => {
  console.log(message);
};

run("Hello world!"); // red squiggly line under "Hello world!"
```

Inside the terminal, `tsc` will display an error message:

```
// inside the terminal

Argument of type 'string' is not assignable to parameter of type 'number'.

run("Hello world!");

Found 1 error. Watching for file changes.

```

Reversing the change back to `message: string` will remove the error and the `example.js` file will again update automatically.

Running `tsc` in watch mode is extremely useful for automatically compiling TypeScript files and catching errors as you write code.

It can be especially useful on large projects because it checks the entire project. This is different to your IDE, which only shows the errors of the file that's currently open.

## TypeScript With Modern Frameworks

The setup we have so far is pretty simple. A TypeScript file, a `tsc –watch` command, and a JavaScript file. But in order to build a frontend app, we're going to need to do a lot more. We'll need to handle CSS, minification, bundling, and a lot more. TypeScript can't help us with all of that.

Fortunately, there are many frontend frameworks that can help.

Vite is one example of a frontend tooling suite that not only transpiles `.ts` files to `.js` files, but also provides a dev server with Hot Module Replacement. Working with an HMR setup allows you to see changes in your code reflected in the browser without having to manually reload the page.

But there's a drawback. While Vite and other tools handle the actual transpilation of TypeScript to JavaScript, they don't provide type checking out of the box. This means that you could introduce errors into your code and Vite would continue running the dev server without telling you. It would even allow you to push errors into production, because it doesn't know any better.

So, we still need the TypeScript CLI in order to catch errors. But if Vite is transpiling our code, we don't need TypeScript to do it too.

Fortunately, we can configure TypeScript's CLI to allow for type checking without interfering with our other tools.

### TypeScript as a Linter

<!-- CONTINUE -->

Inside of the `tsconfig.json` file, there's an option called `noEmit` that tells `tsc` whether or not to emit JavaScript files.

By setting `noEmit` to `true`, any errors that are detected will be shown to us in the IDE as well as being caught in the terminal. This makes a `tsc` step a great addition to a CI/CD system, since it can prevent merging a pull request with TypeScript errors.

When using tools like Vite, Next.js, Remix, or Astro, `noEmit` is set to `true` in the `tsconfig.json` file that ships with the project.

In this way, it's often the case that TypeScript acts more like a linter than part of the build process. It helps us ensure that our code is type safe, but it is not responsible for building our actual JavaScript code.

Later in the book, we'll look closer at more advanced TypeScript configurations for application development.

---

Part 2: Fundamentals

---

# 04. Essential Types and Annotations

Now we've covered most of the why of TypeScript, it's time to start with the how. We'll cover key concepts like type annotations and type inference, as well as how to start writing type-safe functions.

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

As it turns out, TypeScript can infer a lot from the context that your code is run.

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

## Basic Function Annotations

In the previous section, we saw a simple method for annotating function parameters. Let's add a few more tools to our toolbox.

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

<!-- CONTINUE -->

For the `ShoppingCart` example, defining an array of `item` strings would looks like this when using the square bracket syntax:

```typescript
type ShoppingCart = {
  userId: string;

  items: string[];
};
```

With this in place, we must pass in `items` as an array. A single string or other type would result in a type error.

The second syntax is to explicitly write `Array` with the type inside of angle brackets (`<>`):

```typescript
type ShoppingCart = {
  userId: string;

  items: Array<string>;
};
```

#### Solution 2: Arrays of Objects

As it happens, there are a few different ways to express an array of objects. Some of these solutions are nicer than others, but all of them work.

The best approach would be to to create a new `Ingredient` type that we can use to represent the objects in the array:

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

The inline approaches are a bit messy, but they work and can be a nice approach when prototyping.

#### Solution 3: Tuples

In this case, we would update the `setRange` function to use this syntax instead of the array syntax:

```typescript

const setRange = (range: [number, number]) => {

// rest of function body

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

const goToLocation = (coordinates: [number, number, number | undefined]) {

...

```

The problem here is that while the third member of the tuple is able to be a number or `undefined`, the function still is expecting something to be passed in. It's not a good solution to have to pass in `undefined` manually.

Using a named tuple in combination with the optional operator `?` is a better solution:

```tsx

const goToLocation = (coordinates: [latitude: number, longitude: number, elevation?: number]) {

...

```

The values are clear, and using the `?` operator specifies the `elevation` is an optional number. It almost looks like an object, but it's still a tuple.

Alternatively, if you don't want to use named tuples, you can use the `?` operator after the definition:

```tsx

const goToLocation = (coordinates: [number, number, number?]) {

...

```

Optional members of tuples are a funny little quirk of tuples in TypeScript. You probably won't encounter them often, but they can definitely be useful!

## Passing Types To Functions

Let's take a quick look back at the `Array` type we saw earlier.

```ts
Array<string>;
```

This type describes an array of strings. To make that happen, we're passing a type (`string`) as an argument to another type (`Array`).

There are lots of other types that can receive types, like `Promise<string>`, `Record<string, string>`, and others. In each of them, we use the angle brackets to pass a type to another type.

But we can also use that syntax to pass types to functions.

### Strongly Typed Sets

A `Set` is a collection of unique values. It's similar to an array, but it can't contain duplicate values.

To create a `Set`, use the `new` keyword and call `Set`:

```typescript
const formats = new Set();
```

If we hover over the `formats` variable, we can see that it is typed as `Set<unknown>`:

```typescript
// hovering over `formats` shows:

var formats: Set<unknown>;
```

That's because the `Set` doesn't know what type it's supposed to be! We haven't passed it any values, and we haven't passed it any types.

But take a look at those angle brackets. That means that we can pass `Set` a type to let it know what it's supposed to contain:

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

### Strongly Typed Maps

<!-- TODO - rewrite this to focus more on passing the type arguments into the Map -->

A `Map` is to an object as a `Set` is to an array. It is a collection of key-value pairs, where the keys are enforced to be unique.

Creating a `Map` is similar to creating a `Set`, except we pass in an array of key-value pairs. Here we'll specify that the keys are of type `Album` and the values are a string:

```typescript
let musicCollection = new Map([
  [{ artist: "The Beatles", title: "Rubber Soul", year: 1965 }, "Vinyl"],

  [{ artist: "The Beatles", title: "Abbey Road", year: 1969 }, "CD"],
]);
```

In this case, when we hover over `musicCollection`, we can see that the type is inferred as an object with `artist`, `title`, and `year` properties as the key, and a string as the value:

```typescript
// hovering over `musicCollection` shows:

let musicCollection: Map<
  {
    artist: string;

    title: string;

    year: number;
  },
  string
>;
```

However, since we have an `Album` type already created we could specify the types of the key and value in the `Map` by adding the types in angle brackets `<>`:

```typescript
let musicCollection = new Map<Album, string>();

const rubberSoul: Album = {
  artist: "The Beatles",
  title: "Rubber Soul",
  year: 1965,
};

musicCollection.set(rubberSoul, "Vinyl");
```

Then to get the value from the `Map`, we can use the `get` method and pass in the key:

```typescript
const format = musicCollection.get(rubberSoul); // "Vinyl"
```

### Exercises

#### Exercise 1: Passing Types to Set

Here's an interesting problem in TypeScript where we want to restrict the types of elements that can be added to a `Set`.

A new `Set` of `userIds` is created, but we want it to only be numbers:

```typescript
const userIds = new Set();

userIds.add(1);

userIds.add(2);

userIds.add(3);

// @ts-expect-error // red squiggly line under `@ts-expect-error`

userIds.add("123");

// @ts-expect-error // red squiggly line under `@ts-expect-error`

userIds.add({ name: "Max" });
```

Adding numbers 1, 2, and 3 works as expected. However, the `@ts-expext-error` directives have red squiggly lines, which tells us that strings and objects are being allowed into the Set.

If we hover over a call to `userIds.add()`, we can see that it is currently typed as `unknown`:

```typescript

// hovering over `userIds` shows:

Set<unknown>.add(value: unknown): Set<unknown>

```

We'll discuss what `unknown` does in more depth later, but for now you can think of it as TypeScript's way of saying "I don't know what this is, so it could be anything."

How would we type the `Set` so it only accepts numbers?

#### Exercise 2: Passing Types to Map

Here we are creating a `Map`, which is essentially a dictionary.

In this case we want to pass in a number for the key, and an object for the value:

```typescript
const userMap = new Map();

userMap.set(1, { name: "Max", age: 30 });

userMap.set(2, { name: "Manuel", age: 31 });

// @ts-expect-error  // red squiggly line under `@ts-expect-error`

userMap.set("3", { name: "Anna", age: 29 });

// @ts-expect-error // red squiggly line under `@ts-expect-error`

userMap.set(3, "123");
```

There are errors on the `@ts-expect-error` directives because currently any type of key and value is allowed in the `Map`.

```typescript

// hovering over Map shows:

var Map: MapConstructor

new () => Map<any, any> (+3 overloads)

```

How would we type the `userMap` so the key must be a number and the value is an object with `name` and `age` properties?

#### Exercise 3: `JSON.parse()` Can't Receive Type Arguments

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

TypeScript allows us to add a type argument to the `JSON.parse` function, however, it only kind of works in this case.

The test errors tell us that the type of `parsed` is incorrect, and the properties `name` and `age` are not being recognized.

Why this is happening? What would be an alternative way to express this to correct these type errors?

#### Solution 1: Passing Types to Set

Hovering over `Set` when it is created shows us a clue:

```typescript

const userIds = new Set();

// hovering over `Set` shows:

var Set: SetConstructor;

new <unknown>(iterable?: Iterable<unknown> | null | undefined) =>

Set<unknown> (+1 overload)

```

We've seen the angle brackets `<>` before when creating an Array. When combined with parentheses, it's like a function call where we pass in a type argument.

Following this pattern, we can specify we want a `Set` of numbers like so:

```typescript
const userIds = new Set<number>();
```

With this fix, the errors under the `@ts-expect-error` directives go away. We can also see that the `userIds` variable is now typed as `Set<number>`.

It's important that you become familiar with the syntax of passing type arguments into a function call!

There's also an alternative approach, where we can specify the type of the variable itself:

```typescript
const userIds: Set<number> = new Set();
```

This essentially says that whatever we put into the set when creating it must be a number.

For example, the following would result in an error because TypeScript sees only strings instead of numbers:

```typescript
const userIds: Set<number> = new Set(["a", "b", "c"]); // red squiggly line under `userIds`
```

#### Solution 2: Passing Types to Map

There are a few different ways to solve this problem, but we'll start with the most straightforward one.

The first thing to do is to create a `User` type:

```typescript
type User = {
  name: string;

  age: number;
};
```

Following the patterns we've seen so far, it shouldn't take too much guesswork to figure that we need to add `number` and `User` as the types for the `Map`:

```typescript
const userMap = new Map<number, User>();
```

With this change, the errors go away, and we can no longer pass in incorrect types into the `userMap.set` function.

Of course, you wouldn't have to specify the `User` type outside of the `Map` declaration. You could also do it inline:

```typescript
const userMap = new Map<number, { name: string; age: number }>();
```

Or similar to what we saw with the `Set`, we could add the type to the variable and have TypeScript infer the type of the `Map`:

```typescript
const userMap: Map<number, { name: string; age: number }> = new Map();
```

Finally, to bring things full circle, we could replace the inline type with a `User` type:

```typescript
const userMap: Map<number, User> = new Map();
```

#### Solution 3: `JSON.parse()` Can't Receive Type Arguments

Let's look a bit closer at the error message we got when calling `JSON.parse`:

```

Expected 0 type arguments, but got 1.

```

This message indicates that TypeScript is not expecting anything inside the angle braces when calling `JSON.parse`. To resolve this error, we simply remove the angle braces:

```typescript
const parsedData = JSON.parse('{"name": "Alice", "age": 30}');
```

Since `JSON.parse` is now being passed an `any` type, TypeScript is happy. Anything is assignable to `any` and `any` is assignable to anything.

However, we want our parsed data to have the correct type.

Hovering over `JSON.parse`, we can see its type definition:

```typescript

JSON.parse(text: string, reviver?: ((this: any, key: string, value: any) => any)  undefined): any

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

## More Function Typings

Let's expand upon what we've learned about functions and their type annotations so far.

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

We can call this function with any number of strings:

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

If this function was written with only a single `format` parameter, we would have to pass in an array of strings and manually join them together in order to create a single string:

```typescript
getAlbumFormats(
  { artist: "Radiohead", title: "OK Computer", year: 1997 },
  ["CD", "LP", "Cassette"].join(", "),
);
```

Using the rest parameter allows for a much nicer experience.

### Function Types

We've used type annotations to specify the types of function parameters, but we can also specify the types of functions themselves.

If we hover over the `getAlbumFormats` function, we'll see the following:

```typescript
// hovering over `getAlbumFormats` shows:

function getAlbumFormats(album: Album, ...formats: string[]): string;
```

This tells us that `getAlbumFormats` is a function that takes in an `Album` and any number of strings, and returns a string.

Writing out a function type annotation is a bit cleaner to read in the arrow function style:

```typescript
getAlbumFormats: (album: Album, ...formats: string[]) => string;
```

If we wanted to create a new `chooseRandomAlbum` function that takes in an array of `Album`s and the function to get formats, our parameter type annotations would look something like this:

```typescript
function chooseRandomAlbum(
  albums: Album[],
  getAlbumFormatsFn: (album: Album, ...formats: string[]) => string,
) {
  const randomIndex = Math.floor(Math.random() * albums.length);

  const randomAlbum = albums[randomIndex];

  return getAlbumFormatsFn(randomAlbum, "CD", "LP", "Cassette");
}
```

Without specifying the shape of the function passed in, we would end up with the implicity `any` error.

### The `void` Type

But what if our function doesn't return anything at all? This is where TypeScript's `void` type comes in.

Any time a function does a `console.log` or performs some type of side effect, its return type is `void`. This is TypeScript's way of saying that nothing is ever going to be there.

Note that this is different behavior than in JavaScript!

In JavaScript, the type of a function that doesn't return anything is `undefined`, which is a value that can be assigned to a variable.

<!-- TODO - add an example -->

### Typing Async Functions

<!-- TODO -->

### Exercises

#### Exercise 1: Rest Parameters

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

#### Exercise 2: Function Types

Here we have a `modifyUser` function that takes in an array of `users`, an `id` of the user that we want to change, and a `makeChange` function that makes that change:

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

The `modifyUser` type annotation for the `makeChange` function to be updated, while also ensuring that the return type is the same as the `User` type. For example, we should not be able to return a `name` of `123`:

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

#### Exercise 3: Functions Returning `void`

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

addClickEventListener(
  // @ts-expect-error // red squiggly line under `@ts-expect-error`

  "abc",
);
```

Currently there is an error under `listener` because it is implicitly typed as `any`. Because of this, there is also an error under the `@ts-expect-error` directive, because the string being passed into `addClickEventListener` is acceptable for the `listener` parameter.

How should `addClickEventListener` be typed so that the errors are resolved?

#### Exercise 4: Typing Async Functions

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

One way involves adding a type to `fetchData` itself. Another way involves typing `data` itself. Since we're dealing with `any`, there is some flexibility in the types that you can add.

#### Solution 1: Rest Parameters

As we've seen with previous errors involving an `implicit any` type, the solution here is relatively straight forward.

When using rest parameters, all of the arguments passed to the parameter will end up as an array that is passed to the function. So in this case, the `strings` parameter can be typed as an array:

```typescript
export function concatenate(...strings: string[]) {
  return strings.join("");
}
```

#### Solution 2: Function Types

The starting point for annotating the `makeChange` function will look like an arrow function. For now, we'll say it doesn't take in a parameter and returns `any`:

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

```typescript

// inside the `user.map()` function

return makeChange(u)

// hovering over `u` shows:

Expected 0 arguments, but got 1.

```

This tells us we need to add an argument to the `makeChange` function type. We can do this the same as we would for a regular function parameter.

In this case, we will specify that `user` is of type `User`. We also will specify the return type of `User`, which will fix the error where we return `123` as the `name`.

```typescript

const modifyUser = (

user: User[],

id: string,

makeChange: (user: User) => User,

) => {

...

```

Now the errors are resolved, and we have autocompletion for the `User` properties when writing a `makeChange` function.

We can clean up the code a bit by creating a type alias for the `makeChange` function type:

```typescript

type MakeChangeFunc = (user: User) => User

const modifyUser = (

user: User[],

id: string,

makeChange: MakeChangeFunc,

) => {

...

```

This is a great technique for expressing function types for functions as well as callbacks.

#### Solution 3: Functions Returning `void`

Like before, we can start by annotating the `listener` parameter to be a function. For now, we'll specify that it returns a string:

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

#### Solution 4: Typing Async Functions

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

```typescript

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

async function fetchData(): number {  // red squiggly line under number

...

```

Now `data` is typed as a `number`, except we have an error under our return type annotation:

```

The return type of an async function or method must be the global Promise<T> type. Did you mean to write 'Promise<number>'?

```

This is a rare instance of a very helpful error message from TypeScript!

By following its suggestion, we've successfully added the correct return type to our function, and the error is resolved:

```typescript
async function fetchData(): Promise<number> {
  const response = await fetch("https://api.example.com/data");

  const data = await response.json();

  return data;
}
```

By wrapping the `number` inside of `Promise<>`, we make sure that the `data` is awaited before the type is figured out.

If we don't `await` the function call, `data` will have the type `Promise<number>` instead of `number`. This is important because we need to `await` the `fetchData` function for its result to be useful.

```typescript
const data = fetchData();

// hovering over data shows:

const data: Promise<number>;
```

Return types are useful for specifying what a function should return, since TypeScript will enforce it.

---

# 05. Create Sets of Types with Unions, Intersections, and Interfaces

## Unions and Literals

### JavaScript's Dynamic Typing

<!-- TODO - introduce the union type multiverse -->

In JavaScript, we often need to work with variables that can be different types at different times.

Since JavaScript is dynamically typed, it's totally fine if we have a `price` variable be a number `19.99` then change it into a string `"19.99"` later on. This is true for functions as well– we could write a `printPrice` function that accepts a price in either format, and it would print it out without complaint:

```javascript
// JavaScript version of printPrice

function printPrice(price) {
  console.log(`The price is ${price}`);
}

let price = 19.99;

printPrice(price); // The price is 19.99

price = "19.99";

printPrice(price); // The price is 19.99
```

But how would we handle this in TypeScript?

If we specify that `printPrice` accepts a number, TypeScript will throw an error when we try to pass a string to it:

```tsx

// TypeScript version of printPrice

function printPrice(price: number) {

console.log(`The price is ${price}`);

}

let price = 19.99;

printPrice(price); // The price is 19.99

let stringPrice = "19.99";

printPrice(stringPrice); // red squiggly line under stringPrice

// hovering over stringPrice shows:

Error: Argument of type 'string' is not assignable to parameter of type 'number'

```

We know that the `printPrice` function will work just fine if we pass a string to it, but TypeScript won't accept anything else.

Fortunately, TypeScript has a feature that will help us out in this situation.

### Union Types

Union types are TypeScript's way of allowing a variable to be one of several types.

To create a union type, the `|` operator is used to separate the types that the variable can be.

We can use this syntax to update the `printPrice` function to accept a `number | string`:

```tsx
function printPrice(price: number | string) {
  console.log(`The price is ${price}`);
}
```

With this update, we can now pass either a number or a string to the `printPrice` function without any errors.

Union types also work when creating your own type aliases. For example, we can define a `Price` type that can be either a `number` or a `string` and use it in the `printPrice` function:

```tsx
type Price = number | string;

function printPrice(price: Price) {
  console.log(`The price is ${price}`);
}
```

Because `Price` is a union type of `number` and `string`, it is now possible to reassign what was initially a number into a string without TypeScript complaining:

```tsx

let price: Price = 19.99;

printPrice(price); // The price is 19.99

price = "19.99";

printPrice(price); // The price is 19.99

let otherPrice = 19.99;

otherPrice = "19.99"; // red squiggly line under "otherPrice"

// hovering over "otherPrice" shows:

Type 'string' is not assignable to type 'number'

```

#### The Assignability of Union Types

Now that we have a basic understanding of union types, let's take a moment to talk about assignability.

Consider this assignability chart:

![](images/image3.png)

At the top, we have `string | number`. Below are two boxes `string` and `number`, each with their own connecting arrow pointing to `string | number`. This diagram shows that both `string` and `number` are assignable to `string | number`.

When a variable is assigned a union type, TypeScript will only allow the variable to be assigned values that are of one of the types in the union.

However, this doesn't work in reverse. If we have a union type, we won't be able to use it in a place expecting only one of its types.

For example, if we changed the `printPrice` function to only accept a `number`, TypeScript would throw an error when we try to pass a `Price` to it:

```tsx

function printPrice(price: number) {

console.log(`The price is ${price}`);

}

let price: Price = 19.99;

printPrice(price); // red squiggly line under price

// hovering over price shows:

Argument of type 'Price' is not assignable to parameter of type 'number'

```

As we continue through the book, we'll expand the graph with other available types to help you get a better sense of how assignability works in TypeScript.

### Literal Types

Just as TypeScript allows us to create union types from multiple types, it also allows us to create single-value types called literal types.

Let's look at an example that compares how a `string` type compares to a literal type that represents a specific string.

Here we have an `albumFormat` variable that TypeScript will infer as a `string` type. This means we can reassign it to any string value:

```tsx
let albumFormat = "LP";

albumFormat = "CD";
```

However, if we want to restrict the `albumFormat` variable to only be able to hold the value `"LP"`, we can use a literal type:

```tsx

let albumFormat: "LP";

albumFormat = "LP"; // no error because "LP" is assignable to "LP"

albumFormat = "CD"; // red squiggly line under "CD"

// hovering over "CD" shows:

Type '"CD"' is not assignable to type '"LP"'

```

### Combining Union Types and Literal Types

TypeScript allows us to combine union types and literal types to create complex type definitions.

To update our `albumFormat` example, we can turn it into a union type containing literal types for the various available album formats:

```tsx
let albumFormat: "LP" | "CD" | "MP3" | "FLAC" | "Cassette";
```

Now, the `albumFormat` variable can only be assigned one of the four literal types we specified. Choosing any other value will result in a TypeScript error:

```tsx

albumFormat = "Edison Wax Cylinder"; // red squiggly line under albumFormat

// hovering over albumFormat shows:

Type '"Edison Wax Cylinder"' is not assignable to type '"LP" | "CD" | "MP3" | "FLAC" | "Cassette"'

```

Creating a type alias for the union of literals is a good way to clean this up:

```tsx
type AlbumFormat = "LP" | "CD" | "MP3" | "FLAC" | "Cassette";

let format: AlbumFormat = "LP";

console.log(format); // "LP"
```

It's great to have a union type representing all of the possible album formats, but it might be useful to have more specific types representing the formats for use in different parts of our application.

#### Combining Union Types of Union Types

Union types can be combined with other union types to create even more complex type definitions.

For example, we can create `DigitalFormat` and `PhysicalFormat` types that contain a union of literal values:

```tsx
type DigitalFormat = "MP3" | "FLAC";

type PhysicalFormat = "LP" | "CD" | "Cassette";
```

We could then specify `AlbumFormat` as a union of `DigitalFormat` and `PhysicalFormat:

```tsx
type AlbumFormat = DigitalFormat | PhysicalFormat;
```

Now, we can use the `DigitalFormat` type for functions that handle digital formats, and the `AnalogFormat` type for functions that handle analog formats. The `AlbumFormat` type can be used for functions that handle all cases.

This way, we can ensure that each function only handles the cases it's supposed to handle, and TypeScript will throw an error if we try to pass an incorrect format to a function.

### How Big Can Union Types Get?

You probably won't ever have an issue with the size of your union types, but it's worth noting that there is an upper limit to how many members there can be.

Consider a union type `Alphabet` that includes literals for each letter of the alphabet:

```tsx

type Alphabet = "a" | "b" | "c" | // pretend all 26 letters are here

```

Using some advanced type syntax that we'll cover later in the book, we'll do some type manipulation to create a `TooBig` type based on the `Alphabet` type:

```tsx
type TooBig = `${Alphabet}${Alphabet}${Alphabet}${Alphabet}`; // red squiggly line under the string template
```

The syntax above sets the `TooBig` type to be a union of every possible four letter combination of the `Alphabet` type. From `"AAAA" | "AAAB" | "AAAC" | ...` to `... | "ZZZY" | "ZZZZ"`, the `TooBig` type would contain 26^4, or 456,976 members.

This is too large for TypeScript to handle, which is why it gives an error under the string template:

```

Expression creates a union type that is too complex to represent.

```

As mentioned before, you probably won't ever have an issue with the size of your unions. However, for situations where there are a large number of possible values, you should consider just using `string` as the type and handling logic and validation elsewhere in your code.

### Resolving Literal Types to Wider Types

Let's look at how a union of literal types is resolved to a wider type.

Consider this `getResolvedIconSize` function that takes in an `iconSize` parameter that is a union of literal types `"small" | "medium" | "large"` as well as just the `string` type:

```typescript
const getResolvedIconSize = (
  iconSize: "small" | "medium" | "large" | string, // notice the mix of literal types & string
) => {
  switch (iconSize) {
    case "small":
      return 16;

    case "medium":
      return 32;

    case "large":
      return 48;

    default:
      return iconSize;
  }
};
```

Inside the function, we have a `switch` statement that returns the corresponding size for the given `iconSize`. If the `iconSize` is not one of the literal sizes, then it just returns the `iconSize`.

Let's revisit the assignability chart to see what's going on here.

#### Assignability of Literal Types with Wider Types

We have a union of literal types `"small" | "medium" | "large"` and the `string` type and the wider string type.

Any of the individual `"small"`, `"medium"`, and `"large"` literals are assignable to the literals as well as `string`. In turn, `string` is assignable to `"small" | "medium" | "large" | string`.

Following the pattern we've seen in previous examples, we might draw the assignability chart like this:

![](images/image1.png)

However, this chart isn't quite accurate.

Because all of the individual literals are in a union with their wider type, they get cancelled out. TypeScript looks at the union and sees that it can just be represented by `string`, so it goes with that instead of the size literals.

Here's what the more actual assignability chart looks like:

![](images/image6.png)

Even though the `getResolvedIconSize` function looks like we could pass in any of the sizes, when TypeScript sees the union of literal types and a wider type, it resolves to the wider type.

We can see this behavior happening when trying to pass in one of the sizes, because there will not be autocompletion for the individual sizes as we're typing:

```typescript
getResolvedIconSize("small"); // no autocompletion for "small"
```

However, when we hover over the call to `getResolvedIconSize`, we'll still see the full union from the function signature:

```typescript
// hovering over getResolvedIconSize shows:

const getResolvedIconSize: (
  iconSize: "small" | "medium" | "large" | string,
) => string | 16 | 32 | 48;
```

#### Autocompletion Trick for Literal Types with Wider Types

There is a workaround that can be added to the function signature that will work when literal types are in a union with a wider type.

By wrapping the wider type in parentheses and including an ampersand with an empty object, we will get the desired behavior:

```typescript

const getResolvedIconSize = (iconSize: "small" | "medium" | "large" | (string & {}),) => {

...

}

```

While this trick is interesting, it's not something to be applied without proper thought and understanding of its implications. We'll look behind the scenes of this syntax later.

For now, the big takeaway here is that you shouldn't think about a union of literals and their wider types together as "this or that". Instead, think of them as just the wider type since that is what TypeScript will resolve to.

#### Exercises

##### Exercise 1: `string` or `null`

Here we have a function called `getUsername` that takes in a `username` string. If the `username` is not equal to `null`, we return a new interpolated string. Otherwise, we return `"Guest"`:

```typescript
function getUsername(username: string) {
  if (username !== null) {
    return `User: ${username}`;
  } else {
    return "Guest";
  }
}
```

In the first test, we call `getUsername` and pass in a string of "Alice" which passes as expected. However, in the second test, we have a red squiggly line under `null` when passing it into `getUsername`:

```typescript
const result = getUsername("Alice");

type test = Expect<Equal<typeof result, string>>;

const result2 = getUsername(null); // red squiggly line under `null`

type test2 = Expect<Equal<typeof result2, string>>;
```

Hovering over `null` shows us the following error message:

```

Argument of type 'null' is not assignable to parameter of type 'string'.

```

Normally we wouldn't explicitly call the `getUsername` function with `null`, but it's important that we handle `null` values appropriately. For example, we might be getting the `username` from a user record in a database, and the user might or might not have a name depending on how they signed up.

Currently, the `username` parameter only accepts a `string` type, and the check for `null` isn't doing anything. Update the type definition so the errors are resolved and the function can handle `null` values.

##### Exercise 2: Restricting Function Parameters

Here we have a `move` function that takes in a `direction` of type string, and a `distance` of type number:

```tsx
function move(direction: string, distance: number) {
  // Move the specified distance in the given direction
}
```

The implementation of the function is not important, but the idea is that we want to be able to move either up, down, left, or right.

Here's what calling the `move` function might look like:

```typescript
move("up", 10);

move("left", 5);
```

To test this function, we have the `@ts-expect-error` directives that tell TypeScript we expect the following lines to throw an error.

However, since the `move` function currently takes in a `string` for the `direction` parameter, we can pass in any string we want, even if it's not a valid direction. There is also a test where we expect that passing `20` as a distance won't work, but it's being accepted as well.

This leads to TypeScript drawing red squiggly lines under the `@ts-expect-error` directives:

```typescript
move(
  // @ts-expect-error - "up-right" is not a valid direction // red squiggly line

  "up-right",

  10,
);

move(
  // @ts-expect-error - "down-left" is not a valid direction // red squiggly line

  "down-left",

  20,
);
```

Your challenge is to update the `move` function so that it only accepts the strings `"up"`, `"down"`, `"left"`, and `"right"`. This way, TypeScript will throw an error when we try to pass in any other string.

##### Solution 1: `string` or `null`

The solution is to update the `username` parameter to be a union of `string` and `null`:

```typescript

function getUsername(username: string | null) {

...

```

With this change, the `getUsername` function will now accept `null` as a valid value for the `username` parameter, and the errors will be resolved.

##### Solution 2: Restricting Function Parameters

In order to restrict what the `direction` can be, we can use a union type of literal values (in this case strings).

Here's what this looks like:

```typescript
function move(direction: "up" | "down" | "left" | "right", distance: number) {
  // Move the specified distance in the given direction
}
```

With this change, we now have autocomplete for the possible `direction` values.

To clean things up a bit, we can create a new type alias called `Direction` and update the parameter accordingly:

```typescript
type Direction = "up" | "down" | "left" | "right";

function move(direction: Direction, distance: number) {
  // Move the specified distance in the given direction
}
```

## Narrowing

Narrowing in TypeScript allows us to refine a value that can be more than one type. We do this through conditional statements that use type guards to check the variable's type. The more certain TypeScript is about what it's working with, the more safe our code will be.

### Narrowing with `typeof`

The `typeof` operator is useful for determining what type a given variable is.

Consider a function `getAlbumYear` that takes in a parameter `year`, which can either be a `string` or `number`. Here's how we could use the `typeof` operator to narrow down the type of `year`:

```typescript

const getAlbumYear = (year: string | number ) => {

if (typeof year === "string") {

console.log(`The album was released in ${year}.`); // `year` is string

} else (typeof year === "number") {

console.log(`The album was released in ${year}.`); // `year` is number

}

};

```

It looks straightforward, but there are some important things to realize about what's happening behind the scenes.

Scoping plays a big role in narrowing. In the first `if` block, TypeScript understands that `year` is a `string` because we've used the `typeof` operator to check its type. In the `else` block, TypeScript understands that `year` is a `number` because we've used the `typeof` operator to check its type.

However, anywhere outside of the conditional block the type of `year` is still the union `string | number`. This is because narrowing only applies within the block's scope.

For the sale of illustration, if we add a `boolean` to the `year` union, the first `if` block will still end up with a type of `string`, but the `else` block will end up with a type of `number | boolean`:

```typescript

const getAlbumYear = (year: string | number | boolean) => {

if (typeof year === "string") {

console.log(`The album was released in ${year}.`); // `year` is string

} else (typeof year === "number") {

console.log(`The album was released in ${year}.`); // `year` is number | boolean

}

console.log(year); // `year` is string | number | boolean

};

```

### Narrowing with the switch(true) Pattern

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

### Other Ways to Narrow

The `typeof` operator is just one way to narrow types.

TypeScript can use other conditional operators like `&&` and `||`, and will take the truthiness into account for coercing the boolean value. It's also possible to use other operators like `instanceof` and `in` for checking object properties.

However, there are some situations where narrowing doesn't quite work as expected.

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

### Exercises

#### Exercise 1: Narrowing with `if` Statements

Here we have a function called `validateUsername` that takes in either a `string` or `null`, and will always return a `boolean`:

```typescript
function validateUsername(username: string | null): boolean {
  return username.length > 5; // red squiggly line under `username`

  return false;
}
```

Tests for checking the length of the username pass as expected:

```typescript
it("should return true for valid usernames", () => {
  expect(validateUsername("Matt1234")).toBe(true);

  expect(validateUsername("Alice")).toBe(false);

  expect(validateUsername("Bob")).toBe(false);
});
```

However, we have an error underneath `username` inside of the function body, because it could possibly be `null` and we are trying to access a property off of it.

```typescript
it("Should return false for null", () => {
  expect(validateUsername(null)).toBe(false);
});
```

Your task is to rewrite the `validateUsername` function to add narrowing so that the `null` case is handled and the tests all pass.

#### Exercise 2: Throwing Errors to Narrow

Here we have a line of code that uses `document.getElementById` to fetch an HTML element, which can return either an `HTMLElement` or `null`:

```typescript
const appElement = document.getElementById("app");
```

Currently, a test to see if the `appElement` is an `HTMLElement` fails:

```typescript
type Test = Expect<Equal<typeof appElement, HTMLElement>>; // red squiggly line under Equal<>
```

Your task is to refactor the code to throw an `Error` if `appElement` doesn't exist.

#### Exercise 3: Narrowing API Responses

Here we have a `HandleResponse` function that takes in a type of `APIResponse`, which is a union of two types of objects.

The goal of the `HandleResponse` function is to check whether the provided object has a `data` property. If it does, the function should return the `id` property. If not, it should throw an `Error` with the message from the `error` property.

```tsx
type APIResponse =
  | {
      data: {
        id: string;
      };
    }
  | {
      error: string;
    };

const handleResponse = (response: APIResponse) => {
  // How do we check if 'data' is in the response?

  if (true) {
    return response.data.id;
  } else {
    throw new Error(response.error);
  }
};
```

Currently, there are several errors being thrown as seen in the following tests.

The first error is `Property 'data' does not exist on type 'APIResponse'`

```tsx
test("passes the test even with the error", () => {
  // there is no error in runtime

  expect(() =>
    HandleResponseOrThrowError({
      error: "Invalid argument",
    }),
  ).not.toThrowError();

  // but the data is returned, instead of an error.

  expect(
    HandleResponseOrThrowError({
      error: "Invalid argument",
    }),
  ).toEqual("Should this be 'Error'?");
});
```

Then we have the inverse error, where `Property 'error' does not exist on type 'APIResponse'`:

```tsx

Property data does not exist on type 'APIResponse'.ts.

```

We're also getting a warning because we have unreachable code on the `if (true)` statement.

Your challenge is to find the correct syntax for narrowing down the types within the `HandleResponse` function's `if` condition.

The changes should happen inside of the function without modifying any other parts of the code.

#### Solution 1: Narrowing with `if` Statements

There are several different ways to validate the username length.

##### Option 1: Check for `username`

We could use an `if` statement to check if `username` exists. If it does, we can return `username.length > 5`, otherwise we can return `false`:

```typescript
function validateUsername(username: string | null): boolean {
  // Rewrite this function to make the error go away

  if (username) {
    return username.length > 5;
  }

  return false;
}
```

This implementation corresponds to the logic we wanted in the exercise, but it doesn't account for other behavior we would want in the real world like checking for empty strings.

##### Option 2: Check if `typeof username` is `"string"`

We could use `typeof` to check if the username is a string:

```typescript
function validateUsername(username: string | null): boolean {
  if (typeof username === "string") {
    return username.length > 5;
  }

  return false;
}
```

##### Option 3: Check if `typeof username` is not `"string"`

Similar to the above, we could check if `typeof username !== "string"`.

In this case, if `username` is not a string, we know it's `null` and could return `false` right away. Otherwise, we'd return the check for length being greater than 5:

```typescript
function validateUsername(username: string | null | undefined): boolean {
  if (typeof name !== "string") {
    return false;
  }

  return username.length > 5;
}
```

This approach has the unconventional implementation of this exercise, but it is nice to know how to properly check for a `null`, so you should be aware of this method as well.

##### Option 4: Check if `typeof username` is `"object"`

An unconventional approach to checking for `null` is by exploiting a JavaScript quirk where the type of `null` is equal to `"object"`.

The body is otherwise the same as the previous option:

```typescript
function validateUsername(username: string | null): boolean {
  if (typeof username === "object") {
    return false;
  }

  return username.length > 5;
}
```

##### Option 5: Extract the check into its own variable

Finally, for readability and reusability purposes you could store the check in its own variable `isUsernameNotNull` and negate the boolean. Since we don't care about the return value or the naming in the guard clause, we can also negate the value and use the double-bang to ensure we have just a boolean.

Here's what this would look like:

```typescript
function validateUsername(username: string | null): boolean {
  const isUsernameOK = typeof username === "string";

  if (isUsernameOK) {
    return username.length > 5;
  }

  return false;
}
```

All of the above options use `if` statements to perform checks by narrowing types by using `typeof`.

No matter which option you go with, remember that you can always use an `if` statement to narrow your type and add code to the case that the condition passes.

#### Solution 2: Throwing Errors to Narrow

In order to crash the app if `appElement` does not exist, we can add an `if` statement that checks if `appElement` is `null` or does not exist, then throws an error:

```tsx
if (!appElement) {
  throw new Error("Could not find app element");
}
```

By adding this error condition, we can be sure that we will never reach any subsequent code if `appElement` is `null`.

If we hover over `appElement` after the `if` statement, we can see that TypeScript now knows that `appElement` is an `HTMLElement`. This means our test also now passes:

```tsx
console.log(appElement);

// hovering over `appElement` shows:

const appElement: HTMLElement;

type Test = Expect<Equal<typeof appElement, HTMLElement>>; // passes
```

Throwing errors like this can help you identify issues at runtime. In this specific case, it acts like a type annotation that narrows down the code inside of the immediate `if` statement scope.

In general, this technique is useful any time you need to manage logical flow in your applications.

#### Solution 3: Narrowing API Responses

It may be tempting to change the `APIReponse` type to make it a little bit different. For example, we could add an `error` as a string on one side and `data` as undefined on the other branch:

```tsx
// Don't change the type like this!

type APIResponse =
  | {
      data: {
        id: string;
      };

      error: undefined;
    }
  | {
      data?: undefined;

      error: string;
    };
```

However, there's a much simpler way to do this.

We can use an `in` operator to check if a specific key exists on `json`.

In this example, it would check for the key `data`:

```typescript
const handleResponse = (response: APIResponse) => {
  if ("data" in response) {
    return response.data.id;
  } else {
    throw new Error(response.error);
  }
};
```

The neat thing about this approach is that it manages to narrow the type of the `response` without needing an environment where narrowing can occur.

If the `response` isn't the one with `data` on it, then it must be the one with `error`, so we can throw an `Error` with the error message.

Using `in` here gives us a great way to narrow down objects that might have different keys from one another.

## `unknown` and `never`

Let's pause for a moment to introduce a couple more types that play an important role in TypeScript, particularly when it comes to narrowing.

### The `unknown` Type

TypeScript has a special type called `unknown`. It represents something we don't know what it is, but we still want to keep type checking on it.

The `unknown` type sits at the top of our type hierarchy in TypeScript. All other types like strings, numbers, booleans, null, undefined, and their respective literals are assignable to `unknown`, as seen in its assignability chart:

<img src="https://res.cloudinary.com/total-typescript/image/upload/v1706814781/065-introduction-to-unknown.explainer_ohm9pd.png">

Consider this example function `fn` that takes in an `input` parameter of type `unknown`:

```typescript
const fn = (input: unknown) => {};

// Anything is assignable to unknown!

fn("hello");

fn(42);

fn(true);

fn({});

fn([]);

fn(() => {});
```

All of the above function calls are valid because `unknown` is assignable to any other type, and unlike the `any` type, it can be checked against.

The `unknown` type is the preferred choice when you want to represent something that's truly unknown in JavaScript. For example, it is extremely useful when you have things coming into your application from outside sources, like input from a form.

However, the `unknown` type must be narrowed before you can do anything with it. You can't access any properties on `unknown`, or call any functions except for those that expect `unknown`.

### The `never` Type

Let's go from the top of the assignability chart to the bottom.

But first, consider this function that doesn't return anything:

```typescript
const getNever = () => {
  // This function never returns!
};
```

When checking the type of this function, TypeScript will infer that it returns `void`, indicating that it essentially returns nothing.

```typescript
// hovering over `getNever` shows:

const getNever: () => void;
```

However, if we throw an error inside of the function, the function will never return:

```typescript
const getNever = () => {
  throw new Error("This function never returns");
};
```

With this change, TypeScript will infer that the function's type is `never`:

```typescript
// hovering over `getNever` shows:

const getNever: () => never;
```

The `never` type represents something that can never happen. Where the `unknown` type is like the "top" type in TypeScript, `never` is like the "bottom".

There are some weird implications for the `never` type.

You cannot assign anything to `never`, except for `never` itself.

```typescript
// red squiggly lines under everything in parens

fn("hello");

fn(42);

fn(true);

fn({});

fn([]);

fn(() => {});

// no error here, since we're assigning `never` to `never`

fn(getNever());
```

However, you can assign `never` to anything:

```typescript
const str: string = getNever();

const num: number = getNever();

const bool: boolean = getNever();

const arr: string[] = getNever();
```

Let's update the assignability chart to include `never`:

![](images/image2.png)

The `never` type can be assigned to any other type, but nothing can be assigned to it.

As shown in the diagram, `never` truly is the bottom type in TypeScript. Nothing can be assigned to the `never` type but the `never` type. The `unknown` type is at the top of the hierarchy and can have anything assigned to it, but you can't go the other way.

It might be confusing initially, but keeping this hierarchy in mind and understanding the relationship between `unknown` and `never` will help you grasp the concept more smoothly as you progress through the exercises.

### Exercises

#### Exercise 1: Dealing with Unknown Errors

In TypeScript, one of the most common places you'll encounter the `unknown` type is when using a `try...catch` statement to handle potentially dangerous code. Let's consider an example:

```typescript
const somethingDangerous = () => {
  if (Math.random() > 0.5) {
    throw new Error("Something went wrong");
  }

  return "all good";
};

try {
  somethingDangerous();
} catch (error) {
  if (true) {
    console.error(error.message); // red squiggly line under error in `error.message`
  }
}
```

In the code snippet above, we have a function called `somethingDangerous` that has a 50-50 chance of either throwing an error with the message "Something went wrong" or returning "all good". We're using a `try...catch` block to handle any errors that might be thrown by the function.

Notice that the `error` variable in the `catch` clause is typed as `unknown`. This is the default behavior in TypeScript.

Now let's say we want to log the error using `console.error()` only if the error contains a `message` attribute. We know that errors typically come with a `message` attribute, like in the following example:

```typescript
const error = new Error("Some error message");

console.log(error.message);
```

Your task is to update the `if` statement to have the proper condition to check if the `error` has a message attribute before logging it. Remember, `error` is a class!

#### Exercise 2: Narrowing `unknown` to a Value

Here we have a `parseValue` function that takes in an `unknown` value:

```typescript
const parseValue = (value: unknown) => {
  if (true) {
    return value.data.id; // red squiggly line under `value`
  }

  throw new Error("Parsing error!");
};
```

The goal of this function is to return the `id` property of the `data` property of the `value` object. If the `value` object doesn't have a `data` property, then it should throw an error.

Here are some tests for the function that show us the amount of narrowing that needs to be done inside of the `parseValue` function:

```typescript
it("Should handle a { data: { id: string } }", () => {
  const result = parseValue({
    data: {
      id: "123",
    },
  });

  type test = Expect<Equal<typeof result, string>>;

  expect(result).toBe("123");
});

it("Should error when anything else is passed in", () => {
  expect(() => parseValue("123")).toThrow("Parsing error!");

  expect(() => parseValue(123)).toThrow("Parsing error!");
});
```

Your challenge is to modify the `parseValue` function so that the tests pass and the errors go away. As a head's up, the solution requires a large conditional statement!

#### Solution 1: Dealing with Unknown Errors

The way to solve this challenge is to narrow types using the `instanceof` operator.

Where we check the error message, we'll check if `error` is an instance of `Error`:

```typescript
if (error instanceof Error) {
  console.log(error.message);
}
```

The `instanceof` operator covers all children that come from `Error` class as well, such as `TypeError`.

Even though it works in this particular example for all kinds of `Error`s, in the real world someone may be throwing a string in code instead. To be more safe from these edge cases, it's a good idea to include an `else` block that would throw the `error` variable like so:

```typescript
if (error instanceof Error) {
  console.log(error.message);
} else {
  throw error;
}
```

Now `unknown` has been narrowed down into a known class.

#### Solution 2: Narrowing `unknown` to a Value

Here's our starting point:

```typescript
const parseValue = (value: unknown) => {
  if (true) {
    return value.data.id; // red squiggly line under `value`
  }

  throw new Error("Parsing error!");
};
```

To fix the error, we'll need to narrow the type using conditional checks. Let's take it step-by-step.

First, we'll check if the type of `value` is an `object` by replacing the `true` with a type check:

```typescript
if (typeof value === "object") {
  return value.data.id; // red squiggly line under `value` and `data`
}
```

Then we'll check if the `value` argument has a `data` attribute using the `in` operator:

```typescript
if (typeof value === "object" && "data" in value) {
  // red squiggly line under `value`

  return value.data.id; // red squiggly line under `value` and `data`
}
```

With this change, TypeScript is complaining that `value` is possibly `null`.

To fix this, we can add `&& value` to our first condition to make sure it isn't `null`:

```typescript
if (typeof value === "object" && value && "data" in value) {
  return value.data.id; // red squiggly line under `value` and `data`
}
```

Now our condition check is passing, but we're still getting an error on `value.data` being typed as `unknown`.

What we need to do now is to narrow the type of `value.data` to an `object` and make sure that it isn't `null`. At this point we'll also add specify a return type of `string` to avoid returning an `unknown` type:

```typescript
const parseValue = (value: unknown): string => {
  if (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    typeof value.data === "object" &&
    value.data !== null
  ) {
    return value.data.id; // red squiggly line under `id`
  }

  throw new Error("Parsing error!");
};
```

Finally, we'll add a check to ensure that the `id` is a string. If not, TypeScript will throw an error:

```typescript
const parseValue = (value: unknown): string => {
  if (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    typeof value.data === "object" &&
    value.data !== null &&
    "id" in value.data &&
    typeof value.data.id === "string"
  ) {
    return value.data.id;
  }

  throw new Error("Parsing error!");
};
```

Now when we hover over `parseValue`, we can see that it takes in an `unknown` input and always returns a `string`:

```typescript
// hovering over `parseValue` shows:

const parseValue: (value: unknown) => string;
```

Thanks to this huge conditional, our tests pass, and our error messages are gone!

As a side note, the Zod library would allow us to do this in a single line of code, but knowing how to do this manually is a great exercise to understand how narrowing works in TypeScript.

## Working With “Unique but Related” Types

<!-- TODO - figure out a better title for this -->

We've seen how unions can be used to combine different types into a single type. However, there are situations where working with unions can get a bit cumbersome.

For example, when working with a union of types that share a common property but may have properties that are unique to each type, you may find yourself needing to write multiple type guards to narrow down the type.

Consider this `Album` type, which includes a required `format`, `title`, `artist`, and `totalLength` attributes, as well as optional attributes related to length and speed:

```typescript
type Album = {
  format: "CD" | "Cassette" | "Vinyl";

  title: string;

  artist: string;

  totalLength: number;

  maxCDLength?: 80;

  maxSideLength?: number;
};
```

Say we wanted to write a function that will determine the number of discs or records or cassettes that an album will be released on. We could check if the `format` is "CD", then return `album.totalLength` divided by `album.maxCDLength` since a CD only has one side. Otherwise, we would return `album.totalLength` divided by `album.maxSideLength` since we know it would be either cassette or vinyl which have two sides:

```tsx
function calculateUnitsNeeded(album: Album): number {
  if (album.format === "CD") {
    // Assuming maxCDLength is always 80 for CDs

    return Math.ceil(album.totalLength / album.maxCDLength); // red squiggly line under album.maxCDLength
  } else {
    // For Vinyl and Cassette, using maxSideLength

    return Math.ceil(album.totalLength / (album.maxSideLength * 2)); // red squiggly line under album.maxSideLength
  }
}
```

With this current implementation, TypeScript is giving us errors underneath `album.maxCDLength` and `album.maxSideLength`:

```tsx

// hovering over album.maxCDLength shows:

'album.maxCDLength' is possibly 'undefined'

// hovering over album.maxSideLength shows:

'album.maxSideLength' is possibly 'undefined'

```

The error messages tell us that the optional properties on the `Album` type could be `undefined`, so this code could cause a runtime error when trying to do math operations with them.

Instead of having a single type with multiple optional properties, we can create separate types for each that includes only the properties that are relevant to that format:

```tsx
type CD = {
  format: "CD";

  title: string;

  artist: string;

  totalLength: number;

  maxCDLength: 74;
};

type Cassette = {
  format: "Cassette";

  title: string;

  artist: string;

  totalLength: number;

  maxSideLength: 45;
};

type Vinyl = {
  format: "Vinyl";

  title: string;

  artist: string;

  totalLength: number;

  maxSideLength: 22;
};
```

### Introducing Discriminated Unions

Now that we have clear-cut types for each format, we can form a union that accurately represents the `Album`:

```typescript
type Album = CD | Cassette | Vinyl;
```

The `Album` type is now a discriminated union, as it consolidates distinct formats into a single type. The key to this union is the `format` property, which acts as the discriminator.

With this change, the `calculateUnitsNeeded` function makes use of the discriminated `Album` type to check for the `format` property and accordingly determine the album's type without errors:

```tsx
function calculateUnitsNeeded(album: Album): number {
  if (album.format === "CD") {
    return Math.ceil(album.totalLength / album.maxCDLength);
  } else {
    return Math.ceil(album.totalLength / (album.maxSideLength * 2));
  }
}
```

If the album's `format` is `"CD"`, we know it will have a `maxCDLength` property. Otherwise, we know that the `maxSideLength` property will be present. Using a discriminated union also provides us with autocomplete and type checking for the properties specific to each format.

It is important to keep the discriminator consistent across every type in the discriminated union. For example, changing `format` of `CD` to `type` would cause the union to crumble.

However, the type of the discriminator doesn't have to be a string literal. It could be a number, a boolean, or an enum value.

Similarly, you don't have to use types as the members of a discriminated union. You could use interfaces, tuples, or even classes– the only requirement is to have a discriminator property that is common to all members of the discriminated union. This ensures TypeScript will be able to narrow properly.

### Exercises

#### Exercise 1: Destructuring a Discriminated Union

Consider a discriminated union called `Shape` that is made up of two types: `Circle` and `Square`. Both types have a `kind` property that acts as the discriminator.

```tsx
type Circle = {
  kind: "circle";

  radius: number;
};

type Square = {
  kind: "square";

  sideLength: number;
};

type Shape = Circle | Square;
```

This `calculateArea` function destructures the `kind`, `radius`, and `sideLength` properties from the `Shape` that is passed in, and calculates the area of the shape accordingly:

```typescript
function calculateArea({ kind, radius, sideLength }: Shape) {
  // red squiggly lines under radius and sideLength

  if (kind === "circle") {
    return Math.PI * radius * radius;
  } else {
    return sideLength * sideLength;
  }
}
```

However, TypeScript is showing us errors below `'radius'` and `'sideLength'`:

```tsx

// hovering over radius shows:

Property 'radius' does not exist on type 'Shape'.

// hovering over sideLength shows:

Property 'sideLength' does not exist on type 'Shape'.

```

We get this error because TypeScript cannot guarantee that `radius` and `sideLength` will be present on the `Shape` type. A more accurate error would tell us that these properties do not exist on all branches of the `Shape` type. Because the `kind` property does exist on all branches, we do not have an error under that property.

Your task is to update the implementation of the `calculateArea` function so that destructuring properties from the passed in `Shape` works without errors. Hint: this may involve changing the location where the destructuring takes place.

#### Exercise 2: Narrowing a Discriminated Union with a Switch Statement

Here we have a version of the `calcuateArea` function that uses an `if-else` statement to calculate the area of a circle or square without doing any destructuring:

```typescript
function calculateArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius * shape.radius;
  } else {
    return shape.sideLength * shape.sideLength;
  }
}
```

Your challenge is to refactor this function to use a `switch` statement based on the `kind` property instead of an `if-else` statement.

The reason behind this refactor is that `switch` statements make it easier to extend the function to allow for more shapes without repeating `if (shape.kind === "whatever")` over and over again.

As you refactor, ensure that all the behavior is preserved. The area should be calculated accurately, regardless of the shape.

#### Exercise 3: Destructuring a Discriminated Union of Tuples

Here we have a `fetchData` function that returns a promise that resolves to an `ApiResponse` tuple that consists of two elements.

The first element is a string that indicates the type of the response. The second element can be either an array of `User` objects in the case of successful data retrieval, or a string in the event of an error:

```typescript

type APIResponse = [string, User[]] | string];

```

Here's what the `fetchData` function looks like:

```typescript
async function fetchData(): Promise<ApiResponse> {
  try {
    const response = await fetch("https://api.example.com/data");

    if (!response.ok) {
      return [
        "error",

        // Imagine some improved error handling here

        "An error occurred",
      ];
    }

    const data = await response.json();

    return ["success", data];
  } catch (error) {
    return ["error", "An error occurred"];
  }
}
```

However, as seen in the tests below, the `ApiResponse` type currently will allow for other combinations that aren't what we want. For example, it would allow for passing an error message when data is being returned:

```tsx
async function exampleFunc() {
  const [status, value] = await fetchData();

  if (status === "success") {
    console.log(value);

    type test = Expect<Equal<typeof value, User[]>>; // red squiggly lines under Equal<>
  } else {
    console.error(value);

    type test = Expect<Equal<typeof value, string>>; // red squiggly lines under Equal<>
  }
}
```

The problem stems from the `ApiResponse` type being too wide.

The `ApiResponse` type needs to be updated so that there are two possible combinations for the returned tuple:

If the first element is `"error"` then the tuple signifies an error occurred with the second element being the error message.

Otherwise, if the first element is `"success"` the tuple carries the successful payload, which is an array of `User` objects.

Your challenge is to redefine the `ApiResponse` type to be a discriminated unions of tuples that only allows for the specific combinations for the `success` and `error` states defined above.

#### Exercise 4: Handling Defaults with a Discriminated Union

We're back to the `calculateArea` function example:

```typescript
function calculateArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius * shape.radius;
  } else {
    return shape.sideLength * shape.sideLength;
  }
}
```

Until now, the test cases have involved checking if the `kind` of the `Shape` is a `circle` or a `square`, then calculating the area accordingly.

However, a new test case has been added for a situation where no `kind` value has been passed into the function:

```typescript
it("Should calculate the area of a circle when no kind is passed", () => {
  const result = calculateArea({
    radius: 5, // red squiggly line under radius
  });

  expect(result).toBe(78.53981633974483);

  type test = Expect<Equal<typeof result, number>>;
});
```

TypeScript is showing errors under `radius` in the test:

```typescript

Argument of type '{ radius: number; }' is not assignable to parameter of type 'Shape'.

Property 'kind' is missing in type '{ radius: number; }' but required in type 'Circle'.

```

The test expects that if a `kind` isn't passed in, the shape should be treated as a circle. However, the current implementation doesn't account for this.

Your challenge is to make updates to the `Shape` discriminated union that will allow for a missing value. Next, you'll need to make adjustments to the `calculateArea` function to ensure that TypeScript's type narrowing works properly within the function.

#### Solution 1: Destructuring a Discriminated Union

Before we look at the working solution, let's look at an attempt that doesn't work out.

##### A Non-Working Attempt at Destructuring Parameters

Since we know that `kind` is present in all branches of the discriminated union, we can try using the rest parameter syntax to bring along the other properties:

```typescript

function calculateArea({ kind, ...shape }: Shape) {

// rest of function

```

Then inside of the conditional branches, we can specify the `kind` and destructure from the `shape` object:

```typescript

if (kind === "circle") {

const { radius } = shape; // red squiggly line under radius

return Math.PI * radius * radius;

} else {

const { sideLength } = shape; // red squiggly line under sideLength

return sideLength * sideLength;

}

}

```

However, this approach doesn't work because the `kind` property has been separated from the rest of the shape. As a result, TypeScript can't track the relationship between `kind` and the other properties of `shape`.

Both `radius` and `sideLength` have error messages below them:

```typescript

Property 'radius' does not exist on type '{ radius: number; } | { sideLength: number; }'.

Property 'sideLength' does not exist on type '{ radius: number; } | { sideLength: number; }'.

```

TypeScript gives us these errors because it still cannot guarantee properties in the function parameters since it doesn't know yet whether it's dealing with a `Circle` or a `Square`.

##### The Working Destructuring Solution

Instead of doing the destructuring at the function parameter level, we instead will revert the function parameter back to `shape` and move the destructuring to take place inside of the conditional branches:

```typescript
function calculateArea(shape: Shape) {
  if (shape.kind === "circle") {
    const { radius } = shape;

    return Math.PI * radius * radius;
  } else {
    const { sideLength } = shape;

    return sideLength * sideLength;
  }
}
```

Now within the `if` condition, TypeScript can recognize that `shape` is indeed a `Circle` and allows us to safely access the `radius` property. A similar approach is taken for the `Square` in the `else` condition.

Destructuring is best used closer to where it's needed, especially when dealing with discriminated unions. Also note that TypeScript's auto-completion feature makes it convenient to work with properties directly, which don't require destructuring at all.

#### Solution 2: Narrowing a Discriminated Union with a Switch Statement

The first step is to clear out the `calcuateArea` function and add the `switch` keyword and specify `shape.kind` as our switch condition. TypeScript's intelligence kicks in and suggests autocompletion for `circle` and `square`, based on the discriminated union.

Each case will be handled as they were with the `if-else` statement:

```typescript
function calculateArea(shape: Shape) {
  switch (shape.kind) {
    case "circle": {
      return Math.PI * shape.radius * shape.radius;
    }

    case "square": {
      return shape.sideLength * shape.sideLength;
    }

    // Potential additional cases for more shapes
  }
}
```

##### Not Accounting for All Cases

As an experiment, comment out the case where the `kind` is `square`:

```typescript
function calculateArea(shape: Shape) {
  switch (shape.kind) {
    case "circle": {
      return Math.PI * shape.radius * shape.radius;
    }

    // case "square": {

    //   return shape.sideLength * shape.sideLength;

    // }

    // Potential additional cases for more shapes
  }
}
```

Now when we hover over the function, we see that the return type is `number | undefined`. This is because TypeScript is smart enough to know that if we don't return a value for the `square` case, the output will be `undefined` for any `square` shape.

```typescript
// hovering over `calculateArea` shows

function calculateArea(shape: Shape): number | undefined;
```

Switch statements work great with discriminated unions!

#### Solution 3: Destructuring a Discriminated Union of Tuples

At the start of this exercise, the `ApiResponse` type was too wide:

```tsx
type ApiResponse = [string, User[] | string];
```

We need to update the type to handle both the error and success states separately.

Let's start by handling the error state of our API response.

##### Handling the Error State

In this state, the first element of the tuple is `"error"` and the second element is a string that contains the error message:

```typescript
type ApiResponse = ["error", string];
```

##### Handling the Success State

Next, we need to add another option to our discriminated union with `"success"` as the first member and an array of users (`User[]`) as the second:

```typescript
type ApiResponse = ["error", string] | ["success", User[]];
```

With this update to the `ApiResponse` type, the errors have gone away!

##### Understanding Tuple Relationships

Inside of the `exampleFunc` function, we use array destructuring to pull out the `status` and `value` from the `ApiResponse` tuple:

```typescript
const [status, value] = await fetchData();
```

In this case, `status` is acting as the discriminator for the `ApiResponse` type.

Even though the `status` and `value` variables are separate, TypeScript keeps track of the relationships behind them. If `status` is checked and is equal to `"success"`, TypeScript can narrow down `value` to be of the `User[]` type automatically:

```typescript
// hovering over `status` shows

const status: "error" | "success";
```

Note that this intelligent behavior is specific to discriminated tuples, and won't work with discriminated objects.

##### Error Handling with Discriminated Unions

If you were to change the function to try to return a value that doesn't match the defined tuple structure, TypeScript would raise an error. For example, an empty object or an array where a string is expected would not be assignable. The type system checks that the pair of values in the tuple align with either the `["error", string]` or `["success", User[]]` format defined by the `ApiResponse` discriminated union.

#### Solution 4: Handling Defaults with a Discriminated Union

Before we look at the working solution, let's take a look at a couple of approaches that don't quite work out.

##### Attempt 1: Creating an `OptionalCircle` Type

One possible first step is to create an `OptionalCircle` type by discarding the `kind` property:

```typescript
type OptionalCircle = {
  radius: number;
};
```

Then we would update the `Shape` type to include the new type:

```typescript
type Shape = Circle | OptionalCircle | Square;
```

This solution appears to work initially since it resolves the error in the radius test case.

However, this approach brings back errors inside of the `calculateArea` function because the discriminated union is broken since not every member has a `kind` property.

##### Attempt 2: Updating the `Circle` Type

Rather than developing a new type, we could modify the `Circle` type to make the `kind` property optional:

```typescript
type Circle = {
  kind?: "circle";

  radius: number;
};

type Square = {
  kind: "square";

  sideLength: number;
};

type Shape = Circle | Square;
```

This modification allows us to distinguish between circles and squares. The discriminated union remains intact while also accommodating the optional case where `kind` is not specified.

However, there is now a new error inside of the `calculateArea` function:

```typescript
// inside the `calculateArea` function

if (shape.kind === "circle") {
  return Math.PI * shape.radius * shape.radius;
} else {
  return shape.sideLength * shape.sideLength; // red squiggly line under sideLength
}
```

The error tells us that TypeScript is no longer able to narrow down the type of `shape` to a `Square` because we're not checking to see if `shape.kind` is `undefined`.

##### Fixing the New Error

It would be possible to fix this error by adding additional checks for the `kind`, but instead we could just swap how our conditional checks work.

We'll check for a `square` first, then fall back to a `circle`:

```typescript
if (shape.kind === "square") {
  return shape.sideLength * shape.sideLength;
} else {
  return Math.PI * shape.radius * shape.radius;
}
```

By inspecting `square` first, all shape cases that aren't squares default to circles. The circle is treated as optional, which preserves our discriminated union and keeps the function flexible.

## Extending Objects

Creating new objects based on objects that already exist is a great way to promote modularity and reusability in your code. There are two primary methods for extending objects in TypeScript: using intersections and extending interfaces.

### Intersection Types

Unlike the union operator `|` which represents an "or" relationship between types, the intersection operator `&` signifies an 'and' relationship.

Using the intersection operator `&` combines multiple separate types into a single type that inherits all of the properties of the source types (formally known as "constituent types").

Consider these types for `Album` and `SalesData`:

```typescript
type Album = {
  title: string;

  artist: string;

  releaseYear: number;
};

type SalesData = {
  unitsSold: number;

  revenue: number;
};
```

On their own, each type represents a distinct set of properties. While the `SalesData` type on its own could be used to represent sales data for any product, using the `&` operator to create an intersection type allows us to combine the two types into a single type that represents an album's sales data:

```typescript
type AlbumSales = Album & SalesData;
```

The `AlbumSales` type now requires objects to include all of the properties from both `AlbumDetails` and `SalesData`:

```tsx

const wishYouWereHereSales: AlbumSales = {

title: "Wish You Were Here",

artist: "Pink Floyd",

releaseYear: 1975

unitsSold: 13000000,

revenue: 65000000,

};

```

If the contract of the `AlbumSales` type isn't fulfilled when creating a new object, TypeScript will raise an error.

### Interfaces

<!-- TODO - introduce interfaces -->

Another option for creating new objects is to use TypeScript interfaces and the `extends` keyword. This approach is particularly useful when building hierarchies or when multiple extensions are needed.

In this example, we have a base `Album` interface that will be extended into `StudioAlbum` and `LiveAlbum` interfaces that allow us to provide more specific details about an album:

```typescript
interface Album {
  title: string;

  artist: string;

  releaseYear: number;
}

interface StudioAlbum extends Album {
  studio: string;

  producer: string;
}

interface LiveAlbum extends Album {
  concertVenue: string;

  concertDate: Date;
}
```

This structure allows us to create more specific album representations with a clear inheritance relationship:

```tsx
const americanBeauty: StudioAlbum = {
  title: "American Beauty",

  artist: "Grateful Dead",

  releaseYear: 1970,

  studio: "Wally Heider Studios",

  producer: "Grateful Dead and Stephen Barncard",
};

const oneFromTheVault: LiveAlbum = {
  title: "One from the Vault",

  artist: "Grateful Dead",

  releaseYear: 1991,

  concertVenue: "Great American Music Hall",

  concertDate: new Date("1975-08-13"),
};
```

Just as adding additional `&` operators add to an intersection, it's also possible for an interface to extend multiple other interfaces by separating them with commas:

```tsx
interface BoxSet extends StudioAlbum, LiveAlbum {
  numberOfDiscs: number;
}
```

### Types vs Interfaces

We've now seen two ways of extending objects in TypeScript: one using `type` and one using `interface`.

_So, what's the difference?_

A `type` can represent anything– union types, objects, intersection types, and more.

On the other hand, an `interface` primarily represents object types, though it can also be used to define function types. Interfaces are particularly important given the significance of object types in TypeScript and the broader context of JavaScript.

Generally speaking, it doesn't matter too much if you use `type` or `interface` in your code, though you will learn benefits and drawbacks of each as you continue to work with TypeScript.

### Intersections vs Interfaces

For the topic at hand, when it comes to extending objects you'll get better performance from using `interface extends`.

By using `interface extends`, TypeScript can cache interfaces based on their names. This effectively creates a reference for future use. It's also more expressive when reading the code, as it's clear that one interface is extending another.

In contrast, using `&` requires TypeScript to compute the intersection almost every time it's used. This is largely due to the potentially complex nature of intersections.

The debate between `type` vs `interface` will continue to arise in the TypeScript community, but when extending objects, using interfaces and the `extends` keyword is the way to go.

### Interface Declaration Merging

In addition to being able to `extend` interfaces, TypeScript also allows for interfaces to be declared more than once. When an interface is declared multiple times, TypeScript automatically merges the declarations into a single interface. This is known as interface declaration merging.

Here's an example of an `Album` interface with properties for the `title` and `artist`:

```typescript
interface Album {
  title: string;

  artist: string;
}
```

Suppose that as the application evolves, you want to add more details to the album's metadata, such as the release year and genre. With declaration merging, you can simply declare the `Album` interface again with the new properties:

```typescript
interface Album {
  releaseYear: number;

  genres: string[];
}
```

Behind the scenes, TypeScript automatically merges these two declarations into a single interface that includes all of the properties from both declarations:

```typescript
interface Album {
  title: string;

  artist: string;

  releaseYear: number;

  genres: string[];
}
```

This is a different behavior than in JavaScript, which would cause an error if you tried to redeclare an object in the same scope. You would also get an error in TypeScript if you tried to redeclare a type with the `type` keyword.

However, when using `interface` to declare a type, additional declarations are merged which may or may not be what you want.

This might give you pause about using `interface` instead of `type` by default.

There will be more advanced examples of interface declaration merging in the future, but for now, it's important to know that TypeScript automatically merges interfaces when they're declared multiple times.

### Exercises

#### Exercise 1: Create an Intersection Type

Here we have a `User` type and a `Product` type, both with some common properties like `id` and `createdAt`:

```tsx
type User = {
  id: string;

  createdAt: Date;

  name: string;

  email: string;
};

type Product = {
  id: string;

  createdAt: Date;

  name: string;

  price: number;
};
```

Your task is to create an intersection by refactoring the `User` and `Product` types such that they rely on the same `BaseEntity` type with properties `id` and `createdAt`.

#### Exercise 2: Extending Interfaces

After the previous exercise, you'll have a `BaseEntity` type along with `User` and `Product` types that intersect with it.

This time, your task is to refactor the types to be interfaces, and use the `extends` keyword to extend the `BaseEntity` type. For extra credit, try creating and extending multiple smaller interfaces.

#### Solution 1: Create an Intersection Type

To solve this challenge, we'll create a new `BaseEntity` type with the common properties:

```typescript
type BaseEntity = {
  id: string;

  createdAt: Date;
};
```

Once the `BaseEntity` type is created, we can use it to create the `User` and `Product` types that intersect it:

```typescript
type User = {
  name: string;

  email: string;
} & BaseEntity;

type Product = {
  name: string;

  price: number;
} & BaseEntity;
```

Now `User` and `Product` have exactly the same behavior that they did before, but with less duplication.

#### Solution 2: Extending Interfaces

Instead of using the `type` keyword, the `BaseEntity`, `User`, and `Product`, can be declared as interfaces. Remember, interfaces do not use an equals sign like `type` does:

```typescript
interface BaseEntity {
  id: string;

  createdAt: Date;
}

interface User {
  name: string;

  email: string;
}

interface Product {
  name: string;

  price: number;
}
```

Once the interfaces are created, we can use the `extends` keyword to extend the `BaseEntity` interface:

```typescript
interface User extends BaseEntity {
  name: string;

  email: string;
}

interface Product extends BaseEntity {
  name: string;

  price: number;
}
```

As eluded to by the extra credit, we can take this further by creating `WithId` and `WithCreatedAt` interfaces that represent objects with an `id` and `createdAt` property. Then, we can have `User` and `Product` extend from these interfaces by adding commas:

```typescript
interface WithId {
  id: string;
}

interface WithCreatedAt {
  createdAt: Date;
}

interface User extends WithId, WithCreatedAt {
  name: string;

  email: string;
}

interface Product extends WithId, WithCreatedAt {
  name: string;

  price: number;
}
```

Here, `User` represents an object with an `id`, `createdAt`, `name`, and `email` while `Product` represents an object with an `id`, `createdAt`, `name`, and `price`.

## Handling Dynamic Object Keys

When using objects, it's common that we won't always know the exact keys that will be used.

In JavaScript, we can start with an empty object and add keys and values to it as we go:

```tsx
// JavaScript Example
const albumAwards = {};

albumAwards.Grammy = true;
albumAwards.MercuryPrize = false;
albumAwards.Billboard = true;
```

However, when we try to add keys to an empty prototype object in TypeScript, we'll get errors:

```tsx
// TypeScript Example
const albumAwards = {};

albumAwards.Grammy = true; // red squiggly line under Grammy
albumAwards.MercuryPrize = false; // red squiggly line under MercuryPrize
albumAwards.Billboard = true; // red squiggly line under Billboard

// hovering over Grammy shows:
Property 'Grammy' does not exist on type '{}'.
```

TypeScript is protecting us from adding keys to an object that doesn't have them defined.

We need to tell TypeScript that we want to be able to dynamically add keys. Let's look at some ways to do this.

### Index Signatures for Dynamic Keys

Index signatures are one way to specify we want to be able to add any key and value to an object. The syntax uses square brackets, just like we would if we were adding a dynamic key to an object literal.

Here's how we would specify an inline index signature for the `albumAwards` object literal. We'll call the key `award` as a string, and specify it should have a boolean value to match the example above:

```tsx
const albumAwards: {
  [award: string]: boolean;
} = {};
```

Note that with the inline index signature above, the values must always be a boolean. The `award` keys we add can't use a string or any other type.

The same syntax can also be used with types and interfaces:

```tsx
interface AlbumAwards {
  [award: string]: boolean;
}

const beyonceAwards: AlbumAwards = {
  Grammy: true,
  Billboard: true,
};
```

Index signatures are one way to handle dynamic keys, but there's a more readable way to do this with a type we've seen before.

### Using a Record Type for Dynamic Keys

The `Record` utility type is the preferred option for supporting dynamic keys. This type allows us to use any string, number, or symbol as a key, and supports any type for the value.

Here's how we would use `Record` for the `albumAwards` object, where the key will be a string and the value will be a boolean:

```tsx
const albumAwards: Record<string, boolean> = {};

albumAwards.Grammy = true;
```

The `Record` type helper is a repeatable pattern that's easy to read and understand. It's also an abstraction, which is generally preferred over using the lower-level index signature syntax. However, both options are valid and can even be used together.

### Combining Known and Dynamic Keys

In many cases there will be a base set of keys we know we want to include, but we also want to allow for additional keys to be added dynamically.

For example, say we are working with a base set of awards we know were nominations, but we don't know what other awards are in play. We can use the `Record` type to define a base set of awards and then use an intersection to extend it with an index signature for additional awards:

```typescript
type BaseAwards = "Grammy" | "MercuryPrize" | "Billboard";

type ExtendedAlbumAwards = Record<BaseAwards, boolean> & {
  [award: string]: boolean;
};

const extendedNominations: ExtendedAlbumAwards = {
  Grammy: true,
  MercuryPrize: false,
  Billboard: true, // Additional awards can be dynamically added
  "American Music Awards": true,
};
```

This technique would also work when using an interface and the `extends` keyword.

Being able to support both default and dynamic keys in our data structures allows us quite a bit of flexibility to adapt to changing requirements in your applications.

### Exercises

#### Exercise 1: Use an Index Signature for Dynamic Keys

Here we have an object called `scores`, and we are trying to assign several different properties to it:

```tsx
const scores = {};

scores.math = 95; // red squiggly line under math
scores.english = 90; // red squiggly line under english
scores.science = 85; // red squiggly line under science
```

Your task is to update `scores` to support the dynamic subject keys three ways: an inline index signature, a type, an interface, and a `Record`.

#### Exercise 2: Default Properties with Dynamic Keys

Here we have a `scores` object with default properties for `math` and `english`:

```tsx
interface Scores {}

// @ts-expect-error science is missing! // red squiggly line under @ts-expect-error
const scores: Scores = {
  math: 95,
  english: 90,
};
```

Here the `@ts-expect-error` directive is saying that we expect there to be an error because `science` is missing. However, there isn't actually an error with `scores` so instead TypeScript gives us an error below the directive.

Your task is to update the `Scores` interface to specify default keys for `math`, `english`, and `science` while allowing for any other subject to be added. Once you've updated the type correctly, the red squiggly line below `@ts-expect-error` will go away because `science` will be required but missing. For extra practice, create a `RequiredScores` interface that can be extended.

#### Exercise 3: Restricting Object Keys

Here we have a `configurations` object, typed as `Configurations` which is currently unknown.

The object holds keys for `development`, `production`, and `staging`, and each respective key is associated with configuration details such as `apiBaseUrl` and `timeout`.

There is also a `notAllowed` key, which is decorated with a `@ts-expect-error` comment. This is because, like the name says, the `notAllowed` key should not be allowed. However, there is an error below the directive because `notAllowed` is currently being allowed because of `Configuration`'s `unknown` type.

```typescript
type Environment = "development" | "production" | "staging";

type Configurations = unknown;

const configurations: Configurations = {
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
  // @ts-expect-error   // red squiggly line under @ts-expect-error
  notAllowed: {
    apiBaseUrl: "https://staging.example.com",
    timeout: 8000,
  },
};
```

Update the `Configurations` type to be a Record that specifies the keys from `Environment`, while ensuring the `notAllowed` key is still not be allowed.

#### Solution 1: Use an Index Signature for Dynamic Keys

Inline index signature:

```typescript
const scores: {
  [key: string]: number;
} = {};
```

Interface:

```typescript
interface Scores {
  [key: string]: number;
}
```

Record:

```typescript
const scores: Record<string, number> = {};
```

#### Solution 2: Default Properties with Dynamic Keys

Here's how to add an index signature to the `Scores` interface to support dynamic keys along with the required keys:

```typescript
interface Scores {
  [subject: string]: number;
  math: number;
  english: number;
  science: number;
}
```

Creating a `RequiredScores` interface and extending it looks like this:

```typescript
interface RequiredScores {
  math: number;
  english: number;
  science: number;
}

interface Scores extends RequiredScores {
  [key: string]: number;
}
```

#### Solution 3: Restricting Object Keys

We know that the values of the `Configurations` object will be `apiBaseUrl`, which is a string, and `timeout`, which is a number.
These key-value pairs are added to the `Configurations` type like so:

```typescript
type Environment = "development" | "production" | "staging";

type Configurations = {
  apiBaseUrl: string;
  timeout: number;
};
```

##### A Failed First Attempt at Using Record

It may be tempting to use a Record to set the key as a string and the value an object with the properties `apiBaseUrl` and `timeout`:

```typescript
type Configurations = Record<
  string,
  {
    apiBaseUrl: string;
    timeout: number;
  }
>;
```

However, having the key as `string` still allows for the `notAllowed` key to be added to the object. We need to make the keys dependent on the `Environment` type.

##### The Correct Approach

Instead, we can specify the `key` as `Environment` inside the Record:

```typescript
type Configurations = Record<
  Environment,
  {
    apiBaseUrl: string;
    timeout: number;
  }
>;
```

Now TypeScript will throw an error when the object includes a key that doesn't exist in `Environment`, like `notAllowed`.

## Utility Types for Object Manipulation

TypeScript offers a variety of built-in types for you to use when working with objects. Whether you need to transform an existing object type or create a new type based on an existing one, there's likely a utility type that can help with that.

### Make Properties Optional with Partial

We've seen how to use the question mark operator `?` to make properties optional in TypeScript. However, when dealing with an object type where every key is optional it gets a bit annoying to have to write (and read) the `?` over and over again.

The Partial utility type allows you to quickly transform all of the properties of a given type into optional properties.

Consider an Album interface that contains detailed information about an album:

```typescript
interface Album {
  id: number;
  title: string;
  artist: string;
  releaseYear: number;
  genre: string;
}
```

When we want to update an album's information, we might not have all the information at once. For example, it can be difficult to decide what genre to assign to an album before it's released.

Using the `Partial` utility type and passing in `Album`, we can create a type that allows us to update any subset of an album's properties:

```typescript
type PartialAlbum = Partial<Album>;
```

Now we have a `PartialAlbum` type where `id`, `title`, `artist`, `releaseYear`, and `genre` are all optional.

This means we can create an album with only some of the properties of `Album`:

```typescript
const geogaddi: PartialAlbum = {
  title: "Geogaddi",
  artist: "Boards of Canada",
};
```

### Making Properties Required

On the opposite side of Partial is the Required type, which makes sure all of the properties of a given type are required– even those that started as optional.

This `Album` interface has the `releaseYear` and `genre` properties marked as optional:

```typescript
interface Album {
  title: string;
  artist: string;
  releaseYear?: number;
  genre?: string;
}
```

We can use the `Required` utility type to create a new `RequiredAlbum` type:

```typescript
type RequiredAlbum = Required<Album>;
```

With `RequiredAlbum`, all of the original `Album` properties become required, and omitting any of them would result in an error:

```typescript
const doubleCup: RequiredAlbum = {
  title: "Double Cup",
  artist: "DJ Rashad",
  releaseYear: 2013,
  genre: "Juke",
};
```

#### Required with Nested Properties

An important thing to note is that `Required` only works one level deep. For example, if the `Album`'s `genre` contained nested properties, `Required<Album>` would not make the children required:

```tsx
type Album = {
  title: string;
  artist: string;
  releaseYear?: number;
  genre?: {
    parentGenre?: string;
    subGenre?: string;
  };
};

type RequiredAlbum = Required<Album>;
// hovering over RequiredAlbum shows:
type RequiredAlbum = {
  title: string;
  artist: string;
  releaseYear: number;
  genre: {
    parentGenre?: string;
    subGenre?: string;
  };
};
```

If you find yourself in a situation where you need a deeply Required type, check out the type-fest library by Sindre Sorhus.

### The `PropertyKey` Type

The `PropertyKey` type is a global type that represents the set of all possible keys that can be used on an object, including string, number, and symbol. You can find its type definition inside of TypeScript's ES5 type definitions file:

```tsx
// inside lib.es5.d.ts
declare type PropertyKey = string | number | symbol;
```

Because `PropertyKey` works with all possible keys, it's great for working with dynamic keys where you aren't sure what the type of the key will be.

For example, when using an index signature you could set the key type to `PropertyKey` in order to allow for any valid key type:

```tsx
type Album = {
  [key: PropertyKey]: string;
};
```

The `PropertyKey` type is used behind the scenes of several TypeScript features

### Select Properties with Pick

The Pick utility type allows you to create a new type by selecting a subset of properties from an existing type. This type helper allows you to keep a main type as the source of truth while creating subtypes that contain only what you need.

For example, say we want to create a new type that only includes the `title` and `artist` properties from the `Album` type:

```typescript
type BasicAlbum = Pick<Album, "title" | "artist">;
```

An important thing to note is that Pick doesn't work well with union types, so it's best to stick with object types when using it.

Despite this limitation, Pick is a great way to ensure you're only working with the data you need.

### Excluding Certain Properties with Omit

The Omit helper type is kind of like the opposite of Pick. It allows you to create a new type by excluding a subset of properties from an existing type.

For example, we could use Omit to create the same `BasicAlbum` type we created with Pick, but this time by excluding the `id`, `releaseYear` and `genre` properties:

```tsx
type BasicAlbum = Omit<Album, "id" | "releaseYear" | "genre">;
```

On the surface, using Omit is straightforward, but there are a couple of quirks to be aware of.

#### Omit is Loose

When using Omit, you are able to exclude properties that don't exist on an object.

For example, creating an `AlbumWithoutProducer` type with our `Album` type would not result in an error, even though `producer` doesn't exist on `Album`:

```typescript
type AlbumWithoutProducer = Omit<Album, "producer">;
```

If we tried to create an `AlbumWithOnlyProducer` type using Pick, we would get an error because `producer` doesn't exist on `Album`:

```tsx
type AlbumWithOnlyProducer = Pick<Album, "producer">; // red squiggly line under "producer"

// hovering over producer shows:
Type '"producer"' does not satisfy the constraint 'keyof Album'.
```

Why do these two seemingly related utility types behave differently?

When the TypeScript team was originally implementing Omit, they were faced with a decision to create a strict or loose version of Omit. The strict version would only permit the omission of valid keys (`id`, `title`, `artist`, `releaseYear`, `genre`), whereas the loose version wouldn't have this constraint

At the time, it was a more popular idea in the community to implement a loose version, so that's the one they went with. Given that global types in TypeScript are globally available and don't require an import statement, the looser version is seen as a safer choice, as it is more compatible and less likely to cause unforeseen errors.

However, having this loose implementation of Omit doesn't allow for autocompletion. You won't get any suggestions when you start typing the properties you want to omit, so anything is fair game.

While it is possible to create a strict version of Omit, the loose version should be sufficient for most cases. Just keep an eye out, since it may error in ways you don't expect.

For more insights into the decisions behind Omit, refer to the TypeScript team's original [discussion](https://github.com/microsoft/TypeScript/issues/30455) and [pull request](https://github.com/microsoft/TypeScript/pull/30552) adding `Omit`, and their [final note](https://github.com/microsoft/TypeScript/issues/30825#issuecomment-523668235) on the topic.

#### Omit Doesn't Distribute

Earlier it was mentioned that Pick doesn't work well with union types. Omit has a similar issue that we'll look at now.

Consider a scenario where we have three interface types for `Album`, `CollectorEdition`, and `DigitalRelease`:

```tsx
type Album = {
  id: string;
  title: string;
  genre: string;
  coverImageId: string;
};

type CollectorEdition = {
  id: string;
  title: string;
  limitedEditionFeatures: string[];
  coverImageId: string;
};

type DigitalRelease = {
  id: string;
  title: string;
  digitalFormat: string;
  coverImageId: string;
};
```

These types share common properties such as `id`, `title`, and `coverImageId`, but each also has unique attributes. The `Album` type includes `genre`, the `CollectorEdition` includes `limitedEditionFeatures`, and `DigitalRelease` has `digitalFormat`:

After creating a `MusicProduct` type that is a union of these three types, say we want to create a `MusicProductWithoutId` type, mirroring the structure of `MusicProduct` but excluding the `id` field:

```tsx
type MusicProduct = Album | CollectorEdition | DigitalRelease;

type MusicProductWithoutId = Omit<MusicProduct, "id">;
```

You might assume that `MusicProductWithoutId` would be a union of the three types minus the `id` field. However, what we get instead is a simplified object type containing only the `title` and `coverImageId`– the other properties that were shared across all types, without `id`.

```tsx
// hovering over MusicProductWithoutId shows:
type MusicProductWithoutId = {
  title: string;
  coverImageId: string;
};
```

This unexpected outcome stems from how Omit processes union types. Rather than iterating over each union member, it amalgamates them into a single structure it can understand.

##### The `DistributiveOmit` Type

In order to address this, we can create a `DistributiveOmit` type. It's defined similarly to Omit but operates individually on each union member. Note the inclusion of `PropertyKey` in the type definition to allow for any valid key type:

```tsx
type DistributiveOmit<T, K extends PropertyKey> = T extends any
  ? Omit<T, K>
  : never;
```

When we apply `DistributiveOmit` to our `MusicProduct` type, we get the anticipated result: a union of `Album`, `CollectorEdition`, and `DigitalRelease` with the `id` field omitted:

```tsx
type MusicProductWithoutId = DistributiveOmit<MusicProduct, "id">;

// Hovering over MusicProductWithoutId shows:
type MusicProductWithoutId =
  | Omit<Album, "id">
  | Omit<CollectorEdition, "id">
  | Omit<DigitalRelease, "id">;
```

Structurally, this is the same as:

```tsx
type MusicProductWithoutId =
  | {
      title: string;
      genre: string;
      coverImageId: string;
    }
  | {
      title: string;
      limitedEditionFeatures: string[];
      coverImageId: string;
    }
  | {
      title: string;
      digitalFormat: string;
      coverImageId: string;
    };
```

In situations where you need to use Omit with union types, using a distributive version will give you a much more predictable result.

For practice, try creating a `DistributivePick` type based on the original type definition of `Pick`.

## Exercises

### Exercise 1: Expecting Certain Properties

In this exercise, we have a `fetchUser` function that uses `fetch` to access an endpoint named `APIUser` and it return a `Promise<User>`:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const fetchUser = async (): Promise<User> => {
  const response = await fetch("/api/user");
  const user = await response.json();
  return user;
};

const example = async () => {
  const user = await fetchUser();

  type test = Expect<Equal<typeof user, { name: string; email: string }>>; // red squiggly line under Equal<>
};
```

Since we're in an asynchronous function, we do want to use a `Promise`, but there's a problem with this `User` type.

In the `example` function that calls `fetchUser`, we're only expecting to receive the `name` and `email` fields. These fields are only part of what exists in the `User` interface.

Your task is to update the typing so that only the `name` and `email` fields are expected to be returned from `fetchUser`.

You can use the helper types we've looked at to accomplish this, but for extra practice try using just interfaces.

### Exercise 2: Dynamic Key Support

Consider this `hasKey` function that accepts an object and a key, then calls `object.hasOwnProperty` on that object:

```typescript
const hasKey = (obj: object, key: string) => {
  return obj.hasOwnProperty(key);
};
```

There are several test cases for this function:

The first test case checks that it works on string keys, which doesn't present any issues. As anticipated, `hasKey(obj, "foo")` would return true and `hasKey(obj, "bar")` would return false:

```typescript
it("Should work on string keys", () => {
  const obj = {
    foo: "bar",
  };

  expect(hasKey(obj, "foo")).toBe(true);
  expect(hasKey(obj, "bar")).toBe(false);
});
```

A test case that checks for numeric keys does have issues because the function is expecting a string key:

```typescript
it("Should work on number keys", () => {
  const obj = {
    1: "bar",
  };

  expect(hasKey(obj, 1)).toBe(true); // red squiggly line under 1
  expect(hasKey(obj, 2)).toBe(false); // red squiggly line under 2
});
```

Because an object can also have a symbol as a key, there is also a test for that case. It currently has type errors for `fooSymbol` and `barSymbol` when calling `hasKey`:

```typescript
it("Should work on symbol keys", () => {
  const fooSymbol = Symbol("foo");
  const barSymbol = Symbol("bar");

  const obj = {
    [fooSymbol]: "bar",
  };

  expect(hasKey(obj, fooSymbol)).toBe(true); // red squiggly line under fooSymbol
  expect(hasKey(obj, barSymbol)).toBe(false); // red squiggly line under barSymbol
});
```

Your task is to update the `hasKey` function so that all of these tests pass. Try to be as concise as possible!

### Exercise 3: Updating a Product

Here we have a function `updateProduct` that takes two arguments: an `id`, and a `productInfo` object derived from the `Product` type, excluding the `id` field.

```tsx
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

const updateProduct = (id: number, productInfo: Omit<Product, "id">) => {
  // Do something with the productInfo
};
```

The twist here is that during a product update, we might not want to modify all of its properties at the same time. Because of this, not all properties have to be passed into the function.

This means we have several different test scenarios. For example, update just the name, just the price, or just the description. Combinations like updating the name and the price or the name and the description are also tested.

```tsx
updateProduct(1, {
  // red squiggly line under the entire object
  name: "Book",
});

updateProduct(1, {
  // red squiggly line under the entire object
  price: 12.99,
});

updateProduct(1, {
  // red squiggly line under the entire object
  description: "A book about Dragons",
});

updateProduct(1, {
  // red squiggly line under the entire object
  name: "Book",
  price: 12.99,
});

updateProduct(1, {
  // red squiggly line under the entire object
  name: "Book",
  description: "A book about Dragons",
});
```

Your challenge is to modify the `ProductInfo` type to reflect these requirements. The `id` should remain absent from `ProductInfo`, but we also want all other properties in `ProductInfo` to be optional.

### Solution 1: Expecting Certain Properties

There are quite a few ways to solve this problem. Here are a few examples:

#### Using Pick

Using the Pick utility type, we can create a new type that only includes the `name` and `email` properties from the `User` interface:

```typescript
type PickedUser = Pick<User, "name" | "email">;
```

Then the `fetchUser` function can be updated to return a `Promise` of `PickedUser`:

```typescript
const fetchUser = async (): Promise<PickedUser> => {
  ...
```

#### Using Omit

The Omit utility type can also be used to create a new type that excludes the `id` and `role` properties from the `User` interface:

```typescript
type OmittedUser = Omit<User, "id" | "role">;
```

Then the `fetchUser` function can be updated to return a `Promise` of `OmittedUser`:

```typescript
const fetchUser = async (): Promise<OmittedUser> => {
  ...
```

#### Extending an Interface

We could create an interface `NameAndEmail` that contains a `name` and `email` property, along with updating the `User` interface to remove those properties in favor of extending them:

```tsx
interface NameAndEmail {
  name: string;
  email: string;
}

interface User extends NameAndEmail {
  id: string;
  role: string;
}
```

Then the `fetchUser` function could return a `Promise` of `NameAndEmail`:

```tsx
const fetchUser = async (): Promise<NameAndEmail> => {
  ...
```

### Solution 2: Dynamic Key Support

The obvious answer is to change the `key`'s type to `string | number | symbol`:

```typescript
const hasKey = (obj: object, key: string | number | symbol) => {
  return obj.hasOwnProperty(key);
};
```

However, there's a much more succinct solution.

Hovering over `hasOwnProperty` shows us the type definition:

```typescript
(method) Object.hasOwnProperty(v: PropertyKey): boolean
```

Recall that the `PropertyKey` type represents every possible value a key can have. This means we can use it as the type for the key parameter:

```typescript
const hasKey = (obj: object, key: PropertyKey) => {
  return obj.hasOwnProperty(key);
};
```

### Solution 3: Updating a Product

Using the `Partial` type helper is a good fit in this scenario.

In this case, wrapping `Ommit<Product, "id">` in `Partial` will remove the `id` while making all of the remaining properties optional:

```typescript
const updateProduct = (
  id: number,
  productInfo: Partial<Omit<Product, "id">>,
) => {
  // Do something with the productInfo
};
```
