type Coordinates = {
  x?: number;
  y?: number;
};

type CoordinatesRequired = Required<Coordinates>;

type test = Expect<Equal<CoordinatesRequired, { x: number; y: number }>>;
