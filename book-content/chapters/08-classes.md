<!-- CONTINUE -->

# 08. Classes

Classes are a like a blueprint for creating special objects. These objects can hold more than just data– they also hold behaviors and methods for interacting with the data they contain.

For every class you declare using the `class` keyword, you can create an instance of that class using the `new` keyword. TypeScript will enforce that the instance you create follows the structure and requirements of the class you've defined.

Let's build a class from scratch and see how it works.

## Creating a Class

To create a class, you use the `class` keyword followed by the name of the class. Similar to types and interfaces, the convention is to have the name in PascalCase, which means the first letter of each word in the name is capitalized.

We'll start creating the `Album` class in a similar way to how a type or interface is created:

```tsx
class Album {
  title: string; // red squiggly line under title
  artist: string; // red squiggly line under artist
  releaseYear: number; // red squiggly line under releaseYear
}
```

At this point, even though it looks like a type or interface, TypeScript gives an error for each property in the class:

```tsx
// hovering over title shows:

Property 'title' has no initializer and is not definitely assigned in the constructor.
```

In order to fix these errors, we need to add a constructor to the class. The constructor is a special method that runs when a new instance of the class is created. It's where you can set up the initial state of the object.

### Adding a Constructor

To start, we'll add a constructor that hardcodes values for the properties of the `Album` class:

```tsx
class Album {
  title: string;
  artist: string;
  releaseYear: number;

  constructor() {
    this.title = "Loop Finding Jazz Records";
    this.artist = "Jan Jelinek";
    this.releaseYear = 2001;
  }
}
```

Now, when we create a new instance of the `Album` class, we can access the properties and values we've set in the constructor:

```tsx
const loopFindingJazzRecords = new Album();

console.log(loopFindingJazzRecords.title); // Output: Loop Finding Jazz Records
```

The `new` keyword creates a new instance of the `Album` class, and the constructor sets the initial state of the object. However, because the properties are hardcoded, every instance of the `Album` class will have the same values.

Note that TypeScript is able to infer the types of the properties from the constructor, so we don't need to specify the types again. However, it's common to see the types specified in the class body as well since they act as a form of documentation for the class that's quick to read.

Let's update the constructor to accept arguments for the properties of the `Album` class.

### Adding Arguments to the Constructor

Update the constructor to accept an optional `opts` argument that includes the properties of the `Album` class:

```tsx
// inside the Album class
constructor(opts?: { title: string; artist: string; releaseYear: number }) {
  ...
```

Then inside of the body of the constructor, we'll use assign `this.title`, `this.artist`, and `this.releaseYear` to the values of the `opts` argument. If the values are not provided, we'll use default values:

```tsx
// inside the Album class
constructor(opts?: { title: string; artist: string; releaseYear: number }) {
  this.title = opts?.title || "Unknown Album";
  this.artist = opts?.artist || "Unknown Artist";
  this.releaseYear = opts?.releaseYear || 0;
}
```

The `this` keyword refers to the instance of the class, and it's used to access the properties and methods of the class.

Now, when we create a new instance of the `Album` class, we can pass an object with the properties we want to set. If we don't provide any values, the default values will be used:

```tsx
const loopFindingJazzRecords = new Album({
  title: "Loop Finding Jazz Records",
  artist: "Jan Jelinek",
  releaseYear: 2001,
});

console.log(loopFindingJazzRecords.title); // Output: Loop Finding Jazz Records

const unknownAlbum = new Album();

console.log(unknownAlbum.title); // Output: Unknown Album
```

Note that it's not required to follow this pattern of using an `opts` object in the constructor parameters. You can still specify the properties or use default values directly:

```tsx
constructor(title: string = "Unknown Album", artist: string = "Unknown Artist", releaseYear: number = 0) {
  ...
```

The style you use is up to you, but the optional `opts` object is nice since it allows an easy way to create a default class instance.

### Creating a Class Without a Constructor

Depending on the needs of your application, it's also possible to create a class without a constructor. In this case, the initial state of the class properties need to be initialized when they're declared:

```tsx
class Album {
  title = "Unknown Album";
  artist = "Unknown Artist";
  releaseYear = 0;
}
```

## Properties in Classes

Now that we've seen how to create a class and create new instances of it, let's look a bit closer at how properties work.

### Immutable `readonly` Properties

As we've seen with types and interfaces, the `readonly` keyword can be used to make a property immutable. This means that once the property is set, it cannot be changed.

