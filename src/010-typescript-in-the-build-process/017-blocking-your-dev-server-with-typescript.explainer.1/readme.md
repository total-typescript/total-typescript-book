# Blocking Your Dev Server with TypeScript

## Learning Goals

- Understand how to see TypeScript errors in your dev server
- Reach a conclusion for whether this is a good idea or not
- Understand how to use `vite-plugin-checker`
- Understand how to use `npm-run-all`

## Problem

You'll notice that if you make a TypeScript error in your code, the dev server will still run.

This is because the dev server _doesn't_ run the TypeScript command line `tsc` on your code. It just runs the dev server.
