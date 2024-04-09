# 15. Configuring TypeScript

We've dipped into TypeScript's `tsconfig.json` configuration file a few times in this book. Let's take a deeper look. We won't cover every option in `tsconfig.json` - many of them are old and rarely used - but we'll cover the most important ones.

## Recommended Configuration

To start, here's a recommended base `tsconfig.json` configuration with options appropriate for most applications you're building:

```json
{
  "compilerOptions": {
    /* Base Options: */
    "skipLibCheck": true,
    "target": "es2022",
    "esModuleInterop": true,
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "strict": true,
    "noUncheckedIndexedAccess": true
}
```

Here's what each setting does:

- `skipLibCheck`: Skips type checking of declaration files, which improves compilation speed. We covered this in the previous chapter.
- `target`: Specifies the ECMAScript target version for the compiled JavaScript code. Targeting `es2022` provides access to some relatively recent JavaScript features - but by the time you read this book, you might want to target a newer version.
- `esModuleInterop`: Enables better compatibility between CommonJS and ES modules.
- `allowJs`: Allows JavaScript files to be imported into the TypeScript project.
- `resolveJsonModule`: Allows JSON files to be imported into your TypeScript project.
- `moduleDetection`: The `force` option tells TypeScript to treat all `.ts` files as a module, instead of a script. We covered this in the previous chapter.
- `isolatedModules`: Ensures that each file can be independently transpiled without relying on information from other files.
- `strict`: Enables a set of strict type checking options that catch more errors and generally promote better code quality.
- `noUncheckedIndexedAccess`: Enforces stricter type checking for indexed access operations, catching potential runtime errors.

Once these base options are set, there are several more to add depending on the type of project you're working on.

### Additional Configuration Options

After setting the base `tsconfig.json` settings, there are several questions to ask yourself to determine which additional options to include.

**Are you transpiling your code with TypeScript?**
If yes, set `module` to `NodeNext`.

**Are you building for a library?**
If you're building for a library, set `declaration` to `true`. If you're building for a library in a monorepo, set `composite` to `true` and `declarationMap` to `true`.

**Are you not transpiling with TypeScript?**
If you're using a different tool to transpile your code, such as ESbuild or Babel, set `module` to `Preserve`, and `noEmit` to `true`.

**Does your code run in the DOM?**
If yes, set `lib` to `["dom", "dom.iterable", "es2022"]`. If not, set it to `["es2022"]`.

### The Complete Base Configuration

Based on your answers to the above questions, here's how the complete `tsconfig.json` file would look:

```json
{
  "compilerOptions": {
    /* Base Options: */
    "skipLibCheck": true,
    "target": "es2022",
    "esModuleInterop": true,
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "isolatedModules": true,

    /* Strictness */
    "strict": true,
    "noUncheckedIndexedAccess": true,

    /* If transpiling with TypeScript: */
    "module": "NodeNext",
    "outDir": "dist",
    "sourceMap": true,

    /* AND if you're building for a library: */
    "declaration": true,

    /* AND if you're building for a library in a monorepo: */
    "composite": true,
    "declarationMap": true,

    /* If NOT transpiling with TypeScript: */
    "module": "Preserve",
    "noEmit": true,

    /* If your code runs in the DOM: */
    "lib": ["es2022", "dom", "dom.iterable"],

    /* If your code doesn't run in the DOM: */
    "lib": ["es2022"]
  }
}
```

Now that we understand the lay of the land, let's take a look at each of these options in more detail.

## Base Options

### `target`

The `target` option specifies the ECMAScript version that TypeScript should target when generating JavaScript code.

For example, setting `target` to `ES5` will attempt to transform your code to be compatible with ECMAScript 5.

Language features like optional chaining and nullish coalescing, which were introduced later than ES5, are still available:

```tsx
// Optional chaining
const search = input?.search;

// Nullish coalescing
const defaultedSearch = search ?? "Hello";
```

But when they are turned into JavaScript, they'll be transformed into code that works in ES5 environments:

```javascript
// Optional chaining
var search = input === null || input === void 0 ? void 0 : input.search;
// Nullish coalescing
var defaultedSearch = search !== null && search !== void 0 ? search : "Hello";
```

#### `target` Doesn't Polyfill

While `target` can transpile newer syntaxes into older environments, it won't do the same with API's that don't exist in the target environment.

For example, if you're targeting a version of JavaScript that doesn't support `.replaceAll` on strings, TypeScript won't polyfill it for you:

