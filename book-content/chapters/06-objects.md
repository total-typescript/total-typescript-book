# 06. Objects

<!-- CONTINUE -->

## Extending Objects

Creating new objects based on objects that already exist is a great way to promote modularity and reusability in your code. There are two primary methods for extending objects in TypeScript: using intersections and extending interfaces.

### Intersection Types

Unlike the union operator `|` which represents an "or" relationship between types, the intersection operator `&` signifies an 'and' relationship.

Using the intersection operator `&` combines multiple separate types into a single type that inherits all of the properties of the source types (formally known as "constituent types").

Consider these types for `Album` and `SalesData`:

```typescript
type Album = {
  title: string;

  artist: string;

  releaseYear: number;
};

type SalesData = {
  unitsSold: number;

  revenue: number;
};
```

On their own, each type represents a distinct set of properties. While the `SalesData` type on its own could be used to represent sales data for any product, using the `&` operator to create an intersection type allows us to combine the two types into a single type that represents an album's sales data:

```typescript
type AlbumSales = Album & SalesData;
```

The `AlbumSales` type now requires objects to include all of the properties from both `AlbumDetails` and `SalesData`:

```tsx

const wishYouWereHereSales: AlbumSales = {
  title: "Wish You Were Here",

  artist: "Pink Floyd",

  releaseYear: 1975

  unitsSold: 13000000,

  revenue: 65000000,
};
```

If the contract of the `AlbumSales` type isn't fulfilled when creating a new object, TypeScript will raise an error.

### Interfaces

<!-- TODO - introduce interfaces -->

Another option for creating new objects is to use TypeScript interfaces and the `extends` keyword. This approach is particularly useful when building hierarchies or when multiple extensions are needed.

In this example, we have a base `Album` interface that will be extended into `StudioAlbum` and `LiveAlbum` interfaces that allow us to provide more specific details about an album:

```typescript
interface Album {
  title: string;

  artist: string;

  releaseYear: number;
}

interface StudioAlbum extends Album {
  studio: string;

  producer: string;
}

interface LiveAlbum extends Album {
  concertVenue: string;

  concertDate: Date;
}
```

This structure allows us to create more specific album representations with a clear inheritance relationship:

```tsx
const americanBeauty: StudioAlbum = {
  title: "American Beauty",

  artist: "Grateful Dead",

  releaseYear: 1970,

  studio: "Wally Heider Studios",

  producer: "Grateful Dead and Stephen Barncard",
};

const oneFromTheVault: LiveAlbum = {
  title: "One from the Vault",

  artist: "Grateful Dead",

  releaseYear: 1991,

  concertVenue: "Great American Music Hall",

  concertDate: new Date("1975-08-13"),
};
```

Just as adding additional `&` operators add to an intersection, it's also possible for an interface to extend multiple other interfaces by separating them with commas:

```tsx
interface BoxSet extends StudioAlbum, LiveAlbum {
  numberOfDiscs: number;
}
```

### Types vs Interfaces

We've now seen two ways of extending objects in TypeScript: one using `type` and one using `interface`.

_So, what's the difference?_

A `type` can represent anything– union types, objects, intersection types, and more.

On the other hand, an `interface` primarily represents object types, though it can also be used to define function types. Interfaces are particularly important given the significance of object types in TypeScript and the broader context of JavaScript.

Generally speaking, it doesn't matter too much if you use `type` or `interface` in your code, though you will learn benefits and drawbacks of each as you continue to work with TypeScript.

### Intersections vs Interfaces

For the topic at hand, when it comes to extending objects you'll get better performance from using `interface extends`.

By using `interface extends`, TypeScript can cache interfaces based on their names. This effectively creates a reference for future use. It's also more expressive when reading the code, as it's clear that one interface is extending another.

In contrast, using `&` requires TypeScript to compute the intersection almost every time it's used. This is largely due to the potentially complex nature of intersections.

