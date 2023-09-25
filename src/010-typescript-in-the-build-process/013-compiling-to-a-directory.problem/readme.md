# Compiling your JavaScript files to a directory

## Learning Goals

- Learn how to compile your TypeScript files to a directory

## Problem

Things are looking good. We've got a TypeScript file that emits JavaScript whenever we change it. But the JavaScript file is in the same directory as the TypeScript file. That's not very clean.

See if you can find a way to compile the TypeScript file to a directory called `dist`. You'll need to:

- Change the `tsconfig.json` file
- Add `dist` to `.gitignore`

Remember to check the [TSConfig options](https://www.typescriptlang.org/tsconfig).
