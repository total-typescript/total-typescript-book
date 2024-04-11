<!-- CONTINUE -->

# 15. CommonJS vs. ES Modules

JavaScript is still a very young language. Its youth is most obvious when looking at how you modularize your code. As of 2024, the time of writing, there are _two_ ways to modularize your code in JavaScript: CommonJS (CJS) and ECMAScript Modules (ESM).

Understanding the differences between these two module systems, and how they interoperate, is crucial for writing modern JavaScript applications.

## An Overview

CommonJS was the first to appear and was created for use with Node.js. It introduced the `require` function for importing modules, and the `module.exports` object for exporting functionality. CJS modules have their own scope, which helps prevent unintended interactions with the global scope.

```javascript
// an import statement in CommonJS:
const module = require("module");

// an export statement in CommonJS:
module.exports = "Hello, world!";
```

ECMAScript Modules, often referred to as ES Modules or ESM, arrived later as part of the ECMAScript standard. ESM introduced a more declarative syntax using `import` and `export` statements:

```javascript
// an import statement in ESM:
import module from "module";

// an export statement in ESM:
export default "Hello, world!";
```

The ESM system was designed to work seamlessly in both browser and Node.js environments, providing a unified module system for JavaScript.

However, there are still traces of CommonJS in the ecosystem. Many existing libraries and codebases rely heavily on CJS, and even when using a bundler and writing code in ESM syntax, you might find the output is still in CommonJS format. To make things more confusing, some NPM packages written in CommonJS can work in ESM, but not the other way around.

The goal of this chapter is to prepare you for a future where everything in your application code is ES Modules, while also providing you with the tools to handle any interoperability issues you might encounter.

## Importing ESM into a CommonJS System

Let's look at a very typical error that shows up when working with both CommonJS and ES Modules in the same project.

Consider these two JavaScript files:

Here we have `esm-module.js`, which is a module that employs `export default` to export a value in ESM syntax:

```tsx
// esm-module.js
const hello = () => {
  console.log("Hello from Matt!");
};
export default hello;
```

Then inside of `index.js`, a `require` statement is used to import the `esm-module.js` file:

```tsx
// index.js
const esModule = require("./esm-module.js"); // cjs require

const main = async () => {
  esModule.default();
};

main();
```

A `package.json` file with a `dev` script is also present. The script calls `nodemon`, a tool that automatically reruns our application whenever there's a modification in our files.

However, when the script is run with the `npm run dev` command, we get an error from the `esm-module.js` file:

```typescript
export default hello;
^^^^^^
SyntaxError: Unexpected token 'export'
```

The issue is that the `index.js` file is written with CommonJS syntax, and it attempting to import something that's exported with the ES Module syntax `export default`.

Here's a simplified view of these files:

```javascript
// index.js
const esModule = require("./es-module.js");

// esm-module.js
export default "Hello, world!";
```

### Fixing the Error with `await import`

In order to fix this error, we need to fix this way we import the `esm-module.js` file in `index.js`.

Instead of the original import statement in the CommonJS `require` syntax, we need to use the `await import` syntax. This is a dynamic import statement that promises to return the module namespace object of the specified module.

Because the syntax is async, it should be be used inside an async function like so:

```tsx
// inside index.js
const main = async () => {
  const esModule = await import("./esm-module.mjs");
  esModule.default();
};
main();
```

Using the `await import` syntax is the primary method for importing ES module-compatible material into a CommonJS system.

However, this modification alone doesn't eliminate the error. The `await import` syntax is capable of targeting both CommonJS and ES modules, and Node.js defaults to treating the target as a CommonJS file.

We need to tell Node.js explicitly that our file is an ES module. We can do this by changing the file extension to `.mjs`:

```tsx
const esModule = await import("./esm-module.mjs");
```

By using the `.mjs` extension, Node.js recognizes that the file is an ES module. This allows us to utilize `import` and `export` statements within it.

