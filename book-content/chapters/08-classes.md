Classes are a JavaScript feature that help you encapsulate data and behavior into a single unit. They are a fundamental part of object-oriented programming and are used to create objects that have properties and methods.

You can use the `class` keyword to define a class, and then create instances of that class using the `new` keyword. TypeScript adds a layer of static type checking to classes, which can help you catch errors and enforce structure in your code.

Let's build a class from scratch and see how it works.

## Creating a Class

To create a class, you use the `class` keyword followed by the name of the class. Similar to types and interfaces, the convention is to have the name in PascalCase, which means the first letter of each word in the name is capitalized.

We'll start creating the `Album` class in a similar way to how a type or interface is created:

```ts twoslash
// @errors: 2564
class Album {
  title: string;
  artist: string;
  releaseYear: number;
}
```

At this point, even though it looks like a type or interface, TypeScript gives an error for each property in the class.
How do we fix this?

### Adding a Constructor

In order to fix these errors, we need to add a `constructor` to the class. The `constructor` is a special method that runs when a new instance of the class is created. It's where you can set up the initial state of the object.

To start, we'll add a constructor that assigns values for the properties of the `Album` class:

```typescript
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

```typescript
const loopFindingJazzRecords = new Album();

console.log(loopFindingJazzRecords.title); // Output: Loop Finding Jazz Records
```

The `new` keyword creates a new instance of the `Album` class, and the constructor sets the initial values of our class's properties. In this case, because the properties are hardcoded, every instance of the `Album` class will have the same values.

#### You Don't Always Need To Type Class Properties

As we'll see, TypeScript can do some really smart inference with classes. It's able to infer the types of the properties from where we assign them in the constructor, so we can actually drop some of the type annotations:

```typescript
class Album {
  title;
  artist;
  releaseYear;

  constructor() {
    this.title = "Loop Finding Jazz Records";
    this.artist = "Jan Jelinek";
    this.releaseYear = 2001;
  }
}
```

However, it's common to see the types specified in the class body as well since they act as a form of documentation for the class that's quick to read.

### Adding Arguments to the Constructor

We can use the constructor to declare arguments for the class. This allows us to pass in values when creating a new instance of the class.

Update the constructor to accept an `opts` argument that includes the properties of the `Album` class:

```typescript
// inside the Album class
constructor(opts: { title: string; artist: string; releaseYear: number }) {
 // ...
}
```

Then inside of the body of the constructor, we'll use assign `this.title`, `this.artist`, and `this.releaseYear` to the values of the `opts` argument.

```typescript
// inside the Album class
constructor(opts: { title: string; artist: string; releaseYear: number }) {
  this.title = opts.title;
  this.artist = opts.artist;
  this.releaseYear = opts.releaseYear;
}
```

The `this` keyword refers to the instance of the class, and it's used to access the properties and methods of the class.

Now, when we create a new instance of the `Album` class, we can pass an object with the properties we want to set.

```typescript
const loopFindingJazzRecords = new Album({
  title: "Loop Finding Jazz Records",
  artist: "Jan Jelinek",
  releaseYear: 2001,
});

console.log(loopFindingJazzRecords.title); // Output: Loop Finding Jazz Records
```

### Using a Class as a Type

An interesting property of classes in TypeScript is that they can be used as types for variables and function parameters. The syntax is similar to how you would use any other type or interface.

In this case, we'll use the `Album` class to type the `album` parameter of a `printAlbumInfo` function:

```typescript
function printAlbumInfo(album: Album) {
  console.log(
    `${album.title} by ${album.artist}, released in ${album.releaseYear}.`,
  );
}
```

We can then call the function and pass in an instance of the `Album` class:

```typescript
printAlbumInfo(sixtyNineLoveSongsAlbum);

// Output: 69 Love Songs by The Magnetic Fields, released in 1999.
```

While using a class as a type is possible, it's a much more common pattern to require classes to implement a specific interface.

## Properties in Classes

Now that we've seen how to create a class and create new instances of it, let's look a bit closer at how properties work.

### Class Property Initializers

You can set default values for properties directly in the class body. These are called class property initializers.

```typescript
class Album {
  title = "Unknown Album";
  artist = "Unknown Artist";
  releaseYear = 0;
}
```

You can combine them with type annotations:

```typescript
class Album {
  title: string = "Unknown Album";
  artist: string = "Unknown Artist";
  releaseYear: number = 0;
}
```

Importantly, class property initializers are resolved _before_ the constructor is called. This means you can override the default values by assigning a different value in the constructor:

```typescript
class User {
  name = "Unknown User";

