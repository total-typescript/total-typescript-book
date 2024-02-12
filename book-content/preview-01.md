## Passing Types To Functions

Let's take a quick look back at the `Array` type we saw earlier.

```ts
Array<string>;
```

This type describes an array of strings. To make that happen, we're passing a type (`string`) as an argument to another type (`Array`).

There are lots of other types that can receive types, like `Promise<string>`, `Record<string, string>`, and others. In each of them, we use the angle brackets to pass a type to another type.

But we can also use that syntax to pass types to functions.

### Passing Types To `Set`

A `Set` is JavaScript feature that represents a collection of unique values.

To create a `Set`, use the `new` keyword and call `Set`:

```typescript
const formats = new Set();
```

If we hover over the `formats` variable, we can see that it is typed as `Set<unknown>`:

```typescript
// hovering over `formats` shows:

const formats: Set<unknown>;
```

That's because the `Set` doesn't know what type it's supposed to be! We haven't passed it any values, so it defaults to an `unknown` type.

One way to fix this would be to pass some values to `Set` so it understands what type it's supposed to be:

```typescript
const formats = new Set(["CD", "DVD"]);
```

But, we don't _want_ to pass any values to it initially.

We can get around this by passing a _type_ to `Set` when we call it, using the angle brackets syntax:

```typescript
const formats = new Set<string>();
```

Now, `formats` understands that it's a set of strings, and adding anything other than a string will fail:

```typescript
formats.add("Digital"); // this works

formats.add(8); // red squiggly line under `8`

// Error message:

// Argument of type 'number' is not assignable to parameter of type 'string'.ts
```

This is a really important thing to understand in TypeScript. You can pass types, as well as values, to functions.

### Not All Functions Can Receive Types

Most functions in TypeScript _can't_ receive types. A common example where you might want to pass a type is when calling `document.getElementById`.

```typescript
const audioElement = document.getElementById("player");
```

We know that `audioElement` is going to be a `HTMLAudioElement`. This type comes from the DOM typings, which we'll talk about later.

So, it makes sense that we should be able to pass it to `document.getElementById`:

```typescript
// Red line under HTMLAudioElement
// Expected 0 type arguments, but got 1.
const audioElement = document.getElementById<HTMLAudioElement>("player");
```

But unfortunately, we can't. We get an error saying that `.getElementById` expects zero type arguments.

We can see whether a function can receive type arguments by hovering over it. Let's try hovering `.getElementById`:

```
(method) Document.getElementById(elementId: string): HTMLElement | null
```

`.getElementById` contains no angle brackets (`<>`) in its hover. Let's contrasting it with a function that _can_ receive type arguments, like `document.querySelector`:

```
(method) ParentNode.querySelector<Element>(selectors: string): Element | null
```

`.querySelector` has some angle brackets before the parentheses. It shows the default value inside them - in this case, `Element`.

So, to fix our code above we could replace `.getElementById` with `.querySelector`.

```typescript
const audioElement = document.querySelector<HTMLAudioElement>("#player");
```

And everything works.

So, to tell whether a function can receive a type argument, hover it and check whether it has any angle brackets.
