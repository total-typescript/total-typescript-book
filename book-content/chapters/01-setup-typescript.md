Before diving into TypeScript, let's take a moment to talk about its foundation — JavaScript.

JavaScript is the language that makes web pages interactive. Any modern website will utilize some amount of it. And the more complex the site, the more complex the JavaScript.

But, unlike other coding languages, JavaScript was not built for building complex systems.

If you were building JavaScript apps in the 2000's, you were often having a bad time. Your IDE (integrated development environment) was lacking basic features. Autocomplete. Inline errors. There was no way to know if you were passing the right arguments to the right function. As users began demanding more complex experiences online, this made working with JavaScript a nightmare.

This was especially true for refactoring code. If you had to change a function signature, you had to manually find and update every place that function was called throughout your entire codebase. This could take hours, and with no guarantee that you'd fixed everything before you pushed to production.

## TypeScript's Beginnings

As limitations like these became more apparent, developers started looking for a better way to write JavaScript.

Around 2010, Microsoft noticed that a lot of their teams were using a community project called Script# (ScriptSharp) to build their JavaScript apps. This library allowed developers to write code in C#, and then turn it to JavaScript. C# had excellent features for building large applications - so it made the experience of building these apps more pleasant. In fact, many teams had found this was the only way they could build complex applications in large teams.

Anders Hejlsberg, the creator of C#, was tasked to investigate this phenomenon. He was astonished. People were so annoyed with JavaScript that they were willing to code in a completely different language in order to get the powerful IDE features they were used to.

So he thought: what if we create a new language that was closer to JavaScript, but that enabled all the IDE features that JavaScript is missing?

Thus, TypeScript was born. (And yes, the inventor of C# was also the inventor of TypeScript. Not bad.)

In the decade or so since its introduction, TypeScript has grown to become a staple of modern development. In many metrics, it is even more popular than JavaScript.

In this book, you'll learn why it has become so popular, and how it can help you develop better applications while making your life as a developer easier.

## How TypeScript Works

With a JavaScript-only project, you would typically write your code in files with a `.js` file extension. These files are then able to be directly executed in the browser or a runtime environment like Node.js (which is used to run JavaScript on servers, or on your laptop). The JavaScript you write is the JavaScript that gets executed.

![](images/image5.png)

If you're testing whether your code works, you need to test it inside the runtime - the browser or Node.js.

For a TypeScript project, your code is primarily inside of `.ts` files.

Inside your IDE, these files are monitored by TypeScript's 'language server'. This server watches you as you type, and powers IDE features like autocompletion and error checking, among others.

Unlike a `.js` file, `.ts` files can't usually be executed directly by the browser or a runtime. Instead, they require an initial build process.

This is where TypeScript's `tsc` CLI comes in, which transforms your `.ts` files into `.js` files. You are able to take advantage of TypeScript's features while writing your code, but the output is still plain JavaScript.

![](images/image4.png)

The great benefit of this system is that you get in a feedback loop with TypeScript. You write code. The in-IDE server gives you feedback. You adjust based on the feedback. And all of this happens before your code goes into the browser. This loop is much faster than JavaScript's, so can help you create higher-quality code faster.

> Automated testing can also provide a high-quality feedback loop. While we won't cover this in this book, automated tests are a great companion to TypeScript for creating extremely high-quality code.

So, while TypeScript's build process is more complex than JavaScript's, the benefits are well worth it.

## What's Different About TypeScript?

The thing that makes TypeScript from JavaScript different can be summed up in a single word: types.

But there's a common misconception here. People think that TypeScript's core mission is to make JavaScript a strongly typed language, like C# or Rust. This is not quite accurate.

TypeScript wasn't invented to make JavaScript strongly typed. It was built to allow amazing tooling for JavaScript.

Imagine you're building an IDE, and you want to give people warnings when they mis-type a function name or an object property. If you don't know the shapes of the variables, parameters and objects in your code, you'd have to resort to guesswork.

But if you do know the types of everything in your app, you can begin implementing powerful IDE features like autocomplete, inline errors and automatic refactors.

So, TypeScript aims to provide just enough strong typing to make working with JavaScript more pleasant and productive.

## Tools for TypeScript Development

Let's break down the tools you need in order to work with TypeScript:

- An IDE: In order to write code, you need an editor or Integrated Development Environment. While you can use any IDE, the assumption in this book is that you are using Microsoft's Visual Studio Code. The TypeScript integration with VS Code is excellent, as you will see shortly. Install it from https://code.visualstudio.com if you haven't already.
- An Execution Environment: You need somewhere to run your emitted JavaScript. This could be Node.js or a web browser like Chrome.
- The TypeScript CLI: Node.js is needed in order to run the TypeScript CLI (command line interface). This tool converts your TypeScript to JavaScript, and warns you of any issues in your project.

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

You can install it globally with either pnpm or npm:

```
pnpm add -g typescript
```

or

```
npm install –-global typescript
```

TypeScript is usually also installed in your `package.json` to make sure that all developers using the project are using the same version. For the purposes of this book, a global installation will do just fine.
