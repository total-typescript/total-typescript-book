In this chapter, we'll be diving deeper into modules. First, we'll look at how TypeScript understands global scope by looking at the distinction between 'modules' and 'scripts'. Second, we'll look at declaration files - `.d.ts files` - and introduce the `declare` keyword.

## Understanding Modules and Scripts

TypeScript has two ways of understanding what a `.ts` file is. It can be treated either as a module, containing imports and exports, or a script, which executes in the global scope.

### Modules Have Local Scope

A module is an isolated piece of code which can be imported to other modules as needed. Modules have their own scope, meaning that variables, functions, and types defined within a module are not accessible from other files unless they are explicitly exported.

Consider this `constants.ts` module that defines a `DEFAULT_VOLUME` constant:

```typescript
const DEFAULT_VOLUME = 90;
```

Without being imported, the `DEFAULT_VOLUME` constant is not accessible from other files:

```ts twoslash
// @errors: 2304
// inside of index.ts
console.log(DEFAULT_VOLUME);
```

In order to use the `DEFAULT_VOLUME` constant in the `index.ts` file, it must be imported from the `constants.ts` module:

```typescript
// inside of index.ts
import { DEFAULT_VOLUME } from "./constants";

console.log(DEFAULT_VOLUME); // 90
```

TypeScript has a built-in understanding of modules and, by default, will treat any file that contains an `import` or `export` statement as a module.

### Scripts Have Global Scope

Scripts, on the other hand, execute in the global scope. Any variables, functions, or types defined in a script file are accessible from anywhere in the project without the need for explicit imports. This behavior is similar to traditional JavaScript, where scripts are included in HTML files and executed in the global scope.

If a file does not contain any `import` or `export` statements, TypeScript will treat it as a script. If we remove the `export` keyword from the `DEFAULT_VOLUME` constant in the `constants.ts` file, it will be treated as a script:

```typescript
// inside of constants.ts
const DEFAULT_VOLUME = 90;
```

Now, we no longer need to import the `DEFAULT_VOLUME` constant in the `index.ts` file:

```ts twoslash
declare const DEFAULT_VOLUME: 90;
// ---cut---
// inside of index.ts

console.log(DEFAULT_VOLUME);
//          ^?
```

This behavior might be surprising to you - let's figure out why TypeScript does this.

### TypeScript Has To Guess

TypeScript is, at this point, pretty old. It's actually older than `import` and `export` statements being part of JavaScript. When TypeScript was first created, it was mostly used to create _scripts_, not modules.

So TypeScript's default behavior is to _guess_ whether your file is supposed to be treated like a module or script. As we've seen, it does this by looking for `import` and `export` statements.

But whether your code is treated like a module or a script is not actually decided by TypeScript - it's decided by the environment in which the code executes.

Even in the browser, you can opt in to using modules by adding the `type="module"` attribute to your script tag:

```html
<script type="module" src="index.js"></script>
```

This means your JavaScript file will be treated as a module. But remove the `type="module"` attribute, and your JavaScript file will be treated as a script.

So, TypeScript's default is relatively sensible, seeing as it can't know how your code will be executed.

But these days, 99% of the code you'll be writing will be in modules. So this automatic detection can lead to frustrating situations:

### "Cannot redeclare block-scoped variable"

Let's imagine you create a new TypeScript file, `utils.ts`, and add a `name` constant:

```ts twoslash
// @errors: 2451
// @moduleDetection: auto
const name = "Alice";
```

You'll be greeted with a surprising error. This error is telling you that you can't declare `name`, because it's already been declared.

A curious way to fix this is to add an empty export statement at the end of the file:

```typescript
const name = "Alice";

export {};
```

The error disappears. Why?

Let's use what we've already learned to figure this out. We don't have any `import` or `export` statements in `utils.ts`, so TypeScript treats it as a script. This means that `name` is declared in the global scope.