In the case of our `Album` example, all of the existing properties could be marked as `readonly` since they're unlikely to change:

```tsx
class Album {
  readonly title: string;
  readonly artist: string;
  readonly releaseYear: number;

  constructor(opts?: { title: string; artist: string; releaseYear: number; }) {
    ...
}
```

In addition to `readonly`, there are some additional modifiers we can add to our class properties.

### `public` and `private` Properties

The `public` and `private` keywords are used to control the visibility and accessibility of class properties.

By default, properties are `public`, which means that they can be accessed from outside the class. We saw this when calling `console.log()` to print the title of an `Album` instance.

If we want to restrict access to certain properties, we can mark them as `private`. This means that they can only be accessed from within the class itself.

For example, say we want to add a `rating` property to the album class that will only be used inside of the class:

```tsx
class Album {
  readonly title: string;
  readonly artist: string;
  readonly releaseYear: number;
  private rating = 0;

  constructor(opts?: { title: string; artist: string; releaseYear: number; }) {
    ...
}
```

Now if we try to access the `rating` property from outside of the class, TypeScript will give us an error:

```tsx
console.log(loopFindingJazzRecords.rating); // red squiggly line under rating

// hovering over rating shows:
Property 'rating' is private and only accessible within class 'Album'.
```

For an alternative syntax, you can also use the `#` symbol to mark a property as private:

```tsx
class Album {
  #rating = 0;
```

The `#` syntax behaves the same as `private`, but it's a newer feature that's part of the ECMAScript standard. This means that it can be used in JavaScript as well as TypeScript, if you ever need to convert your TypeScript code to JavaScript.

Regardless of which syntax you use, the `rating` of an album is a private property that is encapsulated within the class. However, just because the `rating` property is private doesn't mean it can't be accessed or modified.

## Class Methods

Along with properties, classes can also contain methods. These special functions define the behaviors of a class and can be used to interact with both public and private properties.

### Implementing Class Methods

Let's add a `printAlbumInfo` method to the `Album` class that will log the album's title, artist, and release year.

There are a couple of techniques for adding methods to a class.

The first is to follow the same pattern as the constructor and directly add the method to the class body:

```tsx
// inside of the Album class
printAlbumInfo() {
  console.log(`${this.title} by ${this.artist}, released in ${this.releaseYear}.`);
}
```

Another option is to use an arrow function to define the method. This has the benefit of automatically binding `this` to the class instance, which can be useful in certain scenarios:

```tsx
// inside of the Album class
printAlbumInfo = () => {
  console.log(
    `${this.title} by ${this.artist}, released in ${this.releaseYear}.`,
  );
};
```

Once the `printAlbumInfo` method has been added, we can call it to log the album's information:

```tsx
loopFindingJazzRecords.printAlbumInfo();

// Output: Loop Finding Jazz Records by Jan Jelinek, released in 2001.
```

The technique you choose for adding a method to a class essentially boils down to your personal preference. Both are similar to write, and both provide access to `this`. It shouldn't be a concern most of the time, though the arrow function syntax is useful when using legacy React Class Components or passing methods as callbacks.

### Accessing & Modifying Properties

Earlier we added a private `rating` property to the `Album` class. In order to access and modify this property, we can add special methods called getters and setters to the class.

As the names suggest, a getter is used to retrieve the value of a property, and a setter is used to modify the value of a property.

#### Add a Getter

To add a getter for the `rating` property, we use the `get` keyword followed by a method named similarly to property we want to access:

```tsx
// inside the Album class
get currentRating() {
  return this.rating;
}
```

This getter method will allow for the `rating` property to be accessed and modified in the setter method.

#### Add a Setter

Similarly, we'll add a setter for the `rating` property using the `set` keyword. Additional logic can be used to validate the new value before it's assigned:

```tsx
// inside the Album class
set currentRating(newRating: number) {
  if (newRating >= 0 && newRating <= 10) {
    this.rating = newRating;
  } else {
    throw new Error("Invalid rating");
  }
}
```

#### Bringing it All Together

To bring our examples of class methods and getters and setters together, let's add a `printRating` method to the `Album` class that will log the album's rating:

```tsx
// inside the Album class
printRating() {
  console.log(`Rating: ${this.rating}`);
}
```

Now we can use `currentRating` to set a rating, then print it using the `printRating` method:

```tsx
loopFindingJazzRecords.currentRating = 9;
loopFindingJazzRecords.printRating(); // Output: Rating: 9
```

