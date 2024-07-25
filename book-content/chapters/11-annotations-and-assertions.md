Throughout this book, we've been using relatively simple type annotations. We've had a look at variable annotations, which help TypeScript know what type a variable should be:

```typescript
let name: string;

name = "Waqas";
```

We've also seen how to type function parameters and return types:

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

These annotations are instructions to TypeScript to tell it what type something should be. If we return a `number` from our `greet` function, TypeScript will show an error. We've told TypeScript that we're returning a `string`, so it expects a `string`.

But there are times when we _don't_ want to follow this pattern. Sometimes, we want to let TypeScript figure it out on its own.

And sometimes, we want to lie to TypeScript.

In this chapter, we'll look at more ways to communicate with TypeScript's compiler via annotations and assertions.

## Annotating Variables vs Values

There's a difference in TypeScript between annotating _variables_ and _values_. The way they conflict can be confusing.

### When You Annotate A Variable, The Variable Wins

Let's look again at the variable annotation we've seen throughout this book.

In this example, we're declaring a variable `config` and annotating it as a `Record` with a string key and a `Color` value:

```typescript
type Color =
  | string
  | {
      r: number;
      g: number;
      b: number;
    };

const config: Record<string, Color> = {
  foreground: { r: 255, g: 255, b: 255 },
  background: { r: 0, g: 0, b: 0 },
  border: "transparent",
};
```

Here, we're annotating a variable. We're saying that `config` is a `Record` with a string key and a `Color` value. This is useful, because if we specify a `Color` that doesn't match the type, TypeScript will show an error:

```ts twoslash
// @errors: 2353
type Color =
  | string
  | {
      r: number;
      g: number;
      b: number;
    };

// ---cut---
const config: Record<string, Color> = {
  border: { incorrect: 0, g: 0, b: 0 },
};
```

But there's a problem with this approach. If we try to access any of the keys, TypeScript gets confused:

```ts twoslash
// @errors: 2339
type Color =
  | string
  | {
      r: number;
      g: number;
      b: number;
    };

const config: Record<string, Color> = {};

// ---cut---
config.foreground.r;
```

Firstly, it doesn't know that foreground is defined on the object. Secondly, it doesn't know whether foreground is the `string` version of the `Color` type or the object version.

This is because we've told TypeScript that `config` is a `Record` with a any number of string keys. We annotated the variable, but the actual _value_ got discarded. This is an important point - when you annotate a variable, TypeScript will:

1. Ensure that the value passed to the variable matches the annotation.
2. Forget about the value's type.

This has some benefits - we can add new keys to `config` and TypeScript won't complain:

```typescript
config.primary = "red";
```

But this isn't really what we want - this is a config object that shouldn't be changed.

### With No Annotation, The Value Wins

One way to get around this would be to drop the variable annotation.

```typescript
const config = {
  foreground: { r: 255, g: 255, b: 255 },
  background: { r: 0, g: 0, b: 0 },
  border: "transparent",
};
```

Because there's no variable annotation, `config` is inferred as the type of the value provided.

But now we've lost the ability to check that the `Color` type is correct. We can add a `number` to the `foreground` key and TypeScript won't complain:

```typescript
const config = {
  foreground: 123,
};
```

So it seems we're at an impasse. We both want to infer the type of the value, but also constrain it to be a certain shape.

### Annotating Values With `satisfies`

The `satisfies` operator is a way to tell TypeScript that a value must satisfy certain criteria, but still allow TypeScript to infer the type.

Let's use it to make sure our `config` object has the right shape:

```typescript
const config = {
  foreground: { r: 255, g: 255, b: 255 },
  background: { r: 0, g: 0, b: 0 },
  border: "transparent",
} satisfies Record<string, Color>;
```

Now, we get the best of both worlds. This means we can access the keys without any issues:

```typescript
config.foreground.r;

config.border.toUpperCase();
```

But we've also told TypeScript that `config` must be a `Record` with a string key and a `Color` value. If we try to add a key that doesn't match this shape, TypeScript will show an error:

```ts twoslash
// @errors: 2322
type Color =
  | string
  | {
      r: number;
      g: number;
      b: number;
    };

// ---cut---
const config = {
  primary: 123,
} satisfies Record<string, Color>;
```

Of course, we have now lost the ability to add new keys to `config` without TypeScript complaining:

```ts twoslash
// @errors: 2339
type Color =
  | string
  | {
      r: number;
      g: number;
      b: number;
    };

const config = {} satisfies Record<string, Color>;
// ---cut---
config.somethingNew = "red";
```

