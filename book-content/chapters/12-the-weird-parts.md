We've now got a good understanding of most of TypeScript's features. Let's take it to the next level. By exploring some of the more unusual and lesser-known parts of TypeScript, we'll gain a deeper understanding of how it works.

## The Evolving `any` Type

While most of the time we want to have our types remain static, it is possible to create variables that can dynamically change their type like in JavaScript. This can be done with a technique called the "evolving `any`" which takes advantage of how variables are declared and inferred when no type is specified.

To start, use `let` to declare the variable without a type, and TypeScript will infer it as `any`:

```ts twoslash
let myVar;
//  ^?
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

```ts twoslash
const evolvingArray = [];

evolvingArray.push("abc");

const elem = evolvingArray[0];
//    ^?

evolvingArray.push(123);

const elem2 = evolvingArray[1];
//    ^?
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

```ts twoslash
// @errors: 2353
type Album = {
  title: string;
  releaseYear: number;
};
const processAlbum = (album: Album) => console.log(album);

// ---cut---
processAlbum({
  title: "Rubber Soul",
  releaseYear: 1965,
  label: "Parlophone",
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
const myFetch = (options: { url: string; timeout?: number }) => {
  // Implementation
};

const options = {
  url: "/",
  timeOut: 1000,
};

myFetch(options); // No error!
```

In this case, TypeScript won't show an error, and you won't get the runtime behavior you expect. The only way to source the error would be to provide a type annotation for the `options` object:

```ts twoslash
// @errors: 2561
const options: { timeout?: number } = {
  timeOut: 1000,
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

```ts twoslash
// @errors: 2353
type Album = {
  title: string;
  releaseYear: number;
};

const remapAlbums = (albums: Album[], remap: (album: Album) => Album) => {
  return albums.map(remap);
};

const albums: Album[] = [
  { title: "Rubber Soul", releaseYear: 1965 },
  { title: "Revolver", releaseYear: 1966 },
  { title: "Sgt. Pepper's Lonely Hearts Club Band", releaseYear: 1967 },
];

