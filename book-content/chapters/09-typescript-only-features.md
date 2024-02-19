# 09. TypeScript-only Features

Beyond adding types, TypeScript has several features that are not found in JavaScript. Some of these are runtime features that were introduced in the earlier years, but for the last several releases the TypeScript team has been focused on introducing features that disappear or are removed by the compiler when it transpiles the TypeScript code to JavaScript.

In this chapter we'll look at several of these TypesScript-only features, including parameter properties, enums, namespaces, and declaration merging. Along the way we'll discuss benefits and trade-offs, as well as when you might want to stick with JavaScript.

## Class Parameter Properties

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

## Enums

Enums, or enumerated types, are another runtime-level feature from the early days of TypeScript. They are used similarly to an object or interface, but with a few key differences. For example, enums can be used on the runtime level, while also being referred to by name on the type level.

A good use case for enums is when there are a limited set of related constants that aren't expected to change.

There are a few different flavors of enums for expressing different types of data.

### Numeric Enums

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

### String Enums

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

### `const` Enums

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

### Trade-offs and Practical Use

Because `const` enums require the TypeScript compiler to understand the value of the constants during transpilation, there can be implications for code that runs under different tools like ESBuild or SWC. These tools do not have a full TypeScript compiler, and instead rely on the JavaScript Abstract Syntax Tree (AST) to understand the code. This can lead to unexpected behavior when using `const` enums.

The TypeScript team suggests avoiding `const` enums in your library code. They might be useful in some application code, but in general their weirdness may not be worth the pain.

If you're going to to use enums, stick with string or numeric enums, but even then they might not be worth it.

## Namespaces

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

## When to Prefer ES vs. TS

In this chapter we looked at several TypeScript-only features, and how they are compiled into JavaScript.

Parameter properties are compiled to assignments in the constructor. Enums are compiled into an object with properties for each enum value, as well as a reverse mapping of the values to the keys. Namespaces are compiled into a similar shape.

All of these features are useful in various situations, and it's good that they all compile to basic JavaScript.

However, for the most part you should prefer using ES features over any of these TypeScript features.

Part of the reasoning behind this is that there are several efforts happening with the TC39 committee to bring JavaScript closer to TypeScript.

One of the most notable efforts is the "types as comments" proposal, which would allow TypeScript types to be used in JavaScript as comments. This would allow for a smoother transition from JavaScript to TypeScript, and would also allow for TypeScript types to be used in JavaScript documentation.

There's also the idea of enums being brought into JavaScript, but this could potentially conflict with TypeScript's own spec. Perhaps TypeScript would add some sort of "experimental enums" flag if this proposal were to be accepted.

Members of the TypeScript team have shared that their vision is to have type annotations become part of JavaScript, then work with TC39 to determine what other features should be included.

The big takeaway here is that you should avoid using any of the TypeScript-only features discussed in this chapter. If they're already present in your codebase, it's probably fine. But if you're starting a new project, you should stick with using ES features.