After making these changes, our code operates as expected.

## Importing CommonJS into an ESM System

While importing ESM into CJS takes a bit of work with the `await import` syntax and renaming the file to `.mjs`, importing CommonJS into ESM "just works".

Here we have an `index.mjs` file. It imports `hello` from `commonjs.cjs`, and uses it in a `main` function:

```tsx
//index.mjs
import hello from "./cjs-module.cjs";

const main = async () => {
  hello();
};

main();
```

The `cjs-module.js` file uses the CommonJS syntax of setting `module.exports` to the `hello` function:

```tsx
// cjs-module.cjs
const hello = () => {
  console.log("Hello!");
};

module.exports = hello;
```

Running this code works without errors.

The main point to remember here is that importing CommonJS into an ESM system directly is supported, but the opposite isn't true without additional steps.

## `This Expression is Not Callable`

When writing an ESM module in TypeScript, you might encounter an error that says `This expression is not callable`. This error occurs when you attempt to call a function that is being imported from a module.

For example, this `index.ts` uses the `await import` syntax to import a function from `esm-module.js`:

```tsx
// inside index.ts

const main = async () => {
  const esModule = await import("./esm-module.mjs");

esModule.default(); // red squiggly line under default
};
main();

// hovering over default shows:
This expression is not callable.
```

TypeScript knows that `esModule` is being imported from a module, as seen when hovering over it:

```tsx
// hovering over esModule shows:
const esModule: {
  default: typeof import("src/esm-module");
};
```

Inside of the `esm-module.ts` file, we have a function called `hello` that we are exporting as the default export:

```tsx
const hello = () => {
  console.log("Hello!");
};
export default hello;
```

Despite the file being a TypeScript file that is compiled into JavaScript, TypeScript does not recognize that it should regard the `esm-module.ts` file as an ES module.

### Name ES Modules as `.mts`

In order to resolve this issue, we need to tell TypeScript that the `esm-module` file being imported is an ES module. To do this, we need to rename the file to `esm-module.mts`.

With this change, when TypeScript compiles the file, it will generate an `esm-module.mjs` file. This means we also need to update the import in the `index.ts` file:

```tsx
// index.ts
const main = async () => {
  const esModule = await import("./esm-module.mjs"); // Dynamic import
  esModule.default();
};
main();
```

TypeScript does this compilation thanks to the `moduleNodeNext` and `moduleResolutionNodeNext` configurations in TypeScript:

```tsx
{
  compilerOptions: {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
}
```

Without these configurations, TypeScript will assume that the file is a CommonJS file and will require you to use `esModule.default.default()` to access the default export. If you've ever stumbled upon a double `default` in a codebase, now you know why.

However, when the file extension is `.mts`, `esModule.default()` will operate correctly.

Note that inside of the `index.ts` file, calling `esModule.default()` is enforced because because of the `export default` syntax inside of `esm-module.mts`. If change the export to `export const hello`, it would be accessed with `esModule.hello` in the `index.ts` file.

Understanding how TypeScript identifies CommonJS and ESM files is important for recognizing errors that come up when combining the two module systems.

## Browsers Can't Use CommonJS

An important thing to know is that browsers can't run CommonJS's `require` calls. This issue becomes particularly noticeable when using TypeScript.

Here we have an `example.ts` file that imports a function from `run.js` and executes it:

```tsx
// example.ts
import run from "./run.js";
run("Hello!");
```

While this code looks like it uses ES6 import syntax, by default TypeScript will transpile this to CommonJS syntax with `require()` calls:

```tsx
// dist/example.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const run_js_1 = require("./run.js");
(0, run_js_1.run)("Hello!");
```

Let's see what happens when we attempt to run this in the browser by adding `dist/example.js` to a script tag in an `index.html` file:

```html
<script src="dist/example.js"></script>
```

Upon attempting to load this in a browser environment, an error occurs: `exports is not defined`.