Because TypeScript is now inferring `config` as _just_ an object with a fixed set of keys.

Let's recap:

- When you use a variable annotation, the variable's type wins.
- When you don't use a variable annotation, the value's type wins.
- When you use `satisfies`, you can tell TypeScript that a value must satisfy certain criteria, but still allow TypeScript to infer the type.

#### Narrowing Values With `satisfies`

A common misconception about `satisfies` is that it doesn't affect the type of the value. This is not quite true - in certain situations, `satisfies` does help narrow down a value to a certain type.

Let's take this example:

```tsx
const album = {
  format: "Vinyl",
};
```

Here, we have an `album` object with a `format` key. As we know from our chapter on mutability, TypeScript will infer `album.format` as `string`. We want to make sure that the `format` is one of three values: `CD`, `Vinyl`, or `Digital`.

We could give it a variable annotation:

```tsx
type Album = {
  format: "CD" | "Vinyl" | "Digital";
};

const album: Album = {
  format: "Vinyl",
};
```

But now, `album.format` is `"CD" | "Vinyl" | "Digital"`. This might be a problem if we want to pass it to a function that only accepts `"Vinyl"`.

Instead, we can use `satisfies`:

```typescript
const album = {
  format: "Vinyl",
} satisfies Album;
```

Now, `album.format` is inferred as `"Vinyl"`, because we've told TypeScript that `album` satisfies the `Album` type. So, `satisfies` is narrowing down the value of `album.format` to a specific type.

## Assertions: Forcing The Type Of Values

Sometimes, the way TypeScript infers types isn't quite what we want. We can use assertions in TypeScript to force values to be inferred as a certain type.

### The `as` Assertion

The `as` assertion is a way to tell TypeScript that you know more about a value than it does. It's a way to override TypeScript's type inference and tell it to treat a value as a different type.

Let's look at an example.

Imagine that you're building a web page that has some information in the search query string of the URL.

You happen to know that the user can't navigate to this page without passing `?id=some-id` to the URL.

```ts twoslash
const searchParams = new URLSearchParams(window.location.search);

const id = searchParams.get("id");
//    ^?
```

But TypeScript doesn't know that the `id` will always be a string. It thinks that `id` could be a string or `null`.

So, let's force it. We can use `as` on the result of `searchParams.get("id")` to tell TypeScript that we know it will always be a string:

```ts twoslash
const searchParams = new URLSearchParams(window.location.search);
// ---cut---
const id = searchParams.get("id") as string;
//    ^?
```

Now TypeScript knows that `id` will always be a string, and we can use it as such.

This `as` is a little unsafe! If `id` is somehow not actually passed in the URL, it will be `null` at runtime but `string` at compile time. This means if we called `.toUpperCase()` on `id`, we'd crash our app.

But it's useful in cases where we truly know more than TypeScript can about the behavior of our code.

#### An Alternative Syntax

As an alternative to `as`, you can prefix the value with the type wrapped in angle brackets:

```typescript
const id = <string>searchParams.get("id");
```

This is less common than `as`, but behaves exactly the same way. `as` is more common, so it's better to use that.

#### The Limits of `as`

`as` has some limits on how it can be used. It can't be used to convert between unrelated types.

Consider this example where `as` is used to assert that a string should be treated as a number:

```ts twoslash
// @errors: 2352
const albumSales = "Heroes" as number;
```

TypeScript realizes that even though we're using `as`, we might have made a mistake. The error message is telling us that a string and a number don't share any common properties, but if we really want to go through with it, we could double up on the `as` assertions to first assert the string as `unknown` and then as a `number`:

```tsx
const albumSales = "Heroes" as unknown as number; // no error
```

When using `as` to assert as `unknown as number`, the red squiggly line goes away but that doesn't mean the operation is safe. There's just no way to convert `"Heroes"` into a number that would make sense.

The same behavior applies to other types as well.

In this example, an `Album` interface and a `SalesData` interface don't share any common properties:

```ts twoslash
// @errors: 2352
interface Album {
  title: string;
  artist: string;
  releaseYear: number;
}

interface SalesData {
  sales: number;
  certification: string;
}

const paulsBoutique: Album = {
  title: "Paul's Boutique",
  artist: "Beastie Boys",
  releaseYear: 1989,
};

const paulsBoutiqueSales = paulsBoutique as SalesData;
```