// ---cut---
const newAlbums = remapAlbums(
  albums,
  (album): Album => ({
    ...album,
    releaseYear: album.releaseYear + 1,
    strangeProperty: "This is strange",
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

Open objects more closely reflect how JavaScript actually works. Any type system for JavaScript - a very dynamic language - has to be relatively cautious about how 'safe' it can truly be.

So, TypeScript's decision to treat objects as open by default is a reflection of the language it's trying to type. It also more closely reflects how objects work in other languages.

The issue is that the excess properties warning can often make you think TypeScript uses closed objects.

But really, the excess properties warning is more like a courtesy. It's only used in cases where the object can't be modified elsewhere.

## Object Keys Are Loosely Typed

A consequence of TypeScript having open object types is that iterating over the keys of an object can be frustrating.

In JavaScript, calling `Object.keys` with an object will return an array of strings representing the keys.

```ts twoslash
const yetiSeason = {
  title: "Yeti Season",
  artist: "El Michels Affair",
  releaseYear: 2021,
};

const keys = Object.keys(yetiSeason);
//    ^?
```

In theory, you can then use those keys to access the values of the object:

```ts twoslash
// @errors: 7053
const yetiSeason = {
  title: "Yeti Season",
  artist: "El Michels Affair",
  releaseYear: 2021,
};

const keys = Object.keys(yetiSeason);
// ---cut---
keys.forEach((key) => {
  console.log(yetiSeason[key]); // Red squiggly line under key
});
```

But we're getting an error. TypeScript is telling us that we can't use `string` to access the properties of `yetiSeason`.

The only way this would work would be if `key` was typed as `'title' | 'artist' | 'releaseYear'`. In other words, as `keyof typeof yetiSeason`. But it's not - it's typed as `string`.

The reason for this comes back to `Object.keys` - it returns `string[]`, not `(keyof typeof obj)[]`.

```ts twoslash
// @errors: 2304
const keys = Object.keys(yetiSeason);
//     ^?
```

By the way, the same behavior happens with `for ... in` loops:

```ts twoslash
// @errors: 7053
const yetiSeason = {
  title: "Yeti Season",
  artist: "El Michels Affair",
  releaseYear: 2021,
};

const keys = Object.keys(yetiSeason);

// ---cut---
for (const key in yetiSeason) {
  console.log(yetiSeason[key]);
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

```ts twoslash
// @errors: 2345
const submit = (homework: {}) => console.log(homework);
// ---cut---
submit(null);
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

```ts twoslash
// @errors: 2693
const processAlbum = (album: Album) => console.log(album);
// ---cut---
type Album = {
  title: string;
  artist: string;
};

processAlbum(Album);
```

As you can see, `Album` doesn't even exist in the value world, so TypeScript shows an error when we try to use it as one.

Another common example is trying to pass a value directly to a type:

```ts twoslash
// @errors: 2749
const processAlbum = (album: Album) => console.log(album);

// ---cut---
type Album = ReturnType<processAlbum>;
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

```ts twoslash
// @errors: 2345
class Song {
  title: string;
  artist: string;

  constructor(title: string, artist: string) {
    this.title = title;
    this.artist = artist;
  }
}

const playSong = (song: Song) =>
  console.log(`Playing ${song.title} by ${song.artist}`);

// ---cut---
const song1 = new Song("Song 1", "Artist 1");

playSong(song1);

playSong(Song);
```

In this case, TypeScript shows an error when we try to pass the `Song` class itself to the `playSong` function. This is because `Song` is a class, and not an instance of the class.

So, classes exist in both the type and value worlds, and represent an instance of the class when used as a type.

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

### Naming Types & Values the Same

Finally, it's possible to name types and values the same thing. This can be useful when you want to use a type as a value, or a value as a type.

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

We now have two entities being exported with the same name: one is a value, and the other is a type. This allows `Track` to serve as both when we go to use it.

Pretending we are in a different file, we can import `Track` and use it in a function that only plays "Mambo No. 5":

```tsx
import { Track } from "./other-file";

const mamboNumberFivePlayer = (track: Track) => {
  track.play("Mambo No. 5");
};

mamboNumberFivePlayer(Track);
```

Here, we've used `Track` as a type to type the `track` parameter, and as a value to pass into the `mamboNumberFivePlayer` function.

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

As we can see, TypeScript has aliased `Track` to both the type and the value. This means it's available in both worlds.

A simple example would be to assert `Track as Track`:

```tsx
console.log(Track as Track);
//          ^^^^^    ^^^^^
//          value    type
```

TypeScript can seamlessly switch between the two, and this can be quite useful when you want to reuse types as values, or values as types.

This double-duty functionality can prove quite useful, especially when you have things that feel like types that you want to reuse elsewhere in your code.

## `this` in Functions

We've seen how `this` can be used in classes to refer to the current instance of the class. But `this` can also be used in functions and objects.

### `this` with `function`

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

While the `sellAlbum` function works, currently the `this.title` and `this.sales` properties are typed as any. So we need to find some way to type `this` in our function:

Fortunately, we can type `this` as a parameter in the function signature:

```tsx
function sellAlbum(this: { title: string; sales: number }) {
  this.sales++;
  console.log(`${this.title} has sold ${this.sales} copies.`);
}
```

Note that `this` is not a parameter that needs to be passed in when calling the function. It just refers to the object that the function is a part of.

Now, we can pass the `sellAlbum` function to the `album` object:

```tsx
const album = {
  sellAlbum,
};
```

The type checking works in an odd way here - instead of checking `this` immediately, it checks it when the function is called:

```ts twoslash
// @errors: 2684
function sellAlbum(this: { title: string; sales: number }) {
  this.sales++;
  console.log(`${this.title} has sold ${this.sales} copies.`);
}

const album = {
  sellAlbum,
};

// ---cut---
album.sellAlbum();
```

We can fix this by adding the `title` and `sales` properties to the `album` object:

```tsx
const album = {
  title: "Solid Air",
  sales: 40000,
  sellAlbum,
};
```

Now when we call the `sellAlbum` function, TypeScript will know that `this` refers to an object with a `title` property of type `string` and a `sales` property of type `number`.

### Arrow Functions

Arrow functions, unlike, `function` keyword functions, can't be annotated with a `this` parameter:

```ts twoslash
// @errors: 2730
const sellAlbum = (this: { title: string; sales: number }) => {
  // implementation
};
```

This is because arrow functions can't inherit `this` from the scope where they're called. Instead, they inherit `this` from the scope where they're _defined_. This means they can only access `this` when defined inside classes.

## Function Assignability

Let's dive deeper into how functions are compared in TypeScript.

### Comparing Function Parameters

When checking if a function is assignable to another function, not all function parameters need to be implemented. This can be a little surprising.

Imagine that we're building a `handlePlayer` function. This function listens to a music player and calls a user-defined callback when certain events occur. It should be able to accept a callback that has a single parameter for a `filename`:

```typescript
handlePlayer((filename: string) => console.log(`Playing ${filename}`));
```

It should also handle a callback with a `filename` and `volume`:

```tsx
handlePlayer((filename: string, volume: number) =>
  console.log(`Playing ${filename} at volume ${volume}`),
);
```

Finally, it should be able to handle a callback with a `filename`, `volume`, and `bassBoost`:

```tsx
handlePlayer((filename: string, volume: number, bassBoost: boolean) => {
  console.log(`Playing ${filename} at volume ${volume} with bass boost on!`);
});
```

It might be tempting to type `CallbackType` as a union of the three different function types:

```tsx
type CallbackType =
  | ((filename: string) => void)
  | ((filename: string, volume: number) => void)
  | ((filename: string, volume: number, bassBoost: boolean) => void);

const handlePlayer = (callback: CallbackType) => {
  // implementation
};
```

However, this would result in an implicit `any` error when calling `handlePlayer` with both the single and double parameter callbacks:

```ts twoslash
// @errors: 7006
type CallbackType =
  | ((filename: string) => void)
  | ((filename: string, volume: number) => void)
  | ((filename: string, volume: number, bassBoost: boolean) => void);

const handlePlayer = (callback: CallbackType) => {
  // implementation
};
// ---cut---
handlePlayer((filename) => console.log(`Playing ${filename}`));

handlePlayer((filename, volume) =>
  console.log(`Playing ${filename} at volume ${volume}`),
);

handlePlayer((filename, volume, bassBoost) => {
  console.log(`Playing ${filename} at volume ${volume} with bass boost on!`);
}); // no errors
```

This union of functions obviously isn't working. There's a simpler solution.

You can actually remove the first two members of the union and only include the member with all three parameters:

```tsx
type CallbackType = (
  filename: string,
  volume: number,
  bassBoost: boolean,
) => void;
```

Once this change has been made, the implicit `any` errors with the other two callback versions will disappear.

```typescript
handlePlayer((filename) => console.log(`Playing ${filename}`)); // No error

handlePlayer((filename, volume) =>
  console.log(`Playing ${filename} at volume ${volume}`),
); // No error
```

This might seem weird at first - surely these functions are under-specified?

Let's break it down. The callback passed to `handlePlayer` will be called with three arguments. If the callback only accepts one or two arguments, this is fine! No runtime bugs will be caused by the callback ignoring the arguments.

If the callback accepts more arguments than are passed, TypeScript would show an error:

```ts twoslash
// @errors: 2345 7006
type CallbackType = (
  filename: string,
  volume: number,
  bassBoost: boolean,
) => void;

const handlePlayer = (callback: CallbackType) => {
  // implementation
};

// ---cut---
handlePlayer((filename, volume, bassBoost, extra) => {
  console.log(`Playing ${filename} at volume ${volume} with bass boost on!`);
});
```

Since `extra` will never be passed to the callback, TypeScript shows an error.

But again, implementing fewer parameters than expected is fine. To further illustrate, we can see this concept in action when calling `map` on an array:

```tsx
["macarena.mp3", "scatman.wma", "cotton-eye-joe.ogg"].map((file) =>
  file.toUpperCase(),
);
```

`.map` is always called with three arguments: the current element, the index, and the full array. But we don't have to use all of them. In this case, we only care about the `file` parameter.

So, just because a function can receive a certain number of parameters doesn't mean it has to use them all in its implementation.

### Unions of Functions

When creating a union of functions, TypeScript will do something that might be unexpected. It will create an intersection of the parameters.

Consider this `formatterFunctions` object:

```tsx
const formatterFunctions = {
  title: (album: { title: string }) => `Title: ${album.title}`,
  artist: (album: { artist: string }) => `Artist: ${album.artist}`,
  releaseYear: (album: { releaseYear: number }) =>
    `Release Year: ${album.releaseYear}`,
};
```

Each function in the `formatterFunctions` object accepts an `album` object with a specific property and returns a string.

Now, let's create a `getAlbumInfo` function that accepts an `album` object and a `key` that will be used to call the appropriate function from the `formatterFunctions` object:

```tsx
const getAlbumInfo = (album: any, key: keyof typeof formatterFunctions) => {
  const functionToCall = formatterFunctions[key];

  return functionToCall(album);
};
```

We've annotated `album` as `any` for now, but let's take a moment to think: what should it be annotated with?

We can get a clue by hovering over `functionToCall`:

```tsx
// hovering over functionToCall shows:
const functionToCall:
  | ((album: { title: string }) => string)
  | ((album: { artist: string }) => string)
  | ((album: { releaseYear: number }) => string);
```

`functionToCall` is being inferred as a union of the three different functions from the `formatterFunctions` object.

Surely, this means we should call it with a union of the three different types of `album` objects, right?

```ts twoslash
// @errors: 2345
const formatterFunctions = {
  title: (album: { title: string }) => `Title: ${album.title}`,
  artist: (album: { artist: string }) => `Artist: ${album.artist}`,
  releaseYear: (album: { releaseYear: number }) =>
    `Release Year: ${album.releaseYear}`,
};
// ---cut---
const getAlbumInfo = (
  album: { title: string } | { artist: string } | { releaseYear: number },
  key: keyof typeof formatterFunctions,
) => {
  const functionToCall = formatterFunctions[key];

  return functionToCall(album);
};
```

We can see where we've gone wrong from the error. Instead of needing to be called with a union of the three different types of `album` objects, `functionToCall` actually needs to be called with an _intersection_ of them.

This makes sense. In order to satisfy every function, we need to provide an object that has all three properties: `title`, `artist`, and `releaseYear`. If we miss off one of the properties, we'll fail to satisfy one of the functions.

So, we can provide a type that is an intersection of the three different types of `album` objects:

```tsx
const getAlbumInfo = (
  album: { title: string } & { artist: string } & { releaseYear: number },
  key: keyof typeof formatterFunctions,
) => {
  const functionToCall = formatterFunctions[key];

  return functionToCall(album);
};
```

Which can itself be simplified to a single object type:

```tsx
const getAlbumInfo = (
  album: { title: string; artist: string; releaseYear: number },
  key: keyof typeof formatterFunctions,
) => {
  const functionToCall = formatterFunctions[key];

  return functionToCall(album);
};
```

Now, when we call `getAlbumInfo`, TypeScript will know that `album` is an object with a `title`, `artist`, and `releaseYear` property.

```tsx
const formatted = getAlbumInfo(
  {
    title: "Solid Air",
    artist: "John Martyn",
    releaseYear: 1973,
  },
  "title",
);
```

This situation is relatively easy to resolve because each parameter is compatible with the others. But when dealing with incompatible parameters, things can get a bit more complicated. We'll investigate that more in the exercises.

## Exercises

### Exercise 1: Accept Anything Except `null` and `undefined`

Here we have a function `acceptAnythingExceptNullOrUndefined` that hasn't been assigned a type annotation yet:

```ts twoslash
// @errors: 7006
const acceptAnythingExceptNullOrUndefined = (input) => {};
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

```ts twoslash
// @errors: 2578
const acceptAnythingExceptNullOrUndefined = (input: any) => {};
// ---cut---
acceptAnythingExceptNullOrUndefined(
  // @ts-expect-error
  null,
);
acceptAnythingExceptNullOrUndefined(
  // @ts-expect-error
  undefined,
);
```

Your task is to add a type annotation to the `acceptAnythingExceptNullOrUndefined` function that will allow it to accept any value except `null` or `undefined`.

<Exercise title="Exercise 1: Accept Anything Except `null` and `undefined`" filePath="/src/050-the-weird-parts/150-empty-object-type.problem.ts" resourceId="NMpTvrI4rUCyVa4GW2ViSR"></Exercise>

### Exercise 2: Detecting Excess Properties in an Object

In this exercise, we're dealing with an `options` object along `FetchOptions` interface which specifies `url`, `method`, `headers`, and `body`:

```ts twoslash
// @errors: 2578
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
  // @ts-expect-error
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

<Exercise title="Exercise 2: Detecting Excess Properties in an Object" filePath="/src/050-the-weird-parts/152-excess-properties-warnings.problem.ts" resourceId="PUZfccUL9g0ocvr45qbRoQ"></Exercise>

### Exercise 3: Detecting Excess Properties in a Function

Here's another exercise where TypeScript does not trigger access property warnings where we might expect.

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

```ts twoslash
// @errors: 2578
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

// ---cut---
const usersWithIds: User[] = users.map((user, index) => ({
  ...user,
  id: index,
  // @ts-expect-error
  age: 30,
}));
```

Despite TypeScript not expecting an `age` on `User`, it doesn't show an error, and at runtime the object will indeed contain an `age` property.

Your task is to determine why TypeScript isn't raising an error in this case, and find two different solutions to make it error appropriately when an unexpected property is added.

<Exercise title="Exercise 3: Detecting Excess Properties in a Function" filePath="/src/050-the-weird-parts/153-excess-properties-warnings-in-functions.problem.ts" resourceId="PUZfccUL9g0ocvr45qbS8Y"></Exercise>

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

Your task is to implement the `printUser` function so that the test case passes as expected.

Obviously, you could manually log the properties inside of the `printUser` function, but the goal here is to iterate over every property of the object.

Try to solve this exercise with a `for` loop for one solution, and `Object.keys().forEach()` for another. For extra credit, try widening the type of the function parameter beyond `User` for a third solution.

Remember, `Object.keys()` is typed to always return an array of strings.

<Exercise title="Exercise 4: Iterating over Objects" filePath="/src/050-the-weird-parts/154.6-iterating-over-objects.problem.ts" resourceId="PUZfccUL9g0ocvr45qbSW2"></Exercise>

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

```ts twoslash
// @errors: 7006 2344
import { Equal, Expect } from "@total-typescript/helpers";

type Event = "click" | "hover" | "scroll";

type CallbackType = unknown;

const listenToEvent = (callback: CallbackType) => {};

// ---cut---
listenToEvent((event) => {
  type tests = [Expect<Equal<typeof event, Event>>];
});
```

Stepping up in complexity, we could call it with an `event`, `x`, and `y`:

```ts twoslash
// @errors: 7006 2344
import { Equal, Expect } from "@total-typescript/helpers";

type Event = "click" | "hover" | "scroll";

type CallbackType = unknown;

const listenToEvent = (callback: CallbackType) => {};

// ---cut---
listenToEvent((event, x, y) => {
  type tests = [
    Expect<Equal<typeof event, Event>>,
    Expect<Equal<typeof x, number>>,
    Expect<Equal<typeof y, number>>,
  ];
});
```

Finally, the function could take parameters `event`, `x`, `y`, and `screenID`:

```ts twoslash
// @errors: 7006 2344
import { Equal, Expect } from "@total-typescript/helpers";

type Event = "click" | "hover" | "scroll";

type CallbackType = unknown;

const listenToEvent = (callback: CallbackType) => {};

// ---cut---
listenToEvent((event, x, y, screenId) => {
  type tests = [
    Expect<Equal<typeof event, Event>>,
    Expect<Equal<typeof x, number>>,
    Expect<Equal<typeof y, number>>,
    Expect<Equal<typeof screenId, number>>,
  ];
});
```

In almost every case, TypeScript is giving us errors.

Your task is to update the `CallbackType` to ensure that it can handle all of these cases.

<Exercise title="Exercise 5: Function Parameter Comparisons" filePath="/src/050-the-weird-parts/155-function-parameter-comparisons.problem.ts" resourceId="jUJqrXCHRph0Z4Fs6VxI9r"></Exercise>

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

```ts twoslash
// @errors: 7006
const logId = (obj: { id: string }) => {
  console.log(obj.id);
};

const logName = (obj: { name: string }) => {
  console.log(obj.name);
};

const loggers = [logId, logName];

// ---cut---
const logAll = (obj) => {
  loggers.forEach((func) => func(obj));
};
```

Your task is to determine how to type the `obj` parameter to the `logAll` function. Look closely at the type signatures for the individual logger functions to understand what type this object should be.

<Exercise title="Exercise 6: Unions of Functions with Object Params" filePath="/src/050-the-weird-parts/156-unions-of-functions-with-object-params.problem.ts" resourceId="NMpTvrI4rUCyVa4GW2ViZX"></Exercise>

### Exercise 7: Union of Functions With Incompatible Parameters

Here we're working with an object called `objOfFunctions`, which contains functions keyed by `string`, `number`, or `boolean`. Each key has an associated function to process an input of that type:

```typescript
const objOfFunctions = {
  string: (input: string) => input.toUpperCase(),
  number: (input: number) => input.toFixed(2),
  boolean: (input: boolean) => (input ? "true" : "false"),
};
```

A `format` function accepts an input that can either be a `string`, `number`, or `boolean`. From this input, it extracts the type via the regular `typeof` operator, but it asserts the operator to `string`, `number`, or `boolean`.

Here's how it looks:

```ts twoslash
// @errors: 2345
const objOfFunctions = {
  string: (input: string) => input.toUpperCase(),
  number: (input: number) => input.toFixed(2),
  boolean: (input: boolean) => (input ? "true" : "false"),
};

// ---cut---
const format = (input: string | number | boolean) => {
  // 'typeof' isn't smart enough to know that
  // it can only be 'string', 'number', or 'boolean',
  // so we need to use 'as'
  const inputType = typeof input as "string" | "number" | "boolean";
  const formatter = objOfFunctions[inputType];

  return formatter(input);
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

Currently there's an error on `input` in the return statement of the `format` function. Your challenge is to resolve this error on the type level, even though the code works at runtime. Try to use an assertion for one solution, and a type guard for another.

A useful tidbit - `any` is not assignable to `never`.

<Exercise title="Exercise 7: Union of Functions With Incompatible Parameters" filePath="/src/050-the-weird-parts/157-unions-of-functions.problem.ts" resourceId="Mcr8ILwjCSlKdfKEBg8upM"></Exercise>

### Solution 1: Accept Anything Except `null` and `undefined`

The solution is to add an empty object annotation to the `input` parameter:

```typescript
const acceptAnythingExceptNullOrUndefined = (input: {}) => {};
```

Since the `input` parameter is typed as an empty object, it will accept any value except `null` or `undefined`.

### Solution 2: Detecting Excess Properties in an Object

We aren't seeing an error in the starting point of the exercise because TypeScript's objects are open, not closed. The `options` object has all of the required properties of the `FetchOptions` interface, so TypeScript considers it to be assignable to `FetchOptions` and doesn't care that additional properties were added.

Let's look at a few ways to make the excess property error work as expected:

#### Option 1: Add a Type Annotation

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

This triggers the excess property error because TypeScript is comparing an object literal to a type directly.

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

This works for the same reason.

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

Open objects turn out to be more useful than they may initially seem. If excess property checking was performed all the time, as is the case with Flow, it could be a hassle since you'd have to remove the `search` manually before passing it to fetch.

### Solution 3: Detecting Excess Properties in a Function

There are two solutions that we'll look at for this exercise.

#### Option 1: Give the Mapping Function A Return Type

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

```ts twoslash
// @errors: 7053
type User = {
  id: number;
  name: string;
};
// ---cut---
function printUser(user: User) {
  Object.keys(user).forEach((key) => {
    console.log(user[key]);
  });
}
```

This change will have the test case passing, but TypeScript raises a type error on `user[key]`.

The issue is that the `User` interface doesn't have an index signature. In order to get around the type error without modifying the `User` interface, we can use a type assertion on `key` to tell TypeScript that it is of type `keyof User`:

```tsx
console.log(user[key as keyof User]);
```

The `keyof User` will be a union of the property names, such as `id` or `name`. And by using `as`, we are telling TypeScript that `key` is a like a more precise string.

With this change, the error goes away - but our code is a little less safe. If our object has an unexpected key, we might get some odd behavior.

#### Option 2: Using a `for` Loop

The `for` loop approach is similar to the `Object.keys().forEach()` approach. We can use a `for` loop and pass in an object instead of a `user`:

```tsx
function printUser(user: User) {
  for (const key in user) {
    console.log(user[key as keyof typeof user]);
  }
}
```

Like before, we need to use `keyof typeof` because of how TypeScript handles excess property checking.

#### Option 3: Widening the Type

Another approach is to widen the type inside the `printUser` function. In this case, we'll specify that the `user` being passed in is a `Record` with a `string` key and an `unknown` value.

In this case, the object being passed in doesn't have to be a `user` since we're just going to be mapping over every key that it receives:

```tsx
function printUser(obj: Record<string, unknown>) {
  Object.keys(obj).forEach((key) => {
    console.log(obj[key]);
  });
}
```

This works on both the runtime and type levels without error.

#### Option 4: `Object.values`

Another way to iterate over the object is to use `Object.values`:

```tsx
function printUser(user: User) {
  Object.values(user).forEach(console.log);
}
```

This approach avoids the whole issue with the keys, because `Object.values` will return an array of the values of the object. When this option is available, it's a nice way to avoid needing to deal with issue of loosely typed keys.

When it comes to iterating over object keys, there are two main choices for handling this issue: you can either make the key access slightly unsafe via `as keyof typeof`, or you can make the type that's being indexed into looser. Both approaches will work, so it's up to you to decide which one is best for your use case.

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

Recall that when implementing a function, it doesn't have to pay attention to every argument that has been passed in. However, it can't use a parameter that doesn't exist in its definition.

By typing `CallbackType` with each of the possible parameters, the test cases will pass regardless of how many parameters are passed in.

### Solution 6: Unions of Functions with Object Params

Hovering over the `loggers.forEach()`, we can see that `func` is a union between two different types of functions:

```ts
const logAll = (obj) => {
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

We can use an intersection type with objects for `id` and `name`:

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

### Solution 7: Union of Functions With Incompatible Parameters

Hovering over the `formatter` function shows us that its `input` is typed as `never` because it's a union of incompatible types:

```tsx
// hovering over formatter shows:
const formatter: (input: never) => string;
```

In order to fix the type-level issue, we can use the `as never` assertion to tell TypeScript that `input` is of type `never`:

```tsx
// inside the format function
return formatter(input as never);
```

This is a little unsafe, but we know from the runtime behavior that `input` will always be a `string`, `number`, or `boolean`.

Funnily enough, `as any` won't work here because `any` is not assignable to `never`:

```ts twoslash
// @errors: 2345
const objOfFunctions = {
  string: (input: string) => input.toUpperCase(),
  number: (input: number) => input.toFixed(2),
  boolean: (input: boolean) => (input ? "true" : "false"),
};

// ---cut---
const format = (input: string | number | boolean) => {
  const inputType = typeof input as "string" | "number" | "boolean";
  const formatter = objOfFunctions[inputType];

  return formatter(input as any);
};
```

Another way to solve this issue is to give up on our union of functions by narrowing down the type of `input` before calling `formatter`:

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
