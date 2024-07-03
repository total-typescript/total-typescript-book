So far, we've looked at object types only in the context of 'object literals', defined using `{}` with type aliases.

But TypeScript has many tools available that let you be more expressive with object types. You can model inheritance, create new object types from existing ones, and use dynamic keys.

## Extending Objects

Let's start our investigation by looking at how to build object types from _other object types_ in TypeScript.

### Intersection Types

An intersection type lets us combine multiple object types into a single type. It uses the `&` operator. You can think of it like the reverse of the `|` operator. Instead of representing an "or" relationship between types, the `&` operator signifies an "and" relationship.

Using the intersection operator `&` combines multiple separate types into a single type.

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

```typescript
const wishYouWereHereSales: AlbumSales = {
  title: "Wish You Were Here",
  artist: "Pink Floyd",
  releaseYear: 1975
  unitsSold: 13000000,
  revenue: 65000000,
};
```

If the contract of the `AlbumSales` type isn't fulfilled when creating a new object, TypeScript will raise an error.

It's also possible to intersect more than two types:

```typescript
type AlbumSales = Album & SalesData & { genre: string };
```

This is a useful method for creating new types from existing ones.

#### Intersection Types With Primitives

It's worth noting that intersection types can also be used with primitives, like `string` and `number` - though it often produces odd results.

For instance, let's try intersecting `string` and `number`:

```typescript
type StringAndNumber = string & number;
```

What type do you think `StringAndNumber` is? It's actually `never`. This is because `string` and `number` have innate properties that can't be combined together.

This also happens when you intersect two object types with an incompatible property:

```ts twoslash
type User1 = {
  age: number;
};

type User2 = {
  age: string;
};

type User = User1 & User2;
//   ^?
```

In this case, the `age` property resolves to `never` because it's impossible for a single property to be both a `number` and a `string`.

### Interfaces

So far, we've been only using the `type` keyword to define object types. Experienced TypeScript programmers will likely be tearing their hair out thinking "Why aren't we talking about interfaces?!".

Interfaces are one of TypeScript's most famous features. They shipped with the very first versions of TypeScript and are considered a core part of the language.

Interfaces let you declare object types using a slightly different syntax to `type`. Let's compare the syntax:

```typescript
type Album = {
  title: string;
  artist: string;
  releaseYear: number;
};

interface Album {
  title: string;
  artist: string;
  releaseYear: number;
}
```

They're largely identical, except for the keyword and an equals sign. But it's a common mistake to think of them as interchangeable. They're not.

They have quite different capabilities, which we'll explore in this section.

### `interface extends`

One of `interface`'s most powerful features is its ability to extend other interfaces. This allows you to create new interfaces that inherit properties from existing ones.

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

```typescript
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

```typescript
interface BoxSet extends StudioAlbum, LiveAlbum {
  numberOfDiscs: number;
}
```

### Intersections vs `interface extends`

We've now covered two separate TypeScript syntaxes for extending object types: `&` and `interface extends`. So, which is better?

You should choose `interface extends` for two reasons.

#### Better Errors When Merging Incompatible Types

We saw earlier that when you intersect two object types with an incompatible property, TypeScript will resolve the property to `never`:

```typescript
type User1 = {
  age: number;
};

type User2 = {
  age: string;
};

type User = User1 & User2;
```

When using `interface extends`, TypeScript will raise an error when you try to extend an interface with an incompatible property:

```ts twoslash
// @errors: 2430
interface User1 {
  age: number;
}

interface User extends User1 {
  age: string;
}
```

This is very different because it actually sources an error. With intersections, TypeScript will only raise an error when you try to access the `age` property, not when you define it.

So, `interface extends` is better for catching errors when building out your types.

#### Better TypeScript Performance

When you're working in TypeScript, the performance of your types should be at the back of your mind. In large projects, how you define your types can have a big impact on how fast your IDE feels, and how long it takes for `tsc` to check your code.

`interface extends` is much better for TypeScript performance than intersections. With intersections, the intersection is recomputed every time it's used. This can be slow, especially when you're working with complex types.

Interfaces are faster. TypeScript can cache the resulting type of an interface based on its name. So if you use `interface extends`, TypeScript only has to compute the type once, and then it can reused it every time you use the interface.

#### Conclusion

`interface extends` is better for catching errors and for TypeScript performance. This doesn't mean you need to define all your object types using `interface` - we'll get to that later. But if you need to make one object type extend another, you should use `interface extends` where possible.

### Types vs Interfaces

Now we know how good `interface extends` is for extending object types, a natural question arises. Should we use `interface` for all our types by default?

Let's look at a few comparison points between types and interfaces.

#### Types Can be Anything

Type aliases are a lot more flexible than interfaces. A `type` can represent anything – union types, object types, intersection types, and more.

```typescript
type Union = string | number;
```

When we declare a type alias, we're just giving a name (or alias) to an existing type.

On the other hand, an `interface` can only represent object types (and functions, which we'll look at much later).

#### Declaration Merging

Interfaces in TypeScript have an odd property. When multiple interfaces with the same name in the same scope are created, TypeScript automatically merges them. This is known as declaration merging.

Here's an example of an `Album` interface with properties for the `title` and `artist`:

```typescript
interface Album {
  title: string;
  artist: string;
}
```

But let's imagine that, in the same file, you accidentally declare another `Album` interface with properties for the `releaseYear` and `genres`:

```typescript
interface Album {
  title: string;
  artist: string;
}

interface Album {
  releaseYear: number;
  genres: string[];
}
```

TypeScript automatically merges these two declarations into a single interface that includes all of the properties from both declarations:

```typescript
// Under the hood:
interface Album {
  title: string;
  artist: string;
  releaseYear: number;
  genres: string[];
}
```

This is very different from `type`, which would give you an error if you tried to declare the same type twice:

```ts twoslash
// @errors: 2300
type Album = {
  title: string;
  artist: string;
};

type Album = {
  releaseYear: number;
  genres: string[];
};
```

Coming from a JavaScript point of view, this behavior of interfaces feels pretty weird. I have lost hours of my life to having two interfaces with the same name in the same 2,000+ line file. It's there for a good reason - that we'll explore in a later chapter - but it's a bit of a gotcha.

Declaration merging, and its somewhat unexpected behavior, makes me a little wary of using interfaces.

#### Conclusion

So, should you use `type` or `interface` for declaring simple object types?

I tend to default to `type` unless I need to use `interface extends`. This is because `type` is more flexible and doesn't declaration merge unexpectedly.

But, it's a close call. I wouldn't blame you for going the opposite way. Many folks coming from a more object-oriented background will prefer `interface` because it's more familiar to them from other languages.

### Exercises

#### Exercise 1: Create an Intersection Type

Here we have a `User` type and a `Product` type, both with some common properties like `id` and `createdAt`:

```typescript
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

Your task is to create a new `BaseEntity` type that includes the `id` and `createdAt` properties. Then, use the `&` operator to create `User` and `Product` types that intersect with `BaseEntity`.

<Exercise title="Exercise 1: Create an Intersection Type" filePath="/src/020-objects/081-extend-object-using-intersections.problem.ts"></Exercise>

#### Exercise 2: Extending Interfaces

After the previous exercise, you'll have a `BaseEntity` type along with `User` and `Product` types that intersect with it.

This time, your task is to refactor the types to be interfaces, and use the `extends` keyword to extend the `BaseEntity` type. For extra credit, try creating and extending multiple smaller interfaces.

<Exercise title="Exercise 2: Extending Interfaces" filePath="/src/020-objects/082-extend-object-using-interfaces.problem.ts"></Exercise>

#### Solution 1: Create an Intersection Type

To solve this challenge, we'll create a new `BaseEntity` type with the common properties:

```typescript
type BaseEntity = {
  id: string;
  createdAt: Date;
};
```

Once the `BaseEntity` type is created, we can intersect it with the `User` and `Product` types:

```typescript
type User = {
  id: string;
  createdAt: Date;
  name: string;
  email: string;
} & BaseEntity;

type Product = {
  id: string;
  createdAt: Date;
  name: string;
  price: number;
} & BaseEntity;
```

Then, we can remove the common properties from `User` and `Product`:

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

Now `User` and `Product` have exactly the same behavior that they did before, but with less duplicated code.

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

For the extra credit, we can take this further by creating `WithId` and `WithCreatedAt` interfaces that represent objects with an `id` and `createdAt` property. Then, we can have `User` and `Product` extend from these interfaces by adding commas:

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

We've now refactored our intersections to use `interface extends` - our TypeScript compiler will thank us.

## Dynamic Object Keys

When using objects, it's common that we won't always know the exact keys that will be used.

In JavaScript, we can start with an empty object and add keys and values to it dynamically:

```typescript
// JavaScript Example
const albumAwards = {};

albumAwards.Grammy = true;
albumAwards.MercuryPrize = false;
albumAwards.Billboard = true;
```

However, when we try to add keys dynamically to an object in TypeScript, we'll get errors:

```ts twoslash
// @errors: 2339
// TypeScript Example
const albumAwards = {};

albumAwards.Grammy = true;
albumAwards.MercuryPrize = false;
albumAwards.Billboard = true;
```

This can feel unhelpful. You might think that TypeScript, based on its ability to narrow our code, should be able to figure out that we're adding keys to an object.

In this case, TypeScript prefers to be conservative. It's not going to let you add keys to an object that it doesn't know about. This is because TypeScript is trying to prevent you from making a mistake.

We need to tell TypeScript that we want to be able to dynamically add keys. Let's look at some ways to do this.

### Index Signatures for Dynamic Keys

Let's take another look at the code above.

```ts twoslash
// @errors: 2339
const albumAwards = {};

albumAwards.Grammy = true;
```

The technical term for what we're doing here is 'indexing'. We're indexing into `albumAwards` with a string key, `Grammy`, and assigning it a value.

To support this behavior, we want to tell TypeScript that whenever we try to index into `albumAwards` with a string, we should expect a boolean value.

To do that, we can use an 'index signature'.

Here's how we would specify an index signature for the `albumAwards` object.

```typescript
const albumAwards: {
  [index: string]: boolean;
} = {};

albumAwards.Grammy = true;
albumAwards.MercuryPrize = false;
albumAwards.Billboard = true;
```

The `[index: string]: boolean` syntax is an index signature. It tells TypeScript that `albumAwards` can have any string key, and the value will always be a boolean.

We can choose any name for the `index`. It's just a description.

```typescript
const albumAwards: {
  [iCanBeAnything: string]: boolean;
} = {};
```

The same syntax can also be used with types and interfaces:

```typescript
interface AlbumAwards {
  [index: string]: boolean;
}

const beyonceAwards: AlbumAwards = {
  Grammy: true,
  Billboard: true,
};
```

Index signatures are one way to handle dynamic keys. But there's a utility type that some argue is even better.

### Using a Record Type for Dynamic Keys

The `Record` utility type is another option for supporting dynamic keys.

Here's how we would use `Record` for the `albumAwards` object, where the key will be a string and the value will be a boolean:

```typescript
const albumAwards: Record<string, boolean> = {};

albumAwards.Grammy = true;
```

The first type argument is the key, and the second type argument is the value. This is a more concise way to achieve a similar result as an index signature.

`Record` can also support a union type as keys, but an index signature can't:

```ts twoslash
// @errors: 1337
const albumAwards1: Record<"Grammy" | "MercuryPrize" | "Billboard", boolean> = {
  Grammy: true,
  MercuryPrize: false,
  Billboard: true,
};

const albumAwards2: {
  [index: "Grammy" | "MercuryPrize" | "Billboard"]: boolean;
} = {
  Grammy: true,
  MercuryPrize: false,
  Billboard: true,
};
```

Index signatures can't use literal types, but `Record` can. We'll look at why this is when we explore mapped types in a later chapter.

The `Record` type helper is a repeatable pattern that's easy to read and understand, and is a bit more flexible than an index signature. It's my go-to for dynamic keys.

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

This technique would also work when using an interface and the `extends` keyword:

```typescript
interface BaseAwards {
  Grammy: boolean;
  MercuryPrize: boolean;
  Billboard: boolean;
}

interface ExtendedAlbumAwards extends BaseAwards {
  [award: string]: boolean;
}
```

This version is preferable because, in general, `interface extends` is preferable to intersections.

Being able to support both default and dynamic keys in our data structures allows a lot of flexibility to adapt to changing requirements in your applications.

### `PropertyKey`

A useful type to know about when working with dynamic keys is `PropertyKey`.

The `PropertyKey` type is a global type that represents the set of all possible keys that can be used on an object, including string, number, and symbol. You can find its type definition inside of TypeScript's ES5 type definitions file:

```typescript
// inside lib.es5.d.ts
declare type PropertyKey = string | number | symbol;
```

Because `PropertyKey` works with all possible keys, it's great for working with dynamic keys where you aren't sure what the type of the key will be.

For example, when using an index signature you could set the key type to `PropertyKey` in order to allow for any valid key type:

```typescript
type Album = {
  [key: PropertyKey]: string;
};
```

### `object`

Similar to `string`, `number`, and `boolean`, `object` is a global type in TypeScript.

It represents more types than you might expect. Instead of representing only objects like `{}` or `new Object()`, `object` represents any non-primitive type. This includes arrays, functions, and objects.

So a function like this:

```typescript
function acceptAllNonPrimitives(obj: object) {}
```

Would accept any non-primitive value:

```typescript
acceptAllNonPrimitives({});
acceptAllNonPrimitives([]);
acceptAllNonPrimitives(() => {});
```

But error on primitives:

```ts twoslash
// @errors: 2345
function acceptAllNonPrimitives(obj: object) {}

// ---cut---
acceptAllNonPrimitives(1);
acceptAllNonPrimitives("hello");
acceptAllNonPrimitives(true);
```

This means that the `object` type is rarely useful by itself. Using `Record` is usually a better choice. For instance, if you want to accept any object type, you can use `Record<string, unknown>`.

### Exercises

#### Exercise 1: Use an Index Signature for Dynamic Keys

Here we have an object called `scores`, and we are trying to assign several different properties to it:

```ts twoslash
// @errors: 2339
const scores = {};

scores.math = 95;
scores.english = 90;
scores.science = 85;
```

Your task is to give `scores` a type annotation to support the dynamic subject keys. There are three ways: an inline index signature, a type, an interface, or a `Record`.

<Exercise title="Exercise 1: Use an Index Signature for Dynamic Keys" filePath="/src/020-objects/084-index-signatures.problem.ts"></Exercise>

#### Exercise 2: Default Properties with Dynamic Keys

Here, we're trying to model a situation where we want some required keys - `math`, `english`, and `science` - on our scores object.

But we also want to add dynamic properties. In this case, `athletics`, `french`, and `spanish`:

```ts twoslash
// @errors: 2578 2339
interface Scores {}

// @ts-expect-error science should be provided
const scores: Scores = {
  math: 95,
  english: 90,
};

scores.athletics = 100;
scores.french = 75;
scores.spanish = 70;
```

The definition of scores should be erroring, because `science` is missing - but it's not, because our definition of `Scores` is currently an empty object.

Your task is to update the `Scores` interface to specify default keys for `math`, `english`, and `science` while allowing for any other subject to be added. Once you've updated the type correctly, the red squiggly line below `@ts-expect-error` will go away because `science` will be required but missing. See if you can use `interface extends` to achieve this.

<Exercise title="Exercise 2: Default Properties with Dynamic Keys" filePath="/src/020-objects/085-index-signatures-with-defined-keys.problem.ts"></Exercise>

#### Exercise 3: Restricting Object Keys With Records

Here we have a `configurations` object, typed as `Configurations` which is currently unknown.

The object holds keys for `development`, `production`, and `staging`, and each respective key is associated with configuration details such as `apiBaseUrl` and `timeout`.

There is also a `notAllowed` key, which is decorated with a `@ts-expect-error` comment. But currently, this is not erroring in TypeScript as expected.

```ts twoslash
// @errors: 2578
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
  // @ts-expect-error
  notAllowed: {
    apiBaseUrl: "https://staging.example.com",
    timeout: 8000,
  },
};
```

Update the `Configurations` type so that only the keys from `Environment` are allowed on the `configurations` object. Once you've updated the type correctly, the red squiggly line below `@ts-expect-error` will go away because `notAllowed` will be disallowed properly.

<Exercise title="Exercise 3: Restricting Object Keys With Records" filePath="/src/020-objects/087-record-type-with-union-as-keys.problem.ts"></Exercise>

#### Exercise 4: Dynamic Key Support

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

```ts twoslash
// @errors: 2345

const hasKey = (obj: object, key: string) => {
  return obj.hasOwnProperty(key);
};

// ---cut---
const obj = {
  1: "bar",
};
```

Because an object can also have a symbol as a key, there is also a test for that case. It currently has type errors for `fooSymbol` and `barSymbol` when calling `hasKey`:

```ts twoslash
// @lib: dom,es2023,dom.iterable
// @errors: 2345
const hasKey = (obj: object, key: string) => {
  return obj.hasOwnProperty(key);
};

// ---cut---
const fooSymbol = Symbol("foo");
const barSymbol = Symbol("bar");

const obj = {
  [fooSymbol]: "bar",
};
```

Your task is to update the `hasKey` function so that all of these tests pass. Try to be as concise as possible!

<Exercise title="Exercise 4: Dynamic Key Support" filePath="/src/020-objects/086-property-key-type.problem.ts"></Exercise>

#### Solution 1: Use an Index Signature for Dynamic Keys

Here are the three solutions:

You can use an inline index signature:

```typescript
const scores: {
  [key: string]: number;
} = {};
```

Or an interface:

```typescript
interface Scores {
  [key: string]: number;
}
```

Or a type:

```typescript
type Scores = {
  [key: string]: number;
};
```

Or finally, a record:

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

These two are functionally equivalent, except for the fact that you get access to the `RequiredScores` interface if you need to use that seprately.

#### Solution 3: Restricting Object Keys

##### A Failed First Attempt at Using Record

We know that the values of the `Configurations` object will be `apiBaseUrl`, which is a string, and `timeout`, which is a number.

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

#### Solution 4: Dynamic Key Support

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

Beautiful.

## Reducing Duplication with Utility Types

When working with object types in TypeScript, you'll often find yourself in situations where your object types share common properties. This can lead to a lot of duplicated code.

We've seen how using `interface extends` can help us model inheritance, but TypeScript also gives us tools to directly manipulate object types. With its built-in utility types, we can remove properties from types, make them optional, and more.

### `Partial`

The Partial utility type lets you create a new object type from an existing one, except all of its properties are optional.

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

This means we can create a function which only receives a subset of the album's properties:

```typescript
const updateAlbum = (album: PartialAlbum) => {
  // ...
};

updateAlbum({ title: "Geogaddi", artist: "Boards of Canada" });
```

### `Required`

On the opposite side of `Partial` is the `Required` type, which makes sure all of the properties of a given object type are required.

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

An important thing to note is that both `Required` and `Partial` only work one level deep. For example, if the `Album`'s `genre` contained nested properties, `Required<Album>` would not make the children required:

```ts twoslash
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
//   ^?
```

If you find yourself in a situation where you need a deeply Required type, check out the type-fest library by Sindre Sorhus.

### `Pick`

The Pick utility type allows you to create a new object type by picking certain properties from an existing object.

For example, say we want to create a new type that only includes the `title` and `artist` properties from the `Album` type:

```typescript
type AlbumData = Pick<Album, "title" | "artist">;
```

This results in `AlbumData` being a type that only includes the `title` and `artist` properties.

This is extremely useful when you want to have one object that relies on the shape of another object. We'll explore this more in the chapter on deriving types from other types.

### `Omit`

The Omit helper type is kind of like the opposite of Pick. It allows you to create a new type by excluding a subset of properties from an existing type.

For example, we could use Omit to create the same `AlbumData` type we created with Pick, but this time by excluding the `id`, `releaseYear` and `genre` properties:

```typescript
type AlbumData = Omit<Album, "id" | "releaseYear" | "genre">;
```

A common use case is to create a type without `id`, for situations where the `id` has not yet been assigned:

```typescript
type AlbumData = Omit<Album, "id">;
```

This means that as `Album` gains more properties, they will flow down to `AlbumData` too.

On the surface, using Omit is straightforward, but there is a small quirk to be aware of.

#### Omit is Looser than Pick

When using Omit, you are able to exclude properties that don't exist on an object type.

For example, creating an `AlbumWithoutProducer` type with our `Album` type would not result in an error, even though `producer` doesn't exist on `Album`:

```typescript
type Album = {
  id: string;
  title: string;
  artist: string;
  releaseYear: number;
  genre: string;
};

type AlbumWithoutProducer = Omit<Album, "producer">;
```

If we tried to create an `AlbumWithOnlyProducer` type using Pick, we would get an error because `producer` doesn't exist on `Album`:

```ts twoslash
// @errors: 2344
type Album = {
  id: string;
  title: string;
  artist: string;
  releaseYear: number;
  genre: string;
};

type AlbumWithoutProducer = Omit<Album, "producer">;

// ---cut---
type AlbumWithOnlyProducer = Pick<Album, "producer">;
```

Why do these two utility types behave differently?

When the TypeScript team was originally implementing Omit, they were faced with a decision to create a strict or loose version of Omit. The strict version would only permit the omission of valid keys (`id`, `title`, `artist`, `releaseYear`, `genre`), whereas the loose version wouldn't have this constraint.

At the time, it was a more popular idea in the community to implement a loose version, so that's the one they went with. Given that global types in TypeScript are globally available and don't require an import statement, the looser version is seen as a safer choice, as it is more compatible and less likely to cause unforeseen errors.

While it is possible to create a strict version of Omit, the loose version should be sufficient for most cases. Just keep an eye out, since it may error in ways you don't expect.

We'll implement a strict version of Omit later in this book.

For more insights into the decisions behind Omit, refer to the TypeScript team's original [discussion](https://github.com/microsoft/TypeScript/issues/30455) and [pull request](https://github.com/microsoft/TypeScript/pull/30552) adding `Omit`, and their [final note](https://github.com/microsoft/TypeScript/issues/30825#issuecomment-523668235) on the topic.

### Omit And Pick Don't Work Well With Union Types

`Omit` and `Pick` have some odd behaviour when used with union types. Let's look at an example to see what I mean.

Consider a scenario where we have three interface types for `Album`, `CollectorEdition`, and `DigitalRelease`:

```typescript
type Album = {
  id: string;
  title: string;
  genre: string;
};

type CollectorEdition = {
  id: string;
  title: string;
  limitedEditionFeatures: string[];
};

type DigitalRelease = {
  id: string;
  title: string;
  digitalFormat: string;
};
```

These types share two common properties - `id` and `title` - but each also has unique attributes. The `Album` type includes `genre`, the `CollectorEdition` includes `limitedEditionFeatures`, and `DigitalRelease` has `digitalFormat`:

After creating a `MusicProduct` type that is a union of these three types, say we want to create a `MusicProductWithoutId` type, mirroring the structure of `MusicProduct` but excluding the `id` field:

```typescript
type MusicProduct = Album | CollectorEdition | DigitalRelease;

type MusicProductWithoutId = Omit<MusicProduct, "id">;
```

You might assume that `MusicProductWithoutId` would be a union of the three types minus the `id` field. However, what we get instead is a simplified object type containing only `title` – the other properties that were shared across all types, without `id`.

```typescript
// Expected:
type MusicProductWithoutId =
  | Omit<Album, "id">
  | Omit<CollectorEdition, "id">
  | Omit<DigitalRelease, "id">;

// Actual:
type MusicProductWithoutId = {
  title: string;
};
```

This is particularly annoying given that `Partial` and `Required` work as expected with union types:

```typescript
type PartialMusicProduct = Partial<MusicProduct>;

// Hovering over PartialMusicProduct shows:
type PartialMusicProduct =
  | Partial<Album>
  | Partial<CollectorEdition>
  | Partial<DigitalRelease>;
```

This stems from how `Omit` processes union types. Rather than iterating over each union member, it amalgamates them into a single structure it can understand.

The technical reason for this is that `Omit` and `Pick` are not distributive. This means that when you use them with a union type, they don't operate individually on each union member.

#### The `DistributiveOmit` and `DistributivePick` Types

In order to address this, we can create a `DistributiveOmit` type. It's defined similarly to Omit but operates individually on each union member. Note the inclusion of `PropertyKey` in the type definition to allow for any valid key type:

```typescript
type DistributiveOmit<T, K extends PropertyKey> = T extends any
  ? Omit<T, K>
  : never;
```

When we apply `DistributiveOmit` to our `MusicProduct` type, we get the anticipated result: a union of `Album`, `CollectorEdition`, and `DigitalRelease` with the `id` field omitted:

```typescript
type MusicProductWithoutId = DistributiveOmit<MusicProduct, "id">;

// Hovering over MusicProductWithoutId shows:
type MusicProductWithoutId =
  | Omit<Album, "id">
  | Omit<CollectorEdition, "id">
  | Omit<DigitalRelease, "id">;
```

Structurally, this is the same as:

```typescript
type MusicProductWithoutId =
  | {
      title: string;
      genre: string;
    }
  | {
      title: string;
      limitedEditionFeatures: string[];
    }
  | {
      title: string;
      digitalFormat: string;
    };
```

In situations where you need to use Omit with union types, using a distributive version will give you a much more predictable result.

For completeness, the `DistributivePick` type can be defined in a similar way:

```typescript
type DistributivePick<T, K extends PropertyKey> = T extends any
  ? Pick<T, K>
  : never;
```

### Exercises

#### Exercise 1: Expecting Certain Properties

In this exercise, we have a `fetchUser` function that uses `fetch` to access an endpoint named `APIUser` and it return a `Promise<User>`:

```ts twoslash
// @errors: 2344
import { Expect, Equal } from "@total-typescript/helpers";

// ---cut---
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

  type test = Expect<Equal<typeof user, { name: string; email: string }>>;
};
```

Since we're in an asynchronous function, we do want to use a `Promise`, but there's a problem with this `User` type.

In the `example` function that calls `fetchUser`, we're only expecting to receive the `name` and `email` fields. These fields are only part of what exists in the `User` interface.

Your task is to update the typing so that only the `name` and `email` fields are expected to be returned from `fetchUser`.

You can use the helper types we've looked at to accomplish this, but for extra practice try using just interfaces.

<Exercise title="Exercise 1: Expecting Certain Properties" filePath="/src/020-objects/089-pick-type-helper.problem.ts"></Exercise>

#### Exercise 2: Updating a Product

Here we have a function `updateProduct` that takes two arguments: an `id`, and a `productInfo` object derived from the `Product` type, excluding the `id` field.

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

const updateProduct = (id: number, productInfo: Product) => {
  // Do something with the productInfo
};
```

The twist here is that during a product update, we might not want to modify all of its properties at the same time. Because of this, not all properties have to be passed into the function.

This means we have several different test scenarios. For example, update just the name, just the price, or just the description. Combinations like updating the name and the price or the name and the description are also tested.

```ts twoslash
// @errors: 2345
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

const updateProduct = (id: number, productInfo: Product) => {
  // Do something with the productInfo
};

// ---cut---
updateProduct(1, {
  name: "Book",
});

updateProduct(1, {
  price: 12.99,
});
```

Your challenge is to modify the `productInfo` parameter to reflect these requirements. The `id` should remain absent from `productInfo`, but we also want all other properties in `productInfo` to be optional.

<Exercise title="Exercise 2: Updating a Product" filePath="/src/020-objects/091-omit-type-helper.problem.ts"></Exercise>

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

```typescript
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

```typescript
const fetchUser = async (): Promise<NameAndEmail> => {
  // ...
};
```

`Omit` will mean that the object grows as the source object grows. `Pick` and `interface extends` will mean that the object will stay the same size. So depending on requirements, you can choose the best approach.

#### Solution 2: Updating a Product

Using a _combination_ of `Omit` and `Partial` will allow us to create a type that excludes the `id` field from `Product` and makes all other properties optional.

In this case, wrapping `Omit<Product, "id">` in `Partial` will remove the `id` while making all of the remaining properties optional:

```typescript
const updateProduct = (
  id: number,
  productInfo: Partial<Omit<Product, "id">>,
) => {
  // Do something with the productInfo
};
```
