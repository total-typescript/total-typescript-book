const goToLocation = (
  coordinates: [latitude: number, longitude: number, elevation?: number],
) => {
  const latitude = coordinates[0];
  const longitude = coordinates[1];
  const elevation = coordinates[2];

  // Do something with latitude, longitude, and elevation in here

  type tests = [
    Expect<Equal<typeof latitude, number>>,
    Expect<Equal<typeof longitude, number>>,
    Expect<Equal<typeof elevation, number | undefined>>,
  ];
};

goToLocation([10, 20]);

// @ts-expect-error string is not assignable to number
goToLocation([10, "20"]);

goToLocation([10, 20, 30]);
