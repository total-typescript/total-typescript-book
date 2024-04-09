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
