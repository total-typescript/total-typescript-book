import { expect, it } from "vitest";

type User = {
  id: string;
  name: string;
  age: number;
  imageId: string;
};

type Organisation = {
  id: string;
  name: string;
  address: string;
  imageId: string;
};

const getAvatarImage = (entity: User | Organisation) => {
  {
    // Should not be able to access properties that are
    // not common to both types

    // @ts-expect-error
    entity.age;

    // @ts-expect-error
    entity.address;
  }

  return {
    url: `https://via.placeholder.com/${entity.imageId}`,
    alt: `${entity.name} Avatar`,
  };
};

it("Should work for a user", () => {
  const result = getAvatarImage({
    id: "1",
    name: "John",
    age: 20,
    imageId: "abc123",
  });

  expect(result).toEqual({
    url: "https://via.placeholder.com/abc123",
    alt: "John Avatar",
  });
});

it("Should work for an organisation", () => {
  const result = getAvatarImage({
    id: "1",
    name: "Total TypeScript",
    address: "1 Main Street",
    imageId: "abc123",
  });

  expect(result).toEqual({
    url: "https://via.placeholder.com/abc123",
    alt: "Total TypeScript Avatar",
  });
});
