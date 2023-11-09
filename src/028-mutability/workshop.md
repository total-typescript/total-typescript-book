# Fast Track

## Section 1

### 097 - Let and Const inference

Investigate why this error is happening. Look at the type of `type`. Try changing `let` to a `const`.

### 098 - Object Property Inference

Investigate why `buttonAttributes.type` is erroring when passed to `modifyButton`. Try to fix it by adding a type annotation.

Investigate why `buttonsToChange` is erroring when passed to `modifyButtons`. Try to fix it by adding a type annotation.

### 099 - Readonly Object Properties

Change the type of `User` so that `id` cannot be assigned to.

https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties

## Section 2

### 101 - Intro to `as const`

Use the `as const` annotation on `buttonAttributes` to make the TypeScript errors go away.

Investigate _why_ this works.

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions

### 102 - `as const` vs `Object.freeze`

Investigate why `buttonAttributes` is not assignable to `modifyButtons`. Try replacing `Object.freeze` with `as const`.

Why does this work?

## Section 3

### 103 - Readonly Arrays

Find a different type annotation for `names` to make the array readonly.

https://www.typescriptlang.org/docs/handbook/2/objects.html#the-readonlyarray-type

### 104 - Readonly Array Assignability

Read through the examples to get a better understanding of how readonly arrays are assignable to mutable arrays.
