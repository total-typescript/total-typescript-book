# Title

Deriving types from values

## Exercises

LEARNING GOAL: Understand the type world and the runtime world.
CONFUSION: Can I create runtime values from types?
LEARNING GOAL: Understand the `typeof` keyword.
CONFUSION: Is this the same as the JavaScript keyword?

LEARNING GOAL: You can only create types from runtime values, not the other way around.

LEARNING GOAL: Use `ReturnType` to get the return type of a function.
NOTEWORTHY: This is really good for extracting the return value of a third-party function.

LEARNING GOAL: Use `Parameters` to get the parameters of a function.

LEARNING GOAL: Understand the `keyof` keyword
CONFUSION: Why do we have to do `keyof typeof` instead of just `keyof`?

LEARNING GOAL: Understand indexed access types
CONFUSION: Why can't I just use `.name` instead of `['name']`?

LEARNING GOAL: Understand that you can pass unions into indexed access types.

LEARNING GOAL: Understand that you can pass `keyof` into an indexed access type.

LEARNING GOAL: Create an enum from an `as const` object.

LEARNING GOAL: Create an enum from an `as const` array.
LEARNING GOAL: Understand the `T[number]` syntax.

CONFUSION: Should I use enums, or 'as const' objects?
