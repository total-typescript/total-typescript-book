# Fast Track

## Section 1

### 139 - Don't Annotate Too Much

In the two sections marked `CODE`, see how many annotations you can remove without causing TypeScript errors.

### 141 - `as` and `as any`

Inside the `handleFormData` function, see if you can fix the type error.

You might need to use `as` or `as any`.

https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions

### 142 - Global Typings use `any`

Change the way `getObj` is typed so that it returns an object with a `a` and `b` property.

Notice how `JSON.parse` returns `any`!

## Section 2

### 143 - Limits of `as`

Notice how `as` has certain limits - it can't convert strings to numbers. But notice how you can also chain `as` together.

### 143.5 - Non-null Assertion Operator

It feels like TypeScript _should_ know that `searchParams.name` is never `undefined`. But it doesn't, because the `.filter` function is in a different scope from the `searchParams.name` check.

See if you can use the non-null assertion operator to tell TypeScript that `searchParams.name` is never `undefined`.

https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-

### 144 - `@ts-ignore`

`@ts-ignore` can be used to ignore errors. But notice how it ignores _all_ errors on the following line.

In the second example, notice how we've positioned `@ts-ignore` inside the parentheses. This means it only ignores the error on the following line.

Consider whether this is better than `as any`, or worse?

### 145 - `@ts-expect-error`

`@ts-expect-error` can be used to _expect_ errors. This means that if an error is _not_ present on the next line, it will error.

Which is better - `@ts-ignore` or `@ts-expect-error`?

## Section 3

### 146 - `satisfies`

The `config` object is being annotated using a variable annotation (`:`).

Investigate why the errors are happening. Then, see if you can fix them by using `satisfies` on the value instead of `:` on the variable.

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator

### 146.5 - `keyof typeof` and the `satisfies` keyword

In `configurations`, we've added a key to `staging` that we don't want to be there - but we're not getting a type error on it.

See if you can find a way to annotate `configurations` so that we get an error on `staging.notAllowed`, but that also doesn't break the `Environment` type.

### 147 - Satisfies vs `as` vs Variable Annotations

There are three annotations in this file. The first is using 'as'. The second uses a variable annotation. The third uses `satisfies`.

But actually, each annotation is incorrect! The `as` is too unsafe, and the other two have type errors.

Refactor them to make the type errors go away. At the end, one of them should use `satisfies`, one should use `as`, and one should use a variable annotation (`:`).

### 148 - `satisfies` and `as const`

We're expecting `routes['/']['component']` to be a literal string of `Home`, and `routes['/about']['component']` to be the literal string of `About`. But they're not working.

We're also expecting an error when we specify an incorrect property on `routes`. In this case, `search`.

Remember what we learned about `as const`, and see if you can combine it with `satisfies`.

Also - consider why this wouldn't work if we used a `:` annotation.