  constructor() {
    this.name = "Matt Pocock";
  }
}

const user = new User();

console.log(user.name); // Output: Matt Pocock
```

### `readonly` Class Properties

As we've seen with types and interfaces, the `readonly` keyword can be used to make a property immutable. This means that once the property is set, it cannot be changed:

```typescript
class Album {
  readonly title: string;
  readonly artist: string;
  readonly releaseYear: number;
}
```

### Optional Class Properties

We can also mark properties as optional in the same way as objects, using the `?:` annotation:

```typescript
class Album {
  title?: string;
  artist?: string;
  releaseYear?: number;
}
```

As we can see from the lack of errors above, this also means they don't need to be set in the constructor.

### `public` and `private` properties

The `public` and `private` keywords are used to control the visibility and accessibility of class properties.

By default, properties are `public`, which means that they can be accessed from outside the class.

If we want to restrict access to certain properties, we can mark them as `private`. This means that they can only be accessed from within the class itself.

For example, say we want to add a `rating` property to the album class that will only be used inside of the class:

```typescript
class Album {
  private rating = 0;
}
```

Now if we try to access the `rating` property from outside of the class, TypeScript will give us an error:

```ts twoslash
// @errors: 2341
class Album {
  private rating = 0;
}

const loopFindingJazzRecords = new Album();
// ---cut---
console.log(loopFindingJazzRecords.rating);
```

However, this doesn't actually prevent it from being accessed at runtime - `private` is just a compile-time annotation. You could suppress the error using a `@ts-ignore` (which we'll look at later) and still access the property:

```typescript
// @ts-ignore
console.log(loopFindingJazzRecords.rating); // Output: 0
```

#### Runtime Private Properties

To get the same behavior at runtime, you can also use the `#` prefix to mark a property as private:

```typescript
class Album {
  #rating = 0;
}
```

The `#` syntax behaves the same as `private`, but it's a newer feature that's part of the ECMAScript standard. This means that it can be used in JavaScript as well as TypeScript.

Attempting to access a `#`-prefixed property from outside of the class will result in a syntax error:

```ts twoslash
// @errors: 18013
class Album {
  #rating = 0;
}

const loopFindingJazzRecords = new Album();
// ---cut---
console.log(loopFindingJazzRecords.#rating); // SyntaxError
```

Attempting to cheat by accessing it with a dynamic string will return `undefined` - and still give a TypeScript error.

```ts twoslash
// @errors: 7053
class Album {
  #rating = 0;
}

const loopFindingJazzRecords = new Album();

// ---cut---
console.log(loopFindingJazzRecords["#rating"]); // Output: undefined
```

So, if you want to ensure that a property is truly private, you should use the `#` syntax.

## Class Methods

Along with properties, classes can also contain methods. These functions help express the behaviors of a class and can be used to interact with both public and private properties.

### Implementing Class Methods

Let's add a `printAlbumInfo` method to the `Album` class that will log the album's title, artist, and release year.

There are a couple of techniques for adding methods to a class.

The first is to follow the same pattern as the constructor and directly add the method to the class body:

```typescript
// inside of the Album class
printAlbumInfo() {
  console.log(`${this.title} by ${this.artist}, released in ${this.releaseYear}.`);
}
```

Another option is to use an arrow function to define the method:

```typescript
// inside of the Album class
printAlbumInfo = () => {
  console.log(
    `${this.title} by ${this.artist}, released in ${this.releaseYear}.`,
  );
};
```

Once the `printAlbumInfo` method has been added, we can call it to log the album's information:

```typescript
loopFindingJazzRecords.printAlbumInfo();

// Output: Loop Finding Jazz Records by Jan Jelinek, released in 2001.
```

#### Arrow Functions or Class Methods?

Arrow functions and class methods do differ in their behavior. The difference is the way that `this` is handled.

This is runtime JavaScript behavior, so slightly outside the scope of this book. But in the interest of helpfulness, here's an example:

```typescript
class MyClass {
  location = "Class";

  arrow = () => {
    console.log("arrow", this);
  };

  method() {
    console.log("method", this);
  }
}

const myObj = {
  location: "Object",
  arrow: new MyClass().arrow,
  method: new MyClass().method,
};

myObj.arrow(); // { location: 'Class' }
myObj.method(); // { location: 'Object' }
```

In the `arrow` method, `this` is bound to the instance of the class where it was defined. In the `method` method, `this` is bound to the object where it was called.

This can be a bit of a gotcha when working with classes, whether in JavaScript or TypeScript.

## Class Inheritance