It turns out that in the DOM, there is already a global variable called [`name`](https://developer.mozilla.org/en-US/docs/Web/API/Window/name). This lets you set targets for hyperlinks and forms. So when TypeScript sees `name` in a script, it gives you an error because it thinks you're trying to redeclare the global `name` variable.

By adding the `export {}` statement, you're telling TypeScript that `utils.ts` is a module, and `name` is now scoped to the module, not the global scope.

This accidental collision is a good example of why it's a good idea to treat all your files as modules. Fortunately, TypeScript gives us a way to do it.

### Forcing Modules With `moduleDetection`

The `moduleDetection` setting determines how functions and variables are scoped in your project. There are three different options available: `auto`, `force`, and `legacy`.

By default, it's set to `auto` which corresponds to the behavior we've seen above. The `force` setting will treat all files as modules, regardless of the presence of `import` or `export` statements. `legacy` can be safely ignored, as it's only used for compatibility with older versions of TypeScript.

Updating `tsconfig.json` to specify `moduleDetection` to `force` is straightforward:

```json
// tsconfig.json
{
  "compilerOptions": {
    // ...other options...
    "moduleDetection": "force"
  }
}
```

After this change, all files in the project will be treated as modules, and you will need to use `import` and `export` statements to access functions and variables across files. This helps align your development environment more closely with real-world scenarios while reducing unexpected errors.

## Declaration Files

Declaration files are files in TypeScript which have a special extension: `.d.ts`. These files are used for two main purposes in TypeScript: describing JavaScript code, and adding types to the global scope. We'll explore both below.

### Declaration Files Describe JavaScript

Let's say part of our codebase is written in JavaScript, and we want to keep it that way. We have a `musicPlayer.js` file that exports a `playTrack` function:

```javascript
// musicPlayer.js

export const playTrack = (track) => {
  // Complicated logic to play the track...
  console.log(`Playing: ${track.title}`);
};
```

If we try to import this file into a TypeScript file, we'll get an error:

```ts twoslash
// @errors: 2307
// inside of app.ts

import { playTrack } from "./musicPlayer";
```

This error occurs because TypeScript doesn't have any type information for the `musicPlayer.js` file. To fix this, we can create a declaration file with the same name as the JavaScript file, but with a `.d.ts` extension:

```typescript
// musicPlayer.d.ts
export function playTrack(track: {
  title: string;
  artist: string;
  duration: number;
}): void;
```

It's important to notice that this file doesn't contain any implementation code. It only describes the types of the functions and variables in the JavaScript file.

Now, when we import the `musicPlayer.js` file into a TypeScript file, the error will be resolved, and we can use the `playTrack` function as expected:

```typescript
// inside of app.ts

import { playTrack } from "./musicPlayer";

const track = {
  title: "Otha Fish",
  artist: "The Pharcyde",
  duration: 322,
};

playTrack(track);
```

Types and interfaces can also be declared and exported in declaration files:

```tsx
// inside of musicPlayer.d.ts
export interface Track {
  title: string;
  artist: string;
  duration: number;
}

export function playTrack(track: Track): void;
```

Just like in `.ts` files, these can also be imported and used in other TypeScript files:

```tsx
// inside of app.ts

import { Track, playTrack } from "./musicPlayer";
```

It's important to note that declaration files are not checked against the JavaScript files they describe. We can very easily make a mistake in our declaration file, such as changing `playTrack` to `playTRACK`, and TypeScript won't complain.

So, describing JavaScript files by hand can be error-prone - and not usually recommended.

### Declaration Files Can Add To The Global Scope

Just like regular TypeScript files, declaration files can be treated as either modules or scripts based on whether or not the `export` keyword is used. In the example above, `musicPlayer.d.ts` is treated as a module because it includes the `export` keyword.

This means that without an `export`, declaration files can be used to add types to the global scope. Even setting `moduleDetection` to `force` won't change this behavior - `moduleDetection` is always set to `auto` for `.d.ts` files.

For example, we could create an `Album` type that we want to be used across the entire project:

```tsx
// inside of global.d.ts

type Album = {
  title: string;
  artist: string;
  releaseDate: string;
};
```

Now, the `Album` type is available globally and can be used in any TypeScript file without needing to import it. We'll discuss whether this is a good idea later in this chapter.

### Declaration Files Can't Contain Implementations

What would happen if we tried to write normal TypeScript inside our `.d.ts` file?

```ts
export function playTrack(track: {
  title: string;
  artist: string;
  duration: number;
}) {
  // red squiggly line under {
  console.log(`Playing: ${track.title}`);
}

// Hovering over the error shows:
// An implementation cannot be declared in ambient contexts.
```

We get an error! TypeScript doesn't allow us to include any implementation code inside a declaration file. Declaration files completely disappear at runtime, so they can't contain any code that would be executed.

#### What Is An "Ambient Context"?

The phrase 'ambient' might be confusing. TypeScript uses it to mean ['without implementation'](https://github.com/Microsoft/TypeScript-Handbook/issues/180#issuecomment-195446760). Since declaration files can't contain implementations, everything inside is considered 'ambient'. We'll dive deeper into this in the next section.

## The `declare` Keyword

The `declare` keyword lets you define ambient values in TypeScript. It can be used to declare variables, define a global scope with `declare global` or augment module types with `declare module`.

### `declare const/var/let/function`

`declare` can be used to define values which don't have an implementation. This can be useful in a variety of ways. Let's look at how it can help with typing.

#### Typing Global Variables

Let's say we have a global variable `MUSIC_API`. This isn't defined in our code, but it's available in the environment via a script tag:

```html
<script src="/music-api.js"></script>
```

This variable is available anywhere in our codebase. So, let's put it in a declaration file.

We can create a `musicApi.d.ts` file and declare the `MUSIC_API` variable:

```typescript
// inside musicApi.d.ts

type Album = {
  title: string;
  artist: string;
  releaseDate: string;
};

declare const ALBUM_API: {
  getAlbumInfo(upc: string): Promise<Album>;
  searchAlbums(query: string): Promise<Album[]>;
};
```

Because we haven't included any imports or exports, this file is treated as a script. This means that the `ALBUM_API` variable is now available globally in our project.

#### Scoping Global Variables To One File

What if we want to limit the scope of `MUSIC_API` to a single file, `musicUtils.ts`? We can actually move the `declare const` statement inside the file:

```typescript
// inside musicUtils.ts

type Album = {
  title: string;
  artist: string;
  releaseDate: string;
};

declare const ALBUM_API: {
  getAlbumInfo(upc: string): Promise<Album>;
  searchAlbums(query: string): Promise<Album[]>;
};

export function getAlbumTitle(upc: string) {
  return ALBUM_API.getAlbumInfo(upc).then((album) => album.title);
}
```

Now, `ALBUM_API` is only available in the `musicUtils.ts` file. `declare` defines the value within the scope it's currently in. So, because we're now inside a module (due to the `export` statement), `ALBUM_API` is scoped to this module.

#### `declare const`, `declare var`, `declare let`, `declare function`

You might have noticed that we used `declare const` in the examples above. But you can also use `declare var`, `declare let`, and `declare function`. They all do the same thing - declare a value without an implementation.

Here are some examples of the syntax:

```typescript
declare const MY_CONSTANT: number;
declare var MY_VARIABLE: string;
declare let MY_LET: boolean;
declare function myFunction(): void;
```

### `declare global`

`declare global` lets you add things to the global scope from within modules. This can be useful when you want to colocate global types with the code that uses them.

To do this, we can wrap our `declare const` statement in a `declare global` block:

```ts twoslash
// @errors: 1038
type Album = {
  title: string;
  artist: string;
  releaseDate: string;
};

// ---cut---
// inside musicUtils.ts
declare global {
  declare const ALBUM_API: {
    getAlbumInfo(upc: string): Promise<Album>;
    searchAlbums(query: string): Promise<Album[]>;
  };
}
```

This almost works, except for the error. We can't use `declare` inside an ambient context: the `declare global` block is already ambient. So, we can remove the `declare` keyword:

```typescript
// inside musicUtils.ts

declare global {
  const ALBUM_API: {
    getAlbumInfo(upc: string): Promise<Album>;
    searchAlbums(query: string): Promise<Album[]>;
  };
}
```

Now the `ALBUM_API` variable has been put into the global scope.

### `declare module`

There are some situations where you need to declare types for a module that either doesn't have type definitions or is not included in the project directly.

In these cases, you can use the `declare module` syntax to define types for the module.

For example, say we are working with a `duration-utils` module that doesn't have type definitions.

The first step would be to create a new file named `duration-utils.d.ts`. Then at the top of the file, the `declare module` syntax is used to define the types for the module:

```typescript
declare module "duration-utils" {
  export function formatDuration(seconds: number): string;
}
```

We use `export` to define what is being exported from the module.

Like before, we are not including any implementation code in the `.d.ts` file – it's just the types that are being declared.

Once the `duration-utils.d.ts` file is created, the module can be imported and used as usual:

```typescript
import { formatDuration, parseTrackData } from "duration-utils";

const formattedTime = formatDuration(309);
```

Just like normal declaration files, the types you add are not checked against the actual module - so it's important to keep them up to date.

### Module Augmentation vs Module Overriding

When using `declare module`, you can either augment an existing module or override it completely. Augmenting a module means appending new types to an existing module. Overriding a module means replacing the existing types with new ones.

Choosing which you're doing depends on whether you're inside a module or a script.

#### Inside a Module, `declare module` Augments

If you're inside a module, `declare module` will augment the targeted module. For instance, you can add a new type to the `express` module:

```typescript
// inside express.d.ts
declare module "express" {
  export interface MyType {
    hello: string;
  }
}

export {}; // Adding an export turns this .d.ts file into a module
```

Now, across our project, we can import `MyType` from the `express` module:

```typescript
// anywhere.ts
import { MyType } from "express";
```

We don't need to put this in a declaration file. We can get exactly the same behavior by changing `express.d.ts` to `express.ts`.

This example is a little bit silly - there's no real use case for adding your own type to a module. But we'll see later that augmenting the types of modules can be extremely useful.

#### Inside a Script, `declare module` Overrides

Let's go back to our `express.d.ts` file. If we remove the `export {}` statement, it will be treated as a script:

```typescript
// inside express.d.ts

declare module "express" {
  export interface MyType {
    hello: string;
  }
}
```

Now, we've completely overridden the `express` module. This means that the `express` module no longer has any exports except for `MyType`:

```ts
// anywhere.ts
import { Express } from "express"; // red squiggly line under "Express"
```

Just like module augmentation, we can get the same behavior by changing `express.d.ts` to `express.ts` (if `moduleDetection` is set to `auto`).

So, just the presence or absence of an `export` statement can radically change the behavior of `declare module`.

Overriding is occasionally useful when you want to completely replace the types of a module, perhaps when a third-party library has incorrect types.

## Declaration Files You Don't Control

You might think that declaration files are a relatively niche feature of TypeScript. But in every project you create, you're likely using hundreds of declaration files. They either ship with libraries, or come bundled with TypeScript itself.

### TypeScript's Types

Whenever you use TypeScript, you're also using JavaScript. JavaScript has many built-in constants, functions and objects that TypeScript needs to know about. A classic example are the array methods.

```ts
const numbers = [1, 2, 3];

numbers.map((n) => n * 2);
```

Let's step back for a minute. How does TypeScript know that `.map` exists on an array? How does it know that `.map` exists, but `.transform` doesn't? Where is this defined?

As it turns out, TypeScript ships with a bunch of declaration files that describe the JavaScript environment. We can do a 'go to definition' on `.map` to see where that is:

```ts
// inside lib.es5.d.ts

interface Array<T> {
  // ... other methods ...
  map<U>(
    callbackfn: (value: T, index: number, array: T[]) => U,
    thisArg?: any,
  ): U[];
}
```

We've ended up in a file called `lib.es5.d.ts`. This file is part of TypeScript, and describes what JavaScript looked like in ES5, a version of JavaScript from 2009. This is when `.map` was introduced to JavaScript.

Another example would be `.replaceAll` on strings:

```ts
const str = "hello world";

str.replaceAll("hello", "goodbye");
```

Doing a 'go to definition' on `.replaceAll` will take you to a file called `lib.es2021.string.d.ts`. This file describes the string methods that were introduced in ES2021.

Looking at the code in `node_modules/typescript/lib`, you'll see dozens of declaration files that describe the JavaScript environment.

Understanding how to navigate these declaration files can be very useful for fixing type errors. Take a few minutes to explore what's in `lib.es5.d.ts` by using 'go to definition' to navigate around.

#### Choosing Your JavaScript Version With `lib`

The `lib` setting in `tsconfig.json` lets you choose which `.d.ts` files are included in your project. Choosing `es2022` will give you all the JavaScript features up to ES2022. Choosing `es5` will give you all the features up to ES5.

```json
{
  "compilerOptions": {
    "lib": ["es2022"]
  }
}
```

By default, this inherits from the `target` setting, which we'll look at in the chapter on configuring TypeScript.

#### DOM Types

Another set of declaration files that ship with TypeScript are the DOM types. These describe the browser environment, and include types for `document`, `window`, and all the other browser globals.

```ts
document.querySelector("h1");
```

If you do a 'go to definition' on `document`, you'll end up in a file called `lib.dom.d.ts`.

```ts
declare var document: Document;
```

This file declares the `document` variable as type `Document`, using the `declare` keyword we saw earlier.

To include these in your project, you can specify them in the `lib` setting, along with the JavaScript version:

```json
{
  "compilerOptions": {
    "lib": ["es2022", "dom", "dom.iterable"]
  }
}
```

`dom.iterable` includes the types for the iterable DOM collections, like `NodeList`.

If you don't specify `lib`, TypeScript will include `dom` by default alongside the JavaScript version chosen in `target`:

```json
{
  "compilerOptions": {
    "target": "es2022"
    // "lib": ["es2022", "dom", "dom.iterable"] is implied
  }
}
```

Just like the JavaScript versions, you can use 'go to definition' to explore the DOM types and see what's available. At the time of writing, it's over 28,000 lines long - but understanding what's in there over a period of time can be very useful.

#### Which DOM Types Get Included?

Different browsers support different features. A quick browse of [caniuse.com](https://caniuse.com/) will show how patchy browser support can be for certain features.

But TypeScript only ships one set of DOM types. So how does it know what to include?

TypeScript's policy is that if a feature is supported in two major browsers, it's included in the DOM types. This is a good balance between including everything and including nothing.

### Types That Ship With Libraries

When you install a library with npm, you're downloading JavaScript to your file system. To make that JavaScript work with TypeScript, authors will often include declaration files alongside them.

For example, we'll look at Zod – a popular library that allows for validating data at runtime.

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

Just like the DOM types, you can use 'go to definition' to explore the types that ship with libraries. Understanding these types can help you use the library more effectively.

### DefinitelyTyped

Not every library bundles `.d.ts` files alongside the JavaScript you download. This was a big issue in TypeScript's early days, when most open source packages weren't written in TypeScript.

The [`DefinitelyTyped` GitHub repository](https://github.com/DefinitelyTyped/DefinitelyTyped) was built to house high-quality type definitions for numerous popular JavaScript libraries that didn't ship definitions of their own. It's now one of the largest open source repositories on GitHub.

By installing a package with `@types/*` and your library as a dev dependency, you can add type definitions that TypeScript will be able to use immediately.

For example, say you're using the `diff` library to check for the difference between two strings:

```tsx
import Diff from "diff"; // red squiggly line under "diff"

const message1 = "Now playing: 'Run Run Run'";
const message2 = "Now playing: 'Bye Bye Bye'";

const differences = Diff.diffChars(message1, message2);
```

TypeScript reports an error underneath the `import` statement because it can't find type definitions, even though the library is installed over 40 million times a week from NPM:

```txt
hovering over "diff" shows:
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

This is a great solution for libraries that haven't been updated in a while, or for more commonly-used libraries (like, say, React) that don't ship with type definitions.

### `skipLibCheck`

As we've seen, your project can contain hundreds of declaration files. By default, TypeScript considers these files as part of your project. So, it checks them for type errors every single time.

This can result in extremely frustrating situations where a type error in a third-party library can prevent your project from compiling.

To avoid this, TypeScript has a `skipLibCheck` setting. When set to `true`, TypeScript will skip checking declaration files for type errors.

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

This is a must-have in any TypeScript project because of the sheer number of declaration files that are included. Adding this setting speeds up compilation and prevents unnecessary errors.

#### The Downsides of `skipLibCheck`

`skipLibCheck` comes with one enormous downside, though. It doesn't just skip declaration files in `node_modules` - it skips _all_ declaration files.

This means that if you make a mistake authoring a declaration file, TypeScript won't catch it. This can lead to bugs that are difficult to track down.

This is one of my main gripes with TypeScript - `skipLibCheck` is a must-have, because of the danger of incorrect third-party declaration files. But it also makes authoring your own declaration files much harder.

## Authoring Declaration Files

Now we know how to use declaration files, and their downsides (thanks to `skipLibCheck`), let's look at their use cases.

### Augmenting Global Types

The most common use for declaration files is describing the global scope of your project. We've seen how you can use `declare const` in a script file to add a global variable.

You can also use declaration merging, a feature we saw earlier, to append to existing interfaces and namespaces.

As a reminder, declaration merging is when you define a type or interface with the same name as an existing type or interface. TypeScript will merge the two together.

This means that any interface declared in a declaration file is fair game for augmentation. For example, `lib.dom.d.ts` contains a `Document` interface. Let's imagine we want to add a `foo` property to it.

We can create a `global.d.ts` file and declare a new `Document` interface:

```tsx
// inside global.d.ts

interface Document {
  foo: string;
}
```

This declaration file is being treated as a script, so the `Document` interface merges with the existing one.

Now, across our project, the `Document` interface will have a `foo` property:

```tsx
// inside app.ts

document.foo = "hello"; // No error!
```

This can be extremely useful for describing JavaScript globals that TypeScript doesn't know about.

We'll see more examples of these in the exercises section.

### Typing Non-JavaScript Files

In some environments like Webpack, it's possible to import files like images that will end up being incorporated into the bundle with a string identifier.

Consider this example where several `.png` images are imported. TypeScript doesn't typically recognize PNG files as modules, so it reports an error underneath each import statement:

```ts twoslash
// @errors: 2307
import pngUrl1 from "./example1.png";
import pngUrl2 from "./example2.png";
```

The `declare module` syntax can help. We can use it to declare types for non-JavaScript files.

To add support for the `.png` imports, create a new file `png.d.ts`. Inside of the file, we'll start with `declare module` but since we can't use relative module names, we'll use a wildcard `*` to match any `*.png` file. Inside of the declaration, we'll say that `png` is a string and export it as the default:

```tsx
// inside png.d.ts
declare module "*.png" {
  const png: string;

  export default png;
}
```

With the `png.d.ts` file in place, TypeScript will recognize the imported `.png` files as strings without reporting any errors.

### Should You Store Your Types In Declaration Files?

A common misconception among TypeScript developers is that declaration files are where you store your types. You'd create a `types.d.ts` file:

```tsx
// types.d.ts
export type Example = string;
```

Then you'd import this file in your TypeScript files:

```tsx
// index.ts
import { Example } from "./types";

const myFunction = (example: Example) => {
  console.log(example);
};
```

This is a relatively natural thing to get wrong. A 'declaration file'? Sounds like where you put your type declarations.

But this is a bad idea. `skipLibCheck` will ignore these files, meaning you won't get type checking on them. This means that you should use as few declaration files as possible to mitigate the risk of bugs.

Instead, put your types in regular TypeScript files.

### Is Using Global Types A Good Idea?

Across your project, you'll end up with several commonly-used types. For example, you might have a `User` type that's used in many different files.

One option is to put these into the global scope to avoid importing them everywhere. This can be done by using a `.d.ts` file as a script, or using `declare global` in a `.ts` file.

However, I don't recommend you do this. Polluting the global scope with types can turn your project into a mess of implicit dependencies. It can be hard to know where a type is coming from, and can make refactoring difficult.

As your project grows, you'll get naming conflicts between types. Two different parts of your system might define a `User` type, leading to confusion.

Instead, I recommend you import types explicitly. This makes it clear where a type is coming from, makes your system more portable, and makes refactoring easier.

## Exercises

### Exercise 1: Typing a JavaScript Module

Consider this `example.js` JavaScript file that exports `myFunc`:

```javascript
// example.js
export const myFunc = () => {
  return "Hello World!";
};
```

The `myFunc` function is then imported inside of a TypeScript `index.ts` file:

```tsx
// index.ts
import { myFunc } from "./example"; // red squiggly line under ./example

myFunc();
```

However, there is an error in the import statement because TypeScript expects a declaration file for this JavaScript module:

```tsx
// hovering over the error shows:
Could not find a declaration file for module './example'.
```

Your task is to create a declaration file for the `example.js` file.

<Exercise title="Exercise 1: Typing a JavaScript Module" filePath="/src/060-modules-scripts-and-declaration-files/164-declaration-files-can-be-used-to-type-js-files.problem"></Exercise>

### Exercise 2: Ambient Context

Consider a variable called `state` that is returned from a global `DEBUG.getState()` function:

```tsx
const state = DEBUG.getState(); // red squiggly line under DEBUG

type test = Expect<Equal<typeof state, { id: string }>>;
```

Here, `DEBUG` acts like a global variable. In our hypothetical project, `DEBUG` is only referenced in this file and is introduced into the global scope by an external script that we don't have control over.

Currently, there is an error below `DEBUG` because TypeScript cannot resolve the type of `state` returned by `DEBUG.getState()`.

As seen in the test, we expect `state` to be an object with an `id` of type `string`, but TypeScript currently interprets it as `any`:

```tsx
// hovering over state shows:
const state: any;
```

Your task is to specify that `DEBUG` is available in this module (and this module only) without needing to provide its implementation. This will help TypeScript understand the type of `state` and provide the expected type checking.

<Exercise title="Exercise 2: Ambient Context" filePath="/src/060-modules-scripts-and-declaration-files/166-ambient-context-and-declare-const.problem"></Exercise>

### Exercise 3: Modifying `window`

Let's imagine now that we want our `DEBUG` object to only be accessible through the `window` object:

```ts twoslash
// @errors: 2339
import { Equal, Expect } from "@total-typescript/helpers";
// ---cut---
// inside index.ts

const state = window.DEBUG.getState(); // red squiggly line under DEBUG

type test = Expect<Equal<typeof state, { id: string }>>;
```

We expect `state` to be an object with an `id` string property, but it is currently typed as `any`.

There's also an error on `DEBUG` that tells us TypeScript doesn't see the `DEBUG` type.

Your task is to specify that `DEBUG` is available on the `window` object. This will help TypeScript understand the type of `state` and provide the expected type checking.

<Exercise title="Exercise 3: Modifying `window`" filePath="/src/065-types-you-dont-control/174.5-modifying-window.problem"></Exercise>

### Exercise 4: Modifying `process.env`

Node.js introduces a global entity called `process`, which includes several properties that are typed with `@types/node`.

The `env` property is an object encapsulating all the environment variables that have been incorporated into the current running process. This can come in handy for feature flagging or for pinpointing different APIs across various environments.

Here's an example of using an `envVariable`, along with a test that checks to see if it is a string:

```ts twoslash
// @errors: 2344
import { Equal, Expect } from "@total-typescript/helpers";

declare const process: {
  env: Record<string, string | undefined>;
};

// ---cut---
const envVariable = process.env.MY_ENV_VAR;

type test = Expect<Equal<typeof envVariable, string>>;
```

TypeScript isn't aware of the `MY_ENV_VAR` environment variable, so it can't be certain that it will be a string. Thus, the `Equal` test fails because `envVariable` is typed as `string | undefined` instead of just `string`.

Your task is to determine how to specify the `MY_ENV_VAR` environment variable as a string in the global scope. This will be slightly different than the solution for modifying `window` in the first exercise.

Here are a couple of hints to help you out:

Inside of `@types/node` from DefinitelyTyped, the `ProcessEnv` interface is responsible for environment variables. It can be found inside of the `NodeJS` namespace. You might need to revisit previous chapters to refresh your memory on declaration merging of types and namespaces in order to solve this exercise.

<Exercise title="Exercise 4: Modifying `process.env`" filePath="/src/065-types-you-dont-control/175.5-modifying-process-env.problem"></Exercise>

### Solution 1: Typing a JavaScript Module

The solution is to create a declaration file alongside the JavaScript file with a matching name. In this case, the declaration file should be named `example.d.ts`. Inside of the declaration file, we declare the `myFunc` function with its type signature:

```tsx
// example.d.ts
export function myFunc(): string;

export {};
```

With `example.d.ts` in place, the import statement in `index.ts` will no longer show an error.

### Solution 2: Ambient Context

The first step is to use `declare const` to simulate a global variable within the local scope of the module. We'll start by declaring `DEBUG` as an empty object:

```tsx
declare const DEBUG: {};
```

Now that we've typed `DEBUG`, the error message has moved to be under `getState()`:

```ts twoslash
// @errors: 2339
import { Equal, Expect } from "@total-typescript/helpers";
declare const DEBUG: {};
// ---cut---
const state = DEBUG.getState();

type test = Expect<Equal<typeof state, { id: string }>>;
```

Referencing the test, we can see the `DEBUG` needs a `getState` property that returns an object with an `id` of type `string`. We can update the `DEBUG` object to reflect this:

```tsx
declare const DEBUG: {
  getState: () => {
    id: string;
  };
};
```

With this change, our errors have been resolved!

### Solution 3: Modifying `window`

The first thing we'll do is create a new `window.d.ts` declaration file in the `src` directory. We need this file to be treated as a script in order to access the global scope, so we will not include the `export` keyword.

Inside the file, we'll create a new `interface` named `Window` that extends the built-in `Window` interface in `lib.dom.d.ts`. This will allow us to add new properties to the `Window` interface. In this case, the `DEBUG` property with the `getState` method:

```tsx
// window.d.ts
interface Window {
  DEBUG: {
    getState: () => {
      id: string;
    };
  };
}
```

With this change, the errors have been resolved.

#### Alternative Solution

An alternative solution would be to use `declare global` with the interface directly in the `index.ts` file:

```tsx
// index.ts
const state = window.DEBUG.getState();

type test = Expect<Equal<typeof state, { id: string }>>;

declare global {
  interface Window {
    DEBUG: {
      getState: () => {
        id: string;
      };
    };
  }
}
```

Either approach will work, but often keeping the global types in a separate file can make them easier to find.

### Solution 4: Modifying `process.env`

There are two options for modifying the global scope in TypeScript: using `declare global` or creating a `.d.ts` declaration file.

For this solution, we'll create a `process.d.ts` file in the `src` directory. It doesn't matter what we call it, but `process.d.ts` indicates that we're modifying the `process` object.

Since we know that `ProcessEnv` is inside of the `NodeJS` namespace, we'll use `declare namespace` to add our own properties to the `ProcessEnv` interface.

In this case, we'll declare a namespace `NodeJS` that contains an interface `ProcessEnv`. Inside will be our property `MY_ENV_VAR` of type `string`:

```tsx
// src/process.d.ts

declare namespace NodeJS {
  interface ProcessEnv {
    MY_ENV_VAR: string;
  }
}
```

With this new file in place, we can see that `MY_ENV_VAR` is now recognized as a string in `index.ts`. The error is resolved, and we have autocompletion support for the variable.

Remember, just because the error is resolved, it doesn't mean that `MY_ENV_VAR` will actually be a string at runtime. This update is merely a contract we're setting up with TypeScript. We still need to make sure that this contract is respected in our runtime environment.
