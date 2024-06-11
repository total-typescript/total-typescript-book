We've explored the relationship between JavaScript and TypeScript, and also how TypeScript improves your life as a developer. But let's go a bit deeper. In this chapter we'll get the TypeScript CLI up and running, and see how it fits into the development pipeline.

As an example, we'll be looking at using TypeScript to build a web application. But TypeScript can also be used anywhere JavaScript can - in a Node, Electron, React Native or any other app.

## The Problem with TypeScript in the Browser

Consider this TypeScript file `example.ts` that contains a `run` function that logs a message to the console:

```ts twoslash
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

```ts twoslash
const run = (message: string) => {
  // `: string` is not valid JavaScript!

  console.log(message);
};
```

Removing `: string` gives us something that looks a bit more like JavaScript, but now TypeScript displays an error underneath `message`:

```ts twoslash
// @errors: 7006
const run = (message) => {};
```

Hovering over the red squiggly line in VS Code, we can see that TypeScript's error message is telling us that `message` implicitly has an `any` type.

We'll get into what that particular error means later, but for now the point is that our `example.ts` file contains syntax that the browser can't understand, but the TypeScript CLI isn't happy when we remove it.

So, in order to get the browser to understand our TypeScript code, we need to turn it into JavaScript.

## Transpiling TypeScript

The process of turning TypeScript into JavaScript (called 'transpilation') can be handled by the TypeScript CLI `tsc`, which is installed when you install TypeScript. But before we can use `tsc`, we need to set up our TypeScript project.

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

```ts twoslash
// @errors: 2345
const run = (message: number) => {
  console.log(message);
};

run("Hello world!");
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

It can be especially useful on large projects because it checks the entire project. This is different to your IDE, which only shows the errors of the file that's currently open.

## TypeScript With Modern Frameworks

The setup we have so far is pretty simple. A TypeScript file, a `tsc –watch` command, and a JavaScript file. But in order to build a frontend app, we're going to need to do a lot more. We'll need to handle CSS, minification, bundling, and a lot more. TypeScript can't help us with all of that.

Fortunately, there are many frontend frameworks that can help.

Vite is one example of a frontend tooling suite that not only transpiles `.ts` files to `.js` files, but also provides a dev server with Hot Module Replacement. Working with an HMR setup allows you to see changes in your code reflected in the browser without having to manually reload the page.

But there's a drawback. While Vite and other tools handle the actual transpilation of TypeScript to JavaScript, they don't provide type checking out of the box. This means that you could introduce errors into your code and Vite would continue running the dev server without telling you. It would even allow you to push errors into production, because it doesn't know any better.

So, we still need the TypeScript CLI in order to catch errors. But if Vite is transpiling our code, we don't need TypeScript to do it too.

### TypeScript as a Linter

Fortunately, we can configure TypeScript's CLI to allow for type checking without interfering with our other tools.

Inside the `tsconfig.json` file, there's an option called `noEmit` that tells `tsc` whether or not to emit JavaScript files.

By setting `noEmit` to `true`, no JavaScript files will be created when you run `tsc`. This makes TypeScript act more like a linter than a transpiler. This makes a `tsc` step a great addition to a CI/CD system, since it can prevent merging a pull request with TypeScript errors.

Later in the book, we'll look closer at more advanced TypeScript configurations for application development.
