# Modules, Scripts, and Declaration Files

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

```typescript
// inside of index.ts
console.log(DEFAULT_VOLUME); // red squiggly line under DEFAULT_VOLUME
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

```typescript
// inside of index.ts

console.log(DEFAULT_VOLUME); // 90
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

```typescript
const name = "Alice"; // red squiggly line under name

// Hovering over the error shows:
// Cannot redeclare block-scoped variable 'name'.
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

```typescript
// inside of app.ts

import { playTrack } from "./musicPlayer"; // red squiggly line under ./musicPlayer
// Hovering over the error shows:
// Could not find a declaration file for module './musicPlayer'.
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

```tsx
// musicPlayer.d.ts

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

```typescript
// inside musicUtils.ts
declare global {
  declare const ALBUM_API: {
    // red squiggly line under declare
    getAlbumInfo(upc: string): Promise<Album>;
    searchAlbums(query: string): Promise<Album[]>;
  };
}

// Hovering over the error shows:
// A 'declare' modifier cannot be used in an already ambient context.
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

Like before, we are not including any implementation code in the `.d.ts` file– it's just the types that are being declared.

Once the `duration-utils.d.ts` file is created, the module can be imported and used as usual:

```typescript
import { formatDuration, parseTrackData } from "music-utils";

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

```typescript
// anywhere.ts
import { express } from "express"; // red squiggly line under "express"
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

Let's step back for a minute. How does TypeScript know that `.map` exists on an array? How does it know that `.map` exists, but `.transform` doesn't? Where is this defined

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

<!-- TODO - add a section on the most common global types -->

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

<!-- CONTINUE -->

### Types That Ship With Libraries

### DefinitelyTyped

### `skipLibCheck`

## Authoring Declaration Files

### Augmenting Global Types

### Typing Non-Code Files

### Should You Store Your Types In Declaration Files?

<!-- TODO -->

### Is Using Global Types A Good Idea?

<!-- TODO -->

Global variables have a reputation for causing issues in codebases. They can be extremely difficult to debug when things go wrong, and can make changing code more troublesome.

Global types are a little different. Because their usage is limited to type-checking, they don't have the same potential for causing bugs as global variables.

However, I don't recommend you put your types in the global scope. It's better to keep your types close to where they're used, making it easier to see what part of your codebase 'owns' a particular type.

### Declaration Files vs `declare global`

We've looked at a couple different options for creating types that are globally accessible. Both declaration files and the `declare global` keyword are valid approaches, but the one you choose depends on the context and the specific needs of your project.

Using a `.d.ts` declaration file is best suited for cases where you have several global definitions that need to be organized into a centralized location. This is especially useful in larger projects.

The `declare global` syntax is more convenient when the global declarations are closely tied to the context of specific modules or files. This approach is useful when you want to keep the global declarations close to the code that uses them. The `declare module` syntax should be used when you need to define types for modules that don't have type definitions. It's also possible to use `declare namespace` to define types and modify existing types within a namespace through declaration merging.

In general, it's best to limit global declarations to cases where they are absolutely necessary, such as when interacting with external libraries that don't include type definitions or when working with runtime environments that provide global variables.

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

### Exercise 2: Ambient Context

Consider a variable called `state` that is resolved by `DEBUG.getState()`:

```tsx
const state = DEBUG.getState(); // red squiggly line under DEBUG

type test = Expect<Equal<typeof state, { id: string }>>;
```

Here, `DEBUG` acts like a global variable. In our hypothetical project, `DEBUG` is only referenced in this file and is introduced into the global scope by an external tool that we don't have control over.

Currently, there is an error below `DEBUG` because TypeScript cannot resolve the type of `state` returned by `DEBUG.getState()`.

As seen in the test, we expect `state` to be an object with an `id` of type `string`, but TypeScript currently interprets it as `any`:

```tsx
// hovering over state shows:
const state: any;
```

Your task is to specify that `DEBUG` is available in this module without needing to provide its implementation. This will help TypeScript understand the type of `state` and provide the expected type checking.

### Solution 1: Typing a JavaScript Module

The solution is to create a declaration file with a name that matches the JavaScript file. In this case, the declaration file should be named `example.d.ts`. Inside of the declaration file, we declare the `myFunc` function with its type signature:

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

```tsx
const state = DEBUG.getState(); // red squiggly line under getState

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

### Solution 3: Global Declarations

To update the definition of `DEBUG` to make it available across multiple files in the project, we can use the `declare global` syntax:

```tsx
declare global {
  const DEBUG: {
    getState(): { id: string };
  };
}
```

Alternatively, a new declaration file `global.d.ts` could be created to hold the global declarations:

```tsx
// global.d.ts
declare const DEBUG: {
  getState(): { id: string };
};
```

Then `DEBUG` would be available across the project without needing to import it.
