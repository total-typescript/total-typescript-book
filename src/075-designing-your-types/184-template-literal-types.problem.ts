type AbsoluteRoute = string;

const goToRoute = (route: AbsoluteRoute) => {
  // ...
};

goToRoute("/home");
goToRoute("/about");
goToRoute("/contact");

goToRoute(
  // @ts-expect-error
  "somewhere",
);