To recap, getters and setters allows us to control how properties are accessed and modified within a class. Without using these methods, we would have to make the `rating` property public. This would allow it to be accessed and modified from outside of the class without any validation:

```tsx
// imagine if the rating property was public
loopFindingJazzRecords.rating = 999; // No error
```

Being smart about using `readonly` and `private` properties along with getters and setters can help you ensure that your class instances are used correctly.

## Class Inheritance

Similar to how we can extend types and interfaces, we can also extend classes in TypeScript. This allows you to create a hierarchy of classes that can inherit properties and methods from one another, making your code more organized and reusable.

For this example, we'll go back to our basic `Album` class that will act as our base class:

```typescript
class Album {
  title: string;
  artist: string;
  releaseYear: number;

  constructor(opts?: { title: string; artist: string; releaseYear: number }) {
    this.title = title;
    this.artist = artist;
    this.releaseYear = releaseYear;
  }

  displayInfo() {
    console.log(
      `${this.title} by ${this.artist}, released in ${this.releaseYear}.`,
    );
  }
}
```

The goal is to create a `SpecialEditionAlbum` class that extends the `Album` class and adds a `bonusTracks` property.

### Extending a Class

The first step is to use the `extends` keyword to create the `SpecialEditionAlbum` class:

```tsx
class SpecialEditionAlbum extends Album {}
```

Once the `extends` keyword is added, any new properties or methods added to the `SpecialEditionAlbum` class will be in addition to what it inherits from the `Album` class. For example, we can add a `bonusTracks` property to the `SpecialEditionAlbum` class:

```tsx
class SpecialEditionAlbum extends Album {
  bonusTracks: string[];
}
```

Next, we need to add a constructor that includes all of the properties from the `Album` class as well as the `bonusTracks` property. There are a couple of important things to note about the constructor when extending a class.

First, the arguments to the constructor should match the shape used in the parent class. In this case, that's an `opts` object with the properties of the `Album` class along with the new `bonusTracks` property.

Second, we need to include a call to `super()`. This is a special method that calls the constructor of the parent class and sets up the properties it defines. This is crucial to ensure that the base properties are initialized properly. We'll pass in the `title`, `artist`, and `releaseYear` properties to the `super()` method and then set the `bonusTracks` property:

```tsx
class SpecialEditionAlbum extends Album {
  bonusTracks: string[];

  constructor(opts?: {
    title: string;
    artist: string;
    releaseYear: number;
    bonusTracks: string[];
  }) {
    super(opts.title, opts.artist, opts.releaseYear);
    this.bonusTracks = opts.bonusTracks;
  }
}
```

Now that we have the `SpecialEditionAlbum` class set up, we can create a new instance similarly to how we would with the `Album` class:

```tsx
const plasticOnoBandSpecialEdition = new SpecialEditionAlbum({
  title: "Plastic Ono Band",
  artist: "John Lennon",
  releaseYear: 2000,
  bonusTracks: ["Power to the People", "Do the Oz"],
});
```

While this example only added a single property, you can imagine how following the pattern of extending a base class can be useful for creating a hierarchy of classes with shared properties and methods.

## Types & Interfaces with Classes

There are several ways that types and interfaces can be used in conjunction with classes to enforce structure and reduce repetition. Classes can even be used as types themselves!

### Types and Interfaces as Class Contracts

For situations where you want to enforce that a class adheres to a specific structure, you can use an interface or a type as a contract. If a class doesn't adhere to the contract, TypeScript will give an error.

The `SpecialEditionAlbum` class we created in the previous example adds a `bonusTracks` property to the `Album` class, but there is no `trackList` property for the regular `Album` class.

Let's create an interface to enforce that any class that implements it must have a `trackList` property.

Following the Hungarian naming convention, the interface will be named `IAlbum` and include properties for the `title`, `artist`, `releaseYear`, and `trackList` properties:

```tsx
interface IAlbum {
  title: string;
  artist: string;
  releaseYear: number;
  trackList: string[];
}
```

Note that the `I` prefix is used to indicate an interface, while a `T` indicates a type. It isn't required to use these prefixes, but it's a common convention and makes it more clear what the interface will be used for when reading the code.

With the interface created, we can associate it with the `Album` class.

#### The `implements` Keyword

The `implements` keyword is used to tell TypeScript which type or interface a class should adhere to. In this case, we'll use it to ensure that the `Album` class follows the structure of the `IAlbum` interface:

