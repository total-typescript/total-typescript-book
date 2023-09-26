type Event = {
  message: string;
};

const processUserMap = (eventMap: Map<string, Event>) => {
  const event = eventMap.get("error");
  if (event) {
    const message = event.message;

    throw new Error(message);
  }
};
