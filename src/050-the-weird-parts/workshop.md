# Fast Track

## Section 1

### 150 - Empty Object Type

See if you can find a type annotation for `input` that accepts any type except `null` or `undefined`.

https://www.totaltypescript.com/the-empty-object-type-in-typescript

### 152 - Excess Properties Warnings

Inside our `options` object, we're specifying a `search` property. We then pass it to `myFetch`, which doesn't accept a `search` property (on the `FetchOptions` interface).

Why isn't TypeScript erroring here? How can we get it to error by adding some annotations/changing the code?

### 153 - Excess Property Warnings In Functions

We're mapping over some users in `users.map`. The variable that the mapping gets assigned to, `usersWithIds`, is only expecting `id` and `name` properties on each user.

But inside the map, we're able to pass an extra `age` property without TypeScript erroring. How?

See if you can fix this by adding some annotations/changing the code.

## Section 2

### 154 - Object.keys and Object.entries

Now, we're taking our users from `usersWithIds` and mapping over them again. This time, for each user we're calling `Object.keys` on each user.

We know that the keys are `id` and `name`, but TypeScript thinks that the result of `Object.keys` is `string[]`. Why not `Array<"id" | "name">`?

### 154.6 - Iterating Over Objects

Inside our `printUser` function, see if you can iterate over all of the keys in the `user` object and log their corresponding values to the console.

Some ground rules - you can't use `Object.values`, or `Object.entries`. Try using a `for` loop, or `Object.keys`.

You might need to change some of the types, or use a type assertion. `keyof` may also come in handy.

## Section 3

### 155 - Comparing Function Parameters

Our `listenToEvent` function takes in a `callback`, which is typed as `CallbackType`.

It seems that the function passed to `listenToEvent` is able to take in no parameters, one parameter (`event`), or up to four parameters (`event`, `x`, `y` and `screenId`).

See if you can figure out the correct way to type `CallbackType` to make the TypeScript errors go away.

### 156 - Unions of Functions With Object Parameters

In our `loggers` array, we have two functions. One takes in an object with an `id` property, and the other takes in an object with a `name` property.

Figure out the correct type for the `obj` parameter in `logAll`.

### 157 - Unions of Functions With Incompatible Parameters

We now have an object of functions - each which handle different primitive types.

In our `format` function, we get the `typeof` `input`, which can either be `string | number | boolean` (we use `as` to narrow it down to those types).

We then grab our `formatter` from the object of functions.

But TypeScript is erroring on the `formatter(input)` line. Why? See if you can add an annotation which fixes this.
