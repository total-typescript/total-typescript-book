# Title

Title here!

## Exercises

- Modeling your domain in TypeScript
  - Defining types that represent the concepts and entities of the problem domain
    - Users, Products, Orders, etc.
  - Modeling early helps keep code maintainable
- Helper types
  - Types that are defined using other types that help you manipulate, transform, or constrain existing types
  - Type arguments in types
    - The parameters you pass to a generic type
    - Can be any valid type expression
    - e.g. `Array<string>` is a type that takes a type argument `string` and represents an array of strings
    - Type variables, constraints, defaults, and inference make type arguments more flexible and expressive
  - Composing types into other types
    - Use unions and intersections
      - `User & Admin`
    - Template literals for strings
      - Create string types based on template literals which can contain placeholders, expressions, and modifiers
      - e.g. a string type representing a valid email address with `@` and `.` as placeholders
        - `type Email = `${string}@${string}.${string}`;`
  - Create your own with generics, keyof, typeof, indexed access, conditional types, and mapped types
    - Example of a helper type that makes all properties of a type optional except for a few specified ones
