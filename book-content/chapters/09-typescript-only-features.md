Based on what I've told you so far, you might be thinking of TypeScript as just "JavaScript with types". JavaScript handles the runtime code, and TypeScript describes it with types.

But TypeScript actually has a few runtime features that don't exist in JavaScript. These features are compiled into JavaScript, but they are not part of the JavaScript language itself.

In this chapter we'll look at several of these TypeScript-only features, including parameter properties, enums and namespaces. Along the way, we'll discuss benefits and trade-offs, as well as when you might want to stick with JavaScript.

## Class Parameter Properties

One TypeScript feature that doesn't exist in JavaScript is class parameter properties. These allow you to declare and initialize class members directly from the constructor parameters.

Consider this `Rating` class:

```typescript
class Rating {
  constructor(public value: number, private max: number) {}
}
```

That the constructor includes `public` before the `value` parameter and `private` before the `max` parameter. In JavaScript, this compiles down to code which assigns the parameters to properties on the class:

```typescript
class Rating {
  constructor(value, max) {
    this.value = value;
    this.max = max;
  }
}
```

Compared to handling the assignment manually, this saves a lot of code and keeps the class definition concise.

But unlike other TypeScript features, the outputted JavaScript is not a direct representation of the TypeScript code. This can make it difficult to understand what's happening if you're not familiar with the feature.

## Enums

You can use the `enum` keyword to define a set of named constants. These can be used as types or values.

Enums were added in the very first version of TypeScript, but they haven't yet been added to JavaScript. This means it's a TypeScript-only runtime feature. And, as we'll see, it comes with some quirky behavior.

A good use case for enums is when there are a limited set of related values that aren't expected to change.

### Numeric Enums

Numeric enums group together a set of related members and automatically assigns them numeric values starting from 0. For example, consider this `AlbumStatus` enum:

```typescript
enum AlbumStatus {
  NewRelease,
  OnSale,
  StaffPick,
}
```

In this case, `AlbumStatus.NewRelease` would be 0, `AlbumStatus.OnSale` would be 1, and so on.

To use the `AlbumStatus` as a type, we could use its name:

```typescript
function logStatus(genre: AlbumStatus) {
  console.log(genre); // 0
}
```

Now, `logStatus` can only receive values from the `AlbumStatus` enum object.

```typescript
logStatus(AlbumStatus.NewRelease);
```

#### Numeric Enums with Explicit Values

You can also assign specific values to each member of the enum. For example, if you wanted to assign the value 1 to `NewRelease`, 2 to `OnSale`, and 3 to `StaffPick`, you could do so like this:

```typescript
enum AlbumStatus {
  NewRelease = 1,
  OnSale = 2,
  StaffPick = 3,
}
```

Now, `AlbumStatus.NewRelease` would be 1, `AlbumStatus.OnSale` would be 2, and so on.

#### Auto-incrementing Numeric Enums

If you choose to only assign _some_ numeric values to the enum, TypeScript will automatically increment the rest of the values from the last assigned value. For example, if you only assign a value to `NewRelease`, `OnSale` and `StaffPick` will be 2 and 3 respectively.

```typescript
enum AlbumStatus {
  NewRelease = 1,
  OnSale,
  StaffPick,
}
```

### String Enums

String enums allow you to assign string values to each member of the enum. For example:

```typescript
enum AlbumStatus {
  NewRelease = "NEW_RELEASE",
  OnSale = "ON_SALE",
  StaffPick = "STAFF_PICK",
}
```

The same `logStatus` function from above would now log the string value instead of the number.

```typescript
function logStatus(genre: AlbumStatus) {
  console.log(genre); // "NEW_RELEASE"
}

logStatus(AlbumStatus.NewRelease);
```

### Enums Are Strange

There is no equivalent syntax in JavaScript to the `enum` keyword. So, TypeScript gets to make up the rules for how enums work. This means they have some slightly odd behavior.

#### How Numeric Enums Transpile

The way enums are converted into JavaScript code can feel slightly unexpected.

For example, the enum `AlbumStatus`:

```typescript
enum AlbumStatus {
  NewRelease,
  OnSale,
  StaffPick,
}
```

Would be transpiled into the following JavaScript:

```javascript
var AlbumStatus;
(function (AlbumStatus) {
  AlbumStatus[(AlbumStatus["NewRelease"] = 0)] = "NewRelease";
  AlbumStatus[(AlbumStatus["OnSale"] = 1)] = "OnSale";
  AlbumStatus[(AlbumStatus["StaffPick"] = 2)] = "StaffPick";
})(AlbumStatus || (AlbumStatus = {}));
```

This rather opaque piece of JavaScript does several things in one go. It creates an object with properties for each enum value, and it also creates a reverse mapping of the values to the keys.