Similar to how we can extend types and interfaces, we can also extend classes in TypeScript. This allows you to create a hierarchy of classes that can inherit properties and methods from one another, making your code more organized and reusable.

For this example, we'll go back to our basic `Album` class that will act as our base class:

```typescript
class Album {
  title: string;
  artist: string;
  releaseYear: number;

  constructor(opts: { title: string; artist: string; releaseYear: number }) {
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

```typescript
class SpecialEditionAlbum extends Album {}
```

Once the `extends` keyword is added, any new properties or methods added to the `SpecialEditionAlbum` class will be in addition to what it inherits from the `Album` class. For example, we can add a `bonusTracks` property to the `SpecialEditionAlbum` class:

```typescript
class SpecialEditionAlbum extends Album {
  bonusTracks: string[];
}
```

Next, we need to add a constructor that includes all of the properties from the `Album` class as well as the `bonusTracks` property. There are a couple of important things to note about the constructor when extending a class.

First, the arguments to the constructor should match the shape used in the parent class. In this case, that's an `opts` object with the properties of the `Album` class along with the new `bonusTracks` property.

Second, we need to include a call to `super()`. This is a special method that calls the constructor of the parent class and sets up the properties it defines. This is crucial to ensure that the base properties are initialized properly. We'll pass in `opts` to the `super()` method and then set the `bonusTracks` property:

```typescript
class SpecialEditionAlbum extends Album {
  bonusTracks: string[];

  constructor(opts: {
    title: string;
    artist: string;
    releaseYear: number;
    bonusTracks: string[];
  }) {
    super(opts);
    this.bonusTracks = opts.bonusTracks;
  }
}
```

Now that we have the `SpecialEditionAlbum` class set up, we can create a new instance similarly to how we would with the `Album` class:

```typescript
const plasticOnoBandSpecialEdition = new SpecialEditionAlbum({
  title: "Plastic Ono Band",
  artist: "John Lennon",
  releaseYear: 2000,
  bonusTracks: ["Power to the People", "Do the Oz"],
});
```

This pattern can be used to add more methods, properties, and behavior to the `SpecialEditionAlbum` class, while still maintaining the properties and methods of the `Album` class.

### `protected` Properties

In addition to `public` and `private`, there's a third visibility modifier called `protected`. This is similar to `private`, but it allows the property to be accessed from within classes that extend the class.

For example, if we wanted to make the `title` property of the `Album` class `protected`, we could do so like this:

```typescript
class Album {
  protected title: string;
  // ...
}
```

Now, the `title` property can be accessed from within the `SpecialEditionAlbum` class, and not from outside the class.

### Safe Overrides With `override`

You can run into trouble when extending classes if you try to override a method in a subclass. Let's say our `Album` class implements a `displayInfo` method:

```typescript
class Album {
  // ...
  displayInfo() {
    console.log(
      `${this.title} by ${this.artist}, released in ${this.releaseYear}.`,
    );
  }
}
```

And our `SpecialEditionAlbum` class also implements a `displayInfo` method:

```typescript
class SpecialEditionAlbum extends Album {
  // ...
  displayInfo() {
    console.log(
      `${this.title} by ${this.artist}, released in ${this.releaseYear}.`,
    );
    console.log(`Bonus tracks: ${this.bonusTracks.join(", ")}`);
  }
}
```

This overrides the `displayInfo` method from the `Album` class, adding an extra log for the bonus tracks.

But what happens if we change the `displayInfo` method in `Album` to `displayAlbumInfo`? `SpecialEditionAlbum` won't automatically get updated, and its override will no longer work.

To prevent this, you can use the `override` keyword in the subclass to indicate that you're intentionally overriding a method from the parent class:

```typescript
class SpecialEditionAlbum extends Album {
  // ...
  override displayInfo() {
    console.log(
      `${this.title} by ${this.artist}, released in ${this.releaseYear}.`,
    );
    console.log(`Bonus tracks: ${this.bonusTracks.join(", ")}`);
  }
}
```

Now, if the `displayInfo` method in the `Album` class is changed, TypeScript will give an error in the `SpecialEditionAlbum` class, letting you know that the method is no longer being overridden.

You can also enforce this by setting `noImplicitOverride` to `true` in your `tsconfig.json` file. This will force you to always specify `override` when you're overriding a method:

```json
{
  "compilerOptions": {
    "noImplicitOverride": true
  }
}
```

### The `implements` Keyword

There are some situations where you want to enforce that a class adheres to a specific structure. To do that, you can use the `implements` keyword.

The `SpecialEditionAlbum` class we created in the previous example adds a `bonusTracks` property to the `Album` class, but there is no `trackList` property for the regular `Album` class.

Let's create an interface to enforce that any class that implements it must have a `trackList` property.

We'll call the interface `IAlbum`, and include properties for the `title`, `artist`, `releaseYear`, and `trackList` properties:

```typescript
interface IAlbum {
  title: string;
  artist: string;
  releaseYear: number;
  trackList: string[];
}
```

Note that the `I` prefix is used to indicate an interface, while a `T` indicates a type. It isn't required to use these prefixes, but it's a common convention called Hungarian Notation and makes it more clear what the interface will be used for when reading the code. I don't recommend doing this for all your interfaces and types - only when they conflict with a class of the same name.

With the interface created, we can use the `implements` keyword to associate it with the `Album` class.

```ts twoslash
// @errors: 2420
interface IAlbum {
  title: string;
  artist: string;
  releaseYear: number;
  trackList: string[];
}