Again, TypeScript shows us the warning about the lack of common properties.

So, `as` does have some built-in safeguards. But by using `as unknown as X`, you can easily bypass them. And because `as` does nothing at runtime, it's a convenient way to lie to TypeScript about the type of a value.

### The Non-null Assertion

Another assertion we can use is the non-null assertion, which is specified by using the `!` operator. This provides a quick way to tell TypeScript that a value is not `null` or `undefined`.

Heading back to our `searchParams` example from earlier, we can use the non-null assertion to tell TypeScript that `id` will never be `null`:

```typescript
const searchParams = new URLSearchParams(window.location.search);

const id = searchParams.get("id")!;
```

This forces TypeScript to treat `id` as a string, even though it could be `null` at runtime. It's the equivalent of using `as string`, but is a little more convenient.

You can also use it when accessing a property which may or may not be defined:

```typescript
type User = {
  name: string;
  profile?: {
    bio: string;
  };
};

const logUserBio = (user: User) => {
  console.log(user.profile!.bio);
};
```

Or, when calling a function that might not be defined:

```typescript
type Logger = {
  log?: (message: string) => void;
};

const main = (logger: Logger) => {
  logger.log!("Hello, world!");
};
```

Each of these fails at runtime if the value is not defined. But it's a convenient lie to TypeScript that we're sure it will be.

The non-null assertion, like other assertions, is a dangerous tool. It's particularly nasty because it's one character long, so easier to miss than `as`.

For fun, I like to use at least three or four in a row to make sure developers know that what they're doing is dangerous:

```typescript
// Yes, this syntax is legal
const id = searchParams.get("id")!!!!;
```

## Error Suppression Directives

Assertions are not the only ways we can lie to TypeScript. There are several comment directives that can be used to suppress errors.

### `@ts-expect-error`

Throughout the book's exercises we've seen several examples of `@ts-expect-error`. This directive gives us a way to tell TypeScript that we expect an error to occur on the next line of code.

In this example, we're creating an error by passing a string into a function that expects a number.

```typescript
function addOne(num: number) {
  return num + 1;
}

// @ts-expect-error
const result = addOne("one");
```

But the error doesn't show up in the editor, because we told TypeScript to expect it.

However, if we pass a number into the function, the error will show up:

```ts twoslash
// @errors: 2578
function addOne(num: number) {
  return num + 1;
}

// ---cut---
// @ts-expect-error
const result = addOne(1);
```

So, TypeScript expects every `@ts-expect-error` directive to be _used_ - to be followed by an error.

Frustratingly, `@ts-expect-error` doesn't let you expect a specific error, but only that an error will occur.

### `@ts-ignore`

The `@ts-ignore` directive behaves a bit differently than `@ts-expect-error`. Instead of _expecting_ an error, it _ignores_ any errors that do occur.

Going back to our `addOne` example, we can use `@ts-ignore` to ignore the error that occurs when passing a string into the function:

```typescript
// @ts-ignore
const result = addOne("one");
```

But if we later fix the error, `@ts-ignore` won't tell us that it's unused:

```typescript
// @ts-ignore
const result = addOne(1); // No errors here!
```

In general, `@ts-expect-error` is more useful than `@ts-ignore`, because it tells you when you've fixed the error. This means you can get a warning to remove the directive.

### `@ts-nocheck`

Finally, The `@ts-nocheck` directive will completely remove type checking for a file.

To use it, add the directive at the top of your file:

```tsx
// @ts-nocheck
```

With all checking disabled, TypeScript won't show you any errors, but it also won't be able to protect you from any runtime issues that might show up when you run your code.

Generally speaking, you shouldn't use `@ts-nocheck`. I've personally lost hours of my life to working in large files where I didn't notice that `@ts-nocheck` was at the top.

### Suppressing Errors Vs `as any`

There's one tool in a TypeScript developers' toolkit that _also_ suppresses errors, but isn't a comment directive - `as any`.

`as any` is an extremely powerful tool because it combines a lie to TypeScript (`as`) with a type that disables all type checking (`any`).

This means that you can use it to suppress nearly any error. Our example above? No problem:

```typescript
const result = addOne({} as any);
```

`as any` turns the empty object into `any`, which disables all type checking. This means that `addOne` will happily accept it.

#### `as any` vs Error Suppression Directives

When there's a choice with how to suppress an error, I prefer using `as any`. Error suppression directives are too broad - they target the entire line of code. This can lead to accidentally suppressing errors that you didn't mean to:

```typescript
// @ts-ignore
const result = addone("one");
```

Here, we're calling `addone` instead of `addOne`. The error suppression directive will suppress the error, but it will also suppress any other errors that might occur on that line.

Using `as any` instead is more precise:

```ts twoslash
// @errors: 2552
const addOne = (num: number) => num + 1;
// ---cut---
const result = addone("one" as any);
```

Now, you'll only suppress the error that you intended to.

## When To Suppress Errors

Each of the error suppression tools we've looked at is a way of basically telling TypeScript to "keep quiet". TypeScript doesn't attempt to limit how often you try to silence it. It's perfectly possible that every time you encounter an error, you could suppress it with `@ts-ignore` or `as any`.

Taking this approach limits how useful TypeScript can be. Your code will compile, but you will likely get many more runtime errors.

But there are times when suppressing errors is a good idea. Let's explore a few different scenarios.

### When You Know More Than TypeScript

The important thing to remember about TypeScript is that really, you're writing JavaScript.

This disconnect between compile time and runtime means that types _can sometimes be wrong_. This can mean you know more about the runtime code than TypeScript does.

This can happen when third-party libraries don't have good type definitions, or when you're working with a complex pattern that TypeScript struggles to understand.

Error suppression directives exist for this reason. They let you patch over the differences that sometimes crop up between TypeScript and the JavaScript it produces.

But this feeling of superiority over TypeScript can be dangerous. So, let's compare it to a very similar feeling:

### When TypeScript Is Being "Dumb"

Some patterns lend themselves better to being typed than others. More dynamic patterns can be harder for TypeScript to understand, and will lead you to suppressing more errors.

A simple example is constructing an object. In JavaScript, there's no real difference between these two patterns:

```ts twoslash
// @errors: 2339
// Static
const obj = {
  a: 1,
  b: 2,
};

// Dynamic
const obj2 = {};

obj2.a = 1;
obj2.b = 2;
```

In the first, we construct an object by passing in the keys and values. In the second, we construct an empty object and add the keys and values later. The first pattern is static, the second is dynamic.

But in TypeScript, the first pattern is much easier to work with. TypeScript can infer the type of `obj` as `{ a: number, b: number }`. But it can't infer the type of `obj2` - it's just an empty object. In fact, you'll get errors when you try to do this.

But if you're used to constructing your objects in a dynamic way, this can be frustrating. You know that `obj2` will have an `a` and a `b` key, but TypeScript doesn't.

In these cases, it's tempting to bend the rules a little by using an `as` to tell TypeScript that you know what you're doing:

```typescript
const obj2 = {} as { a: number; b: number };

obj2.a = 1;
obj2.b = 2;
```

This is subtly different from the first scenario, where you know more than TypeScript does. In this case, there's a simple runtime refactor you can make to make TypeScript happy and avoid suppressing errors.

The more experienced you are with TypeScript, the more often you'll be able to spot these patterns. You'll be able to spot the times when TypeScript lacks crucial information, requiring an `as`, or when the patterns you're using aren't letting TypeScript do its job properly.

So if you're tempted to suppress an error, see if there's a way you can refactor your code to a pattern that TypeScript understands better. After all, it's easier to swim with the current than against it.

### When You Don't Understand The Error

Let's say you've been coding for a few hours. An unread Slack message notification is blinking at you. The feature is all but finished, except for some types you need to add. You've got a call in 20 minutes. And then TypeScript shows an error that you don't understand.

TypeScript errors can be extremely hard to read. They can be long, multi-layered, and filled with references to types you've never heard of.

It's at this moment that TypeScript can feel its most frustrating. It's enough to turn many developers off TypeScript for good.

So, you suppress the error. You add a `@ts-ignore` or an `as any` and move on.

Weeks later, a bug gets reported. You end up back in the same area of the codebase. And you track the error down to the exact line you suppressed.

The time you save by suppressing errors will, eventually, come back to bite you. You're not saving time, but borrowing it.

It's this situation, when you don't understand the error, that I'd recommend sticking it out. TypeScript is attempting to communicate with you. Try refactoring your runtime code. Use all the tools mentioned in the IDE Superpowers chapter to investigate the types the errors mention.

Think of the time you invest in fixing TypeScript errors as an investment in yourself. You're both fixing potential bugs in the future, and levelling up your own understanding.

## Exercises

### Exercise 2: Provide Additional Info to TypeScript