This error happens because the transpiled JavaScript code includes references to `exports`, which is a global object provided by the Node.js runtime. However, `exports` does not exist in a browser environment, causing the JavaScript code to fail.

### Configure TypeScript to Output ESM

In order to fix this, we need to tell TypeScript to output ES6 modules instead of CommonJS.

First, rename the `.ts` file to `.mts` to denote it is a TypeScript module file. This change will make TypeScript output an `.mjs` file with the ES6 import/export syntax, which is supported by modern browsers.

After compiling the `.mts` file, the `script` tag needs updating to point to the `.mjs` file along with adding the `type="module"` attribute:

```html
<script type="module" src="dist/example.mjs"></script>
```

Now when reloading the page in the browser, `hello` is printed to the console as expected. The browser understands ESM, and loads the resources appropriately.

## Enforcing Correct Module Syntax

As we've seen in the above examples, it can be confusing to know whether the code you're emitting in TypeScript is going to be CommonJS or ESM code.

It's not sufficient to just write `export default` or `export =`, because TypeScript conforms to Node's framework, which has its distinct interpretation of what a CommonJS or an ESM module is.

TypeScript conforms to Node's framework, which has a distinct interpretation of what a CommonJS or an ESM module is. That's why it's not enough to just write `export default` or `export =` on their own.

In order to tell TypeScript to enforce the correct module syntax, the `verbatimModuleSyntax` option can be added to the `tsconfig.json` file:

```tsx
// tsconfig.json
{
  "compilerOptions": {
    "module": "NodeNext",
    "verbatimModuleSyntax": true
    ...
```

Once `verbatimModuleSyntax` has been added and set to true, TypeScript will show an error when the incorrect syntax is used.

For example, consider this file `cjs-module.ts` that uses the `export default` syntax:

```tsx
// cjs-module.ts
const hello = () => {
  console.log("Hello!");
};

export default hello; // red squiggly line under export default hello
```

When `verbatimModuleSyntax` is enabled, TypeScript will show an error under the `export default` line that tells us we're mixing the syntaxes together:

```tsx
// hovering over export default hello shows:
ESM syntax is not allowed in a CommonJS module when 'verbatimModuleSyntax' is enabled.
```

In order to fix the issue, we need to use the `export =` syntax instead:

```tsx
// cjs-module.ts

const hello = () => {
  console.log("Hello!");
};
export = hello;
```

The warnings will show when trying to use an ESM import as well:

```tsx
import { z } from "zod"; // rsl under import statement

// hovering over the import shows:
ESM syntax is not allowed in a CommonJS module when 'verbatimModuleSyntax' is enabled.
```

This functionality is helpful when you want to be precise about the syntax you're employing and the JavaScript you're generating.

In the following sections, we'll keep Verbatim Module Syntax enabled as we discover how to adjust some of the default settings when you want to entirely adopt either ESM or CommonJS. We'll also look at how to make both TypeScript and Node.js understand what's happening.

## Treating `.ts` Files as ESM by Default

In order to configure TypeScript to adopt ESM by default in TypeScript and Node, there is a quick configuration change that can be made.

Inside of the `package.json` file, add a `type` field and set it to `module`:

```json
// package.json
{
  "name": "my-project",
  // ... other settings ...
  "type": "module"
}
```

After this change, TypeScript and NodeJS will treat your files as ESM by default, without having to rename all of your files to `.mts`.

The reason for this change is that TypeScript follows Node's behavior when handling module types. By default, Node will look at the nearest `package.json` file to a file that it's importing. If it sees the `type` set to `module`, Node will treat the file as if it has `import` and `export` statements in it. Otherwise, it will default to CommonJS.

Adding `type: module` is a recommended practice for all new projects, and even when migrating old projects to ESM.

## Translating ESM Syntax to CJS Syntax

For this example, assume that we do not have the `type: module` field specified in the `package.json` file. This means that TypeScript will default to treating the file as a CommonJS file.