The debate between `type` vs `interface` will continue to arise in the TypeScript community, but when extending objects, using interfaces and the `extends` keyword is the way to go.

### Interface Declaration Merging

In addition to being able to `extend` interfaces, TypeScript also allows for interfaces to be declared more than once. When an interface is declared multiple times, TypeScript automatically merges the declarations into a single interface. This is known as interface declaration merging.

Here's an example of an `Album` interface with properties for the `title` and `artist`:

```typescript
interface Album {
  title: string;

  artist: string;
}
```

Suppose that as the application evolves, you want to add more details to the album's metadata, such as the release year and genre. With declaration merging, you can simply declare the `Album` interface again with the new properties:

```typescript
interface Album {
  releaseYear: number;

  genres: string[];
}
```

Behind the scenes, TypeScript automatically merges these two declarations into a single interface that includes all of the properties from both declarations:

```typescript
interface Album {
  title: string;

  artist: string;

  releaseYear: number;

  genres: string[];
}
```

This is a different behavior than in JavaScript, which would cause an error if you tried to redeclare an object in the same scope. You would also get an error in TypeScript if you tried to redeclare a type with the `type` keyword.

However, when using `interface` to declare a type, additional declarations are merged which may or may not be what you want.

This might give you pause about using `interface` instead of `type` by default.

There will be more advanced examples of interface declaration merging in the future, but for now, it's important to know that TypeScript automatically merges interfaces when they're declared multiple times.

### Exercises

#### Exercise 1: Create an Intersection Type

Here we have a `User` type and a `Product` type, both with some common properties like `id` and `createdAt`:

```tsx
type User = {
  id: string;

  createdAt: Date;

  name: string;

  email: string;
};

type Product = {
  id: string;

  createdAt: Date;

  name: string;

  price: number;
};
```

Your task is to create an intersection by refactoring the `User` and `Product` types such that they rely on the same `BaseEntity` type with properties `id` and `createdAt`.

#### Exercise 2: Extending Interfaces

After the previous exercise, you'll have a `BaseEntity` type along with `User` and `Product` types that intersect with it.

This time, your task is to refactor the types to be interfaces, and use the `extends` keyword to extend the `BaseEntity` type. For extra credit, try creating and extending multiple smaller interfaces.

#### Solution 1: Create an Intersection Type

To solve this challenge, we'll create a new `BaseEntity` type with the common properties:

```typescript
type BaseEntity = {
  id: string;

  createdAt: Date;
};
```

Once the `BaseEntity` type is created, we can use it to create the `User` and `Product` types that intersect it:

```typescript
type User = {
  name: string;

  email: string;
} & BaseEntity;

type Product = {
  name: string;

  price: number;
} & BaseEntity;
```

Now `User` and `Product` have exactly the same behavior that they did before, but with less duplication.

#### Solution 2: Extending Interfaces

Instead of using the `type` keyword, the `BaseEntity`, `User`, and `Product`, can be declared as interfaces. Remember, interfaces do not use an equals sign like `type` does:

```typescript
interface BaseEntity {
  id: string;

  createdAt: Date;
}

interface User {
  name: string;

  email: string;
}

interface Product {
  name: string;

  price: number;
}
```

Once the interfaces are created, we can use the `extends` keyword to extend the `BaseEntity` interface:

```typescript
interface User extends BaseEntity {
  name: string;

  email: string;
}

interface Product extends BaseEntity {
  name: string;

  price: number;
}
```

As eluded to by the extra credit, we can take this further by creating `WithId` and `WithCreatedAt` interfaces that represent objects with an `id` and `createdAt` property. Then, we can have `User` and `Product` extend from these interfaces by adding commas:

```typescript
interface WithId {
  id: string;
}

interface WithCreatedAt {
  createdAt: Date;
}

interface User extends WithId, WithCreatedAt {
  name: string;

  email: string;
}

interface Product extends WithId, WithCreatedAt {
  name: string;

  price: number;
}
```

Here, `User` represents an object with an `id`, `createdAt`, `name`, and `email` while `Product` represents an object with an `id`, `createdAt`, `name`, and `price`.

## Dynamic Object Keys

When using objects, it's common that we won't always know the exact keys that will be used.

In JavaScript, we can start with an empty object and add keys and values to it as we go:

```tsx
// JavaScript Example
const albumAwards = {};

albumAwards.Grammy = true;
albumAwards.MercuryPrize = false;
albumAwards.Billboard = true;
```

However, when we try to add keys to an empty prototype object in TypeScript, we'll get errors:

```tsx
// TypeScript Example
const albumAwards = {};

albumAwards.Grammy = true; // red squiggly line under Grammy
albumAwards.MercuryPrize = false; // red squiggly line under MercuryPrize
albumAwards.Billboard = true; // red squiggly line under Billboard

// hovering over Grammy shows:
Property 'Grammy' does not exist on type '{}'.
```

TypeScript is protecting us from adding keys to an object that doesn't have them defined.

We need to tell TypeScript that we want to be able to dynamically add keys. Let's look at some ways to do this.

### Index Signatures for Dynamic Keys

Index signatures are one way to specify we want to be able to add any key and value to an object. The syntax uses square brackets, just like we would if we were adding a dynamic key to an object literal.

Here's how we would specify an inline index signature for the `albumAwards` object literal. We'll call the key `award` as a string, and specify it should have a boolean value to match the example above:

```tsx
const albumAwards: {
  [award: string]: boolean;
} = {};
```

Note that with the inline index signature above, the values must always be a boolean. The `award` keys we add can't use a string or any other type.

The same syntax can also be used with types and interfaces:

```tsx
interface AlbumAwards {
  [award: string]: boolean;
}

const beyonceAwards: AlbumAwards = {
  Grammy: true,
  Billboard: true,
};
```

Index signatures are one way to handle dynamic keys, but there's a more readable way to do this with a type we've seen before.

### Using a Record Type for Dynamic Keys

The `Record` utility type is the preferred option for supporting dynamic keys. This type allows us to use any string, number, or symbol as a key, and supports any type for the value.

Here's how we would use `Record` for the `albumAwards` object, where the key will be a string and the value will be a boolean:

```tsx
const albumAwards: Record<string, boolean> = {};

albumAwards.Grammy = true;
```

The `Record` type helper is a repeatable pattern that's easy to read and understand. It's also an abstraction, which is generally preferred over using the lower-level index signature syntax. However, both options are valid and can even be used together.

### Combining Known and Dynamic Keys

In many cases there will be a base set of keys we know we want to include, but we also want to allow for additional keys to be added dynamically.

For example, say we are working with a base set of awards we know were nominations, but we don't know what other awards are in play. We can use the `Record` type to define a base set of awards and then use an intersection to extend it with an index signature for additional awards:

```typescript
type BaseAwards = "Grammy" | "MercuryPrize" | "Billboard";

type ExtendedAlbumAwards = Record<BaseAwards, boolean> & {
  [award: string]: boolean;
};

const extendedNominations: ExtendedAlbumAwards = {
  Grammy: true,
  MercuryPrize: false,
  Billboard: true, // Additional awards can be dynamically added
  "American Music Awards": true,
};
```

This technique would also work when using an interface and the `extends` keyword.

Being able to support both default and dynamic keys in our data structures allows us quite a bit of flexibility to adapt to changing requirements in your applications.

### Exercises

#### Exercise 1: Use an Index Signature for Dynamic Keys

Here we have an object called `scores`, and we are trying to assign several different properties to it:

```tsx
const scores = {};

scores.math = 95; // red squiggly line under math
scores.english = 90; // red squiggly line under english
scores.science = 85; // red squiggly line under science
```

Your task is to update `scores` to support the dynamic subject keys three ways: an inline index signature, a type, an interface, and a `Record`.

#### Exercise 2: Default Properties with Dynamic Keys

Here we have a `scores` object with default properties for `math` and `english`:

```tsx
interface Scores {}

// @ts-expect-error science is missing! // red squiggly line under @ts-expect-error
const scores: Scores = {
  math: 95,
  english: 90,
};
```

Here the `@ts-expect-error` directive is saying that we expect there to be an error because `science` is missing. However, there isn't actually an error with `scores` so instead TypeScript gives us an error below the directive.

Your task is to update the `Scores` interface to specify default keys for `math`, `english`, and `science` while allowing for any other subject to be added. Once you've updated the type correctly, the red squiggly line below `@ts-expect-error` will go away because `science` will be required but missing. For extra practice, create a `RequiredScores` interface that can be extended.

#### Exercise 3: Restricting Object Keys

Here we have a `configurations` object, typed as `Configurations` which is currently unknown.

The object holds keys for `development`, `production`, and `staging`, and each respective key is associated with configuration details such as `apiBaseUrl` and `timeout`.

There is also a `notAllowed` key, which is decorated with a `@ts-expect-error` comment. This is because, like the name says, the `notAllowed` key should not be allowed. However, there is an error below the directive because `notAllowed` is currently being allowed because of `Configuration`'s `unknown` type.

```typescript
type Environment = "development" | "production" | "staging";

type Configurations = unknown;

const configurations: Configurations = {
  development: {
    apiBaseUrl: "http://localhost:8080",
    timeout: 5000,
  },
  production: {
    apiBaseUrl: "https://api.example.com",
    timeout: 10000,
  },
  staging: {
    apiBaseUrl: "https://staging.example.com",
    timeout: 8000,
  },
  // @ts-expect-error   // red squiggly line under @ts-expect-error
  notAllowed: {
    apiBaseUrl: "https://staging.example.com",
    timeout: 8000,
  },
};
```

Update the `Configurations` type to be a Record that specifies the keys from `Environment`, while ensuring the `notAllowed` key is still not be allowed.

#### Solution 1: Use an Index Signature for Dynamic Keys

Inline index signature:

```typescript
const scores: {
  [key: string]: number;
} = {};
```

Interface:

```typescript
interface Scores {
  [key: string]: number;
}
```

Record:

```typescript
const scores: Record<string, number> = {};
```

#### Solution 2: Default Properties with Dynamic Keys

Here's how to add an index signature to the `Scores` interface to support dynamic keys along with the required keys:

```typescript
interface Scores {
  [subject: string]: number;
  math: number;
  english: number;
  science: number;
}
```

Creating a `RequiredScores` interface and extending it looks like this:

```typescript
interface RequiredScores {
  math: number;
  english: number;
  science: number;
}

interface Scores extends RequiredScores {
  [key: string]: number;
}
```

#### Solution 3: Restricting Object Keys

We know that the values of the `Configurations` object will be `apiBaseUrl`, which is a string, and `timeout`, which is a number.
These key-value pairs are added to the `Configurations` type like so:

```typescript
type Environment = "development" | "production" | "staging";

type Configurations = {
  apiBaseUrl: string;
  timeout: number;
};
```

##### A Failed First Attempt at Using Record

It may be tempting to use a Record to set the key as a string and the value an object with the properties `apiBaseUrl` and `timeout`:

```typescript
type Configurations = Record<
  string,
  {
    apiBaseUrl: string;
    timeout: number;
  }
>;
```

However, having the key as `string` still allows for the `notAllowed` key to be added to the object. We need to make the keys dependent on the `Environment` type.

##### The Correct Approach

Instead, we can specify the `key` as `Environment` inside the Record:

```typescript
type Configurations = Record<
  Environment,
  {
    apiBaseUrl: string;
    timeout: number;
  }
>;
```

Now TypeScript will throw an error when the object includes a key that doesn't exist in `Environment`, like `notAllowed`.

## Utility Types for Object Manipulation

TypeScript offers a variety of built-in types for you to use when working with objects. Whether you need to transform an existing object type or create a new type based on an existing one, there's likely a utility type that can help with that.

### `Partial`

We've seen how to use the question mark operator `?` to make properties optional in TypeScript. However, when dealing with an object type where every key is optional it gets a bit annoying to have to write (and read) the `?` over and over again.

The Partial utility type allows you to quickly transform all of the properties of a given type into optional properties.

Consider an Album interface that contains detailed information about an album:

```typescript
interface Album {
  id: number;
  title: string;
  artist: string;
  releaseYear: number;
  genre: string;
}
```

When we want to update an album's information, we might not have all the information at once. For example, it can be difficult to decide what genre to assign to an album before it's released.

Using the `Partial` utility type and passing in `Album`, we can create a type that allows us to update any subset of an album's properties:

```typescript
type PartialAlbum = Partial<Album>;
```

Now we have a `PartialAlbum` type where `id`, `title`, `artist`, `releaseYear`, and `genre` are all optional.

This means we can create an album with only some of the properties of `Album`:

```typescript
const geogaddi: PartialAlbum = {
  title: "Geogaddi",
  artist: "Boards of Canada",
};
```

### `Required`

On the opposite side of `Partial` is the `Required` type, which makes sure all of the properties of a given type are required– even those that started as optional.

This `Album` interface has the `releaseYear` and `genre` properties marked as optional:

```typescript
interface Album {
  title: string;
  artist: string;
  releaseYear?: number;
  genre?: string;
}
```

We can use the `Required` utility type to create a new `RequiredAlbum` type:

```typescript
type RequiredAlbum = Required<Album>;
```

With `RequiredAlbum`, all of the original `Album` properties become required, and omitting any of them would result in an error:

```typescript
const doubleCup: RequiredAlbum = {
  title: "Double Cup",
  artist: "DJ Rashad",
  releaseYear: 2013,
  genre: "Juke",
};
```

#### Required with Nested Properties

An important thing to note is that `Required` only works one level deep. For example, if the `Album`'s `genre` contained nested properties, `Required<Album>` would not make the children required:

```tsx
type Album = {
  title: string;
  artist: string;
  releaseYear?: number;
  genre?: {
    parentGenre?: string;
    subGenre?: string;
  };
};

type RequiredAlbum = Required<Album>;
// hovering over RequiredAlbum shows:
type RequiredAlbum = {
  title: string;
  artist: string;
  releaseYear: number;
  genre: {
    parentGenre?: string;
    subGenre?: string;
  };
};
```

If you find yourself in a situation where you need a deeply Required type, check out the type-fest library by Sindre Sorhus.

### `PropertyKey`

The `PropertyKey` type is a global type that represents the set of all possible keys that can be used on an object, including string, number, and symbol. You can find its type definition inside of TypeScript's ES5 type definitions file:

```tsx
// inside lib.es5.d.ts
declare type PropertyKey = string | number | symbol;
```

Because `PropertyKey` works with all possible keys, it's great for working with dynamic keys where you aren't sure what the type of the key will be.

For example, when using an index signature you could set the key type to `PropertyKey` in order to allow for any valid key type:

```tsx
type Album = {
  [key: PropertyKey]: string;
};
```

The `PropertyKey` type is used behind the scenes of several TypeScript features

### `Pick`

The Pick utility type allows you to create a new type by selecting a subset of properties from an existing type. This type helper allows you to keep a main type as the source of truth while creating subtypes that contain only what you need.

For example, say we want to create a new type that only includes the `title` and `artist` properties from the `Album` type:

```typescript
type BasicAlbum = Pick<Album, "title" | "artist">;
```

An important thing to note is that Pick doesn't work well with union types, so it's best to stick with object types when using it.

Despite this limitation, Pick is a great way to ensure you're only working with the data you need.

### `Omit`

The Omit helper type is kind of like the opposite of Pick. It allows you to create a new type by excluding a subset of properties from an existing type.

For example, we could use Omit to create the same `BasicAlbum` type we created with Pick, but this time by excluding the `id`, `releaseYear` and `genre` properties:

```tsx
type BasicAlbum = Omit<Album, "id" | "releaseYear" | "genre">;
```

On the surface, using Omit is straightforward, but there are a couple of quirks to be aware of.

#### Omit is Loose

When using Omit, you are able to exclude properties that don't exist on an object.

For example, creating an `AlbumWithoutProducer` type with our `Album` type would not result in an error, even though `producer` doesn't exist on `Album`:

```typescript
type AlbumWithoutProducer = Omit<Album, "producer">;
```

If we tried to create an `AlbumWithOnlyProducer` type using Pick, we would get an error because `producer` doesn't exist on `Album`:

```tsx
type AlbumWithOnlyProducer = Pick<Album, "producer">; // red squiggly line under "producer"

// hovering over producer shows:
Type '"producer"' does not satisfy the constraint 'keyof Album'.
```

Why do these two seemingly related utility types behave differently?

When the TypeScript team was originally implementing Omit, they were faced with a decision to create a strict or loose version of Omit. The strict version would only permit the omission of valid keys (`id`, `title`, `artist`, `releaseYear`, `genre`), whereas the loose version wouldn't have this constraint

At the time, it was a more popular idea in the community to implement a loose version, so that's the one they went with. Given that global types in TypeScript are globally available and don't require an import statement, the looser version is seen as a safer choice, as it is more compatible and less likely to cause unforeseen errors.

However, having this loose implementation of Omit doesn't allow for autocompletion. You won't get any suggestions when you start typing the properties you want to omit, so anything is fair game.

While it is possible to create a strict version of Omit, the loose version should be sufficient for most cases. Just keep an eye out, since it may error in ways you don't expect.

For more insights into the decisions behind Omit, refer to the TypeScript team's original [discussion](https://github.com/microsoft/TypeScript/issues/30455) and [pull request](https://github.com/microsoft/TypeScript/pull/30552) adding `Omit`, and their [final note](https://github.com/microsoft/TypeScript/issues/30825#issuecomment-523668235) on the topic.

#### Omit Doesn't Distribute

Earlier it was mentioned that Pick doesn't work well with union types. Omit has a similar issue that we'll look at now.

Consider a scenario where we have three interface types for `Album`, `CollectorEdition`, and `DigitalRelease`:

```tsx
type Album = {
  id: string;
  title: string;
  genre: string;
  coverImageId: string;
};

type CollectorEdition = {
  id: string;
  title: string;
  limitedEditionFeatures: string[];
  coverImageId: string;
};

type DigitalRelease = {
  id: string;
  title: string;
  digitalFormat: string;
  coverImageId: string;
};
```

These types share common properties such as `id`, `title`, and `coverImageId`, but each also has unique attributes. The `Album` type includes `genre`, the `CollectorEdition` includes `limitedEditionFeatures`, and `DigitalRelease` has `digitalFormat`:

After creating a `MusicProduct` type that is a union of these three types, say we want to create a `MusicProductWithoutId` type, mirroring the structure of `MusicProduct` but excluding the `id` field:

```tsx
type MusicProduct = Album | CollectorEdition | DigitalRelease;

type MusicProductWithoutId = Omit<MusicProduct, "id">;
```

You might assume that `MusicProductWithoutId` would be a union of the three types minus the `id` field. However, what we get instead is a simplified object type containing only the `title` and `coverImageId`– the other properties that were shared across all types, without `id`.

```tsx
// hovering over MusicProductWithoutId shows:
type MusicProductWithoutId = {
  title: string;
  coverImageId: string;
};
```

This unexpected outcome stems from how Omit processes union types. Rather than iterating over each union member, it amalgamates them into a single structure it can understand.

##### The `DistributiveOmit` Type

In order to address this, we can create a `DistributiveOmit` type. It's defined similarly to Omit but operates individually on each union member. Note the inclusion of `PropertyKey` in the type definition to allow for any valid key type:

```tsx
type DistributiveOmit<T, K extends PropertyKey> = T extends any
  ? Omit<T, K>
  : never;
```

When we apply `DistributiveOmit` to our `MusicProduct` type, we get the anticipated result: a union of `Album`, `CollectorEdition`, and `DigitalRelease` with the `id` field omitted:

```tsx
type MusicProductWithoutId = DistributiveOmit<MusicProduct, "id">;

// Hovering over MusicProductWithoutId shows:
type MusicProductWithoutId =
  | Omit<Album, "id">
  | Omit<CollectorEdition, "id">
  | Omit<DigitalRelease, "id">;
```

Structurally, this is the same as:

```tsx
type MusicProductWithoutId =
  | {
      title: string;
      genre: string;
      coverImageId: string;
    }
  | {
      title: string;
      limitedEditionFeatures: string[];
      coverImageId: string;
    }
  | {
      title: string;
      digitalFormat: string;
      coverImageId: string;
    };
```

In situations where you need to use Omit with union types, using a distributive version will give you a much more predictable result.

For practice, try creating a `DistributivePick` type based on the original type definition of `Pick`.

### Exercises

#### Exercise 1: Expecting Certain Properties

In this exercise, we have a `fetchUser` function that uses `fetch` to access an endpoint named `APIUser` and it return a `Promise<User>`:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const fetchUser = async (): Promise<User> => {
  const response = await fetch("/api/user");
  const user = await response.json();
  return user;
};

const example = async () => {
  const user = await fetchUser();

  type test = Expect<Equal<typeof user, { name: string; email: string }>>; // red squiggly line under Equal<>
};
```

Since we're in an asynchronous function, we do want to use a `Promise`, but there's a problem with this `User` type.

In the `example` function that calls `fetchUser`, we're only expecting to receive the `name` and `email` fields. These fields are only part of what exists in the `User` interface.

Your task is to update the typing so that only the `name` and `email` fields are expected to be returned from `fetchUser`.

You can use the helper types we've looked at to accomplish this, but for extra practice try using just interfaces.

#### Exercise 2: Dynamic Key Support

Consider this `hasKey` function that accepts an object and a key, then calls `object.hasOwnProperty` on that object:

```typescript
const hasKey = (obj: object, key: string) => {
  return obj.hasOwnProperty(key);
};
```

There are several test cases for this function:

The first test case checks that it works on string keys, which doesn't present any issues. As anticipated, `hasKey(obj, "foo")` would return true and `hasKey(obj, "bar")` would return false:

```typescript
it("Should work on string keys", () => {
  const obj = {
    foo: "bar",
  };

  expect(hasKey(obj, "foo")).toBe(true);
  expect(hasKey(obj, "bar")).toBe(false);
});
```

A test case that checks for numeric keys does have issues because the function is expecting a string key:

```typescript
it("Should work on number keys", () => {
  const obj = {
    1: "bar",
  };

  expect(hasKey(obj, 1)).toBe(true); // red squiggly line under 1
  expect(hasKey(obj, 2)).toBe(false); // red squiggly line under 2
});
```

Because an object can also have a symbol as a key, there is also a test for that case. It currently has type errors for `fooSymbol` and `barSymbol` when calling `hasKey`:

```typescript
it("Should work on symbol keys", () => {
  const fooSymbol = Symbol("foo");
  const barSymbol = Symbol("bar");

  const obj = {
    [fooSymbol]: "bar",
  };

  expect(hasKey(obj, fooSymbol)).toBe(true); // red squiggly line under fooSymbol
  expect(hasKey(obj, barSymbol)).toBe(false); // red squiggly line under barSymbol
});
```

Your task is to update the `hasKey` function so that all of these tests pass. Try to be as concise as possible!

#### Exercise 3: Updating a Product

Here we have a function `updateProduct` that takes two arguments: an `id`, and a `productInfo` object derived from the `Product` type, excluding the `id` field.

```tsx
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

const updateProduct = (id: number, productInfo: Omit<Product, "id">) => {
  // Do something with the productInfo
};
```

The twist here is that during a product update, we might not want to modify all of its properties at the same time. Because of this, not all properties have to be passed into the function.

This means we have several different test scenarios. For example, update just the name, just the price, or just the description. Combinations like updating the name and the price or the name and the description are also tested.

```tsx
updateProduct(1, {
  // red squiggly line under the entire object
  name: "Book",
});

updateProduct(1, {
  // red squiggly line under the entire object
  price: 12.99,
});

updateProduct(1, {
  // red squiggly line under the entire object
  description: "A book about Dragons",
});

updateProduct(1, {
  // red squiggly line under the entire object
  name: "Book",
  price: 12.99,
});

updateProduct(1, {
  // red squiggly line under the entire object
  name: "Book",
  description: "A book about Dragons",
});
```

Your challenge is to modify the `ProductInfo` type to reflect these requirements. The `id` should remain absent from `ProductInfo`, but we also want all other properties in `ProductInfo` to be optional.

#### Solution 1: Expecting Certain Properties

There are quite a few ways to solve this problem. Here are a few examples:

##### Using Pick

Using the Pick utility type, we can create a new type that only includes the `name` and `email` properties from the `User` interface:

```typescript
type PickedUser = Pick<User, "name" | "email">;
```

Then the `fetchUser` function can be updated to return a `Promise` of `PickedUser`:

```typescript
const fetchUser = async (): Promise<PickedUser> => {
  ...
```

##### Using Omit

The Omit utility type can also be used to create a new type that excludes the `id` and `role` properties from the `User` interface:

```typescript
type OmittedUser = Omit<User, "id" | "role">;
```

Then the `fetchUser` function can be updated to return a `Promise` of `OmittedUser`:

```typescript
const fetchUser = async (): Promise<OmittedUser> => {
  ...
```

##### Extending an Interface

We could create an interface `NameAndEmail` that contains a `name` and `email` property, along with updating the `User` interface to remove those properties in favor of extending them:

```tsx
interface NameAndEmail {
  name: string;
  email: string;
}

interface User extends NameAndEmail {
  id: string;
  role: string;
}
```

Then the `fetchUser` function could return a `Promise` of `NameAndEmail`:

```tsx
const fetchUser = async (): Promise<NameAndEmail> => {
  ...
```

#### Solution 2: Dynamic Key Support

The obvious answer is to change the `key`'s type to `string | number | symbol`:

```typescript
const hasKey = (obj: object, key: string | number | symbol) => {
  return obj.hasOwnProperty(key);
};
```

However, there's a much more succinct solution.

Hovering over `hasOwnProperty` shows us the type definition:

```typescript
(method) Object.hasOwnProperty(v: PropertyKey): boolean
```

Recall that the `PropertyKey` type represents every possible value a key can have. This means we can use it as the type for the key parameter:

```typescript
const hasKey = (obj: object, key: PropertyKey) => {
  return obj.hasOwnProperty(key);
};
```

#### Solution 3: Updating a Product

Using the `Partial` type helper is a good fit in this scenario.

In this case, wrapping `Ommit<Product, "id">` in `Partial` will remove the `id` while making all of the remaining properties optional:

```typescript
const updateProduct = (
  id: number,
  productInfo: Partial<Omit<Product, "id">>,
) => {
  // Do something with the productInfo
};
```