This `handleFormData` function accepts an argument `e` typed as `SubmitEvent`, which is a global type from the DOM typings that is emitted when a form is submitted.

Within the function we use the method `e.preventDefault()`, available on `SubmitEvent`, to stop the form from its default submission action. Then we attempt to create a new `FormData` object, `data`, with `e.target`:

```ts twoslash
// @lib: dom,es2023,dom.iterable
// @errors: 2345
const handleFormData = (e: SubmitEvent) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const value = Object.fromEntries(data.entries());
  return value;
};
```

At runtime, this code works flawlessly. However, at the type level, TypeScript shows an error under `e.target`. Your task is to provide TypeScript with additional information in order to resolve the error.

<Exercise title="Exercise 2: Provide Additional Info to TypeScript" filePath="/src/045-annotations-and-assertions/141-as-and-as-any.problem.ts"></Exercise>

### Exercise 4: Solving Issues with Assertions

Here we'll revisit a previous exercise, but solve it in a different way.

The `findUsersByName` function takes in some `searchParams` as its first argument, where `name` is an optional string property. The second argument is `users`, which is an array of objects with `id` and `name` properties:

```ts twoslash
// @errors: 2345
const findUsersByName = (
  searchParams: { name?: string },
  users: {
    id: string;
    name: string;
  }[],
) => {
  if (searchParams.name) {
    return users.filter((user) => user.name.includes(searchParams.name));
  }

  return users;
};
```

If `searchParams.name` is defined, we want to filter the `users` array using this `name`. Your challenge is to adjust the code so that the error disappears.

Previously we solved this challenge by extracting `searchParams.name` into a const variable and performing the check against that.

However, this time you need to solve it two different ways: Once with `as` and once with non-null assertion.

Note that this is slightly less safe than the previous solution, but it's still a good technique to learn.

<Exercise title="Exercise 4: Solving Issues with Assertions" filePath="/src/045-annotations-and-assertions/143.5-non-null-assertions.problem.ts"></Exercise>

### Exercise 6: Enforcing Valid Configuration

We're back to the `configurations` object that includes `development`, `production`, and `staging`. Each of these members contains specific settings relevant to its environment:

```ts twoslash
// @errors: 2578
const configurations = {
  development: {
    apiBaseUrl: "http://localhost:8080",
    timeout: 5000,
  },
  production: {
    apiBaseUrl: "https://api.example.com",
    timeout: 10000,
  },
  staging: {
    apiBaseUrl: "https://staging.example.com",
    timeout: 8000,
    // @ts-expect-error
    notAllowed: true,
  },
};
```

We also have an `Environment` type along with a passing test case that checks if `Environment` is equal to `"development" | "production" | "staging"`:

```ts
type Environment = keyof typeof configurations;

type test = Expect<
  Equal<Environment, "development" | "production" | "staging">
>;
```

Even though the test case passes, we have an error in the `staging` object inside of `configurations`. We're expecting an error on `notAllowed: true`, but the `@ts-expect-error` directive is not working because TypeScript is not recognizing that `notAllowed` is not allowed.

Your task is to determine an appropriate way to annotate our `configurations` object to retain accurate `Environment` inference from it while simultaneously throwing an error for members that are not allowed. Hint: Consider using a helper type that allows you to specify a data shape.

<Exercise title="Exercise 6: Enforcing Valid Configuration" filePath="/src/045-annotations-and-assertions/146.5-typeof-keyof-and-satisfies-keyword.problem.ts"></Exercise>

### Exercise 7: Variable Annotation vs. `as` vs. `satisfies`

In this exercise, we are going to examine three different types of setups in TypeScript: variable annotations, `as`, and `satisfies`.

The first scenario consists of declaring a `const obj` as an empty object and then applying the keys `a` and `b` to it. Using `as Record<string, number>`, we're expecting the type of `obj` or `a` to be a number:

```typescript
const obj = {} as Record<string, number>;
obj.a = 1;
obj.b = 2;

type test = Expect<Equal<typeof obj.a, number>>;
```

Second, we have a `menuConfig` object that is assigned a Record type with `string` as the keys. The `menuConfig` is expected to have either an object containing `label` and `link` properties or an object with a `label` and `children` properties which include arrays of objects that have `label` and `link`:

```ts twoslash
// @errors: 2339
import { Equal, Expect } from "@total-typescript/helpers";

// ---cut---
const menuConfig: Record<
  string,
  | {
      label: string;
      link: string;
    }
  | {
      label: string;
      children: {
        label: string;
        link: string;
      }[];
    }
> = {
  home: {
    label: "Home",
    link: "/home",
  },
  services: {
    label: "Services",
    children: [
      {
        label: "Consulting",
        link: "/services/consulting",
      },
      {
        label: "Development",
        link: "/services/development",
      },
    ],
  },
};
type tests = [
  Expect<Equal<typeof menuConfig.home.label, string>>,
  Expect<
    Equal<
      typeof menuConfig.services.children,
      {
        label: string;
        link: string;
      }[]
    >
  >,
];
```

In the third scenario, we're trying to use `satisfies` with `document.getElementById('app')` and `HTMLElement`, but it's resulting in errors:

```ts twoslash
// @errors: 1360 2344
import { Equal, Expect } from "@total-typescript/helpers";
// ---cut---
// Third Scenario
const element = document.getElementById("app") satisfies HTMLElement;

type test3 = Expect<Equal<typeof element, HTMLElement>>;
```

Your job is to rearrange the annotations to correct these issues.

At the end of this exercise, you should have used `as`, variable annotations, and `satisfies` once each.

<Exercise title="Exercise 7: Variable Annotation vs. `as` vs. `satisfies`" filePath="/src/045-annotations-and-assertions/147-satisfies-vs-as-vs-variable-annotations.problem.ts"></Exercise>

### Exercise 8: Create a Deeply Read-Only Object

Here we have a `routes` object:

```ts twoslash
// @errors: 2578
const routes = {
  "/": {
    component: "Home",
  },
  "/about": {
    component: "About",
    // @ts-expect-error
    search: "?foo=bar",
  },
};

// @ts-expect-error
routes["/"].component = "About";
```

When adding a `search` field under the `/about` key, it should raise an error, but it currently doesn't. We also expect that once the `routes` object is created, it should not be able to be modified. For example, assigning `About` to the `Home component` should cause an error, but the `@ts-expect-error` directive tells us there is no problem.

Inside of the tests we expect that accessing properties of the `routes` object should return `Home` and `About` instead of interpreting these as literals, but those are both currently failing:

```ts twoslash
// @errors: 2344
import { Equal, Expect } from "@total-typescript/helpers";
const routes = {
  "/": {
    component: "Home",
  },
  "/about": {
    component: "About",
    search: "?foo=bar",
  },
};

// ---cut---
type tests = [
  Expect<Equal<(typeof routes)["/"]["component"], "Home">>,
  Expect<Equal<(typeof routes)["/about"]["component"], "About">>,
];
```

Your task is to update the `routes` object typing so that all errors are resolved. This will require you to use `satisfies` as well as another annotation that ensures the object is deeply read-only.

<Exercise title="Exercise 8: Create a Deeply Read-Only Object" filePath="/src/045-annotations-and-assertions/148-satisfies-with-as-const.problem.ts"></Exercise>

### Solution 2: Provide Additional Info to TypeScript

The error we encountered in this challenge was that the `EventTarget | null` type was incompatible with the required parameter of type `HTMLFormElement`. The problem stems from the fact that these types don't match, and `null` is not permitted:

```ts twoslash
// @lib: dom,es2023,dom.iterable
// @errors: 2345
const handleFormData = (e: SubmitEvent) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const value = Object.fromEntries(data.entries());
  return value;
};
```

First and foremost, it's necessary to ensure `e.target` is not null.

#### Using `as`

We can use the `as` keyword to recast `e.target` to a specific type.

However, if we recast it as `EventTarget`, an error will continue to occur:

```ts twoslash
// @lib: dom,es2023,dom.iterable
// @errors: 2345
const handleFormData = (e: SubmitEvent) => {
  e.preventDefault();
  const data = new FormData(e.target as EventTarget);
  const value = Object.fromEntries(data.entries());
  return value;
};
```

Since we know that the code works at runtime and has tests covering it, we can force `e.target` to be of type `HTMLFormElement`:

```typescript
const data = new FormData(e.target as HTMLFormElement);
```

Optionally, we can create a new variable, `target`, and assign the casted value to it:

```typescript
const target = e.target as HTMLFormElement;
const data = new FormData(target);
```

Either way, this change resolves the error and `target` is now inferred as an `HTMLFormElement` and the code functions as expected.

#### Using `as any`

A quicker solution would be to use `as any` for the `e.target` variable, to tell TypeScript that we don't care about the type of the variable:

```typescript
const data = new FormData(e.target as any);
```

While using `as any` can get us past the error message more quickly, it does have its drawbacks.

For example, we wouldn't be able to leverage autocompletion or have type checking for other `e.target` properties that would come from the `HTMLFormElement` type.

When faced with a situation like this, it's better to use the most specific `as` assertion you can. This communicates that you have a clear understanding of what `e.target` is not only to TypeScript, but to other developers who might read your code.

### Solution 4: Solving Issues with Assertions

Inside the `findUsersByName` function, TypeScript is complaining about `searchParams.name` because of a strange reason.

Imagine if `searchParams.name` was a getter that returned `string` or `undefined` at random:

```typescript
const searchParams = {
  get name() {
    return Math.random() > 0.5 ? "John" : undefined;
  },
};
```

Now, TypeScript can't be sure that `searchParams.name` will always be a `string`. This is why it's complaining inside the `filter` function.

This is why we were previously able to solve this problem by extracting `searchParams.name` into a constant variable and performing the check against that - this guarantees that the name will be a string.

However, this time we will solve it differently.

Currently, `searchParams.name` is typed as `string | undefined`. We want to tell TypeScript that we know more than it does, and that we know that `searchParams.name` will never be `undefined` inside the `filter` callback.

```ts twoslash
// @errors: 2345
const findUsersByName = (
  searchParams: { name?: string },
  users: {
    id: string;
    name: string;
  }[],
) => {
  if (searchParams.name) {
    return users.filter((user) => user.name.includes(searchParams.name));
  }
  return users;
};
```

#### Adding `as string`

One way to solve this is to add `as string` to `searchParams.name`:

```ts twoslash
const findUsersByName = (
  searchParams: { name?: string },
  users: {
    id: string;
    name: string;
  }[],
) => {
  if (searchParams.name) {
    return users.filter((user) =>
      user.name.includes(searchParams.name as string),
    );
  }
  return users;
};
```

This removes `undefined` and it's now just a `string`.

#### Adding a Non-null Assertion

Another way to solve this is to add a non-null assertion to `searchParams.name`. This is done by adding a `!` postfix operator to the property we are trying to access:

```ts twoslash
const findUsersByName = (
  searchParams: { name?: string },
  users: {
    id: string;
    name: string;
  }[],
) => {
  if (searchParams.name) {
    return users.filter((user) => user.name.includes(searchParams.name!));
  }
  return users;
};
```

The `!` operater tells TypeScript to remove any `null` or `undefined` types from the variable. This would leave us with just `string`.

Both of these solutions will remove the error and allow the code to work as expected. But neither protect us against the insidious `get` function that returns `string | undefined` at random.

Since this is a pretty rare case, we might even say TypeScript is being a bit over-protective here. So, an assertion feels like the right choice.

### Solution 6: Enforcing Valid Configuration

The first step is to determine the structure of our `configurations` object.

In this case, it makes sense for it to be a `Record` where the keys will be `string` and the values will be an object with `apiBaseUrl` and `timeout` properties.

```typescript
const configurations: Record<
  string,
  {
    apiBaseUrl: string;
    timeout: number
  }
> = {
  ...
```

This change makes the `@ts-expect-error` directive work as expected, but we now have an error related to the `Environment` type not being inferred correctly:

```ts twoslash
// @errors: 2344
import { Equal, Expect } from "@total-typescript/helpers";

const configurations: Record<
  string,
  {
    apiBaseUrl: string;
    timeout: number;
  }
> = {
  development: {
    apiBaseUrl: "http://localhost:8080",
    timeout: 5000,
  },
  production: {
    apiBaseUrl: "https://api.example.com",
    timeout: 10000,
  },
  staging: {
    apiBaseUrl: "https://staging.example.com",
    timeout: 8000,
    // @ts-expect-error
    notAllowed: true,
  },
};

// ---cut---
type Environment = keyof typeof configurations;
//   ^?

type test = Expect<
  Equal<Environment, "development" | "production" | "staging">
>;
```

We need to make sure that `configurations` is still being inferred as its type, while also type checking the thing being passed to it.

This is the perfect application for the `satisfies` keyword.

Instead of annotating the `configurations` object as a `Record`, we'll instead use the `satisfies` keyword for the type constraint:

