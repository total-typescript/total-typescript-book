<!-- Fragments of text taken from the book that I may add into future sections -->

#### The Assignability of Union Types

Now that we have a basic understanding of union types, let's think about how they work in our apps.

Consider this chart:

![](images/image3.png)

At the top, we have `string | number`. Below are two boxes `string` and `number`, each with their own connecting arrow pointing to `string | number`. This diagram shows that both `string` and `number` are assignable to `string | number`.

However, this doesn't work in reverse. We can't pass `string | number` to a function that only accepts `string`.

For example, if we changed this `logId` function to only accept a `number`, TypeScript would throw an error when we try to pass `string | number` to it:

```tsx
function logId(id: number) {
  console.log(`The id is ${id}`);
}

type User = {
  id: string | number;
};

const user: User = {
  id: 123,
};

logId(user.id); // red squiggly line under user.id
```

Hovering over `user.id` shows:

```
Argument of type 'string | number' is not assignable to parameter of type 'number'.
  Type 'string' is not assignable to type 'number'.
```

This is because `user.id` _could_ be a `string`, and TypeScript is trying to protect us from accidentally passing a `string` to a function that only accepts a `number`.

#### Narrow Objects Can Be Passed to Wider Object Types

You might have a type called `User`:

```typescript
type User = {
  id: string;
  name: string;
  email: string;
};
```

Then, you could have another type called `UserWithoutId`:

```typescript
type UserWithoutId = {
  name: string;
  email: string;
};
```

Which is narrower? `User` or `UserWithoutId`?

The answer is that `User` is the narrower version of `UserWithoutId`. It's more specific. It has more properties than `UserWithoutId`, so it's a narrower type.

This means that anywhere we expect a `UserWithoutId`, we can also pass a `User`:

```typescript
const logUser = (user: UserWithoutId) => {
  console.log(user.name);
};

const user: User = {
  id: "123",
  name: "Waqas",
  email: "waqas@example.com",
};

logUser(user);
```

This is a bit counterintuitive, but it's a fundamental part of TypeScript's type system. We'll examine the implications of this in more detail in a later chapter.

#### Narrow Types Collapsing into Wider Types

<!-- MAYBE MOVE THIS TO THE WEIRD PARTS? -->

Let's look at how narrow types combine with their wider types inside unions.

Imagine we create an `IconSize` type:

```typescript
type IconSize = "small" | "medium" | "large" | string;
```

If we hover over `IconSize`, what will we see?

```ts
type IconSize = string;
```

It seems that our `IconSize` type has been reduced to just `string`. `"small"`, `"medium"`, and `"large"` are nowhere to be seen.

Let's revisit the assignability chart to see what's going on here.

Following the pattern we've seen in previous examples, we might draw the assignability chart like this:

![](images/image1.png)

However, this chart isn't quite accurate.

TypeScript see that `"small"` has all the properties of `string`. In other words, it's a 'subset' of string. So it collapses the union into the wider type, `string`. It does the same with `"medium"` and `"large"`. So, it means that the `IconSize` type is actually just `string`.

Here's what a more accurate assignability chart would look like:

![](images/image6.png)

We can see this behavior happening when trying to pass in a size into an imaginary function, `getResolvedIconSize`. There will not be autocompletion for the individual sizes as we're typing:

```typescript
const getResolvedIconSize = (
  iconSize: "small" | "medium" | "large" | string,
) => {
  // function body
};

getResolvedIconSize("small"); // no autocompletion for "small"
```

This is because TypeScript sees `iconSize` as just `string`, and not as a union of literal types.

This also happens when

#### Autocompletion Trick for Literal Types with Wider Types

There is a workaround that can be added to the function signature that will work when literal types are in a union with a wider type.

By wrapping the wider type in parentheses and including an ampersand with an empty object, we will get the desired behavior:

```typescript
const getResolvedIconSize = (
  iconSize: "small" | "medium" | "large" | (string & {}),
) => {
  // function body
};
```

While this trick is interesting, it's not something to be applied without proper thought and understanding of its implications. We'll look behind the scenes of this syntax later.

For now, the big takeaway here is that you shouldn't think about a union of literals and their wider types together as "this or that". Instead, think of them as just the wider type since that is what TypeScript will resolve to.