The result would then be similar to the following:

```javascript
var AlbumStatus = {
  0: "NewRelease",
  1: "OnSale",
  2: "StaffPick",
  NewRelease: 0,
  OnSale: 1,
  StaffPick: 2,
};
```

This reverse mapping means that there are more keys available on an enum than you might expect. So, performing an `Object.keys` call on an enum will return both the keys and the values.

```typescript
console.log(Object.keys(AlbumStatus)); // ["0", "1", "2", "NewRelease", "OnSale", "StaffPick"]
```

This can be a real gotcha if you're not expecting it.

#### How String Enums Transpile

String enums don't have the same behavior as numeric enums. When you specify string values, the transpiled JavaScript is much simpler:

```typescript
enum AlbumStatus {
  NewRelease = "NEW_RELEASE",
  OnSale = "ON_SALE",
  StaffPick = "STAFF_PICK",
}
```

```javascript
var AlbumStatus;
(function (AlbumStatus) {
  AlbumStatus["NewRelease"] = "NEW_RELEASE";
  AlbumStatus["OnSale"] = "ON_SALE";
  AlbumStatus["StaffPick"] = "STAFF_PICK";
})(AlbumStatus || (AlbumStatus = {}));
```

Now, there is no reverse mapping, and the object only contains the enum values. An `Object.keys` call will only return the keys, as you might expect.

```typescript
console.log(Object.keys(AlbumStatus)); // ["NewRelease", "OnSale", "StaffPick"]
```

This difference between numeric and string enums feels inconsistent, and it can be a source of confusion.

#### Numeric Enums Behave Like Union Types

Another odd feature of enums is that string enums and numeric enums behave differently when used as types.

Let's redefine our `logStatus` function with a numeric enum:

```typescript
enum AlbumStatus {
  NewRelease = 0,
  OnSale = 1,
  StaffPick = 2,
}

function logStatus(genre: AlbumStatus) {
  console.log(genre);
}
```

Now, we can call `logStatus` with a member of the enum:

```typescript
logStatus(AlbumStatus.NewRelease);
```

But we can also call it with a plain number:

```typescript
logStatus(0);
```

If we call it with a number that isn't a member of the enum, TypeScript will report an error:

```ts twoslash
// @errors: 2345
enum AlbumStatus {
  NewRelease = 0,
  OnSale = 1,
  StaffPick = 2,
}

function logStatus(genre: AlbumStatus) {
  console.log(genre);
}

// ---cut---
logStatus(3);
```

This is different from string enums, which only allow the enum members to be used as types:

```ts twoslash
// @errors: 2345
enum AlbumStatus {
  NewRelease = "NEW_RELEASE",
  OnSale = "ON_SALE",
  StaffPick = "STAFF_PICK",
}

function logStatus(genre: AlbumStatus) {
  console.log(genre);
}

logStatus(AlbumStatus.NewRelease);
logStatus("NEW_RELEASE");
```

The way string enums behave feels more natural - it matches how enums work in other languages like C# and Java.

But the fact that they're not consistent with numeric enums can be a source of confusion.

In fact, string enums are unique in TypeScript because they're compared _nominally_. All other types in TypeScript are compared _structurally_, meaning that two types are considered the same if they have the same structure. But string enums are compared based on their name (nominally), not their structure.

This means that two string enums with the same members are considered different types if they have different names:

```ts twoslash
// @errors: 2345
enum AlbumStatus {
  NewRelease = "NEW_RELEASE",
  OnSale = "ON_SALE",
  StaffPick = "STAFF_PICK",
}
function logStatus(genre: AlbumStatus) {
  console.log(genre);
}

// ---cut---
enum AlbumStatus2 {
  NewRelease = "NEW_RELEASE",
  OnSale = "ON_SALE",
  StaffPick = "STAFF_PICK",
}

logStatus(AlbumStatus2.NewRelease);
```

For those of us used to structural typing, this can be a bit of a surprise. But to developers used to enums in other languages, string enums will feel the most natural.

#### `const` Enums

A `const` enum is declared similarly to the other enums, but with the `const` keyword first:

```typescript
const enum AlbumStatus {
  NewRelease = "NEW_RELEASE",
  OnSale = "ON_SALE",
  StaffPick = "STAFF_PICK",
}
```

You can use `const` enums to declare numeric or string enums - they have the same behavior as regular enums.

The major difference is that `const` enums disappear when the TypeScript is transpiled to JavaScript. Instead of creating an object with the enum's values, the transpiled JavaScript will use the enum's values directly.

For instance, if an array is created that accesses the enum's values, the transpiled JavaScript will end up with those values:

```typescript
let albumStatuses = [
  AlbumStatus.NewRelease,
  AlbumStatus.OnSale,
  AlbumStatus.StaffPick,
];

// the above transpiles to:
let albumStatuses = ["NEW_RELEASE", "ON_SALE", "STAFF_PICK"];
```

`const` enums do have some limitations, especially when declared in declaration files (which we'll cover later). The TypeScript team actually recommends avoiding `const` enums in your library code because they can behave unpredictably for consumers of your library.

### Should You Use Enums?

Enums are a useful feature, but they have some quirks that can make them difficult to work with.

There are some alternatives to enums that you might want to consider, such as plain union types. But my preferred alternative uses some syntax we haven't covered yet.

We'll discuss whether you should use enums in general in the section on `as const`, in chapter 10.

## Namespaces

Namespaces were an early feature of TypeScript that tried to solve a big problem in JavaScript at the time - the lack of a module system. They were introduced before ES6 modules were standardized, and they were TypeScript's attempt to organize your code.

Namespaces let you specify closures where you can export functions and types. This allows you to use names that wouldn't conflict with other things declared in the global scope.

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

```typescript
const odelay: AlbumCollection.Album.Album = {
  title: "Odelay!",
  artist: "Beck",
  year: 1996,
};

AlbumCollection.Sales.recordSale("Odelay!", 1, 10.99);
```

### How Namespaces Compile

Namespaces compile into relatively simple JavaScript. For instance, a simpler version of the `RecordStoreUtils` namespace...

```typescript
namespace RecordStoreUtils {
  export function addAlbum(title: string, artist: string, year: number) {
    // Implementation to add an album to the collection
  }
}
```

...would be transpiled into the following JavaScript:

```javascript
var RecordStoreUtils;
(function (RecordStoreUtils) {
  function addAlbum(title, artist, year) {
    // Implementation to add an album to the collection
  }
  RecordStoreUtils.addAlbum = addAlbum;
})(RecordStoreUtils || (RecordStoreUtils = {}));
```

Similarly to an enum, this code creates an object with properties for each function and type in the namespace. This means that the namespace can be accessed as an object, and its properties can be accessed as methods or properties.

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

```typescript
const loaded: RecordStoreUtils.Album.Album = {
  title: "Loaded",
  artist: "The Velvet Underground",
  year: 1970,
};

RecordStoreUtils.Sales.calculateTotalSales("Loaded");
```

#### Merging Interfaces within Namespaces

It's also possible for interfaces within namespaces to be merged. If we had two different `RecordStoreUtils` each with their own `Album` interface, TypeScript would automatically merge them into a single `Album` interface that includes all the properties:

```typescript
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

This information will become crucial later when we look at the namespace's key use case: globally scoped types.

### Should You Use Namespaces?

Imagine ES modules, with `import` and `export`, never existed. In this world, everything you declare is in the global scope. You'd have to be careful about naming things, and you'd have to come up with a way to organize your code.

This is the world that TypeScript was born into. Module systems like CommonJS (`require`) and ES Modules (`import`, `export`) weren't popular yet. So, namespaces were a crucial way to avoid naming conflicts and organize your code.

But now that ES modules are widely supported, you should use them over namespaces. Namespaces have very little relevance in modern TypeScript code, with some exceptions which we'll explore in our chapter on global scopes.

## When to Prefer ES vs. TS

In this chapter we've looked at several TypeScript-only features. These features have two things in common. First, they don't exist in JavaScript. Second, they are _old_.

In 2010, when TypeScript was being built, JavaScript was seen as a problematic language that needed fixing. Enums, namespaces and class parameter properties were added in an atmosphere where new runtime additions to JavaScript were seen as a good thing.

But now, JavaScript itself is in a much healthier place. The TC39 committee, the body that decides what features get added to JavaScript, is more active and efficient. New features are being added to the language every year, and the language is evolving rapidly.

The TypeScript team themselves now see their role very differently. Instead of adding new features to TypeScript, they cleave to JavaScript as closely as possible. Daniel Rosenwasser, the program manager for TypeScript, is co-chair of the TC39 committee.

The right way to think about TypeScript today is as "JavaScript with types".

Given this attitude, it's clear how we should treat these TypeScript-only features: as relics of the past. If enums, namespaces and class parameter properties were proposed today, they would not even be considered.

But the question remains: should you use them? TypeScript will likely never stop supporting these features. To do so would break too much existing code. So, they're safe to continue using.

But I prefer writing code in the spirit of the language I'm using. Writing "JavaScript with types" keeps the relationship between TypeScript and JavaScript crystal-clear.

However, this is my personal preference. If you're working on a large codebase that already uses these features, it is _not_ worth the effort to remove them. Reaching a decision as a team and staying consistent are the keys.