```tsx
class Album implements IAlbum {
  // red squiggly line under Album
  title: string;
  artist: string;
  releaseYear: number;

  constructor(opts?: { title: string; artist: string; releaseYear: number }) {
    this.title = opts.title;
    this.artist = opts.artist;
    this.releaseYear = opts.releaseYear;
  }
}
```

Because the `trackList` property is missing from the `Album` class, TypeScript now gives us an error. In order to fix it, the `trackList` property needs to be added to the `Album` class. Once the property is added, we could update the interface or set up getters and setters accordingly:

```tsx
class Album implements IAlbum {
  title: string;
  artist: string;
  releaseYear: number;
  trackList: string[] = [];

  constructor(opts?: { title: string, artist: string, releaseYear: number, trackList: string[] }) {
    this.title = opts.title;
    this.artist = opts.artist;
    this.releaseYear = opts.releaseYear;
    this.trackList = opts.trackList;
  }

  ...
}
```

### Types & Interfaces for Class Types

To save time when working with constructors or other class methods, you can use a type or interface to define the shape of the arguments that will be passed to the class.

For example, we could use the `IAlbum` interface to define the shape of the `opts` argument in the `Album` class:

```tsx
class Album {
  title: string;
  artist: string;
  releaseYear: number;
  trackList: string[] = [];

  constructor(opts: IAlbum) {
    this.title = opts.title;
    this.artist = opts.artist;
    this.releaseYear = opts.releaseYear;
    this.trackList = opts.trackList;
  }
}
```

We could also intersect `IAlbum` with the additional `bonusTracks` property for the extended `SpecialEditionAlbum` class:

```tsx
class SpecialEditionAlbum extends Album {
  bonusTracks: string[];

  constructor(opts: IAlbum & { bonusTracks: string[] }) {
    super(opts);
    this.bonusTracks = opts.bonusTracks;
  }
}
```

### Using a Class as a Type

An interesting property of classes in TypeScript is that they can be used as types for variables and function parameters. The syntax is similar to how you would use any other type or interface.

In this case, we'll use the `SpecialEditionAlbum` class to type the `album` parameter of a `printBonusInfo` function:

```tsx
function printBonusInfo(album: SpecialEditionAlbum) {
  const bonusTrackCount = album.bonusTracks.length;
  console.log(`${album.title} has ${bonusTrackCount} bonus tracks.`);
}
```

We can then call the function and pass in an instance of the `SpecialEditionAlbum` class:

```tsx
printBonusInfo(plasticOnoBandSpecialEdition);

// Output: Plastic Ono Band has 2 bonus tracks.
```

While using a class as a type is possible, it's a much more common pattern to require classes to implement a specific interface.

## Exercises

### Exercise 1: Creating a Class

Here we have a class called `CanvasNode` that currently functions identically to an empty object:

```typescript
class CanvasNode {}
```

Inside of a test case, we instantiate the class by calling `new CanvasNode()`.

However, have some errors since we expect it to house two properties, specifically `x` and `y`, each with a default value of `0`:

```typescript
it("Should store some basic properties", () => {
  const canvasNode = new CanvasNode();

  expect(canvasNode.x).toEqual(0); // red squiggly line under x
  expect(canvasNode.y).toEqual(0); // red squiggly line under y

  // @ts-expect-error Property is readonly
  canvasNode.x = 10;

  // @ts-expect-error Property is readonly
  canvasNode.y = 20;
});
```

As seen from the `@ts-expect-error` directives, we also expect these properties to be readonly.

Your challenge is to implement the `CanvasNode` class to satisfy these requirements. For extra practice, solve the challenge with and without the use of a constructor.

### Exercise 2: Implementing Class Methods

In this exercise, we've simplified our `CanvasNode` class so that it no longer has read-only properties:

```typescript
class CanvasNode {
  x = 0;
  y = 0;
}
```

There is a test case for being able to move the `CanvasNode` object to a new location:

```typescript
it("Should be able to move to a new location", () => {
  const canvasNode = new CanvasNode();

  expect(canvasNode.x).toEqual(0);
  expect(canvasNode.y).toEqual(0);

  canvasNode.move(10, 20); // red squiggly line under move

  expect(canvasNode.x).toEqual(10);
  expect(canvasNode.y).toEqual(20);
});
```

Currently, there is an error under the `move` method call because the `CanvasNode` class does not have a `move` method.

Your task is to add a `move` method to the `CanvasNode` class that will update the `x` and `y` properties to the new location.

### Exercise 3: Implement a Getter

