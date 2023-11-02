# Fast Track

## Section 1

### 150 - Empty Object Type

See if you can find a type annotation for `input` that accepts any type except `null` or `undefined`.

https://www.totaltypescript.com/the-empty-object-type-in-typescript

### 151 - Truly Empty Object

See if you can make it so that `acceptOnlyEmptyObject` can only receive an empty object as its input.

Remember the use of `never`.

### 152 - Excess Properties Warnings

Inside our `options` object, we're specifying a `search` property. We then pass it to `myFetch`, which doesn't accept a `search` property (on the `FetchOptions` interface).

Why isn't TypeScript erroring here? How can we get it to error by adding some annotations/changing the code?

### 153 - Excess Property Warnings In Functions

We're mapping over some users in `users.map`. The variable that the mapping gets assigned to, `usersWithIds`, is only expecting `id` and `name` properties on each user.

But inside the map, we're able to pass an extra `age` property without TypeScript erroring. How?

See if you can fix this by adding some annotations/changing the code.

### 154 - Object.keys and Object.entries

Now, we're taking our users from `usersWithIds` and mapping over them again. This time, for each user we're calling `Object.keys` on each user.

We know that the keys are `id` and `name`, but TypeScript thinks that the result of `Object.keys` is `string[]`. Why?

### 156 - Unions of Functions With Object Params

In our `funcs` array, we have two functions. One takes in an object with an `id` property, and the other takes in an object with a `name` property.

Figure out the correct type for the `obj` parameter in `logAll`.

### 157 - Unions of Functions With Primitive Keys

We now have an object of functions - each which handle different primitive types.

In our `format` function, we get the `typeof` `input`, which can either be `string | number | boolean` (we use `as` to narrow it down to those types).

We then grab our `formatter` from the object of functions.

But TypeScript is erroring on the `formatter(input)` line. Why? See if you can add an annotation which fixes this.

### 158.5 - Annotating the Errors a Function Throws

How do we annotate our `getUserFromLocalStorage` function to show what errors it might throw?

Then, how do we make the `e` inside our `catch` block have the correct type?

Spoiler - we can't. But why?
