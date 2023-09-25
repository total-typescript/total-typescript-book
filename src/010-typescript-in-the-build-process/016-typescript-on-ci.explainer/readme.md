# Typescript on CI

## Learning Goals

- Learn how to run TypeScript on CI

## Explainer

You can use TypeScript on CI to check that your code is type-safe. This is a good way to catch bugs before they reach production.

This means that even though you're not using TypeScript to emit JavaScript, you're still getting massive value out of it.

I've written a GitHub action workflow which can run on CI. Take a look at each comment in `.github/workflows/ci.yml` and see what's going on.

This can run on each commit to ensure our code is type-safe.