Let's continue working with the `CanvasNode` class, which now has a constructor that accepts an optional argument, renamed to `position`. This `position` is an object that replaces the individual `x` and `y` we had before:

```tsx
class CanvasNode {
  x: number;
  y: number;

  constructor(position?: { x: number; y: number }) {
    this.x = position?.x ?? 0;
    this.y = position?.y ?? 0;
  }

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
```

In these test cases, there are errors accessing the `position` property since it is not currently a property of the `CanvasNode` class:

```typescript
it("Should be able to move", () => {
  const canvasNode = new CanvasNode();

  expect(canvasNode.position).toEqual({ x: 0, y: 0 }); // red squiggly line under position

  canvasNode.move(10, 20);

  expect(canvasNode.position).toEqual({ x: 10, y: 20 }); // red squiggly line under position
});

it("Should be able to receive an initial position", () => {
  const canvasNode = new CanvasNode({
    x: 10,
    y: 20,
  });

  expect(canvasNode.position).toEqual({ x: 10, y: 20 }); // red squiggly line under position
});
```

Your task is to update the `CanvasNode` class to include a `position` getter that will allow for the test cases to pass.

### Exercise 4: Implement a Setter

The `CanvasNode` class has been updated so that `x` and `y` are now private properties:

```tsx
class CanvasNode {
  #x: number;
  #y: number;

  constructor(position?: { x: number; y: number }) {
    this.#x = position?.x ?? 0;
    this.#y = position?.y ?? 0;
  }

  // your `position` getter method here

  // move method as before
}
```

The `#` in front of the `x` and `y` properties means they are `readonly` and can't be modified directly outside of the class. In addition, when a getter is present without a setter, its property will also be treated as `readonly`, as seen in this test case:

```typescript
canvasNode.position = { x: 10, y: 20 }; // red squiggly line under position

// hovering over position shows:
Cannot assign to 'position' because it is a read-only property.
```

Your task is to write a setter for the `position` property that will allow for the test case to pass.

### Exercise 5: Extending a Class

Here we have a more complex version of the `CanvasNode` class.

In addition to the `x` and `y` properties, the class now has a `viewMode` property that is typed as `ViewMode` which can be set to `hidden`, `visible`, or `selected`:

```typescript
type ViewMode = "hidden" | "visible" | "selected";

class CanvasNode {
  x = 0;
  y = 0;
  viewMode: ViewMode = "visible";

  constructor(options?: { x: number; y: number; viewMode?: ViewMode }) {
    this.x = options?.x ?? 0;
    this.y = options?.y ?? 0;
    this.viewMode = options?.viewMode ?? "visible";
  }

  /* getter, setter, and move methods as before */
```

Imagine if our application had a `Shape` class that only needed the `x` and `y` properties and the ability to move around. It wouldn't need the `viewMode` property or the logic related to it.

Your task is to refactor the `CanvasNode` class to split the `x` and `y` properties into a separate class called `Shape`. Then, the `CanvasNode` class should extend the `Shape` class, adding the `viewMode` property and the logic related to it.

### Solution 1: Creating a Class

Here's an example of a `CanvasNode` class with a constructor that meets the requirements:

```typescript
class CanvasNode {
  readonly x: number;
  readonly y: number;

  constructor() {
    this.x = 0;
    this.y = 0;
  }
}
```

Without a constructor, the `CanvasNode` class can be implemented by assigning the properties directly:

```typescript
class CanvasNode {
  readonly x = 0;
  readonly y = 0;
}
```

### Solution 2: Implementing Class Methods

The `move` method can be implemented either as a regular method or as an arrow function:

Here's the regular method:

```typescript
class CanvasNode {
  x = 0;
  y = 0;

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
```

And the arrow function:

```typescript
class CanvasNode {
  x = 0;
  y = 0;

  move = (x: number, y: number) => {
    this.x = x;
    this.y = y;
  };
}
```

Note that these solutions did not use a constructor, but still satisfy the requirements of the test case.

### Solution 3: Implement a Getter

Here's how the `CanvasNode` class can be updated to include a getter for the `position` property:

```typescript
class CanvasNode {
  x: number;
  y: number;

  constructor(position?: { x: number; y: number }) {
    this.x = position?.x ?? 0;
    this.y = position?.y ?? 0;
  }

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get position() {
    return { x: this.x, y: this.y };
  }
}
```

With the getter in place, the test cases will pass.

Remember, when using a getter, you can access the property as if it were a regular property on the class instance:

```typescript
const canvasNode = new CanvasNode();
console.log(canvasNode.position.x); // 0
console.log(canvasNode.position.y); // 0
```

### Solution 4: Implement a Setter

Here's how a `position` setter can be added to the `CanvasNode` class:

```typescript
// inside the CanvasNode class
set position(pos) {
  this.x = pos.x;
  this.y = pos.y;
}
```

Note that we don't have to add a type to the `pos` parameter since TypeScript is smart enough to infer it based on the getter's return type.

### Solution 5: Extending a Class

The new `Shape` class would look very similar to the original `CanvasNode` class:

```tsx
class Shape {
  #x: number;
  #y: number;

  constructor(options?: { x: number; y: number }) {
    this.#x = options?.x ?? 0;
    this.#y = options?.y ?? 0;
  }

  // position getter and setter methods

  move(x: number, y: number) {
    this.#x = x;
    this.#y = y;
  }
}
```

The `CanvasNode` class would then extend the `Shape` class and add the `viewMode` property. The constructor would also be updated to accept the `viewMode` and call `super()` to pass the `x` and `y` properties to the `Shape` class:

```tsx
class CanvasNode extends Shape {
  #viewMode: ViewMode;

  constructor(options?: { x: number; y: number; viewMode?: ViewMode }) {
    super(options);
    this.#viewMode = options?.viewMode ?? "visible";
  }
}
```

## TypeScript-only Features

Beyond adding types, TypeScript has several features that are not found in JavaScript. Some of these are runtime features that were introduced in the earlier years, but for the last several releases the TypeScript team has been focused on introducing features that disappear or are removed by the compiler when it transpiles the TypeScript code to JavaScript.

In this chapter we'll look at several of these TypesScript-only features, including parameter properties, enums, namespaces, and declaration merging. Along the way we'll discuss benefits and trade-offs, as well as when you might want to stick with JavaScript.

### Class Parameter Properties

With classes on the brain from the previous chapter, let's look at one more example that demonstrates a TypeScript-only feature.

Parameter properties allow you to declare and initialize class members directly from the constructor parameters. This feature not only simplifies the code but also enhances readability and maintainability.

Consider this `Rating` class that includes a `rate` method and a `rating` getter:

```tsx
class Rating {
  constructor(public value: number, private max: number) {}

  rate(newValue: number) {
    if (newValue >= 0 && newValue <= this.max) {
      this.value = newValue;
    }
  }

  get rating() {
    return `${this.value}/${this.max}`;
  }
}
```

Note that class constructor includes `public` before `value` and `private` before the `max` parameter.

Without these keywords in place, attempting the access them results in an error:

```tsx
// removing the `private` keywords from the constructor parameters
class Rating {
  constructor(value: number, max: number) {}

  rate(value: number) {
    this.value = value; // red squiggly line under `value`
  }
}

// Hovering over value shows:
Property 'value' does not exist on type 'Rating'.
```

In order for the class to be able to access these values, one of these properties needs to be included for each parameter: `public`, `private`, `readonly`, or `protected`.

The `protected` parameter behaves similarly to `private`, but it is able to be accessed by subclasses (for example, a `protected value` in a base `Rating` class could be accessed by an `AlbumRating` subclass).

Parameter properties will work at runtime, allowing anything passed in to be automatically added to the class with the specified access level.

This feature was an early addition to TypeScript, though it likely wouldn't be added to the language today.

### Enums

Enums, or enumerated types, are another runtime-level feature from the early days of TypeScript. They are used similarly to an object or interface, but with a few key differences. For example, enums can be used on the runtime level, while also being referred to by name on the type level.

A good use case for enums is when there are a limited set of related constants that aren't expected to change.

There are a few different flavors of enums for expressing different types of data.

#### Numeric Enums

Numeric enums group together a set of related members and automatically assigns them numeric values starting from 0. For example, consider this `AlbumStatus` enum:

```tsx
enum AlbumStatus {
  NewRelease,
  OnSale,
  StaffPick,
}
```

In this case, `AlbumStatus.NewRelease` would be 0, `AlbumStatus.OnSale` would be 1, and so on.

To use the `AlbumStatus` as a type, we could use its name:

```tsx
function logStatus(genre: AlbumStatus) {
  console.log(genre); // 0
}

logStatus(AlbumStatus.NewRelease);
```

#### String Enums

String enums allow you to assign string values to each member, which can be more readable than numbers.

