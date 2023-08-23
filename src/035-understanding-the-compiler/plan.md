# Title

Getting to know the compiler

## Exercises

**EXERCISE**: Understand `any`
LEARNING GOAL: Understand any
NOTEWORTHY: Use any to shut the compiler up
LEARNING GOAL: Understand the difference between any and unknown

LEARNING GOAL: Understand that `lib.dom.d.ts` uses `any` quite a lot!
LEARNING GOAL: Learn how to use `ts-reset` to turn some `any` types into `unknown` instead.

LEARNING GOAL: Understand the difference between `as` and `as any`
LEARNING GOAL: Understand how to use `as any` to override the TypeScript compiler.

LEARNING GOAL: Understand that `as` has limits.
CONFUSION: Is `as unknown as string` better than `as any`?

LEARNING GOAL: Understand the differences between satisfies and ':'
LEARNING GOAL: Understand how to use `satisfies`
LEARNING GOAL: Learn how `satisfies` can be used to help with situations where `:` overrides the type (config objects).
LEARNING GOAL: Understand the difference between declaration and inference.

CONFUSION: Why isn't `catch` type safe?
LEARNING GOAL: TypeScript can't infer what errors a function throws.
CONFUSION: Can I annotate what errors a function throws?

LEARNING GOAL: Understand that in certain positions, it's possible for TypeScript to ignore excess properties added to an object.
LEARNING GOAL: Understand _exactly_ when TypeScript will give you a warning when you add excess properties to an object.

LEARNING GOAL: Understand why Object.keys/Object.entries returns a string[].

LEARNING GOAL: Understand structural vs nominal typing

LEARNING GOAL: Understand how enums break TypeScript's normal structural typing rules

LEARNING GOAL: Understand why a union of two functions with different arguments needs to be called with `never`.
LEARNING GOAL: Understand `as never` and why you should use it.