Here we have `index.ts` that uses the ESM `import` statement to import a module from `other-module.ts` but with the error message from TypeScript:

```tsx
// index.ts
import otherModule from "./other-module.js"; // red squiggly line under otherModule

const main = async () => {
  otherModule();
};

main();

// hovering over otherModule shows:
ESM syntax is not allowed in a CommonJS module when 'verbatimModuleSyntax' is enabled.
```

Here's what `other-module.js` looks like, including an error for using ESM syntax for the export:

```tsx
const hello = () => {
  console.log("Hello!");
};
export default hello; // red squiggly line under export statement

// hovering over export statement shows:
ESM syntax is not allowed in a CommonJS module when 'verbatimModuleSyntax' is enabled.
```

### Using `require` will be Typed as `any`

The traditional fix to this issue would be to use `require` instead of `import` in `index.ts`, and to use `module.exports` instead of `export default` in `other-module.ts`:

```tsx
// index.ts
const otherModule = require("./other-module.js");
const main = async () => {
  otherModule();
};
main();

// other-module.ts
const hello = () => {
  console.log("Hello!");
};

module.exports = hello;
```

However, with these changes when we hover over `otherModule` in `index.ts`, we can see that TypeScript has typed `otherModule` as `any`:

```tsx
// hovering over otherModule shows:
const otherModule: any;
```

This is because TypeScript treats `require` as a function that returns `any`:

```tsx
// hovering over require shows:
var require: NodeRequire (id: string) => any
```

In order to get better typing when importing and exporting CommonJS modules, there's a better syntax to use.

### Importing and Exporting CommonJS Modules

When exporting a CommonJS module, TypeScript prefers that you use the `export =` syntax instead of `module.exports`:

```tsx
// other-module.ts
const hello = () => {
  console.log("Hello!");
};

export = hello;
```

Then when you go to import the CJS module, instead of using `const` to create a variable with `require`, use `import` with the `require` function like this:

```tsx
// index.ts
import otherModule = require("./other-module.js");
const main = async () => {
  otherModule(); // red squiggly line under otherModule
};
main();
```

These syntax changes will allow TypeScript to infer the correct type of the exported module, but it only supports top-level imports.

### Multiple Exports and Imports

In order to export multiple things, an object can be used for the `export =` syntax:

```tsx
// other-module.ts

export = {
  hello: helloFunction,
  goodbye: goodbyeFunction,
};
```

Then the top-level `otherModule` would be imported then destructured from:

```tsx
// index.ts
import otherModule = require("./other-module.js");
const { hello, goodbye } = otherModule;
```

Now when the code is compiled, the import and export statements will be transformed into the familiar CommonJS `require` and `module.exports` syntax.

This syntax might seem odd at first, but it's part of TypeScript's strategy to bridge the gap between CommonJS and ECMAScript modules.

## Configuring Output for Node.js Projects

As we've seen, TypeScript will directly compile a `.cts` file into a `.cjs` file with the correct imports and exports. Similarly, an `.mts` file with ESM imports and exports will be compiled into an `.mjs` file. If your project only has `.ts` files, TypeScript will check `package.json` for the `"type": module` setting. If there isn't one, it will default to treating the file as a CommonJS file, which results in a `.cjs` file.

However, when working on a Node.js project, it's important that your files are all compiled into `.js` files with the correct module syntax.

This is where it's important to use the `NodeNext` option for both the `module` and `moduleResolution` settings in the `tsconfig.json` file:

```tsx
// tsconfig.json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    ...
```

Using `NodeNext` for the `module` and `moduleResolution` options guarantees that TypeScript will generate `.js` files that are compatible with Node.js.

The `module` option tells TypeScript the to emit ESM syntax, and the `moduleResolution` option tells TypeScript to resolve modules using the ESM resolution algorithm.

This resolution algorithm tells TypeScript where to look for modules that are being imported. Inside of the file doing the importing, if the import points to a relative or absolute path, it will be resolved the path directly. Otherwise, the import will be treated as a package name and be looked for in the `node_modules` directory, moving into parent directories as necessary. If the module isn't found at all, the resolution will fail and TypeScript will throw an error.

These `NodeNext` settings also play nice with the `verbatimModuleSyntax` `tsconfig.json` option we enabled in earlier examples. This tells TypeScript to enforce proper import syntax and throws errors if your TypeScript files are not recognized as ESM.

In short, for Node.js applications, set `ModuleNodeNext`, `ModuleResolutionNodeNext`, and `verbatimModuleSyntax: true` in your `tsconfig.json` file.

## Importing Types in ESM

When the `verbatimModuleSyntax` option is enabled, you need to use a specific syntax to import types from a module.

Consider this `module-containing-types.ts` file that exports an `Example` type, along with having a `console.log` side effect:

```tsx
// module-containing-types.ts

console.log("Hello from ESM Module");

export type Example = string;
```

When attempting to import the `Example` type using the `import` syntax, TypeScript will show an error:

```tsx
import { Example } from "./module-containing-types.js"; // red squiggly line under Example

// hovering over Example shows:
'Example' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.ts
```

To fix this error, use the `import type` syntax:

```tsx
import type { Example } from "./module-containing-types.js";
```

This syntax tells TypeScript that you only want the type from the imported file, and not the module itself. When TypeScript compiles the code, it will not include the module in the emitted JavaScript. Since the type gets erased at runtime, all that's left from the `module-containing-types` file is an `export` with an empty object.

### Keeping Side Effects in ESM

When `verbatimModuleSyntax` is enabled, the `console.log` side effect won't make it into the emitted JavaScript because only the type is being exported.

However, if you did want the side effect to be included, you would have to import the module itself in addition to the exported type:

```tsx
import type { Example } from "./module-containing-types.js";
import "./module-containing-types.js";

type OtherExample = Example;

// emitted JavaScript:

import "./module-containing-types.js";
type Example2 = string;
console.log("Hello from ESM Module");
```

To summarize, the `import type` syntax in TypeScript allows you to expressly control what's included in the emitted by only bringing in types that disappear from the transpiled code. . If a line has nothing specific to runtime, you can immediately tell that it will be erased at runtime. On the other hand, a standard import statement will always persist at runtime.

This is an interesting quirk of using the `verbatimModuleSyntax` in TypeScript.

## Choosing Between CJS and ESM

We've talked a lot about using CommonJS and ESM, and how to configure TypeScript so that errors are presented early and the correct code is emitted.

But the question remains: _Which one should you choose?_

Your goal should be to use and emit ESM.

ES Modules are the future direction of how JavaScript code is to be written. The ESM system works seamlessly, whether it's in the browser, Node.js, or in experimental runtimes like Bun and Deno. It's a universally accepted standard.

However, some developers like to stick with CommonJS. Their reasons often revolve around how CommonJS resolves modules.

For example, CommonJS doesn't require you to specify the file extension when importing a file, but ESM does. However, CommonJS is harder to bundle split than ESM, which can result in obstacles when minimizing packages for production.

Given the choice and an understanding of what you're shipping, you should be shipping ESM. Add `"type": "module"` to your `package.json` if your chosen framework permits it.

Embracing ESM now will simplify your life in the future, especially when developing libraries for distribution on NPM.

By now you should feel comfortable with both CommonJS (CJS) and ECMAScript Modules (ESM) enough to debug issues and configure TypeScript for smooth operation from the application development side.

Remember, the JavaScript ecosystem is constantly evolving, and what's considered best practice today might change tomorrow. Stay connected with the community, keep learning, and don't be afraid to experiment.

Should you encounter any stumbling blocks, don't hesitate to connect on the Total TypeScript Discord! The community there is always eager to help and share their experiences with publishing TypeScript applications and libraries.