Note that this time inside of the of the `AlbumStatus` enum the equals sign is used instead of a colon to assign the string value:

```tsx
enum AlbumStatus {
  NewRelease = "NEW_RELEASE",
  OnSale = "ON_SALE",
  StaffPick = "STAFF_PICK",
}
```

The same `logStatus` function from above would now log the string value instead of the number.

```tsx
function logStatus(genre: AlbumStatus) {
  console.log(genre); // 0
}

logStatus(AlbumStatus.NewRelease);
```

There is a somewhat annoying side effect of string enums to be aware of. When you have two enums with the same values, they can't be used interchangeably. Even thought `BookStatus` has the same members as `AlbumStatus`, they are not compatible when calling teh `logStatus` function:

```tsx
enum BookStatus {
  NewRelease = "NEW_RELEASE",
  OnSale = "ON_SALE",
  StaffPick = "STAFF_PICK"
}

logStatus(BookStatus.NewRelease); // red squiggly line under BookStatus.NewRelease

// hovering over BookStatus.NewRelease shows:
Argument of type 'BookStatus.NewRelease' is not assignable to parameter of type 'AlbumStatus'.
```

Because of this limitation, you might consider using a union of strings instead of multiple string enums. However, if you're dealing with a single enum, it can allow you to constrain values.

Both numeric and string enums are transpiled into JavaScript. A variable with the enum's name is created, then assigned a function with numeric key properties with a reverse mapping to their values.

For example, the enum `AlbumStatus` would be transpiled into the following JavaScript:

```javascript
var AlbumStatus;
(function (AlbumStatus) {
  AlbumStatus["NewRelease"] = "NEW_RELEASE";
  AlbumStatus["OnSale"] = "ON_SALE";
  AlbumStatus["StaffPick"] = "STAFF_PICK";
})(AlbumStatus || (AlbumStatus = {}));
```

The result would then be similar to the following:

```javascript
const AlbumStatus = {
  NewRelease: "NEW_RELEASE",
  NEW_RELEASE: "NewRelease",
  OnSale: "ON_SALE",
  ON_SALE: "OnSale",
  StaffPick: "STAFF_PICK",
  STAFF_PICK: "StaffPick",
};
```

While numeric and string enums are the most common, there is another type to be aware of.

#### `const` Enums

A `const` enum is declared similarly to the other enums, but with the `const` keyword first:

```tsx
const enum AlbumStatus {
  NewRelease = "NEW_RELEASE",
  OnSale = "ON_SALE",
  StaffPick = "STAFF_PICK",
}
```

The major difference is that `const` enums disappear when the TypeScript is transpiled to JavaScript. TypeScript will still perform type checking, but the enum will not be available at runtime.

However, if an array is created that accesses the enum's values, the transpiled JavaScript will end up with those values:

```tsx
let albumStatuses = [
  AlbumStatus.NewRelease,
  AlbumStatus.OnSale,
  AlbumStatus.StaffPick,
];

// the above transpiles to:
("use strict");
let albumStatuses = ["NEW_RELEASE", "ON_SALE", "STAFF_PICK"];
```

#### Trade-offs and Practical Use

Because `const` enums require the TypeScript compiler to understand the value of the constants during transpilation, there can be implications for code that runs under different tools like ESBuild or SWC. These tools do not have a full TypeScript compiler, and instead rely on the JavaScript Abstract Syntax Tree (AST) to understand the code. This can lead to unexpected behavior when using `const` enums.

The TypeScript team suggests avoiding `const` enums in your library code. They might be useful in some application code, but in general their weirdness may not be worth the pain.

If you're going to to use enums, stick with string or numeric enums, but even then they might not be worth it.

### Namespaces

Namespaces were an early feature of TypeScript that let you specify spaces where you could add functions and types. This allows you to use names that wouldn't conflict with other things declared in the global scope. These days namespaces should rarely be used, but it's still important to be aware of them.

Consider a scenario where we are building a TypeScript application to manage a music collection. There could be functions to add an album, calculate sales, and generate reports. Using namespaces, we can group these functions logically:

```typescript
namespace RecordStoreUtils {
  export namespace Album {
    export interface Album {
      title: string;
      artist: string;
      year: number;
    }
  }

  export function addAlbum(title: string, artist: string, year: number) {
    // Implementation to add an album to the collection
  }

  export namespace Sales {
    export function recordSale(
      albumTitle: string,
      quantity: number,
      price: number,
    ) {
      // Implementation to record an album sale
    }

    export function calculateTotalSales(albumTitle: string): number {
      // Implementation to calculate total sales for an album
      return 0; // Placeholder return
    }
  }
}
```

