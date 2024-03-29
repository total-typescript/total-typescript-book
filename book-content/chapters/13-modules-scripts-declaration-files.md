<!-- CONTINUE -->

# Modules, Scripts, and Declaration Files

TypeScript code can be organized into modules, scripts, and declaration files. In this chapter, we will discuss their distinctions and best practices for using them in your projects.

## Understanding Modules and Scripts

Modules and scripts are TypeScript's two primary ways of organizing code. Each approach has its own characteristics and implications for code organization, execution, and scope.

### Modules Have Local Scope

A module is a file that contains code that is executed within its own local scope. This means that variables, functions, and types defined inside a module are not accessible from outside the module unless they are explicitly exported.

Consider this `musicPlayer.ts` module that defines a `MusicPlayer` class:

```typescript
// musicPlayer.ts

export class MusicPlayer {
  private currentTrack: string;

  constructor() {
    this.currentTrack = "";
  }

  play(track: string) {
    this.currentTrack = track;
    console.log(`Now playing: ${this.currentTrack}`);
  }

  stop() {
    console.log(`${this.currentTrack} stopped playing`);
    this.currentTrack = "";
  }
}
```

Without being imported, the `MusicPlayer` class is not accessible from other files:

```tsx
// inside of index.ts
const player = new MusicPlayer(); // red squiggly line under MusicPlayer

// hovering over MusicPlayer shows:
Cannot find name 'MusicPlayer'.
```

In order to use the `MusicPlayer` class, it needs to be explicitly imported. Then it can be used as expected:

```typescript
// inside of index.ts
import { MusicPlayer } from "./musicPlayer";

const player = new MusicPlayer(); // no errors
player.play(`Tragic Monsters`);
```

### Scripts Have Global Scope

Scripts, on the other hand, execute in the global scope. Any variables, functions, or types defined in a script file are accessible from anywhere in the project without the need for explicit imports. This behavior is similar to traditional JavaScript, where scripts are included in HTML files and have global accessibility.

Here's an example of a script file `songLibrary.ts` that contains an array of track names and a function to select a random track:

```typescript
// songLibrary.ts
const fishTracks = [
  "John the Fisherman",
  "Two Fish and an Elephant",
  "Weird Fishes/Arpeggi",
];

function getRandomTrack(tracks) {
  const randomIndex = Math.floor(Math.random() * tracks.length);
  return tracks[randomIndex];
}
```

The `fishTracks` array and `getRandomTrack` function are defined in the global scope and can be accessed from any other script file without the need for imports. VS Code also supports holding the `CMD` key and clicking to jump to their definitions:

```tsx
// inside of index.ts

const randomTrack = getRandomTrack(fishTracks); // no errors
```

### TypeScript Knows the Difference

Did you spot the difference between the `musicPlayer.ts` module and the `songLibrary.ts` script?

The module uses the `export` keyword, while the script does not. This is how TypeScript knows the difference between modules and scripts. If a file contains an `import` or `export` statement, TypeScript treats it as a module. Otherwise, it is considered a script.

If you were to remove the `export` from the `MusicPlayer` class in `musicPlayer.ts`, it would be treated as a script, and become globally available. Likewise, adding `export` to the function or variable in the `songLibrary.ts` script would convert it into a module.

But just because TypeScript isn't showing errors in the script doesn't mean the code will run as expected. Running the `index.ts` script in a Node.js environment will result in an error:

```bash
$ npx tsx index.ts

index.ts:1
const randomTrack = getRandomTrack(fishTracks);
                  ^
                  ReferenceError: getRandomTrack is not defined
```

However, running the same code in a browser environment will work as expected because TSX compiles code into modules.

Understanding the distinction between modules and scripts in TypeScript is fundamental for managing scope and ensuring the accessibility of functions and types throughout your codebase.

### Enforcing Module Usage

By default, TypeScript looks for the `import` and `export` keywords to determine whether a file should be treated as a module or a script. However, most of the applications being built today tend to use modules to avoid the pitfalls that come with using scripts with their global scope.

In order to force TypeScript to treat all files as modules, regardless of the presence of `import` or `export` statements, you can update settings in the `tsconfig.json` file.

The `moduleDetection` setting determines how functions and variables are scoped in your project. There are three different options available: `auto`, `force`, and `legacy`.

By default, it's set to `auto` which corresponds to the keyword searching behavior. The `force` setting will treat all files as modules, regardless of the presence of `import` or `export` statements. The `legacy` setting is a backwards-compatible mode that may not apply modern scoping rules.

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

After this change, all files in the project will be treated as modules, and you will need to use `import` and `export` statements to access functions and variables across files. This helps align your development environment more closely with real-world scenarios while reducing unexpected errors, particularly in projects where new files are frequently created.

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