// ---cut---
class Album implements IAlbum {
  title: string;
  artist: string;
  releaseYear: number;

  constructor(opts: { title: string; artist: string; releaseYear: number }) {
    this.title = opts.title;
    this.artist = opts.artist;
    this.releaseYear = opts.releaseYear;
  }
}
```

Because the `trackList` property is missing from the `Album` class, TypeScript now gives us an error. In order to fix it, the `trackList` property needs to be added to the `Album` class. Once the property is added, we could update the interface or set up getters and setters accordingly:

```typescript
class Album implements IAlbum {
  title: string;
  artist: string;
  releaseYear: number;
  trackList: string[];

  constructor(opts: {
    title: string;
    artist: string;
    releaseYear: number;
    trackList: string[];
  }) {
    this.title = opts.title;
    this.artist = opts.artist;
    this.releaseYear = opts.releaseYear;
    this.trackList = opts.trackList;
  }

  // ...
}
```

This lets us define a contract for the `Album` class that enforces the structure of the class and helps catch errors early.

### Abstract Classes

Another pattern you can use for defining base classes is the `abstract` keyword. Abstract classes blur the line between types and runtime. You can declare an abstract class like this:

```typescript
abstract class AlbumBase {}
```

You can then define methods and behavior on it, like a regular class:

```typescript
abstract class AlbumBase {
  title: string;
  artist: string;
  releaseYear: number;
  trackList: string[] = [];

  constructor(opts: { title: string; artist: string; releaseYear: number }) {
    this.title = opts.title;
    this.artist = opts.artist;
    this.releaseYear = opts.releaseYear;
  }

  addTrack(track: string) {
    this.trackList.push(track);
  }
}
```

But if you try to create an instance of the `AlbumBase` class, TypeScript will give you an error:

```ts twoslash
// @errors: 2511
abstract class AlbumBase {
  title: string;
  artist: string;
  releaseYear: number;
  trackList: string[] = [];

  constructor(opts: { title: string; artist: string; releaseYear: number }) {
    this.title = opts.title;
    this.artist = opts.artist;
    this.releaseYear = opts.releaseYear;
  }

  addTrack(track: string) {
    this.trackList.push(track);
  }
}

// ---cut---
const albumBase = new AlbumBase({
  title: "Unknown Album",
  artist: "Unknown Artist",
  releaseYear: 0,
});
```

Instead, you'd need to create a class that extends the `AlbumBase` class:

```typescript
class Album extends AlbumBase {
  // any extra functionality you want
}

const album = new Album({
  title: "Unknown Album",
  artist: "Unknown Artist",
  releaseYear: 0,
});
```

You'll notice that this idea is similar to implementing inferfaces - except that abstract classes can also include implementation details.

This means you can blur the line a little between types and runtime. You can define a type contract for a class, but make it more reusable.

#### Abstract Methods

On our abstract class, we can use the `abstract` keyword before a method to indicate that it must be implemented by any class that extends the abstract class:

```typescript
abstract class AlbumBase {
  // ...other properties and methods

  abstract addReview(author: string, review: string): void;
}
```

Now, any class that extends `AlbumBase` must implement the `addReview` method:

```typescript
class Album extends AlbumBase {
  // ...other properties and methods

  addReview(author: string, review: string) {
    // ...implementation
  }
}
```

This gives us another tool for expressing the structure of our classes and ensuring that they adhere to a specific contract.

## Exercises

### Exercise 1: Creating a Class

Here we have a class called `CanvasNode` that currently functions identically to an empty object:

```typescript
class CanvasNode {}
```

Inside of a test case, we instantiate the class by calling `new CanvasNode()`.

However, have some errors since we expect it to house two properties, specifically `x` and `y`, each with a default value of `0`:

```ts twoslash
// @errors: 2339
import { it, expect } from "vitest";