```typescript
const configurations = {
  development: {
    apiBaseUrl: "http://localhost:8080",
    timeout: 5000,
  },
  production: {
    apiBaseUrl: "https://api.example.com",
    timeout: 10000,
  },
  staging: {
    apiBaseUrl: "https://staging.example.com",
    timeout: 8000,
    // @ts-expect-error
    notAllowed: true,
  },
} satisfies Record<
  string,
  {
    apiBaseUrl: string;
    timeout: number;
  }
>;
```

This allows us to specify that the values we pass to our configuration object must adhere to the criteria defined in the type, while still allowing the type system to infer the correct types for our development, production, and staging environments.

### Solution 7: Variable Annotation vs. `as` vs. `satisfies`

Let's work through the solutions for `satisfies`, `as`, and variable annotations.

#### When to Use `satisfies`

For the first scenario that uses a `Record`, the `satisfies` keyword won't work because we can't add dynamic members to an empty object.

```ts twoslash
// @errors: 2339
const obj = {} satisfies Record<string, number>;

obj.a = 1;
```

In the second scenario with the `menuConfig` object, we started with errors about `menuConfig.home` and `menuConfig.services` not existing on both members.

This is a clue that we need to use `satisfies` to make sure a value is checked without changing the inference:

```typescript
const menuConfig = {
  home: {
    label: "Home",
    link: "/home",
  },
  services: {
    label: "Services",
    children: [
      {
        label: "Consulting",
        link: "/services/consulting",
      },
      {
        label: "Development",
        link: "/services/development",
      },
    ],
  },
} satisfies Record<
  string,
  | {
      label: string;
      link: string;
    }
  | {
      label: string;
      children: {
        label: string;
        link: string;
      }[];
    }
>;
```

With this use of `satisfies`, the tests pass as expected.

Just to check the third scenario, `satisfies` doesn't work with `document.getElementById("app")` because it's inferred as `HTMLElement | null`:

```ts twoslash
// @errors: 1360
const element = document.getElementById("app") satisfies HTMLElement;
```

#### When to Use `as`

If we try to use variable annotation in the third example, we get the same error as with `satisfies`:

```ts twoslash
// @errors: 2322
const element: HTMLElement = document.getElementById("app");
```

By process of elimination, `as` is the correct choice for this scenario:

```typescript
const element = document.getElementById("app") as HTMLElement;
```

With this change, `element` is inferred as `HTMLElement`.

#### Using Variable Annotations

This takes us to the first scenario, where using variable annotations is the correct choice:

```typescript
const obj: Record<string, number> = {};
```

Note that we could use `as` here, but it's less safe and may lead to complications as we're forcing a value to be of a certain type. A variable annotation simply denotes a variable as that certain type and checks anything that's passed to it, which is the more correct, safer approach.

Generally when you do have a choice between `as` or a variable annotation, opt for the variable annotation.

#### The Big Takeaway

The key takeaway in this exercise is to grasp the mental model for when to use `as`, `satisfies`, and variable annotations:

Use `as` when you want to tell TypeScript that you know more than it does.

Use `satisfies` when you want to make sure a value is checked without changing the inference on that value.

The rest of the time, use variable annotations.

### Solution 8: Create a Deeply Read-Only Object

We started with an `@ts-expect-error` directive inside of `routes` that was not working as expected.

Because we wanted a configuration object to be in a certain shape while still being able to access certain pieces of it, this was a perfect use case for `satisfies`.

At the end of the `routes` object, add a `satisfies` that will be a `Record` of `string` and an object with a `component` property that is a `string`:

```tsx
const routes = {
  "/": {
    component: "Home",
  },
  "/about": {
    component: "About",
    // @ts-expect-error
    search: "?foo=bar",
  },
} satisfies Record<
  string,
  {
    component: string;
  }
>;
```

This change solves the issue of the `@ts-expect-error` directive inside of the `routes` object, but we still have an error related to the `routes` object not being read-only.

To address this, we need to apply `as const` to the `routes` object. This will make `routes` read-only and add the necessary immutability.

If we try adding `as const` after the `satisfies`, we'll get the following error:

```ts twoslash
// @errors: 1355
const routes = {
  // ...contents
} satisfies Record<
  string,
  {
    component: string;
  }
> as const;
```

In other words, `as const` can only be applied to a value and not a type.

The correct way to use `as const` is to put it before the `satisfies`:

```tsx
const routes = {
  // routes as before
} as const satisfies Record<
  string,
  {
    component: string;
  }
>;
```

Now our tests pass expected.

This setup of combining `as const` and `satisfies` is ideal when you need a particular shape for a configuration object while enforcing immutability.