```tsx
const str = "Hello, world!";

str.replaceAll("Hello,", "Goodbye, cruel");
```

This code will error in your target environment, because `target` won't transform it for you. If you need to support older environments, you'll need to find your own polyfills. You configure the environment your code executes in with `lib`, as we saw in a previous chapter.

If you're not sure what to specify for `target`, keep it up to date with the version you have specified in `lib`.

### `esModuleInterop`

`esModuleInterop` is an old flag, released in 2018. It helps with interoperability between CommonJS and ES modules. At the time, TypeScript had deviated slightly from commonly-used tools like Babel in how it handled wildcard imports and default exports. `esModuleInterop` brought TypeScript in line with these tools.

You can read the [release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#support-for-import-d-from-cjs-from-commonjs-modules-with---esmoduleinterop) for more details. Suffice to say, when you're building an application, `esModuleInterop` should always be turned on. There's even a proposal to make it the default in TypeScript 6.0.

### `isolatedModules`

`isolatedModules` prevents some TypeScript language features that single-file transpilers can't handle.

Sometimes you'll be using other tools than `tsc` to turn your TypeScript into JavaScript. These tools, like `esbuild`, `babel` or `swc`, can't handle all TypeScript features. `isolatedModules` disables these features, making it easier to use these tools.

Consider this example of an `AlbumFormat` enum that has been created with `declare const`:

```tsx
declare const enum AlbumFormat {
  CD,
  Vinyl,
  Digital,
}

const largestPhysicalSize = AlbumFormat.Vinyl; // red squiggly line under AlbumFormat when isolatedModules is enabled
```

Recall that the `declare` keyword will place `const enum` in an ambient context, which means that it would be erased at runtime.

When `isolatedModules` is disabled, this code will compile without any errors.

However, when `isolatedModules` is enabled, the `AlbumFormat` enum will not be erased and TypeScript will raise an error:

```tsx
// hovering over AlbumFormat.Vinyl shows:
Cannot access ambient const enums when 'isolatedModules' is enabled.

// index.js after transpilation
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const largestPhysicalSize = AlbumFormat.Vinyl;
```

This is because only `tsc` has enough context to understand what value `AlbumFormat.Vinyl` should have. TypeScript checks your entire project at once, and stores the values for `AlbumFormat` in memory.

When using a single-file transpiler like `esbuild`, it doesn't have this context, so it can't know what `AlbumFormat.Vinyl` should be. So, `isolatedModules` is a way to make sure you're not using TypeScript features that can be difficult to transpile.

`isolatedModules` is a sensible default because it makes your code more portable if you ever need to switch to a different transpiler - and it disables so few patterns that it's worth the trade-off.

<!-- CONTINUE -->

## Strictness

### `strict`

The `strict` option in `tsconfig.json` acts as shorthand for enabling several different type checking options all at once, including catching potential `null` or `undefined` issues and stronger checks for function parameters, among others.

Setting `strict` to `false` makes TypeScript behave in ways which are much less safe. Without `strict`, TypeScript will allow you to assign `null` to a variable that is supposed to be a string:

```tsx
let name: string = null; // no error
```

With `strict` enabled, TypeScript will, of course, catch this error.

In fact, I've written this entire book on the premise that you have `strict` enabled in your codebase. It's the baseline for all modern TypeScript apps.

#### Should You Start With `strict: false`?

One argument you often hear for turning `strict` off is that it's a good on-ramp for beginners. You can get a project up and running faster without having to worry about all the strictness rules.

However, I don't think this is a good idea. A lot of prominent TypeScript libraries, like `zod`, `trpc`, `@redux/toolkit` and `xstate`, won't behave how you expect when `strict` is off. Most community resources, like StackOverflow and React TypeScript Cheatsheet, assume you have `strict` enabled.

Not only that, but a project that starts with `strict: false` is likely to stay that way. On a mature codebase, it can be very time-consuming to turn `strict` on and fix all of the errors.

So, I consider `strict: false` a fork of TypeScript. It means you can't work with many libraries, makes seeking help harder, and leads to more runtime errors.

### `noUncheckedIndexedAccess`

One strictness rule which isn't part of `strict` is `noUncheckedIndexedAccess`. When enabled, it helps catch potential runtime errors by detecting cases where accessing an array or object index might return `undefined`.

Consider this example of a `VinylSingle` interface with an array of `tracks`:

```typescript
interface VinylSingle {
  title: string;
  artist: string;
  tracks: string[];
}

const egoMirror: VinylSingle = {
  title: "Ego / Mirror",
  artist: "Burial / Four Tet / Thom Yorke",
  tracks: ["Ego", "Mirror"],
};
```

To accessing the b-side of `egoMirror`, we would index into its `tracks` like this:

```typescript
const bSide = egoMirror.tracks[1];
console.log(bSide.toUpperCase()); // 'MIRROR'
```

Without `noUncheckedIndexedAccess` enabled in `tsconfig.json`, TypeScript assumes that indexing will always return a valid value, even if the index is out of bounds.

Trying to access a non-existent fourth track would not raise an error in VS Code, but it does result in a runtime error:

```typescript
const nonExistentTrack = egoMirror.tracks[3];
console.log(nonExistentTrack.toUpperCase()); // no error in VS Code

// However, running the code results in a runtime error:
TypeError: Cannot read property 'toUpperCase' of undefined
```

By setting `noUncheckedIndexedAccess` to `true`, TypeScript will infer the type of every indexed access to be `T | undefined` instead of just `T`. In this case, every entry in `egoMirror.tracks` would be of type `string | undefined`:

```tsx
const ego = egoMirror.tracks[0];
const mirror = egoMirror.tracks[1];
const nonExistentTrack = egoMirror.tracks[3];

// hovering over ego shows:
// const ego: string | undefined
```

However, because the types of each of the tracks are now `string | undefined`, we have errors when attempting to call `toUpperCase` even for the valid tracks:

```typescript
console.log(ego.toUpperCase()); // red squiggly line under ego

// hovering over ego shows
'ego' is possibly 'undefined'
```

This means that we have to handle the possibility of `undefined` values when accessing array or object indices.

So `noUncheckedIndexedAccess` makes TypeScript more strict, but at the cost of having to handle `undefined` values more carefully.

Usually, this is a good trade-off, as it helps catch potential runtime errors early in the development process. But I wouldn't blame you if you end up turning it off in some cases.

### Other Strictness Options

<!-- TODO -->

## `module` and `moduleResolution`

Speaking of modules and transpiling with different tools, the `module` and `moduleResolution` settings in `tsconfig.json` will change depending on your project.

The `module` setting specifies what kind of module code you want TypeScript to emit, and the `moduleResolution` setting determines how TypeScript should resolve imports throughout your application.

There are several options to choose from, but as mentioned at the beginning of this chapter, it was mentioned that `NodeNext` and `Bundler` are the two primary module resolution strategies you should be choosing from.

Let's take a closer look at each of these options and when you should choose them.

### `NodeNext` Module Resolution

If you are transpiling your TypeScript code using the TypeScript compiler, you should choose `module: "NodeNext"` and `moduleResolution: "NodeNext"` in your `tsconfig.json` file:

```tsx
// inside tsconfig.json
"compilerOptions": {
  "moduleResolution": "NodeNext",
  "module": "NodeNext"
  // ...other options...
```

When using `NodeNext` module resolution, TypeScript emulates Node's module resolution behavior, which includes support for features like `package.json`'s `"exports"` field and automatic file extension resolution.

You will also be required to add the `.js` extension to local file imports. This might seem strange when you're importing a `.ts` file, but it's necessary because TypeScript targets the compiled JavaScript file. Because TypeScript doesn't want to change runtime behavior by altering import paths and Node.js will be executing the code, you need to use `.js` when importing when using `NodeNext` module resolution.

When using `NodeNext`, you can import modules using the familiar CommonJS or ECMAScript module syntax:

```typescript
// CommonJS syntax
const { Album } = require("./album.js");

// ECMAScript module syntax
import { Album } from "./album.js";
```

The `NodeNext` strategy is particularly useful when you are developing Node.js applications or libraries that will be consumed by Node.js environments.

### `Bundler` Module Resolution

The `Bundler` module resolution strategy is designed to work with bundler tools like Webpack or Parcel. It also a good choice when building with web frameworks like Vite or Next.js.

This strategy assumes that the bundler will handle module resolution and provides a more flexible and lenient approach to importing modules.

To use `Bundler` module resolution, set the `moduleResolution` option to `"Bundler"` and the `module` option to `"Preserve"` in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "Preserve"
    // ... other options ...
    ...
```

With `Bundler` module resolution, TypeScript assumes that the bundler will handle module resolution, so it is more flexible when it comes to import statements. For example, you can import modules using relative paths or aliases defined in your bundler configuration:

```typescript
// Relative path import
import { Album } from "./album";

// Alias import (assuming 'src' is configured as an alias in the bundler)
import { Album } from "src/album";
```

If you're using tools other than the TypeScript compiler to transpile your code, choose `Bundler` module resolution. Otherwise, choose `NodeNext`.

## Configuring TypeScript as a Linter

When using the `Bundler` module resolution strategy in `tsconfig.json`, an additional suggestion is to set the `noEmit` setting to `true`.

The `noEmit` setting tells TypeScript not to emit any JavaScript files during compilation, because the bundler tool will be taking care of this responsibility.

Without any `.js` files to produce, TypeScript will only have to perform type checking and report any type-related errors or warnings. Essentially, it will become a linting tool.

This is particularly useful when you have a separate build process handled by tools like Babel, webpack, or Rollup, and you want TypeScript to focus solely on type checking and linting.

Any errors or warnings will be reported in the terminal as well as in your editor.

By treating TypeScript as a linter, you'll be able to use external tools without losing type-checking and autocompletion features.

## Transpiling Code for Library Use

If you're building a library either for publishing on npm or using in your own projects, there are a few important settings you'll need to include in your `tsconfig.json` file.

### Creating Declaration Files

We've already discussed how `.d.ts` declaration files are used to provide type information for JavaScript code, but so far we've only created them manually.

By setting `"declaration": true` in your `tsconfig.json` file, TypeScript will automatically generate `.d.ts` files and save them alongside your compiled JavaScript files in the specified `outDir`:

```json
{
  "compilerOptions": {
    "declaration": true,
    "outDir": "dist"
    // ... other options ...
```

When you run the TypeScript compiler, it will generate `.d.ts` files for each TypeScript file in your project. These declaration files will contain type information for the corresponding JavaScript files, allowing other developers to use your library with TypeScript and benefit from type checking and autocompletion features.

```json
{
  "compilerOptions": {
    "declaration": true
  }
}
```

For example, consider this `album.ts` file:

```typescript
// inside album.ts

export interface Album {
  title: string;
  artist: string;
  year: number;
}

export function createAlbum(
  title: string,
  artist: string,
  year: number,
): Album {
  return { title, artist, year };
}
```

After running the TypeScript compiler with the `declaration` option enabled, it will generate an `album.js` and `album.d.ts` file in the project's `dist` directory.

Here's the declaration file code with the type information:

```typescript
// album.d.ts

export interface Album {
  title: string;
  artist: string;
  year: number;
}

export declare function createAlbum(
  title: string,
  artist: string,
  year: number,
): Album;
```

And the `album.js` file transpiled from TypeScript:

```javascript
// album.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAlbum = void 0;
function createAlbum(title, artist, year) {
  return { title, artist, year };
}
exports.createAlbum = createAlbum;
```

Once the declaration files are generated, they can be imported and used in separate files:

```tsx
// inside app.js

import { createAlbum } from "dist/album";

const album = createAlbum("Go Forth", "Les Savy Fav", 2001);
```

At this point, we could use `CMD + click` to go to the definition of `createAlbum` in VS Code, but it would take us to `album.d.ts`.

Depending on your use case, it may be more useful to go to the actual implementation in `album.js`. This is where declaration maps come in.

### Declaration Maps

Declaration maps are generated files that provide a mapping between the generated `.d.ts` and the original `.ts` source files.

In order to create them, the `declarationMap` setting should be added to your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true
    // ... other options ...
```

With this option in place, the TypeScript compiler will generate `.d.ts.map` files alongside the `.d.ts` files. Now when `CMD + click`ing on the `createAlbum` import in `app.js`, you'll be taken to the original `album.ts` file instead of the type definitions.

Declaration maps are most useful when you're building locally in a monorepo or other project where changes to the source code directly affect the generated `.d.ts` files. If you are building a library for npm, it's likely that you won't need declaration maps since the end users will be using the built code instead of the original source.

## `jsx`

Recall that when building web applications, it's recommended to include `dom` and `dom.iterable` in the `lib` options of your `tsconfig.json` file:

```tsx
{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["es2022", "dom", "dom.Iterable"]
    // ... other options ...

```

If you're using React or another framework that uses JSX, you'll need to use the aptly-named `jsx` option in your `tsconfig.json` file.

The `jsx` option tells TypeScript how to handle JSX syntax during compilation, and has five possible values. However, the most common values are `preserve`, `react`, and `react-jsx`.

### `preserve`

When `jsx` is set to `preserve`, TypeScript leaves the JSX syntax as it is and doesn't transform it.

```tsx
// inside tsconfig.json
{
  "compilerOptions": {
    "jsx": "preserve",
    ...
```

When TypeScript compiles your code with this setting, the output will be a `.jsx` file, not a `.js` file. In our example, the output would be a `dist/index.jsx` file, with the `<div />` JSX syntax unchanged.

Note that if you're bundling your TypeScript code into a library for others to use, this option is not recommended.

### `react`

The `react` option transforms the JSX syntax into `React.createElement` calls:

```tsx
jsx: "react";
```

However, this option assumes that `React` is in scope, which can lead to errors if `React` isn't imported. For our example code to run without errors, we would need to import `React` at the top of our file:

```tsx
import React from "react";

const MyComponent = () => {
  return <div />;
};
```

The transpiled code would then look like this:

```js
// dist/index.js
import React from "react";
const MyComponent = () => {
  return React.createElement("div", null);
};
```

This option is best for legacy React projects.

### `react-jsx`

The `react-jsx` option is designed for version 17 of React and beyond, and doesn't require you to import `React`.

Instead, it uses a newer JSX transform that transforms the JSX elements into `_jsx` calls instead of `React.createElement` calls. This option requires you to import `JSX` from `react/jsx-runtime`:

```tsx
import { JSX } from "react/jsx-runtime";

const MyComponent = () => {
  return <div />;
};
```

If you're building a library for others to use, this is the recommended option to use.

## Managing Multiple TypeScript Configurations

As projects grow in size and complexity, it's common to have different environments or targets within the same project.

For example, your single repo might include both a client-side application and a server-side API, each with different requirements and configurations. For example, DOM APIs like `document` are not available on the server-side, and Node.js APIs like `fs` are not available on the client-side.

In situations like these, it becomes necessary to have multiple `tsconfig.json` files.

### Structuring a Project with Multiple TypeScript Configurations

By default, TypeScript determines which `tsconfig.json` to use by looking for the closest one to the current `.ts` file in question. If there are no other `tsconfig.json` files present, TypeScript defaults to using the one in the root of the repo.

To structure a project with multiple TypeScript configurations for `client` and `server`, you can create separate directories with `tsconfig.json` files for each. Here's an example of what that might look like:

```
project/
src/
  ├── client/
  │   ├── src/
  │   │   └── ...
  │   └── tsconfig.json
  ├── server/
  │   ├── src/
  │   │   └── ...
  │   └── tsconfig.json
  ├── shared/
      └── ...
```

The `client/tsconfig.json` file could include DOM libs and `jsx` options, while the `server/tsconfig.json` file could include Node.js libs and `module` options.

#### Globals with Multiple `tsconfig.json` Files

A useful feature of having multiple `tsconfig.json` files is that globals are tied to a single configuration file.

For example, say a declaration file `server.d.ts` in the `server` directory has a global declaration for a `ONLY_ON_SERVER` variable. This variable will only be available in files that are part of the `server` configuration:

```tsx
// inside server/server.d.ts
declare const ONLY_ON_SERVER: string;
```

Trying to use `ONLY_ON_SERVER` in a file that's part of the `client` configuration will result in an error:

```tsx
// inside client/index.ts
console.log(ONLY_ON_SERVER); // red squiggly line under ONLY_ON_SERVER
```

This feature is useful when dealing with environment-specific variables or globals that come from testing tools like Jest or Cypress, and avoids polluting the global scope.

### Extending Configurations

When you have multiple `tsconfig.json` files, it's common to have shared settings between them:

```tsx
// client/tsconfig.json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "Preserve",
    "esModuleInterop": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "lib": [
      "es2022",
      "dom",
      "dom.Iterable"
    ],
    "jsx": "react-jsx",
  }
}

// server/tsconfig.json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "Preserve",
    "esModuleInterop": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "lib": [
      "es2022"
    ]
  },
}
```

Instead of repeating the same settings in both `client/tsconfig.json` and `server/tsconfig.json`, we can create a new `tsconfig.base.json` file that can be extended from.

The common settings can be moved to `tsconfig.base.json`:

```tsx
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "Preserve",
    "esModuleInterop": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true
  }
}
```

Then, the `client/tsconfig.json` would extend the base configuration wit the `extends` option that points to the `tsconfig.base.json` file:

```tsx
// client/tsconfig.json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "lib": [
      "es2022",
      "dom",
      "dom.Iterable"
    ],
    "jsx": "react-jsx"
  }
}
```

The `server/tsconfig.json` would do the same:

```tsx
// server/tsconfig.json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "lib": [
      "es2022"
    ]
  }
}
```

This approach is particularly useful for monorepos, where many different `tsconfig.json` files might need to reference the same base configuration.

Any changes to the base configuration will be automatically inherited by the `client` and `server` configurations. However, it's important to note that using `extends` will only copy over `compilerOptions` from the base configuration, and not other settings like `include` or `exclude` (which are used to specify which files to include or exclude from compilation).

### Project References

Continuing with our multi-config example, consider this `package.json` file that defines `dev` scripts for both the client and server projects, as well as both simultaneously:

```json
{
  "name": "exercise",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "run-p dev:*",
    "dev:client": "tsc --project ./src/client/tsconfig.json --watch",
    "dev:server": "tsc --project ./src/server/tsconfig.json --watch"
  }
}
```

In its current state, there's a lot of plumbing going on with hardcoded filepaths. If the file structure changes, the `package.json` file will need to be updated.

Fortunately, `tsconfig.json` files allow us to configure project references to clean this up.

Let's look at a few approaches to organizing TypeScript configurations using project references.

#### Option 1: Referencing Existing Configurations

For this approach, we'll assume that the `client` and `server` directories still have their own `tsconfig.json` files that extend the `tsconfig.base.json` file.

What we could do here is have a single `tsconfig.json` file at the root of the project that has references to the `client` and `server` configurations:

```tsx
// tsconfig.json
{
  "references": [
    {
      "path": "./src/client/tsconfig.json"
    },
    {
      "path": "./src/server/tsconfig.json"
    }
  ],
  "files": []
}
```

Note that there is also an empty `files` array in the configuration above. This is because the `tsconfig.json` file in the root directory is not responsible for type checking any files. Instead, it serves as a reference `tsconfig.json` to run the client and server `tsconfig.json` files in a specific order.

Then inside of the `package.json` file, the `dev` script command would be updated to use the `-b` flag. This flag tells TypeScript to build the project references as well, in turn allowing us to check the entire repo with a single command:

```tsx
{
  "name": "exercise",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "tsc -b --watch"
  }
}
```

We would also need to add the `composite` option to the `tsconfig.base.json` file. This option tells TypeScript that it is a child project configuration that needs to be run with project references:

```tsx
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "Preserve",
    "esModuleInterop": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "composite": true
  },
}
```

While this approach works, it might not be ideal to have several `tsconfig.json` files present in different directories.

#### Option 2: Root Level Organization

Renaming and moving all of the `tsconfig.json` files to the root directory is the next approach:

```tsx
project/
  ├── src/
  │   ├── client/
  │   │   └── ...
  │   ├── server/
  │   │   └── ...
  │   └── shared/
  │       └── ...
  ├── tsconfig.base.json
  ├── tsconfig.client.json
  ├── tsconfig.server.json
  ├── tsconfig.json
  └── package.json
```

With this structure, it's more clear that the `tsconfig.json` file belongs to the entire project instead of just a single part of it.

Like before, the client and server configurations would extend `tsconfig.base.json`, and the `tsconfig.json` file would then reference the client and server configurations:

```tsx
// tsconfig.json
{
  "references": [
    {
      "path": "./tsconfig.client.json"
    },
    {
      "path": "./tsconfig.server.json"
    }
  ],
  "files": []
}
```

Again, this solution will work, but it might feel like clutter to have so many `tsconfig.json` files in the root directory.

#### Option 3: Separate Configuration Folder

An emerging pattern for having multiple `tsconfig.json` files in a project is to place them into a separate `.config` directory:

```tsx
project/
  ├── src/
  │   ├── .config/
  │   │   ├── tsconfig.base.json
  │   │   ├── tsconfig.client.json
  │   │   ├── tsconfig.server.json
  │   │   └── tsconfig.json
  │   ├── client/
  │   │   └── ...
  │   ├── server/
  │   │   └── ...
  │   └── shared/
  │       └── ...
  └── package.json
```

Each of the `tsconfig.json` files would be updated to reference the other configurations, but the fundamental structure of the project would remain the same.

The the `dev` script inside of `package.json` is now simplified to just one line:

```tsx
{
  "name": "exercise",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "tsc -b --watch"
  }
}
```

Whichever approach you choose, project references and extending configuration files are great for keeping your TypeScript configurations organized and maintainable. Choose whichever approach makes the most sense for your project.
