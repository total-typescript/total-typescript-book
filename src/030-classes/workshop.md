# Fast Track

## Section 1

### 108 - Understanding Classes

Give the CanvasNode class two properties, `x` and `y`. Both properties should be readonly.

https://www.typescriptlang.org/docs/handbook/2/classes.html#fields

### 109 - Class Methods

Add a `move` method to the class which moves the node to that location.

https://www.typescriptlang.org/docs/handbook/2/classes.html#methods

### 110 - Receiving Arguments in the constructor

Like functions, classes can receive arguments to tell them what to do.

Add a `constructor` to your class, and add an optional initial argument to let it accept an object of `{ x: number; y: number }`.

https://www.typescriptlang.org/docs/handbook/2/classes.html#constructors

### 111 - Getters

Add a `position` getter to the class which will always be in sync with the `x` and `y` values in the class.

https://www.typescriptlang.org/docs/handbook/2/classes.html#getters--setters

## Section 2

### 112 - Public and Private Properties

Add a modifier to `x` and `y` so that they aren't accessible outside of the class.

There are two possible solutions here - one more TypeScript-focused, one more JavaScript-focused. Which do you prefer?

### 114 - Extending Other Classes

Our class has grown a lot bigger. It's now containing two sets of distinct behaviour - `#viewMode` and `#x`/`#y`.

1. Move the code related to `#x`, `#y`, `position` and `move` into a separate class called `Shape`.

2. Keep `isHidden`, `isSelected`, `isVisible` and `#viewMode` in `CanvasNode`.

3. Make `CanvasNode` inherit from `Shape`, and fix any TypeScript errors that emerge. You'll need to know about `super`!

https://www.typescriptlang.org/docs/handbook/2/classes.html#extends-clauses
