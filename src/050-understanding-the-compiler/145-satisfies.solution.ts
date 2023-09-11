type Color =
  | string
  | {
      r: number;
      g: number;
      b: number;
    };

const config = {
  foreground: { r: 255, g: 255, b: 255 },
  background: { r: 0, g: 0, b: 0 },
  border: "transparent",
} satisfies Record<string, Color>;

config.border.toUpperCase();

console.log(config.foreground.r);

// @ts-expect-error
config.primary;

// @ts-expect-error
config.secondary;
