# Fast Track

## Section 1

### 139 - Don't Annotate Too Much

In the sections marked `CODE`, see how many annotations you can remove without causing TypeScript errors.

### 141 - `as` and `as any`

Inside the `handleFormData` function, see if you can fix the type error.

You might need to use `as` or `as any`.

https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions

### 142 - Global Typings use `any`

Change the way `getObj` is typed so that it returns an object with a `a` and `b` property.

Notice how `JSON.parse` returns `any`!

### 143 - Limits of `as`

Notice how `as` has certain limits - it can't convert strings to numbers. But notice how you can also chain `as` together.

### 144 - `@ts-ignore`

`@ts-ignore` can be used to ignore errors. But notice how it ignores _all_ errors on the following line.

In the second example, notice how we've positioned `@ts-ignore` inside the parentheses. This means it only ignores the error on the following line.

Consider whether this is better than `as any`, or worse?

### 145 - `@ts-expect-error`

`@ts-expect-error` can be used to _expect_ errors. This means that if an error is _not_ present on the next line, it will error.

Which is better - `@ts-ignore` or `@ts-expect-error`?

## Section 2

### 146 - `satisfies`

The `config` object is being annotated using a variable annotation (`:`).

Investigate why the errors are happening. Then,see if you can fix them by using `satisfies` on the value instead of `:` on the variable.

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator
