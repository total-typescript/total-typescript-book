# The Weird Parts

We've now got a good understanding of most of TypeScript's features. Let's take it to the next level. By exploring some of the more unusual and lesser-known parts of TypeScript, we'll gain a deeper understanding of how it works.

## The Evolving `any` Type

While most of the time we want to have our types remain static, it is possible to create variables that can dynamically change their type like in JavaScript. This can be done with a technique called the "evolving `any`" which takes advantage of how variables are declared and inferred when no type is specified.

To start, use `let` to declare the variable without a type, and TypeScript will infer it as `any`:

```tsx
let myVar;

// hovering over myVar shows:
let myVar: any;
```

Now the `myVar` variable will take on the inferred type of whatever is assigned to it.

For example, we can assign it a number then call number methods like `toExponential()` on it. Later, we could change it to a string and convert it to all caps:

```tsx
myVar = 659457206512;

console.log(myVar.toExponential()); // logs "6.59457206512e+11"

myVar = "mf doom";

console.log(myVar.toUpperCase()); // logs "MF DOOM"
```

This is like an advanced form of narrowing, where the type of the variable is narrowed based on the value assigned to it.

### Evolving `any` Arrays

This technique of using the evolving `any` also works with arrays. When you declare an array without a specific type, you can push various types of elements to it:

```tsx
const evolvingArray = []; // any[]

evolvingArray.push("abc");  // string[];
evolvingArray.push(123);    // (string | number)[];
evolvingArray.push("do re mi"); // (string | number)[];
evolvingArray.push({easy: true}; // (string | number | { easy: boolean })[];
```

Even without specifying types, TypeScript is incredibly smart about picking up on your actions and the behavior you're pushing to evolving `any` types.

## Excess Property Warnings

A deeply confusing part of TypeScript is how it handles excess properties in objects. In many situations, TypeScript won't show errors you might expect when working with objects.

Let's create an `Album` interface that includes `title` and `releaseYear` properties:

```tsx
interface Album {
  title: string;
  releaseYear: number;
}
```

Here we create an untyped `rubberSoul` object that includes an excess `label` property:

```tsx
const rubberSoul = {
  title: "Rubber Soul",
  releaseYear: 1965,
  label: "Parlophone",
};
```

Now if we create a `processAlbum` function that accepts an `Album` and logs it, we can pass in the `rubberSoul` object without any issues:

```tsx
const processAlbum = (album: Album) => console.log(album);

processAlbum(rubberSoul); // No error!
```

This seems strange! We would expect TypeScript to show an error for the excess `label` property, but it doesn't.

Even more strangely, when we pass the object _inline_, we do get an error:

```tsx
processAlbum({
  title: "Rubber Soul",
  releaseYear: 1965,
  label: "Parlophone", // red squiggly line under label
});
```

Why the different behavior?

### No Excess Property Checks On Variables

In the first example, we assigned the album to a variable, then passed the variable into our function. In this situation, TypeScript won't check for excess properties.

The reason is that we might be using that variable in other places where the excess property is needed. TypeScript doesn't want to get in the way of that.

But when we inline the object, TypeScript knows that we're not going to use it elsewhere, so it checks for excess properties.

This can make you _think_ that TypeScript cares about excess properties - but it doesn't. It only checks for them in certain situations.

This behavior can be frustrating when you misspell the names of an optional parameter. Imagine you misspell `timeout` as `timeOut`:

```typescript
const fetch = (options: { timeout?: number }) => {
  // Implementation
};

const options = {
  timeOut: 1000,
};

fetch(options); // No error!
```

In this case, TypeScript won't show an error, and you won't get the runtime behavior you expect. The only way to source the error would be to provide a type annotation for the `options` object:

```tsx
const options: { timeout?: number } = {
  timeOut: 1000, // red squiggly line under timeOut
};
```

Now, we're comparing an inline object to a type, and TypeScript will check for excess properties.

### No Excess Property Checks When Comparing Functions

Another situation where TypeScript won't check for excess properties is when comparing functions.

Let's imagine we have a `remapAlbums` function that itself accepts a function:

```tsx
const remapAlbums = (albums: Album[], remap: (album: Album) => Album) => {
  return albums.map(remap);
};
```

This function takes an array of `Album`s and a function that remaps each `Album`. This can be used to change the properties of each `Album` in the array.

We can call it like this to increment the `releaseYear` of each album by one:

```tsx
const newAlbums = remapAlbums(albums, (album) => ({
  ...album,
  releaseYear: album.releaseYear + 1,
}));
```

But as it turns out, we can pass an excess property to the return type of the function without TypeScript complaining:

```tsx
const newAlbums = remapAlbums(albums, (album) => ({
  ...album,
  releaseYear: album.releaseYear + 1,
  strangeProperty: "This is strange",
}));
```

Now, our `newAlbums` array will have an excess `strangeProperty` property on each `Album` object, without TypeScript even knowing about it. It thinks that the return type of the function is `Album[]`, but it's actually `(Album & { strangeProperty: string })[]`.

The way we'd get this 'working' is to add a return type annotation to our inline function:

```tsx
const newAlbums = remapAlbums(
  albums,
  (album): Album => ({
    ...album,
    releaseYear: album.releaseYear + 1,
    strangeProperty: "This is strange", // red squiggly line under strangeProperty
  }),
);
```

This will cause TypeScript to show an error for the excess `strangeProperty` property.

This works because in this situation, we're comparing an inline object (the value we're returning) directly to a type. TypeScript will check for excess properties in this case.

Without a return type annotation, TypeScript ends up trying to compare two functions, and it doesn't really mind if a function returns too many properties.

### Open vs Closed Object Types

TypeScript, by default, treats all objects as _open_. At any time, it expects that other properties might be present on objects.

Other languages, like Flow, treat objects as _closed_ by default. Flow is Meta's internal type system, and by default requires objects to be exact (their term for 'closed').

```js
function method(obj: { foo: string }) {
  /* ... */
}

method({ foo: "test", bar: 42 }); // Error!
```

You can opt in to open (or inexact) objects in Flow with a `...` syntax:

```js
function method(obj: { foo: string, ... }) {
  /* ... */
}

method({ foo: "test", bar: 42 }); // No more error!
```

But Flow recommends you use closed objects by default. They think that, especially when working with spread operators, it's better to err on the side of caution.

### Why Does TypeScript Treat Objects As Open?

Open objects more closely reflect how JavaScript actually works. Any type system for JavaScript - a very dynamic lanugage - has to be relatively cautious about how 'safe' it can truly be.

So, TypeScript's decision to treat objects as open by default is a reflection of the language it's trying to type. It also more closely reflects how objects work in other languages.

The issue is that the excess properties warning can often make you think TypeScript uses closed objects.

But really, the excess properties warning is more like a courtesy. It's only used in cases where the object can't be modified elsewhere.

## Object Keys Are Loosely Typed

A consequence of TypeScript having open object types is that iterating over the keys of an object can be frustrating.

In JavaScript, calling `Object.keys` with an object will return an array of strings representing the keys.

```tsx
const yetiSeason = {
  title: "Yeti Season",
  artist: "El Michels Affair",
  releaseYear: 2021,
};

const keys = Object.keys(yetiSeason); // string[]
```

In theory, you can then use those keys to access the values of the object:

```tsx
keys.forEach((key) => {
  console.log(yetiSeason[key]); // Red squiggly line under key
});

// hovering over key shows:
// Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ title: string; artist: string; releaseYear: number; }'.
```

But we're getting an error. TypeScript is telling us that we can't use `string` to access the properties of `yetiSeason`.

The only way this would work would be if `key` was typed as `'title' | 'artist' | 'releaseYear'`. In other words, as `keyof typeof yetiSeason`. But it's not - it's typed as `string`.

The reason for this comes back to `Object.keys` - it returns `string[]`, not `(keyof typeof obj)[]`.

```tsx
const keys = Object.keys(yetiSeason); // string[]
```

By the way, the same behavior happens with `for ... in` loops:

```tsx
for (const key in yetiSeason) {
  console.log(yetiSeason[key]); // Red squiggly line under key
}
```

This is a consequence of TypeScript's open object types. TypeScript can't know the exact keys of an object at compile time, so it has to assume that there are unspecified keys on every object. The safest thing for it to do is, when you're enumerating the keys of an object, to treat them all as `string`.

We'll look at a few ways to work around this in the exercises below.

## The Empty Object Type

Another consequence of open object types is that the empty object type `{}` doesn't behave the way you might expect.

To set the stage, let's revisit the type assignability chart:

![type assignability chart](https://res.cloudinary.com/total-typescript/image/upload/v1708622408/150-empty-object-type.solution.1_htrfmv.png)

At the top of the chart is the `unknown` type, which can accept all other types. At the bottom is the `never` type, which no other type can be assigned to, but the `never` type itself can be assigned to any other type.

Between the `never` and `unknown` types is a universe of types. The empty object type `{}` has a unique place in this universe. Instead of representing an empty object, as you might imagine, it actually represents _anything that isn't `null` or `undefined`_.

This means that it can accept a number of other types: string, number, boolean, function, symbol, and objects containing properties.

All of the following are valid assignments:

```typescript
const coverArtist: {} = "Guy-Manuel De Homem-Christo";
const upcCode: {} = 724384260910;

const submit = (homework: {}) => console.log(homework);
submit("Oh Yeah");
```

However, trying to call `submit` with `null` or `undefined` will result in a TypeScript error:

```tsx
submit(null); // red squiggly line under null

// hovering over null shows:
Argument of type 'undefined' is not assignable to parameter of type '{}'.
```

This might feel a bit strange. But it makes sense when you remember that TypeScript's objects are _open_. Imagine our success function actually took an object containing `message`. TypeScript would be happy if we passed it an excess property:

```tsx
const success = (response: { message: string }) =>
  console.log(response.message);

const messageWithExtra = { message: "Success!", extra: "This is extra" };

success(messageWithExtra); // No Error!
```

An empty object is really the 'most open' object. Strings, numbers, booleans can all be considered objects in JavaScript. They each have properties, and methods. So TypeScript is happy to assign them to an empty object type.

The only things in JavaScript that don't have properties are `null` and `undefined`. Attempting to access a property on either of these will result in a runtime error. So, they don't fit the definition of an object in TypeScript.

When you consider this, the empty object type `{}` is a rather elegant solution to the problem of representing anything that isn't `null` or `undefined`.

## The Type and Value Worlds

For the most part, TypeScript can be separated into two syntatical spaces: the type world and the value world. These two worlds can live side-by-side in the same line of code:

```tsx
const myNumber: number = 42;
//    ^^^^^^^^  ^^^^^^   ^^
//    value     type     value
```

This can be confusing, especially because TypeScript likes to reuse the same keywords across both worlds:

```tsx
if (typeof key === "string" && (key as keyof typeof obj)) {
  //^^^^^^^^^^^^^^^^^^^^^^          ^^^^^^^^^^^^^^^^^^^
  //value                           type
}
```

But TypeScript treats this boundary very strictly. For instance, you can't use a type in the value world:

```tsx
type Album = {
  title: string;
  artist: string;
};

processAlbum(Album); // red squiggly line under Album
// Hovering over Album shows:
// Cannot find name 'Album'.
```

As you can see, `Album` doesn't even exist in the value world, so TypeScript shows an error when we try to use it as one.

Another common example is trying to pass a value directly to a type:

```tsx
type Album = ReturnType<processAlbum>; // red squiggly line under processAlbum
// Hovering over processAlbum shows:
// 'processAlbum' refers to a value, but is being used as a type here. Did you mean 'typeof processAlbum'?
```

In this case, TypeScript suggests using `typeof processAlbum` instead of `processAlbum` to fix the error.

These boundaries are very clear - except in a few cases. Some entities can exist in both the type and value worlds.

### Classes

Consider this `Song` class that uses the shortcut of declaring properties in the constructor:

```tsx
class Song {
  title: string;
  artist: string;

  constructor(title: string, artist: string) {
    this.title = title;
    this.artist = artist;
  }
}
```

We can use the `Song` class as a type, for instance to type a function's parameter:

```tsx
const playSong = (song: Song) =>
  console.log(`Playing ${song.title} by ${song.artist}`);
```

This type refers to an _instance_ of the `Song` class, not the class itself:

```tsx
const song1 = new Song("Song 1", "Artist 1");

playSong(song1);

playSong(Song); // red squiggly line under Song
// Argument of type 'typeof Song' is not assignable to parameter of type 'Song'.
```

In this case, TypeScript shows an error when we try to pass the `Song` class itself to the `playSong` function. This is because `Song` is a class, and not an instance of the class.

So, classes exists in both the type and value worlds, and represents an instance of the class when used as a type.

### Enums

Enums can also cross between worlds.

Consider this `AlbumStatus` enum, and a function that determines whether a discount is available:

```tsx
enum AlbumStatus {
  NewRelease = 0,
  OnSale = 1,
  StaffPick = 2,
  Clearance = 3,
}

function logAlbumStatus(status: AlbumStatus) {
  if (status === AlbumStatus.NewRelease) {
    console.log("No discount available.");
  } else {
    console.log("Discounted price available.");
  }
}
```

You could use `typeof AlbumStatus` to refer to the entire structure of the enum itself:

```typescript
function logAlbumStatus(status: typeof AlbumStatus) {
  // ...implementation
}
```

But then you'd need to pass in a structure matching the enum to the function:

```typescript
logAlbumStatus({
  NewRelease: 0,
  OnSale: 1,
  StaffPick: 2,
  Clearance: 3,
});
```

When used as a type, enums refer to the members of the enum, not the entire enum itself.

### The `this` Keyword

The `this` keyword can also cross between the type and value worlds.

To illustrate, we'll work with this `Song` class that has a slightly different implementation than the one we saw earlier:

```typescript
class Song {
  playCount: number;

  constructor(title: string) {
    this.playCount = 0;
  }

  play(): this {
    this.playCount += 1;
    return this;
  }
}
```

Inside of the `play` method, `this.playCount` uses `this` as a value, to access the `this.playCount` property, but also as a type, to type the return value of the method.

When the `play` method returns `this`, in the type world it signifies that the method returns an instance of the current class.

This means that we can create a new `Song` instance and chain multiple calls to the `play` method:

```tsx
const earworm = new Song("Mambo No. 5", "Lou Bega").play().play().play();
```

`this` is a rare case where `this` and `typeof this` are the same thing. We could replace the `this` return type with `typeof this` and the code would still work the same way:

```typescript
class Song {
  // ...implementation

  play(): typeof this {
    this.playCount += 1;
    return this;
  }
}
```

Both point to the current instance of the class.

<!-- CONTINUE -->

### Naming Types & Values the Same

Finally, it's possible for you to make anything you want work as both a type and a value.

Consider this `Track` object that has been created as a constant, and note the capital "T":

```tsx
export const Track = {
  play: (title: string) => {
    console.log(`Playing: ${title}`);
  },
  pause: () => {
    console.log("Song paused");
  },
  stop: () => {
    console.log("Song stopped");
  },
};
```

Next, we'll create a `Track` type that mirrors the `Track` constant:

```tsx
export type Track = typeof Track;
```

We now have two entities being exported with the same name: one is a constant, and the other is a type. This allows `Track` to serve as both when we go to use it in another file.

Pretending we are in a different file, we can import `Track` and use it in a function that only plays "Mambo No. 5":

```tsx
import { Track } from "./other-file";

const mamboNumberFivePlayer = (track: Track) => {
  track.play("Mambo No. 5");
};

mamboNumberFivePlayer(Track);
```

Hovering over `Track` shows us that it is both a type and a value:

```tsx
// hovering over { Track } shows:

(alias) type Track = {
  play: (title: string) => void;
  pause: () => void;
  stop: () => void;
}

(alias) const Track = {
  play: (title: string) => void;
  pause: () => void;
  stop: () => void;
}
```

This double-duty functionality can prove quite useful, especially when you have things that feel like types that you want to reuse elsewhere in your code.

## `this` in Functions and Objects

When working with classes, `this` refers to the current instance of the class. It can also be used in a similar way for functions and objects.

### The `function` Keyword

Here we have an object representing an album that includes a `sellAlbum` function written with the `function` keyword:

```tsx
const solidAir = {
  title: "Solid Air",
  artist: "John Martyn",
  sales: 40000,
  price: 12.99,
  sellAlbum: function () {
    this.sales++;
    console.log(`${this.title} has sold ${this.sales} copies.`);
  },
};
```

Note that inside of the `sellAlbum` function, `this` is used to access the `sales` and `title` properties of the `album` object.

When we call the `sellAlbum` function, it will increment the `sales` property and log the expected message:

```tsx
album.sellAlbum(); // logs "Solid Air has sold 40001 copies."
```

This works because when declaring a function with the `function` keyword, `this` will always refer to the object that the function is a part of. Even when the function implementation is written outside of the object, `this` will still refer to the object when the function is called:

```tsx
function sellAlbum() {
  this.sales++;
  console.log(`${this.title} has sold ${this.sales} copies.`);
}

const album = {
  title: "Solid Air",
  artist: "John Martyn",
  sales: 40000,
  price: 12.99,
  sellAlbum,
};
```

While the `sellAlbum` function works, currently the `this.title` and `this.sales` properties are typed as any. We could add type annotations to the `album` object to make it more specific:

```tsx
function sellAlbum(this: { title: string; sales: number }) {
  this.sales++;
  console.log(`${this.title} has sold ${this.sales} copies.`);
}
```

In this case, the `this` parameter is typed as an object with a `title` property of type `string` and a `sales` property of type `number`. Note that `this` is not a parameter that needs to be passed in when calling the function, but is just a type annotation instead.

Now when we call the `sellAlbum` function, TypeScript will know that `this` refers to an object with a `title` property of type `string` and a `sales` property of type `number`.

### Arrow Functions

Arrow functions behave differently than functions declared with the `function` keyword. When inside of a class, an arrow function's `this` will be automatically bound to the class instance. However, this is not the case outside of a class.

Consider this `applyDiscount` function that is written as an arrow function:

```tsx
const applyDiscount = (this: { price: number }) => { // red squiggly line under this: { price: number }
  const discount = 0.2;
  console.log(`The price has been reduced to $${this.price * (1 - discount)}`);
}

// hovering over `this` shows:
An arrow function cannot have a 'this' parameter.
```

The error message plainly tells us that an arrow function cannot have a `this` parameter.

In order to make the `applyDiscount` function work, we would either need to refactor it to use the `function` keyword and include it as a method on the `solidAir` object. Alternatively, we could just inline both the `sellAlbum` and `applyDiscount` into the object when it's created:

```tsx
const solidAir = {
  title: "Solid Air",
  artist: "John Martyn",
  sales: 40000,
  price: 12.99,
  sellAlbum(this: { title: string; sales: number }) {
    this.sales++;
    console.log(`${this.title} has sold ${this.sales} copies.`);
  },
  applyDiscount(this: { price: number }) {
    const discount = 0.2;
    console.log(`The price is now $${this.price * (1 - discount)}`);
    this.price *= 1 - discount;
  },
};
```

Notice that the above now looks a lot like a class, and is indeed an example of how they operate under the hood in TypeScript.

Remember, when you're faced with a similar scenario, using `this` within your function parameters ensures that they're strongly typed with the correct context.

## Function Assignability

There are a number of quirks to be aware of when it comes to working with functions.

### Comparing Function Parameters

Imagine that we're building a media player application. A function called `playMedia` is defined that accepts a callback function that can handle a varying number of parameters based on how it's called. For now, we'll have `CallbackType` typed as `unknown`, and iteratively make our way to the correct type:

```tsx
function playMedia(callback: CallbackType) {
  // implementation here
}

type CallbackType = unknown;
```

There are a few scenarios for the `playMedia` function that we need to account for. It should be able to accept a callback that has a single parameter for a `filename`, or a callback with a `filename` and `volume`, or a callback with an additional `bassBoost` parameter:

```tsx
playMedia((filename: string) => console.log(`Playing ${filename}`));

playMedia((filename: string, volume: number) =>
  console.log(`Playing ${filename} at volume ${volume}`),
);

playMedia((filename: string, volume: number, bassBoost: boolean) => {
  console.log(`Playing ${filename} at volume ${volume} with bass boost on!`);
});
```

It might be tempting to type `CallbackType` as a union of the three different function types:

```tsx
type CallbackType =
  | (filename: string) => void
  | (filename: string, volume: number) => void
  | (filename: string, volume: number, bassBoost: boolean) => void;
```

However, this would result in an implicit `any` error when calling `playMedia` with both the single and double parameter callbacks:

```tsx
playMedia((filename) => console.log(`Playing ${filename}`)); // red squiggly line under filename

playMedia((filename, volume) => console.log(`Playing ${filename} at volume ${volume}`)); // red squiggly line under filename and volume

playMedia((filename, volume, bassBoost) => {
  console.log(`Playing ${filename} at volume ${volume} with bass boost on!`);
}); // no errors


// hovering over filename shows:
Parameter 'filename' implicitly has an 'any' type.
```

Interestingly, the callback version with all three parameters works without an error.

It turns out that the correct way to define the `CallbackType` type is to remove the first two members of the union and only include the member with all three parameters:

```tsx
type CallbackType = (
  filename: string,
  volume: number,
  bassBoost: boolean,
) => void;
```

Once this change has been made, the implicit `any` errors with the other two callback versions will disappear.

This might seem weird at first, but think about how functions work in JavaScript. When you call a function with fewer parameters than it expects, the extra parameters are just `undefined`. This is why the callback with all three parameters works without an error, but the other two don't. However, a function can't use a parameter that doesn't exist in its definition, because that would cause an error. This is why we needed to delete the first two members of the `CallbackType` union.

To further illustrate, we can see this concept in action when calling `map` on an array:

```tsx
["macarena.mp3", "scatman.wma", "cotton-eye-joe.ogg"].map((file) =>
  file.toUpperCase(),
);
```

The function passed into `map` only uses the `file` parameter, ignoring the `index` and full `array` parameters that could have been passed in.

Just because a function can receive a certain number of parameters doesn't mean it has to use them all. This is crucial to understand when working with callbacks!

### Unions of Functions

When creating a union of functions, TypeScript will intersect the arguments and create a union of the return types.

Consider this `formatterFunctions` object that has keys corresponding to `Album` properties, and values that are functions that format the `input` into strings:

```tsx
const formatterFunctions = {
  title: (album: Album) => `Title: ${input}`,
  artist: (album: Album) => `Artist: ${input}`,
  releaseYear: (album: Album) => `Release Year: ${input}`,
};
```

A `getAlbumInfo` function accepts an `Album`, along with a specific `key` from the `formatterFunctions` that we'll get with the `keyof typeof` trick. The function then retrieves the appropriate function from the `formatterFunctions` object and calls it with the `album`:

```tsx
const getAlbumInfo = (album: Album, key: keyof typeof albumFunctions) => {
  const functionToCall = formatterFunctions[key];

  return functionToCall(album);
};
```

Calling `getAlbumInfo` with a proper `Album` and valid `key` will work as expected, but the interesting thing here is how `functionToCall` ends up being typed:

```tsx
// hovering over functionToCall shows:
const functionToCall:
  | ((album: Album) => string)
  | ((album: Album) => string)
  | ((album: Album) => string);
```

The `functionToCall` variable is typed as a union of the three different functions from the `formatterFunctions` object, and each has the same signature of `(album: Album) => string`.

Even though hovering over `functionToCall` shows us a union of the three functions, since they are identical they collapse into a single signature that intersects the arguments and unions the return types.

We can see this when hovering over the actual call to `functionToCall(album)` in the return statement of `getAlbumInfo`:

```tsx
// hovering over functionToCall(album) shows:
const albumFunction: (album: Album) => string;
```

Where the behavior of intersecting arguments and creating a union of return types becomes more obvious is when the functions have different signatures. For example, let's add an additional function to the `formatterFunctions` object that accepts and returns a number:

```tsx
const formatterFunctions = {
  title: (album: Album) => `Title: ${album.title}`,
  artist: (album: Album) => `Artist: ${album.artist}`,
  releaseYear: (album: Album) => `Release Year: ${album.releaseYear}`,
  salesUntilPlatinum: (sales: number) => 1000000 - sales,
};
```

Now our return statement with the call to `functionToCall(album)` shows us an error below `album`:

```tsx
// inside of getAlbumInfo
return functionToCall(album); // red squiggly line under album

// hovering over album shows:
Argument of type 'Album' is not assignable to parameter of type 'Album & number'.
Type 'Album' is not assignable to type 'number'.
```

We can see that `functionToCall` indeed has arguments typed with an intersection of `Album` and `number`, and a return type of `string | number`:

```tsx
// hovering over functionToCall(album) shows:
const functionToCall: (arg0: Album & number) => string | number;
```

In this case, we could fix the error by adding a type assertion to `functionToCall` to intersect `Album & number`:

```tsx
// inside of getAlbumInfo
return functionToCall(album as Album & number);
```

However, it's important to remember that not all types can intersect so cleanly.

#### Asserting `as never`

Recall that in TypeScript the `never` type represents a value that can never occur. Earlier in the book we saw that creating an intersection of incompatible types resulted in `never`:

```tsx
type StringAndNumber = string & number;

// hovering over StringAndNumber shows:
type StringAndNumber = never;
```

When we create a new variable that's typed as `StringAndNumber`, TypeScript will show an error that `string` is not assignable to `never`. However, there won't be an error at runtime and we can successfully call `console.log` with the `StringAndNumber` variable:

```tsx
const stringAndNumber: StringAndNumber = "Hello"; // red squiggly line under stringAndNumber

// hovering over stringAndNumber shows:
Type 'string' is not assignable to type 'never'.

console.log(stringAndNumber); // logs "Hello"
```

In order to resolve the error from TypeScript, we can add the `as never` assertion when creating the `stringAndNumber` variable:

```tsx
const stringAndNumber: StringAndNumber = "Hello" as never;
```

While this assertion is a little bit strange, it does show up in the wild when dealing with unions of functions that accept incompatible types.

## Exercises

### Exercise 1: Accept Anything Except `null` and `undefined`

Here we have a function `acceptAnythingExceptNullOrUndefined` that hasn't been assigned a type annotation yet:

```typescript
const acceptAnythingExceptNullOrUndefined = (input) => {}; // red squiggly line under input
```

This function can be called with a variety of inputs: strings, numbers, boolean expressions, symbols, objects, arrays, functions, regex, and an `Error` class instance:

```typescript
acceptAnythingExceptNullOrUndefined("hello");
acceptAnythingExceptNullOrUndefined(42);
acceptAnythingExceptNullOrUndefined(true);
acceptAnythingExceptNullOrUndefined(Symbol("foo"));
acceptAnythingExceptNullOrUndefined({});
acceptAnythingExceptNullOrUndefined([]);
acceptAnythingExceptNullOrUndefined(() => {});
acceptAnythingExceptNullOrUndefined(/foo/);
acceptAnythingExceptNullOrUndefined(new Error("foo"));
```

None of these inputs should throw an error.

However, as the name of the function suggests, if we pass `null` or `undefined` to the function, we want it to throw an error.

```typescript
acceptAnythingExceptNullOrUndefined(
  // @ts-expect-error // red squiggly line under @ts-expect-error
  null,
);
acceptAnythingExceptNullOrUndefined(
  // @ts-expect-error // red squiggly line under @ts-expect-error
  undefined,
);
```

Your task is to add a type annotation to the `acceptAnythingExceptNullOrUndefined` function that will allow it to accept any value except `null` or `undefined`.

### Exercise 2: Detecting Excess Properties in an Object

In this exercise, we're dealing with an `options` object along `FetchOptions` interface which specifies `url`, `method`, `headers`, and `body`:

```typescript
interface FetchOptions {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

const options = {
  url: "/",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  // @ts-expect-error // red squiggly line under @ts-expect-error
  search: new URLSearchParams({
    limit: "10",
  }),
};
```

Note that the `options` object has an excess property `search` which is not specified in the `FetchOptions` interface, along with a `@ts-expect-error` directive that currently isn't working.

There is also a `myFetch` function which accepts a `FetchOptions` typed object as its argument that doesn't have any errors when called with the `options` object:

```typescript
const myFetch = async (options: FetchOptions) => {};

myFetch(options);
```

Your challenge is to determine why the `@ts-expect-error` directive isn't working, and restructure the code so that it does. Try to solve it multiple ways!

### Exercise 3: Detecting Excess Properties in a Function

Here's another exercise where TypeScript does not trigger access property warnings as we might expect.

Here we have a `User` interface with `id` and `name` properties, and a `users` array containing two user objects, "Waqas" and "Zain".

```typescript
interface User {
  id: number;
  name: string;
}

const users = [
  {
    name: "Waqas",
  },
  {
    name: "Zain",
  },
];
```

A `usersWithIds` variable is typed as an array of `User`s. A `map()` function is used to spread the user into a newly created object, with an `id` and an `age` of 30:

```typescript
const usersWithIds: User[] = users.map((user, index) => ({
  ...user,
  id: index,
  // @ts-expect-error // red squiggly line under @ts-expect-error
  age: 30,
}));
```

Despite TypeScript not expecting an `age` on `User`, it doesn't show an error, and at runtime the object will indeed contain an `age` property.

Your task is to determine why TypeScript isn't raising an error in this case, and find two different solutions to make it error appropriately when an unexpected property is added.

### Exercise 4: Iterating over Objects

Consider an interface `User` with properties `id` and `name`, and a `printUser` function that accepts a `User` as its argument:

```typescript
interface User {
  id: number;
  name: string;
}

function printUser(user: User) {}
```

Inside a test setup, we want to call the `printUser` function with an `id` of `1` and a `name` of "Waqas". The expectation is that the spy on `console.log` will first be called with `1` and then with "Waqas":

```typescript
it("Should log all the keys of the user", () => {
  const consoleSpy = vitest.spyOn(console, "log");

  printUser({
    id: 1,
    name: "Waqas",
  });

  expect(consoleSpy).toHaveBeenCalledWith(1);
  expect(consoleSpy).toHaveBeenCalledWith("Waqas");
});
```

Your task is to fill out the skeleton of the `printUser` function so that the test case passes as expected.

Obviously, you could manually log the properties inside of the `printUser` function, but the goal here is to iterate over every property of the object.

Try to solve this exercise with a `for` loop for one solution, and `Object.keys().forEach()` for another. For extra credit, try widening the type of the function parameter beyond `User` for a third solution.

Remember, `Object.keys()` is typed to always return an array of strings.

### Exercise 5: Function Parameter Comparisons

Here we have a `listenToEvent` function that takes a callback that can handle a varying number of parameters based on how it's called. Currently the `CallbackType` is set to `unknown`:

```typescript
type Event = "click" | "hover" | "scroll";

type CallbackType = unknown;

const listenToEvent = (callback: CallbackType) => {};
```

For example, we might want to call `listenToEvent` and pass a function that accepts no parameters - in this case, there's no need to worry about arguments at all:

```typescript
listenToEvent(() => {});
```

Alternatively, we could pass a function that expects a single parameter, `event`:

```typescript
listenToEvent((event) => {
  // red squiggly line under event
  type tests = [Expect<Equal<typeof event, Event>>]; // red squiggly line under Equal<>
});
```

Stepping up in complexity, we could call it with an `event`, `x`, and `y`:

```typescript
listenToEvent((event, x, y) => {
  // red squiggly line under event, x, and y
  type tests = [
    Expect<Equal<typeof event, Event>>, // red squiggly line under Equal<>
    Expect<Equal<typeof x, number>>, // red squiggly line under Equal<>
    Expect<Equal<typeof y, number>>, // red squiggly line under Equal<>
  ];
});
```

Finally, the function could take parameters `event`, `x`, `y`, and `screenID`:

```typescript
listenToEvent((event, x, y, screenId) => {
  // red squiggly line under event, x, y, and screenId
  type tests = [
    Expect<Equal<typeof event, Event>>, // red squiggly line under Equal<>
    Expect<Equal<typeof x, number>>, // red squiggly line under Equal<>
    Expect<Equal<typeof y, number>>, // red squiggly line under Equal<>
    Expect<Equal<typeof screenId, number>>, // red squiggly line under Equal<>
  ];
});
```

In almost every case, TypeScript is giving us errors.

Your task is to update the `CallbackType` to ensure that it can handle all of these cases.

### Exercise 6: Unions of Functions with Object Params

Here we are working with two functions: `logId` and `logName`. The `logId` function logs an `id` from an object to the console, while `logName` does the same with a `name`:

These functions are grouped into an array called `loggers`:

```typescript
const logId = (obj: { id: string }) => {
  console.log(obj.id);
};

const logName = (obj: { name: string }) => {
  console.log(obj.name);
};

const loggers = [logId, logName];
```

Inside a `logAll` function, a currently untyped object is passed as a parameter. Each logger function from the `loggers` array is then invoked with this object:

```typescript
const logAll = (obj) => {
  // red squiggly line under obj
  loggers.forEach((func) => func(obj));
};
```

Your task is to determine how to type the `obj` parameter to the `logAll` function. Look closely at the type signatures for the individual logger functions to understand what type this object should be.

### Exercise 7: Union of Functions

Here we're working with an object called `objOfFunctions`, which contains functions keyed by `string`, `number`, or `boolean`. Each key has an associated function to process an input of that type:

```typescript
const objOfFunctions = {
  string: (input: string) => input.toUpperCase(),
  number: (input: number) => input.toFixed(2),
  boolean: (input: boolean) => (input ? "true" : "false"),
};
```

A `format` function accepts an input that can either be a `string`, `number`, or `boolean`. From this input, it extracts the type via the regular `typeof` operator, but it constrains the operator to `string`, `number`, or `boolean`.

Here's how it looks:

```typescript
const format = (input: string | number | boolean) => {
  const inputType = typeof input as "string" | "number" | "boolean";
  const formatter = objOfFunctions[inputType];

  return formatter(input); // red squiggly line under input
};
```

The `formatter` which is extracted from `objOfFunctions` ends up typed as a union of functions. This happens because it can be any one of the functions that take either a `string`, `number`, or `boolean`:

```tsx
// hovering over formatter shows:
const formatter:
  | ((input: string) => string)
  | ((input: number) => string)
  | ((input: boolean) => "true" | "false");
```

Currently there's an error on `input` in the return statement of the `format` function:

```tsx
// hovering over input shows:
Argument of type 'string | number | boolean' is not assignable to parameter of type 'never'.
```

Your challenge is to resolve this error on the type level, even though the code works at runtime. Try to use an assertion for one solution, and a type guard for another.

### Exercise 8: Annotating a Function's Errors

Consider a function named `getUserFromLocalStorage` that takes an `id` and returns a user object from `localStorage`:

```typescript
const getUserFromLocalStorage = (id: string) => {
  const user = localStorage.getItem(id);
  if (!user) {
    return undefined;
  }

  return JSON.parse(user);
};
```

This function can throw errors in either of two scenarios: First, an error will be thrown when there's a `SyntaxError` due to the data retrieved from `localStorage` being incorrectly formatted. Second, if there's a `DOMException` that occurs from an abnormal DOM event.

We have tried to encapsulate these possible errors by defining a type `PossibleErrors` as follows:

```typescript
type PossibleErrors = SyntaxError | DOMException;
```

Ideally, we should be able to annotate that `getUserFromLocalStorage` will either return a `user` or throw one of the errors represented by the `PossibleErrors` type.

In practice, however, when we wrap this function call in a `try-catch` block, the `catch` block's error parameter `e` is typed as `unknown`.

```typescript
// outside of the function

try {
  const user = getUserFromLocalStorage("user-1");
} catch (
  // How do we make this typed as PossibleErrors?
  e
) {}
```

Your challenge is to determine how to type `e` as one of the types represented by `PossibleErrors`. Note that there isn't a specific annotation, so there are different approaches to solving this problem.

The best solution involves implementing a type that will either return `data` or the specific `error`, and updating the implementation of `getUserFromLocalStorage` to include its own try-catch.

This exercise is challenging, and might require you to revisit what you've learned in previous chapters!

### Solution 1: Accept Anything Except `null` and `undefined`

The solution is to add an empty object annotation to the `input` parameter:

```typescript
const acceptAnythingExceptNullOrUndefined = (input: {}) => {};
```

Since the `input` parameter is typed as an empty object, it will accept any value except `null` or `undefined`.

### Solution 2: Detecting Excess Properties in an Object

We aren't seeing an error in the starting point of the exercise because of TypeScript's structural type model. The `options` object has all of the required properties of the `FetchOptions` interface, so TypeScript considers it to be of type `FetchOptions` and doesn't care that additional properties were added.

Let's look at a few ways to make the excess property error work as expected:

#### Option 1: Add a Type Annotation to `options`

Adding a type annotation to the `options` object will result in an error for the excess property:

```typescript
const options: FetchOptions = {
  url: "/",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  // @ts-expect-error
  search: new URLSearchParams({
    limit: "10",
  }),
};
```

#### Option 2: Use the `satisfies` Keyword

Another way to trigger excess property checking is to add the `satisfies` keyword at the end of the variable declaration:

```tsx
const options = {
  url: "/",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  // @ts-expect-error
  search: new URLSearchParams({
    limit: "10",
  }),
} satisfies FetchOptions;
```

#### Option 3: Inline the Variable

Finally, TypeScript will also check for excess properties if the variable is inlined into the function call:

```typescript
const myFetch = async (options: FetchOptions) => {};

myFetch({
  url: "/",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  // @ts-expect-error
  search: new URLSearchParams({
    limit: "10",
  }),
});
```

In this case, TypeScript will provide an error because it knows that `search` is not part of the `FetchOptions` interface.

Excess property checking turns out to be more useful than may initially seem. If excess property checking was performed all the time, as is the case with flow, it could be a hassle since you'd have to remove the `search` manually before passing it to fetch.

Generally, it's good practice to inline your variables most of the time. Even if TypeScript doesn't always behave as expected, adapting to inlining variables gives better error warnings when transferring objects around.

### Solution 3: Detecting Excess Properties in a Function

There are two solutions that we'll look at for this exercise.

#### Option 1: Annotate the Mapping Function

The first way to solve this issue is to annotate the map function.

In this case, the mapping function will take in a `user` that is an object with a `name` string, and an `index` which will be a number.

Then for the return type, we'll specify that it must return a `User` object.

```tsx
const usersWithIds: User[] = users.map(
  (user, index): User => ({
    ...user,
    id: index,
    // @ts-expect-error
    age: 30,
  }),
);
```

With this setup, there will be an error on `age` because it is not part of the `User` type.

#### Option 2: Use `satisfies`

For this solution, we'll use the `satisfies` keyword to ensure that the object returned from the map function satisfies the `User` type:

```tsx
const usersWithIds: User[] = users.map(
  (user, index) =>
    ({
      ...user,
      id: index,
      // @ts-expect-error
      age: 30,
    } satisfies User),
);
```

TypeScript's excess property checks can sometimes lead to unexpected behavior, especially when dealing with function returns. To avoid this issue, always declare the types for variables that may contain excess properties or indicate the expected return types in your functions.

### Solution 4: Iterating over Objects

Let's look at both looping approaches for the `printUser` function.

#### Option 1: Using `Object.keys().forEach()`

The first approach is to use `Object.keys().forEach()` to iterate over the object keys. Inside the `forEach` callback, we'll access the value of the key by using the `key` variable:

```tsx
function printUser(user: User) {
  Object.keys(user).forEach((key) => {
    console.log(user[key]); // red squiggly line under user[key]
  });
}
```

This change will have the test case passing, but TypeScript raises a type error on `user[key]`:

```tsx
// Hovering over user[key] shows:
Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'User'.
```

The issue is that the `User` interface doesn't have an index signature. Adding one would solve the issue, but for the challenge we were only supposed to update the `printUser` function:

```tsx
interface User {
  id: number;
  name: string;
  [index: string]: any;
}
```

In order to get around the type error without modifying the `User` interface, we can use a type assertion on `key` to tell TypeScript that it is of type `keyof User`:

```tsx
console.log(user[key as keyof User]);
```

The `keyof User` will be a union of the property names, such as `id` or `name`. And by using `as`, we are telling TypeScript that `key` is a like a more precise string.

With this change, the error goes away.

#### Option 2: Using a `for` Loop

The `for` loop approach is similar to the `Object.keys().forEach()` approach, but it's a bit more generic. We can use a `for` loop and pass in an object instead of a `user`:

```tsx
function printUser(user: User) {
  for (const key in user) {
    console.log(user[key as keyof typeof user]);
  }
}
```

Like before, we need to use `keyof typeof` because of how TypeScript handles excess property checking.

#### Option 3: Widening the Type

Another approach is to widen the type inside the `printUser` function. In this case, we'll specify that the `user` being passed in is a `Record` with a `string` key and an `any` value.

In this case, the object being passed in doesn't have to be a `user` since we're just going to be mapping over every key that it receives:

```tsx
function printUser(obj: Record<string, any>) {
  Object.keys(obj).forEach((key) => {
    console.log(obj[key]);
  });
}
```

This works on both the runtime and type levels without error.

When it comes to iterating over object keys, there are two main choices for handling this issue: you can either make the key access slightly unsafe and patch it that way, or you can make the type that's being indexed into looser. Both approaches will work, so it's up to you to decide which one is best for your use case.

### Solution 5: Function Parameter Comparisons

The solution is to type `CallbackType` as a function that specifies each of the possible parameters:

```tsx
type CallbackType = (
  event: Event,
  x: number,
  y: number,
  screenId: number,
) => void;
```

Recall that when implementing a function, it doesn't have to pay attention to everything that has been passed in. However, it can't use a parameter that doesn't exist in its definition.

By typing `CallbackType` with each of the possible parameters, the test cases will pass regardless of how many parameters are passed in.

### Solution 6: Unions of Functions with Object Params

Hovering over the `loggers.forEach()`, we can see that `func` is a union between two different types of functions:

```tsx
const logAll = (obj) => { // red squiggly line under obj
  loggers.forEach((func) => func(obj));
};

// Hovering over forEach shows:

(parameter) func: ((obj: {
  id: string;
}) => void) | ((obj: {
  name: string;
}) => void)
```

One function takes in an `id` string, and the other takes in a `name` string.

This makes sense because when we call the array, we don't know which one we're getting at which time.

#### Attempting to Pass in a Union Won't Work

It may be tempting to pass in a union of objects like `{ id: string } | { name: string}`, but this won't work:

```tsx
// this won't work!
const logAll = (obj: { id: string } | { name: string }) => {
  loggers.forEach((func) => func(obj)); // red squiggly line under obj
};
```

When typing the parameter to be a union, the `func`'s type has changed a single function that takes in an object with an `id` string and a `name` string.

```tsx
// hovering over `func` in the non-working example above shows:
(parameter) func: ((obj: {
  id: string;
} & {
  name: string;
}) => void)
```

In other words, the combined function needs to satisfy all the potential inputs– in this case, it must contain both an `id` string and a `name` string.

Using a union type isn't an option.

#### Passing in an Intersection or Object Type

Instead of a union, we can use an intersection type with objects for `id` and `name`:

```tsx
const logAll = (obj: { id: string } & { name: string }) => {
  loggers.forEach((func) => func(obj));
};
```

Alternatively, we could just pass in a regular object with `id` string and `name` string properties. As we've seen, having an extra property won't cause runtime issues and TypeScript won't complain about it:

```tsx
const logAll = (obj: { id: string; name: string }) => {
  loggers.forEach((func) => func(obj));
};
```

In both cases, the result is `func` being a function that contains all of the possibilities of things being passed into it:

```tsx
// hovering over func shows:
(parameter) func: (obj: {
    id: string;
} & {
    name: string;
}) => void
```

This behavior makes sense, and this pattern is useful when working with functions that have varied requirements.

### Solution 7: Union of Functions

Hovering over the `formatter` variable shows us that its `input` is typed as `never` because it's a union of incompatible types:

```tsx
// hovering over formatter shows:
const formatter: (input: never) => string;
```

In order to fix the type-level issue, we can use the `as never` assertion to tell TypeScript that `input` is of type `never`:

```tsx
// inside the format function
return formatter(input as never);
```

This is a quick fix to this problem.

Another way to solve this issue is to use a type guard for narrowing the type of `input`:

```tsx
const format = (input: string | number | boolean) => {
  if (typeof input === "string") {
    return objOfFunctions.string(input);
  } else if (typeof input === "number") {
    return objOfFunctions.number(input);
  } else {
    return objOfFunctions.boolean(input);
  }
};
```

This solution is more verbose and won't compile down as nicely as `as never`, but it will fix the error as expected.

### Solution 8: Annotating a Function's Errors

Unlike some languages, TypeScript doesn't employ the `throws` syntax that could describe potential errors. There's currently no way to specifically annotate what kind of errors a function might throw:

```tsx
// This won't work!
const getUserFromLocalStorage = (id: string): throws PossibleErrors => {
  // ...
};
```

Additionally, TypeScript does not allow for the annotation of the catch clause. You can't directly annotate that `e`, must be a specific type of error:

```typescript
// This won't work!

try {
  const user = getUserFromLocalStorage("user-1");
} catch (e) {
  // You can't annotate 'e' like this
  e: PossibleErrors; // red squiggly line under PossibleErrors
}
```

That means we have to do some extra work to handle the errors in a recognizable pattern.

#### Using `instanceof` to Handle Errors

One approach to solving this problem is to use `instanceof` to check if the error is of a specific type:

```tsx
// inside the `catch` block

if (e instanceof SyntaxError) {
  // Handle SyntaxError
}

if (e instanceof DOMException) {
  // Handle DOMException
}
```

This solution will work, but it requires the user of your function to handle the error instead of the function itself.

#### Using a Type to Handle Errors

The better solution is to use a type to capture the necessary information inside the function.

The `Result` type is a discriminated union that includes a `success` property that is `true` when the function is successful, and `false` when it's not. When the function is successful, the `data` property will contain the data. When it's not, the `error` property will contain the specific error:

```tsx
type Result =
  | {
      success: true;
      data: any;
    }
  | {
      success: false;
      error: SyntaxError | DOMException;
    };
```

With the `Result` type created, we can use it to annotate the return type of the `getUserFromLocalStorage` function. Inside the function, we can add a `try-catch` block that will safely access the `localStorage` and handle success and error cases appropriately:

```typescript
const getUserFromLocalStorage = (id: string): Result => {
  try {
    const user = localStorage.getItem(id);
    if (!user) {
      return {
        success: true,
        data: undefined,
      };
    }

    return {
      success: true,
      data: JSON.parse(user),
    };
  } catch (e) {
    if (e instanceof DOMException) {
      return {
        success: false,
        error: e,
      };
    }
    if (e instanceof SyntaxError) {
      return {
        success: false,
        error: e,
      };
    }
    throw e;
  }
};
```

While this is a verbose solution, it provides a better experience to the users. The function is less likely to throw an error, and if it does, the error will be handled. This `Result` type pattern is a good one to adopt in your own applications!