class CanvasNode {}

// ---cut---
it("Should store some basic properties", () => {
  const canvasNode = new CanvasNode();

  expect(canvasNode.x).toEqual(0);
  expect(canvasNode.y).toEqual(0);

  // @ts-expect-error Property is readonly
  canvasNode.x = 10;

  // @ts-expect-error Property is readonly
  canvasNode.y = 20;
});
```

As seen from the `@ts-expect-error` directives, we also expect these properties to be readonly.

Your challenge is to implement the `CanvasNode` class to satisfy these requirements. For extra practice, solve the challenge with and without the use of a constructor.

<Exercise title="Exercise 1: Creating a Class" filePath="/src/030-classes/108-understand-classes.problem.ts"></Exercise>

### Exercise 2: Implementing Class Methods

In this exercise, we've simplified our `CanvasNode` class so that it no longer has read-only properties:

```typescript
class CanvasNode {
  x = 0;
  y = 0;
}
```

There is a test case for being able to move the `CanvasNode` object to a new location:

```ts twoslash
// @errors: 2339
import { it, expect } from "vitest";
class CanvasNode {
  x = 0;
  y = 0;
}
// ---cut---
it("Should be able to move to a new location", () => {
  const canvasNode = new CanvasNode();

  expect(canvasNode.x).toEqual(0);
  expect(canvasNode.y).toEqual(0);

  canvasNode.move(10, 20);

  expect(canvasNode.x).toEqual(10);
  expect(canvasNode.y).toEqual(20);
});
```

Currently, there is an error under the `move` method call because the `CanvasNode` class does not have a `move` method.

Your task is to add a `move` method to the `CanvasNode` class that will update the `x` and `y` properties to the new location.

<Exercise title="Exercise 2: Implementing Class Methods" filePath="/src/030-classes/109-class-methods.problem.ts"></Exercise>

### Exercise 3: Implement a Getter

Let's continue working with the `CanvasNode` class, which now has a constructor that accepts an optional argument, renamed to `position`. This `position` is an object that replaces the individual `x` and `y` we had before:

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
}
```

In these test cases, there are errors accessing the `position` property since it is not currently a property of the `CanvasNode` class:

```ts twoslash
// @errors: 2339
import { it, expect } from "vitest";

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

// ---cut---
it("Should be able to move", () => {
  const canvasNode = new CanvasNode();

  expect(canvasNode.position).toEqual({ x: 0, y: 0 });

  canvasNode.move(10, 20);

  expect(canvasNode.position).toEqual({ x: 10, y: 20 });
});

it("Should be able to receive an initial position", () => {
  const canvasNode = new CanvasNode({
    x: 10,
    y: 20,
  });

  expect(canvasNode.position).toEqual({ x: 10, y: 20 });
});
```

Your task is to update the `CanvasNode` class to include a `position` getter that will allow for the test cases to pass.

<Exercise title="Exercise 3: Implement a Getter" filePath="/src/030-classes/111-getters.problem.ts"></Exercise>

### Exercise 4: Implement a Setter

The `CanvasNode` class has been updated so that `x` and `y` are now private properties:

```typescript
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

```ts twoslash
// @errors: 2540
declare const canvasNode: {
  readonly position: { x: number; y: number };
};

// ---cut---
canvasNode.position = { x: 10, y: 20 };
```

Your task is to write a setter for the `position` property that will allow for the test case to pass.

<Exercise title="Exercise 4: Implement a Setter" filePath="/src/030-classes/113-setters.problem.ts"></Exercise>

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

If you like, you can use an `abstract` class to define `Shape`.

<Exercise title="Exercise 5: Extending a Class" filePath="/src/030-classes/114-extending-other-classes.problem.ts"></Exercise>

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

As discussed in a previous section, it's safer to use the arrow function to avoid issues with `this`.

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
class CanvasNode {
  // inside the CanvasNode class
  set position(pos) {
    this.x = pos.x;
    this.y = pos.y;
  }
}
```

Note that we don't have to add a type to the `pos` parameter since TypeScript is smart enough to infer it based on the getter's return type.

### Solution 5: Extending a Class

The new `Shape` class would look very similar to the original `CanvasNode` class:

```typescript
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

```typescript
class CanvasNode extends Shape {
  #viewMode: ViewMode;

  constructor(options?: { x: number; y: number; viewMode?: ViewMode }) {
    super(options);
    this.#viewMode = options?.viewMode ?? "visible";
  }
}
```
