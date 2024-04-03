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

<!-- CONTINUE -->

## Declaration Files

Declaration files play an important role in TypeScript. These `.d.ts` files are where the types and structures of external libraries are defined, and in turn power TypeScript's type checking and autocompletion features. Whether you're working with your own code, a JavaScript library, or a third-party module, declaration files provide the type information for your project.

For example, say we are working with a JavaScript library called `musicPlayer.js` that we want to use in our TypeScript project. We would create a corresponding declaration file `musicPlayer.d.ts` that describes the types and structure of the exported functions.

### Type Declarations

Say there is a `playTrack` function in the `musicPlayer.js` library that we want to type in the `musicPlayer.d.ts` file:

```tsx
// inside of musicPlayer.d.ts

export const playTrack = (track: string) => { // red squiggly line under (track: string) => {}
  console.log(`Playing: ${track}`);
};

// hovering over the error shows:
A 'const' initializer in an ambient context must be a string or numeric literal or literal enum reference.
```

We'll discuss the actual error message later, but for now the important takeaway from it is that declaration files are not allowed to include any runtime code or implementations. They contain just the type declarations.

Here's how the `musicPlayer.d.ts` file should look instead:

```tsx
// inside of musicPlayer.d.ts
export function playTrack(track: string): void;
```

Types and interfaces can also be declared and exported in declaration files. For example, we can declare an interface `Track` and export it from the `musicPlayer.d.ts` file, and update the `playTrack` function to accept a `Track` object instead of a string:

```tsx
// inside of musicPlayer.d.ts
export interface Track {
  title: string;
  artist: string;
  duration: number;
}

export function playTrack(track: Track): void;
```

Then we can import and use `Track` and `playTrack` in a separate file with full type checking and code completion:

```tsx
// inside of app.ts
import { Track, playTrack } from "./musicPlayer";

const othaFish: Track = {
  title: "Otha Fish",
  artist: "The Pharcyde",
  duration: 322,
};

playTrack(othaFish);
```

### Declaration Files Can Be Modules or Scripts

Just like regular TypeScript files, declaration files can be treated as either modules or scripts based on whether or not the `export` keyword is used.

In the example above, `musicPlayer.d.ts` is treated as a module because it includes the `export` keyword before the `Track` interface and the `playTrack` function, which were then imported into `app.ts`.

When a declaration file does not include `export` statements, TypeScript treats it as a script. This means that the declarations will be available globally throughout the project without the need for explicit imports, but as we saw earlier, this can lead to unexpected errors.

It's important to note that the `moduleDetection` setting in `tsconfig.json` does not apply to declaration files– the decision is made based on whether or not there are `export` statements within the `.d.ts` files themselves.

### Typing JavaScript with Declaration Files

Declaration files can be used to define types for JavaScript files and libraries. This is useful when migrating from JavaScript to TypeScript or when working with existing JavaScript codebases.

Consider a JavaScript library called `sellMusic.js` that provides functionality for selling music:

```javascript
// sellMusic.js
export function listAlbum(album) {
  console.log(`Listing: ${album.title} by ${album.artist}`);
}

export function sellAlbum(album) {
  console.log(`Selling: ${album.title} by ${album.artist}`);
}

export function getPrice() {
  return 15.99;
}
```

The first step to integrating this JS library with TypeScript is to create a `.d.ts` declaration file with a matching name– in this case `sellMusic.d.ts`.

Inside of the declaration file, we declare the exported functions and variables with their respective types that match the implementation in the JavaScript file. We'll also include an `Album` interface to keep the types organized:

```typescript
// sellMusic.d.ts
export interface Album {
  title: string;
  artist: string;
  year: number;
}

export function listAlbum(album: Album): void;
export function sellAlbum(album: Album): void;
export function getPrice(): number;

export {};
```

With the declaration file in place, we can now import and use the JavaScript module as expected:

```typescript
// app.ts
import { listAlbum, sellAlbum, getPrice, Album } from "./sellMusic";

const dinosaurL: Album = {
  title: "24-24 Music",
  artist: "Dinosaur L",
  year: 1981,
};

listAlbum(myAlbum);
sellAlbum(myAlbum);

const price = getPrice();
console.log(`Price: ${price}`);
```

This process is the same for any JavaScript library or module that you want to use in a TypeScript project.

## The `declare` Keyword

Earlier we saw an error when including a function implementation in a declaration file:

```tsx
A 'const' initializer in an ambient context must be a string or numeric literal or literal enum reference.
```

Ambient context is a term used to describe the global scope in TypeScript. As we've been defining types in declaration files, we've been adding them to the ambient context and making them globally available.

Even though we can't include function implementations in declaration files, the error message above suggests that there is a way to declare global variables and types without providing actual implementations.

This is done using the `declare` keyword, which can be used in a few different ways.

### `declare const`

Occasionally, you may encounter global variables that come from external libraries or tools that you don't have control over. In situations like these, using `declare const` will allow you to tell TypeScript about the variable's type without providing an actual implementation.

The `declare` keyword simulates a global variable within the local scope of a module. The variable will be available throughout the file it's declared in without polluting the global namespace.

For example, say we have a global variable `MUSIC_API` that is introduced by an external library. We could add the following declaration directly into our `searchMusic.ts` file like so:

```typescript
// inside searchMusic.ts

declare const ALBUM_API: {
  getAlbumInfo(upc: string): Promise<Album>;
  searchAlbums(query: string): Promise<Album[]>;
};
```

Using `declare const` acts similarly to a `.d.ts` file, except that it's scoped only to the file it is declared in.

### `declare global`

Using `declare global` behaves similarly to `declare const`, but allows for the types and variables to be accessible across multiple files in your project.

Here's how the `MUSIC_API` global variable could be declared using `declare global`:

```typescript
// inside musicUtils.ts
declare global {
  const MUSIC_API: {
    searchTracks(query: string): Promise<Track[]>;
    getAlbumInfo(albumId: string): Promise<Album>;
  };
}
```

Now the `MUSIC_API` variable could be used in a different file without being imported.

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

## Comparing Approaches

We've looked at a couple different options for creating types that are globally accessible. Both declaration files and the `declare` keyword are valid approaches, but the one you choose depends on the context and the specific needs of your project.

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

### Exercise 4: Global Declarations

Picking up where the previous exercise left off, `DEBUG` is only available in the file it was declared in. How would the definition need to change in order to make it available across multiple files in the project?

### Exercise 5: Modularizing a Declaration File

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
