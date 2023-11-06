import { Equal, Expect } from "@total-typescript/helpers";

type Event = "click" | "hover" | "scroll";

type CallbackType = (
  event: Event,
  x: number,
  y: number,
  screenId: number,
) => void;

const listenToEvent = (callback: CallbackType) => {};

listenToEvent(() => {});

listenToEvent((event) => {
  type tests = [Expect<Equal<typeof event, Event>>];
});

listenToEvent((event, x, y) => {
  type tests = [
    Expect<Equal<typeof event, Event>>,
    Expect<Equal<typeof x, number>>,
    Expect<Equal<typeof y, number>>,
  ];
});

listenToEvent((event, x, y, screenId) => {
  type tests = [
    Expect<Equal<typeof event, Event>>,
    Expect<Equal<typeof x, number>>,
    Expect<Equal<typeof y, number>>,
    Expect<Equal<typeof screenId, number>>,
  ];
});
