# 15. Designing Your Types in TypeScript

The types you design are more than just a way to catch errors at compile time. They are a representation of your business logic. Your application's types will likely correspond closely to your database, and should also convey your app's logic.

We've seen syntax like `interface extends` and type helpers like `Pick` and `Omit` that allow us to create new types based on existing ones, but it's time to go further.

In this chapter, we add several more techniques for composing and transforming types. We'll work with generics, which add a ton of flexibility by allowing you to parameterize your types. We'll also introduce template literal types for defining and enforcing specific string formats, as well as mapped types for deriving the shape of one type from another.

Designing types is a non-trivial task, but with these techniques, you'll be able to create and compose types that accurately represent your business domain.

## Generic Types

Generic types allow you to provide parameters that are used to create types, similar to how functions are provided arguments. This means you can write reusable type definitions that can work with a variety of data types.

Consider these `StreamingPlaylist` and `StreamingAlbum` types, which share similar structures:

```tsx
type StreamingPlaylist =
  | {
      status: "available";
      content: {
        id: number;
        name: string;
        tracks: string[];
      };
    } 
  | {
      status: "unavailable";
      reason: string;
  };
type StreamingAlbum =
  | {
      status: "available";
      content: {
        id: number;
        title: string;
        artist: string;
        tracks: string[];
      };
    }
  | {
      status: "unavailable";
      reason: string;
  };
```

Both of these types represent a streaming resource that is either available with specific content or unavailable with a reason for its unavailability.

The primary difference lies in the structure of the `content` object: the `StreamingPlaylist` type has a `name` property, while the `StreamingAlbum` type has a `title` and `artist` property. Despite this difference, the overall structure of the types is the same. 

In order to reduce repetition, we can create a generic type called `ResourceStatus` that can represent both `StreamingPlaylist` and `StreamingAlbum`.

### Creating a Generic Type

To create a generic type, we use a type parameter that acts as a placeholder for the actual type. This allows us to define a type that can work with different data types.

To specify the parameter, we use the angle bracket syntax that will look familiar from working with the various type helpers we've seen earlier in the book. Often type parameters are named with single-letter names like `T`, `K`, or `V`, but you can name them anything you like.

Our `ResourceStatus` type will take in a parameter of `TContent`, which will represent the shape of the `content` object that is specific to each resource. For now, we'll set the type to `unknown`:

```tsx
type ResourceStatus<TContent> = unknown;
```

Let's create an `Example` type to demonstrate how the generic `ResourceStatus` type works, and provide an object type as the type argument for `TContent`:

```tsx
type Example = ResourceStatus<{
  id: string;
  name: string;
  tracks: string[];
}>;

// hovering over Example shows
type Example = unknown;
```

Because `ResourceStatus` is currently typed as `unknown`, the `Example` type is also `unknown`. 

If we change `ResourceStatus` to be typed the same as the `TContent` that is passed in, we can see that `Example` will now be typed as the object type we provided as the type argument:

```tsx
type ResourceStatus<TContent> = TContent;


// hovering over Example shows
type Example = {
  id: string;
  name: string;
  tracks: string[];
};
```

Just like with a function, we can use the `TContent` that's being passed in to create a new type. This is the property we will leverage to define the shape of the `ResourceStatus` type.

The primary difference between the `StreamingPlaylist` and `StreamingAlbum` types was in `content` object in the first branch of the union type. The second branch's `unavailable` status and `reason` properties are the same.

We can update the shape of the `ResourceStatus` type to reflect this:

```tsx
type ResourceStatus<TContent> =
  | {
      status: "available";
      content: TContent;
    }
  | {
      status: "unavailable";
      reason: string;
    };
```

With the `ResourceStatus` type defined, we can now redefine `StreamingPlaylist` and `StreamingAlbum` to use it:

```tsx
type StreamingPlaylist = ResourceStatus<{
  id: number;
  name: string;
  tracks: string[];
}>;

type StreamingAlbum = ResourceStatus<{
  id: number;
  title: string;
  artist: string;
  tracks: string[];
}>;
```

Now if we hover over `StreamingPlaylist`, we will see that it has the same structure as it did originally, but it's now defined in terms of the `ResourceStatus` type without having to manually provide the additional properties:

```tsx
// hovering over StreamingPlaylist shows:

type StreamingPlaylist = {
    status: "unavailable";
    reason: string;
} | {
    status: "available";
    content: {
        id: number;
        name: string;
        tracks: string[];
    };
}
```

Because the `ResourceStatus` type is generic, we can quickly and easily create new types of resources that maintain structure while accommodating different content shapes.

### Multiple Type Parameters

Generic types can accept multiple type parameters, allowing for even more flexibility.

We could expand the `ResourceStatus` type to include a second type parameter that represents metadata that accompanies the resource:

```tsx
type ResourceStatus<TContent, TMetadata> =
  | {
      status: "available";
      content: TContent;
      metadata: TMetadata;
    }
  | {
      status: "unavailable";
      reason: string;
    };
```

Now we can define the `StreamingPlaylist` and `StreamingAlbum` types, we can include metadata specific to each resource:

```tsx
type StreamingPlaylist = ResourceStatus<
  {
    id: number;
    name: string;
    tracks: string[];
  },
  {
    creator: string;
    artwork: string;
    dateUpdated: Date;
  }
>;

type StreamingAlbum = ResourceStatus<
  {
    id: number;
    title: string;
    artist: string;
    tracks: string[];
  },
  {
    recordLabel: string;
    upc: string;
    yearOfRelease: number;
  }
>;
```

Like before, each type maintains the same structure defined in `ResourceStatus`, but with its own content and metadata.

### Default Type Parameters

In some cases, you may want to provide default types for generic type parameters. Like with functions, you can use the `=` to assign a default value.

With the latest update to the `ResourceStatus` type, the second type parameter `TMetadata` is required.

For example, if we want to create a `ResourceStatus` type that doesn't include metadata, TypeScript gives us an error:

```tsx
type StreamingPlaylist = ResourceStatus<{ 
  id: number;
  name: string;
  tracks: string[];
}>; // red squiggly line under the content object

// hovering over the error shows:
Generic type 'ResourceStatus' requires 2 type argument(s).
```

By setting `TMetadata`'s default value to an empty, we can essentially make `TMetadata` optional:

```tsx
type ResourceStatus<TContent, TMetadata = {}> =
  | {
      status: "available";
      content: TContent;
      metadata: TMetadata;
    }
  | {
      status: "unavailable";
      reason: string;
    };
```

With this change, the error under `StreamingPlaylist` as gone away. If we hover over it, we'll see that it's typed as expected, with `metadata` being an empty object:

```tsx
type StreamingPlaylist = {
    status: "unavailable";
    reason: string;
} | {
    status: "available";
    content: {
        id: number;
        name: string;
        tracks: string[];
    };
    metadata: {};
}
```

However, there's an interesting behavior here. Even though we've specified that `TMetadata` will be an empty object by default, we can still provide a different type for `TMetadata` if we want to:

```tsx
type StreamingPlaylist = ResourceStatus<{
  id: number;
  name: string;
  tracks: string[];
}, number>;

// hovering over StreamingPlaylist shows:
type StreamingPlaylist = {
    status: "unavailable";
    reason: string;
} | {
    status: "available";
    content: {
        id: number;
        name: string;
        tracks: string[];
    };
    metadata: number;
}
```

It would probably be a good idea to add a constraints to ensure that the parameters to `ResourceStatus` are of the correct type.

### Type Parameter Constraints

To set constraints on type parameters, we can use the `extends` keyword like we've seen in the context of interfaces and type aliases.

We can force the `TMetadata` type parameter to be an object while still defaulting to an empty object:

```tsx
type ResourceStatus<TContent, TMetadata extends object = {}> = // ...
```

There's also an opportunity to provide a constraint for the `TContent` type parameter.

Both of the `StreamingPlaylist` and `StreamingAlbum` types have an `id` property in their `content` objects. This would be a good candidate for a constraint.

First, we'll define a `HasId` interface with an `id` property:

```tsx
interface HasId {
  id: number;
}
```

Then we can use this interface as a constraint for the `TContent` type parameter in the `ResourceStatus` type:

```tsx
type ResourceStatus<TContent extends HasId, TMetadata extends object = {}> =
  | {
      status: "available";
      content: TContent extends HasId;
      metadata: TMetadata;
    }
  | {
      status: "unavailable";
      reason: string;
    };
```

With these changes in place, it is now required that the `TContent` type parameter must include an `id` property. The `TMetadata` type parameter is optional, but if it is provided it must be an object.

When we try to create a type with `ResourceStatus` that doesn't have an `id` property, TypeScript will raise an error that tells us exactly what's wrong:

```tsx
type StreamingPlaylist = ResourceStatus<
  {
    name: string;
    tracks: string[];
  }, // red squiggly line under the object
  {
    creator: string;
    artwork: string;
    dateUpdated: Date;
  }
>;

// hovering over the error shows:
Type '{ name: string; tracks: string[]; }' does not satisfy the constraint 'HasId'.
  Property 'id' is missing in type '{ name: string; tracks: string[]; }' but required in type 'HasId'.
```

Once the `id` property is added to the `TContent` type parameter, the error will go away.

### Putting it All Together

The generic `ResourceStatus` type allows for the creation of any sort of resource, as long as its constraints are met. The first branch of the union type represents the resource being available, with a `content` object and optional `metadata`. The second branch represents the resource being unavailable, with a `reason` for its unavailability.

Let's create a `DownloadableAlbum` type that is generally `available` for listening, but only for paid subscribers.

We'll provide an object corresponding to the `TContent` parameter that includes the required `id`, along with a `TMetdata` object that contains a `region` property:

```tsx
type DownloadableAlbum = ResourceStatus<
  {
    id: string;
    name: string;
    artist: string;
    year: number;
  },
  {
    region: string;
  }
>;
```

We can create a variable representing an album that is typed as the `DownloadableAlbum` type:

```tsx
let hosonoHouse: DownloadableAlbum = {
  status: "available",
  content: {
    id: "1",
    artist: "Haruomi Hosono",
    name: "Hosono House",
    year: 1973,
  },
  metadata: {
    region: "Japan",
  },
};
```

Next, we'll write a function that checks if the `DownloadableAlbum` being passed in is available in a specific region. The function will use a type guard to first check that the album has a `status` of `available`. Once we know the album is available, we know that it will have a content object with a `name` that we can access. Because the function will also return a `DownloadableAlbum`, if the region is not Japan, the function will return an object with a `status` of `unavailable` and a `reason` property as defined in the `ResourceStatus` type:

```tsx
function checkRegionAvailability(
  album: DownloadableAlbum,
  region: string
): DownloadableAlbum {
  // Check if the album is available
  if (album.status === "available") {
    let albumName = album.content.name;

    if (region !== "Japan") {
      return {
        status: "unavailable",
        reason: `${albumName} is not available in ${region}`,
      };
    }
    return album;
  } else {
    // If the album is already unavailable, just return it as is
    return album;
  }
}
```

We can test the function by passing in the `hosonoHouse` album and a region:

```tsx
hosonoHouse = checkRegionAvailability(hosonoHouse, "USA");

console.log(`hosonoHouse after region check: `, hosonoHouse);

// Output:
hosonoHouse after region check:  { status: 'unavailable', reason: 'Hosono House is not available in USA' }
```

If we create a new `unreleasedAlbum` typed as `DownloadableAlbum` with an `unavailable` status, it will be returned as-is when passed into the `checkRegionAvailability` function:

```tsx
const unreleasedAlbum: DownloadableAlbum = {
  status: "unavailable",
  reason: "Album has not been released yet",
};

unreleasedAlbum = checkRegionAvailability(unreleasedAlbum, "Japan");

console.log(`unreleasedAlbum after region check: `, unreleasedAlbum);

// Output:
unreleasedAlbum after region check:  { status: 'unavailable', reason: 'Album has not been released yet' }
```

Generics are one of the most important features of TypeScript. They provide flexibility and reusability, while still maintaining type safety. As you become more comfortable with generics, you'll find that they can be used to solve a wide variety of problems.

## A Generic `Result` Type

As we iterated through building the `ResourceStatus` generic type, we essentially encapsulated the concept of a type that either has a success state or an error state.

This type follows the structure of a common TypeScript pattern seen in this `Result` type:

```tsx
type Result<TResult, TError = Error> =
  | {
      success: true;
      data: TResult;
    }
  | {
      success: false;
      error: TError;
    };
```

Here, `Result` is a generic type that accepts two type parameters `TResult` and `TError`, and returns a discriminated union where the first branch represents a successful operation and the second branch represents an unsuccessful operation.

The `TResult` type parameter represents the type of the data that will be returned if the operation is successful. The `TError` type parameter represents the type of the error that will be returned if the operation is unsuccessful, defaulting to the built-in `Error` type.

This pattern for defining the `Result` type comes in handy for error handling, as it eliminates the need for `try-catch` blocks. Instead, we can directly check if there was an error and handle it accordingly:

```tsx
function doSomethingWithResult(result: Result<string, Error>) {
  if (result.success) {
    console.log(result.data);
  } else {
    console.error(result.error.message);
  }
}
```

If you have complicated imperative code in your projects, give the `Result` type pattern a try!

## Template Literal Types in TypeScript

Similar to how template literals in JavaScript allow you to interpolate values into strings, template literal types in TypeScript can be used to interpolate other types into string types.

For example, let's create a `GreatestHitsAlbumTitle` type that enforces that a string ends with "Greatest Hits". To do this, we'll use the same backtick syntax as template literals in JavaScript, along with the `${}` syntax for interpolation:

```tsx
type GreatestHitsAlbumTitle = `${string} Greatest Hits`;
```

Now when we type a new variable as `GreatestHitsAlbumTitle`, we can only assign it a string that ends with "Greatest Hits":

```tsx
type GreatestHitsAlbumTitle = `${string} Greatest Hits`;

let dollyPartonsGreatestHits: GreatestHitsAlbumTitle = "Dolly Parton's Greatest Hits";
```

When a string does not match the pattern defined in the `GreatestHitsAlbumTitle` type, TypeScript will raise an error:

```tsx
let legend: GreatestHitsAlbumTitle = "The Best of Bob Marley and the Wailers"; // red squiggly line under legend

// hovering over legend shows:
Type '"The Best of Bob Marley and the Wailers"' is not assignable to type '`${string} Greatest Hits`'
```

Enforce specific string formats with template literal types can be useful in your applications, especially when working with APIs or databases.

### Combining Template Literal Types with Union Types

Template literal types become even more powerful when combined with union types. By passing a union to a template literal type, you can generate a type that represents all possible combinations of the union.

For example, the artist John Mellencamp has released albums under several different names. We could create a `JohnMellencampNames` type by passing a union of last names into a template literal type:

```tsx
type JohnMellencampNames = `John ${"Cougar" | "Cougar Mellencamp" | "Mellencamp"}`;
```

Now when hovering over `JohnMellencampNames`, we'll see that it's a union of all possible combinations of the `JohnLastNames` union:

```tsx
// hovering over JohnMellencampNames shows:
type JohnMellencampNames = "John Cougar" | "John Cougar Mellencamp" | "John Mellencamp";
```

Using template literals in this way allows you to quickly create unions based on combinations of other unions.

While this can be useful, it's a capability that should be used with caution. Each additional union you add increases the number of combinations exponentially.

For example, if we use another union for first names, the number of combinations would increase from three to six:

```tsx
type JohnMellencampNames = `${"John" | "Johnny"} ${"Cougar" | "Cougar Mellencamp" | "Mellencamp"}`;

// hovering over JohnMellencampNames shows:
type JohnMellencampNames = "John Cougar" | "John Cougar Mellencamp" | "John Mellencamp" | "Johnny Cougar" | "Johnny Cougar Mellencamp" | "Johnny Mellencamp";
```

Despite the potential for overuse, template literal types combined with unions have legitimate use cases and can be a valuable tool in your TypeScript toolbox.

## Mapped Types

Mapped types in TypeScript allow you to create a new type based on an existing type by iterating over its keys and values, similar to how a `map` function can be used in JavaScript. This can be useful for creating new types that are variations of existing ones, while maintaining a single source of truth.

Consider this `Album` interface:

```tsx
interface Album {
  name: string;
  artist: string;
  songs: string[];
}
```

Notice that the `songs` property in the `Album` interface is an array of strings. This is fine for representing a basic album structure in a music library, but wouldn't really work in a player application. This situation would call for more detailed information like its currently playback status, as seen in this `SongWithPlayingStatus` type:

```tsx
type SongWithPlayingStatus = {
  title: string;
  nowPlaying: boolean;
};
```

Instead of manually updating the `Album` interface to incorporate the `SongWithPlayingStatus` type, we can use a mapped type to dynamically generate a new `AlbumWithPlayableSongs` type based on the `Album` interface. This new type will have the `songs` property replaced with an array of `SongWithPlayingStatus` objects.

Here's what the syntax for the mapped type looks like:

```tsx
type AlbumWithPlayableSongs = {
  [K in keyof Album]: K extends 'songs' ? SongWithPlayingStatus[] : Album[K];
};
```

In the above, the `[K in keyof Album]` part of the mapped type iterates over the keys of the `Album` interface. For each key, we check if the key is `'songs'`. If the key is `songs`, we replace its type with an array of `SongWithPlayingStatus` objects. Otherwise the original type of the property will stay the same.

Now when typing something as `AlbumWithPlayableSongs`, each of the `songs` will need to follow the shape of `SongWithPlayingStatus` and include a boolean `nowPlaying` property.


#### Key Remapping with `as`

We've used a mapped type to change the type of `songs` in the `Album` interface to `SongWithPlayingStatus[]`, but it would be nice to have a more descriptive key name.

By bringing the `as` keyword into the mapped type, we can rename the `songs` key to `songsWithStatus` to better reflect its transformed type by updating the mapped type:

```tsx
type AlbumWithPlayableSongs = {
  [K in keyof Album as K extends 'songs' ? 'songsWithStatus' : K]: K extends 'songs' ? SongWithPlayingStatus[] : Album[K];
};
```

Now when the keys of the `Album` interface are iterated over, if the key is `songs` it will be renamed to `songsWithStatus` in the resulting `AlbumWithPlayableSongs` type. The rest of the keys and types will remain the same.

Let's look at an example of the `AlbumWithPlayableSongs` type in action, starting with an regular `Album` object:

```tsx
const legend: Album = {
  name: "Legend: The Best of Bob Marley and the Wailers",
  artist: "Bob Marley",
  songs: [
    "Is This Love",
    "No Woman, No Cry",
    "Could You Be Loved",
    "Three Little Birds",
  ],
};
```

Instead of manually creating a new `AlbumWithPlayableSongs` object, we can map over the existing `legend` object and transform the `songs` property to satisfy the `SongWithPlayingStatus` type:

```tsx
const legendWithPlayableSongs: AlbumWithPlayableSongs = {
  name: legend.name,
  artist: legend.artist,
  songsWithStatus: legend.songs.map((song) => ({
    title: song,
    nowPlaying: false,
  })),
};
```

Now `legendWithPlayableSongs` is ready to track the playback status of each song in the `songsWithStatus` array. We could even create a type helper that uses a template literal to generate a message that includes the title of the currently playing song:

```tsx
legendWithPlayableSongs.songsWithStatus[3].nowPlaying = true;


let currentSong = legendWithPlayableSongs.songsWithStatus.find(
  (song) => song.nowPlaying
);

type NowPlayingMessage<Title extends string> = `Now playing: ${Title}`;

const nowPlayingMessage: NowPlayingMessage<string> = `Now playing: ${currentSong?.title}`;

console.log(nowPlayingMessage);

// output:
Now playing: Three Little Birds
```

#### Another Mapped Type Example

Mapped types don't always have to use `keyof` to iterate over an object. They can also map over a union of something that's assignable to a string.

For example, we can create an `Example` type that is a union of 'a', 'b', and 'c':

```tsx
type Example = "a" | "b" | "c";
```

Then, we can create a `MappedExample` type that maps over `Example` and returns the same values:

```tsx
type MappedExample = {
  [E in Example]: E;
};


// hovering over MappedExample shows:
type MappedExample = {
    a: "a";
    b: "b";
    c: "c";
}
```

This chapter should help you start to understand how transforming objects into other shapes is a great way to derive types from other types while still retaining a single source of truth.


## Exercises

### Exercise 1: Create a `DataShape` Type Helper

Consider the types `UserDataShape` and `PostDataShape`:

```tsx
type ErrorShape = {
  error: {
    message: string;
  };
};

type UserDataShape =
  | {
      data: {
        id: string;
        name: string;
        email: string;
      };
    }
  | ErrorShape;

type PostDataShape =
  | {
      data: {
        id: string;
        title: string;
        body: string;
      };
    }
  | ErrorShape;
```

Looking at these types, they both share a consistent pattern. Both `UserDataShape` and `PostDataShape` possess a `data` object and an `error` shape, with the `error` shape being identical in both. The only difference between the two is the `data` object, which holds different properties for each type.

Because the user of this API would have to look at the `data` object whether to determine whether there's an error or not, a `DataShape` type helper would be useful.

Your task is to create a generic `DataShape` type that would accept accept a `data` object that is merged with the `ErrorShape` type.

### Exercise 2: Typing `PromiseFunc`

This `PromiseFunc` type represents a function that returns a Promise:

```tsx
type PromiseFunc = (input: any) => Promise<any>;
```

Provided here are two example tests that use the `PromiseFunc` type with different inputs that currently have errors:

```tsx
type Example1 = PromiseFunc<string, string>; // red squiggly line under PromiseFunc<>

type test1 = Expect<Equal<Example1, (input: string) => Promise<string>>>;

type Example2 = PromiseFunc<boolean, number>; // red squiggly line under PromiseFunc<>

type test2 = Expect<Equal<Example2, (input: boolean) => Promise<number>>>;
```

The error messages inform us that the `PromiseFunc` type is not generic.

Your task is to update `PromiseFunc` so that both of the tests pass without errors.

### Exercise 3: Working with the `Result` Type

Here we have the `Result` type that will either give us a `success` or an `error`:

```tsx
type Result<TResult, TError> =
  | {
    success: true;
    data: TResult;
  }
  | {
    success: false;
    error: TError;
  };
```

We also have the `createRandomNumber` function, but this time it only specifies a `number` to the `Result` type:

```tsx
const createRandomNumber = (): Result<number> => { // red squiggly line under number
  const num = Math.random();

  if (num > 0.5) {
    return {
      success: true,
      data: 123,
    };
  }

  return {
    success: false,
    error: new Error("Something went wrong"),
  };
};
```

Because there's only a `number` being sent as a type argument, we have an error message:

```tsx
// hovering over `Result<number>` shows:

Generic type 'Result' requires 2 type argument(s)
```

We're only specifying the number because it can be a bit of a hassle to always specify both the `success` and `error` types whenever we use the `Result` type.

It would be easier if we could designate `Error` type as the default type for `Result`'s `TError`, since that's what most errors will be typed as.

Your task is to adjust the `Result` type so that `TError` defaults to type `Error`.

### Exercise 4: Constraining the `Result` Type

After updating the `Result` type to have a default type for `TError`, it would be a good idea to add a constraint on the shape of what's being passed in.

Here are some examples of using the `Result` type:

```tsx
type BadExample = Result<
  { id: string },
  // @ts-expect-error Should be an object with a message property
  string
>;

type GoodExample = Result<{ id: string }, TypeError>;
type GoodExample2 = Result<{ id: string }, { message: string; code: number }>;
type GoodExample3 = Result<{ id: string }, { message: string }>;
type GoodExample4 = Result<{ id: string }>;
```

The `GoodExample`s should pass without errors, but the `BadExample` should raise an error because the `TError` type is not an object with a `message` property. Currently, this isn't the case as seen by the error under the `@ts-expect-error` directive.

Your task is to add a constraint to the `Result` type that ensures the `BadExample` test raises an error, while the `GoodExample`s pass without errors.

### Exercise 5: A Stricter `Omit` Type

Earlier in the book, we worked with the `Omit` type helper, which allows you to create a new type that omits specific properties from an existing type.

Interestingly, the `Omit` helper also lets you try to omit keys that don't exist in the type you're trying to omit from.

In this example, we're trying to omit the property `b` from a type that only has the property `a`:

```tsx
type Example = Omit<{ a: string }, "b">;
```

Since `b` isn't a part of the type, you might anticipate TypeScript would throw an error, but it doesn't.

Instead, we want to implement a `StrictOmit` type that only accepts keys that exist in the provided type. Otherwise, an error should be thrown.

Here's the start of `StrictOmit`, which currently has an error under `K`:

```tsx
type StrictOmit<T, K> = Omit<T, K>; // red squiggly line under K

// hovering over K shows:
Type 'K' does not satisfy the constraint 'string | number | symbol'.
```

Currently, the `StrictOmit` type behaves the same as a regular `Omit` as evidenced by this failing `@ts-expect-error` directive:

```tsx
type ShouldFail = StrictOmit<
  { a: string },
  // @ts-expect-error // red squiggly line under @ts-expect-error
>;
```

Your task is to update `StrictOmit` so that it only accepts keys that exist in the provided type `T`. If a non-valid key `K` is passed, TypeScript should return an error.

Here are some tests to show how `StrictOmit` should behave:

```tsx
type tests = [
  Expect<Equal<StrictOmit<{ a: string; b: number }, "b">, { a: string }>>,
  Expect<Equal<StrictOmit<{ a: string; b: number }, "b" | "a">, {}>>,
  Expect<
    Equal<StrictOmit<{ a: string; b: number }, never>, { a: string; b: number }>
  >,
];
```

You'll need to use `keyof` and `extends` to solve this challenge.

### Exercise 6: Route Matching

Here we have a `route` typed as `AbsoluteRoute`:

```tsx
type AbsoluteRoute = string;

const goToRoute = (route: AbsoluteRoute) => {
  // ...
};
```

We're expecting that the `AbsoluteRoute` will represent any string that has a forward slash at the start of it. For example, we'd expect the following strings to be valid `route`s:

```tsx
goToRoute("/home");
goToRoute("/about");
goToRoute("/contact");
```

However, if we attempt passing a string that doesn't start with a forward slash there currently is not an error:

```tsx
goToRoute(
  // @ts-expect-error // red squiggly line under @ts-expect-error
  "somewhere",
);
```

Because `AbsoluteRoute` is currently typed as `string`, TypeScript fails to flag this as an error.

Your task is to refine the `AbsoluteRoute` type to accurately expect that strings begin with a forward slash.

### Exercise 7: Sandwich Permutations

n this exercise, we want to build a `Sandwich` type.

This `Sandwich` is expected to encompass all possible combinations of three types of bread (`"rye"`, `"brown"`, `"white"`) and three types of filling (`"cheese"`, `"ham"`, `"salami"`):

```tsx
type BreadType = "rye" | "brown" | "white";

type Filling = "cheese" | "ham" | "salami";

type Sandwich = unknown;
```

As seen in the test, there are several possible combinations of bread and filling:

```tsx
type tests = [
  Expect<
    Equal<
      Sandwich,
      | "rye sandwich with cheese"
      | "rye sandwich with ham"
      | "rye sandwich with salami"
      | "brown sandwich with cheese"
      | "brown sandwich with ham"
      | "brown sandwich with salami"
      | "white sandwich with cheese"
      | "white sandwich with ham"
      | "white sandwich with salami"
    >
  >,
];
```

Your task is to use a template literal type to define the `Sandwich` type. This can be done in just one line of code!

### Exercise 8: Attribute Getters

Here we have an `Attributes` interface, that contains a `firstName`, `lastName`, and `age`:

```tsx
interface Attributes {
  firstName: string;
  lastName: string;
  age: number;
}
```

Following that, we have `AttributeGetters` which is currently typed as `unknown`:

```tsx
type AttributeGetters = unknown;
```

As seen in the tests, we expect `AttributeGetters` to be an object composed of functions. When invoked, each of these functions should return a value matching the key from the `Attributes` interface:

```tsx
type tests = [
  Expect<
    Equal< // red squiggly line under Equal<>
      AttributeGetters,
      {
        firstName: () => string;
        lastName: () => string;
        age: () => number;
      }
    >
  >,
];
```

Your task is to define the `AttributeGetters` type so that it matches the expected output. To do this, you'll need to iterate over each key in `Attributes` and produce a function as a value which then returns the value of that key.

### Exercise 9: Renaming Keys in a Mapped Type

After creating the `AttributeGetters` type in the previous exercise, it would be nice to rename the keys to be more descriptive.

Here's a test case for `AttributeGetters` that currently has an error:

```tsx
type tests = [
  Expect<
    Equal<
      AttributeGetters,
      {
        getFirstName: () => string;
        getLastName: () => string;
        getAge: () => number;
      }
    >
  >,
];
```

Your challenge is to adjust the `AttributeGetters` type to remap the keys as specified. You'll need to use the `as` keyword, as well as TypeScript's built-in `Capitalize<string>` type helper.


### Solution 1: Create a `DataShape` Type Helper

Here's how a generic `DataShape` type would look:

```tsx
type DataShape<TData> =
  | {
      data: TData;
    }
  | ErrorShape;
```

With this type defined, the `UserDataShape` and `PostDataShape` types can be updated to use it:

```tsx
type UserDataShape = DataShape<{
  id: string;
  name: string;
  email: string;
}>;

type PostDataShape = DataShape<{
  id: string;
  title: string;
  body: string;
}>;
```

### Solution 2: Typing `PromiseFunc`

The first thing we need to do is make `PromiseFunc` generic by adding type parameters to it.

In this case, since we want it to have two parameters we call them `TInput` and `TOutput` and separate them with a comma:

```tsx
type PromiseFunc<TInput, TOutput> = (input: any) => Promise<any>;
```

Next, we need to replace the `any` types with the type parameters.

In this case, the `input` will use the `TInput` type, and the `Promise` will use the `TOutput` type:

```tsx
type PromiseFunc<TInput, TOutput> = (input: TInput) => Promise<TOutput>;
```

With these changes in place, the errors go away and the tests pass because `PromiseFunc` is now a generic type. Any type passed as `TInput` will serve as the input type, and any type passed as `TOutput` will act as the output type of the Promise.

### Solution 3: Working with the `Result` Type

Similar to other times you set default values, the solution is to use an equals sign.

In this case, we'll add the `=` after the `TError` type parameter, and then specify `Error` as the default type:

```tsx
type Result<TResult, TError = Error> =
  | {
      success: true;
      data: TResult;
    }
  | {
      success: false;
      error: TError;
    };
```

### Solution 4: Constraining the `Result` Type

We want to set a constraint on `TError` to ensure that it is an object with a `message` string property, while also retaining `Error` as the default type for `TError`.

To do this, we'll use the `extends` keyword for `TError` and specify the object with a `message` property as the constraint:

```tsx
type Result<TResult, TError extends { message: string } = Error> =
  | {
      success: true;
      data: TResult;
    }
  | {
      success: false;
      error: TError;
    };
```

Now if we remove the `@ts-expect-error` directive from `BadExample`, we will get an error under `string`:

```tsx
type BadExample = Result<
  { id: string },
  string // red squiggly line under string
>;

// hovering over `string` shows:
Type 'string' does not satisfy the constraint '{ message: string }'.
```

The behavior of constraining type parameters and adding defaults is similar to runtime parameters. However, unlike runtime arguments, you can add additional properties and still satisfy the constraint:

```tsx
type GoodExample2 = Result<{ id: string }, { message: string; code: number }>;
```

A runtime argument constraint would be limited only containing a `message` string property without any additional properties, so the above wouldn't work the same way.

### Solution 5: A Stricter `Omit` Type

Here's the starting point of the `StrictOmit` type and the `ShouldFail` example that we need to fix:

```tsx
type StrictOmit<T, K> = Omit<T, K>

type ShouldFail = StrictOmit<
  { a: string },
  // @ts-expect-error // red squiggly line under @ts-expect-error
  "b"
>;
```

Our goal is to update `StrictOmit` so that it only accepts keys that exist in the provided type `T`. If a non-valid key `K` is passed, TypeScript should return an error.

Since the `ShouldFail` type has a key of `a`, we'll start by updating the `StrictOmit`'s `K` to extend `a`:

```tsx
type StrictOmit<T, K extends "a"> = Omit<T, K>;
```

Removing the `@ts-expect-error` directive from `ShouldFail` will now show an error under `"b"`:

```tsx
type ShouldFail = StrictOmit<
  { a: string },
  "b" // red squiggly line under "b"
>;

// hovering over "b" shows:
Type '"b"' does not satisfy the constraint '"a"'.
```

This shows us that the `ShouldFail` type is failing as expected.

However, we want to make this more dynamic by specifying that `K` will extend any key in the object `T` that is passed in.

We can do this by changing the constraint from `"a"` to `keyof T`:

```tsx
type StrictOmit<T, K extends keyof T> = Omit<T, K>;
```

Now in the `StrictOmit` type, `K` is bound to extend the keys of `T`. This imposes a limitation on the type parameter `K` that it must belong to the keys of `T`.

With this change, all of the tests pass as expected with any keys that are passed in:

```tsx
type tests = [
  Expect<Equal<StrictOmit<{ a: string; b: number }, "b">, { a: string }>>,
  Expect<Equal<StrictOmit<{ a: string; b: number }, "b" | "a">, {}>>,
  Expect<
    Equal<StrictOmit<{ a: string; b: number }, never>, { a: string; b: number }>
  >,
];
```

### Solution 6: Route Matching

In order to specify that `AbsoluteRoute` is a string that begins with a forward slash, we'll use a template literal type.

Here's how we could create a type that represents a string that begins with a forward slash, followed by either "home", "about", or "contact":

```tsx
type AbsoluteRoute = `/${"home" | "about" | "contact"}`;
```

With this setup our tests would pass, but we'd be limited to only those three routes.

Instead, we want to allow for any string that begins with a forward slash.

To do this, we can just use the `string` type inside of the template literal:

```tsx
type AbsoluteRoute = `/${string}`;
```

With this change, the `somewhere` string will cause an error since it does not begin with a forward slash:

```tsx
goToRoute(
  // @ts-expect-error 
  "somewhere",
);
```

### Solution 7: Sandwich Permutations

Following the pattern of the tests, we can see that the desired results are named:

```tsx
bread "sandwich with" filling
```

That means we should pass the `BreadType` and `Filling` unions to the `Sandwich` template literal with the string `"sandwich with"` in between:

```tsx
type BreadType = "rye" | "brown" | "white";
type Filling = "cheese" | "ham" | "salami";
type Sandwich = `${BreadType} sandwich with ${Filling}`;
```

TypeScript generates all the feasible pairings, leading to the type `Sandwich` being the same as:

```tsx
| "rye sandwich with cheese"
| "rye sandwich with ham"
| "rye sandwich with salami"
| "brown sandwich with cheese"
| "brown sandwich with ham"
| "brown sandwich with salami"
| "white sandwich with cheese"
| "white sandwich with ham"
| "white sandwich with salami"
```

### Solution 8: Attribute Getters

Our challenge is to derive the shape of `AttributeGetters` based on the `Attributes` interface:

```tsx
interface Attributes {
  firstName: string;
  lastName: string;
  age: number;
}
```

To do this, we'll use a mapped type. We'll start by using `[K in keyof Attributes]` to iterate over each key in `Attributes`. Then, we'll create a new property for each key, which will be a function that returns the type of the corresponding property in `Attributes`:

```tsx
type AttributeGetters = {
  [K in keyof Attributes]: () => Attributes[K];
};
```

The `Attributes[K]` part is the key to solving this challenge. It allows us to index into the `Attributes` object and return the actual values of each key.

With this approach, we get the expected output and all tests pass as expected:

```tsx
type tests = [
  Expect<
    Equal<
      AttributeGetters,
      {
        firstName: () => string;
        lastName: () => string;
        age: () => number;
      }
    >
  >,
];
```

### Solution 9: Renaming Keys in a Mapped Type

Our goal is to create a new mapped type, `AttributeGetters`, that changes each key in `Attributes` into a new key that begins with "get" and capitalizes the original key. For example, `firstName` would become `getFirstName`.

Before we get to the solution, let's look at an incorrect approach.

#### The Incorrect Approach

It might be tempting to think that you should transform `keyof Attributes` before it even gets to the mapped type.

To do this, we'd creating a `NewAttributeKeys` type and setting it to a template literal with `keyof Attributes` inside of it added to `get`:

```tsx
type NewAttributeKeys = `get${keyof Attributes}`;
```

However, hovering over `NewAttributeKeys` shows that it's not quite right:

```tsx
// hovering over NewAttributeKeys shows:
type NewAttributeKeys = "getfirstName" | "getlastName" | "getage";
```

Adding the global `Capitalize` helper results in the keys being formatted correctly:

```tsx
type NewAttributeKeys = `get${Capitalize<keyof Attributes>}`;
```

Since we have formatted keys, we can now use `NewAttributeKeys` in the map type:

```tsx
type AttributeGetters = {
  [K in NewAttributeKeys]: () => Attributes[K]; // red squiggly line under Attributes[K]
};

// hovering over Attributes[K] shows:
Type 'K' cannot be used to index type 'Attributes'.
```

However, we have a problem. We can't use `K` to index `Attributes` because each `K` has changed and no longer exists on `Attributes`.

We need to maintain access to the original key inside the mapped type.

#### The Correct Approach

In order to maintain access to the original key, we can use the `as` keyword.

Instead of using the `NewAttributeKeys` type we tried before, we can update the map type to use `keyof Attributes as` followed by the transformation we want to make:

```tsx
type AttributeGetters = {
  [K in keyof Attributes as `get${Capitalize<K>}`]: () => Attributes[K];
};
```

We now iterate over each key `K` in `Attributes`, and use it in a template literal type that prefixes "get" and capitalizes the original key. Then the value paired with each new key is a function that returns the type of the original key in `Attributes`.

Now when we hover over the `AttributeGetters` type, we see that it's correct and the tests pass as expected:

```tsx
// hovering over AttributeGetters shows:
type AttributeGetters = {
  getFirstName: () => string;
  getLastName: () => string;
  getAge: () => number;
}
```