In this example, `AlbumCollection` is the main namespace, with `Sales` as a nested namespace. This structure helps in organizing the code by functionality and makes it clear which part of the application each function pertains to.

The stuff inside of the `AlbumCollection` can be used as values or types:

```tsx
const odelay: AlbumCollection.Album.Album = {
  title: "Odelay!",
  artist: "Beck",
  year: 1996,
};

AlbumCollection.Sales.recordSale("Odelay!", 1, 10.99);
```

The behavior in the example above is very similar to modules, despite pre-dating their introduction to JavaScript.

While modules have now become the standard for organizing your code, you will still encounter namespaces when dealing with global scope types that come from external libraries. We'll revisit this topic later.

When it comes to your own projects, you should stick with using modules.

### Merging Namespaces

Just like interfaces, namespaces can be merged through declaration merging. This allows you to combine two or more separate declarations into a single definition.

Here we have two declarations of `RecordStoreUtils`– one with an `Album` namespace and another with a `Sales` namespace:

```typescript
namespace RecordStoreUtils {
  export namespace Album {
    export interface Album {
      title: string;
      artist: string;
      year: number;
    }
  }
}

namespace RecordStoreUtils {
  export namespace Sales {
    export function recordSale(
      albumTitle: string,
      quantity: number,
      price: number,
    ) {
      // Implementation to record an album sale
    }

    export function calculateTotalSales(albumTitle: string): number {
      // Implementation to calculate total sales for an album
      return 0; // Placeholder return
    }
  }
}
```

Because namespaces support declaration merging, the two declarations are automatically combined into a single `RecordStoreUtils` namespace. Both the `Album` and `Sales` namespaces can be accessed as before:

```tsx
const loaded: RecordStoreUtils.Album.Album = {
  title: "Loaded",
  artist: "The Velvet Underground",
  year: 1970,
};

RecordStoreUtils.Sales.calculateTotalSales("Loaded");
```

There are some constraints to this merging. For example, either all or none of the declarations must be exported. If you try to export only one of them, you'll get an error. Also, if you try to export a function with the same name but different implementations in both namespaces, TypeScript will throw an error due to the conflict.

#### Merging Interfaces within Namespaces

It's also possible for interfaces within namespaces to be merged. If we had two different `RecordStoreUtils` each with their own `Album` interface, TypeScript would automatically merge them into a single `Album` interface that includes all the properties:

```tsx
namespace RecordStoreUtils {
  export interface Album {
    title: string;
    artist: string;
    year: number;
  }
}

namespace RecordStoreUtils {
  export interface Album {
    genre: string[];
    recordLabel: string;
  }
}

const madvillainy: RecordStoreUtils.Album = {
  title: "Madvillainy",
  artist: "Madvillain",
  year: 2004,
  genre: ["Hip Hop", "Experimental"],
  recordLabel: "Stones Throw",
};
```

Understanding how namespaces and their interfaces merge will be useful when we look at global types later on, but again, in most cases you should stick with using modules.

### When to Prefer ES vs. TS

In this chapter we looked at several TypeScript-only features, and how they are compiled into JavaScript.

Parameter properties are compiled to assignments in the constructor. Enums are compiled into an object with properties for each enum value, as well as a reverse mapping of the values to the keys. Namespaces are compiled into a similar shape.

All of these features are useful in various situations, and it's good that they all compile to basic JavaScript.

However, for the most part you should prefer using ES features over any of these TypeScript features.

Part of the reasoning behind this is that there are several efforts happening with the TC39 committee to bring JavaScript closer to TypeScript.

One of the most notable efforts is the "types as comments" proposal, which would allow TypeScript types to be used in JavaScript as comments. This would allow for a smoother transition from JavaScript to TypeScript, and would also allow for TypeScript types to be used in JavaScript documentation.

There's also the idea of enums being brought into JavaScript, but this could potentially conflict with TypeScript's own spec. Perhaps TypeScript would add some sort of "experimental enums" flag if this proposal were to be accepted.

Members of the TypeScript team have shared that their vision is to have type annotations become part of JavaScript, then work with TC39 to determine what other features should be included.

The big takeaway here is that you should avoid using any of the TypeScript-only features discussed in this chapter. If they're already present in your codebase, it's probably fine. But if you're starting a new project, you should stick with using ES features.
