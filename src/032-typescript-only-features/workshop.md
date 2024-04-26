# Fast Track

## Section 1

### 118 - Enums

We're declaring `LogLevel` as an object containing a bunch of numbers. These show how much logging info we want.

Inside our function, we then compare the level to a globalLogLevel to see if we should log.

Notice the last test - we're allowed to pass _any_ random number into the `level` property.

Replace `LogLevel` with an `enum` to force us to always use the `LogLevel` object when passing a value to our `log` function.

Search terms: enum, numeric enum

### 119 - String Enums

We're declaring a `Method` object containing a set of keys with the same values, which describe a set of REST methods.

In our `request` function, we're declaring `method` as a set of literals which correspond to that.

BUT - we've decided that we only ever want users to use the `Method` object, NOT pass randoms strings around.

So this should be valid:

```ts
// GOOD
request("https://example.com", Method.GET);
```

But this should not:

```ts
// BAD
request("https://example.com", "GET");
```

Make `Method` a string enum and change the definition of `method` in the `request` function to make it work.

Search terms: string enum

### 124 - ES Features vs TS Features

In the `index.ts` file, we have an `enum`, a `namespace` and a `class` with a special `constructor` property (`private`).

Each of these features is not supported in JavaScript natively - it's syntax that only works in TypeScript.

Running the exercise will tell TypeScript to compile this TypeScript into `./dist/index.js`.

Look at the outputted code. Is it what you expected it to be? Or is it more complex?
