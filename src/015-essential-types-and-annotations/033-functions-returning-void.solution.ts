const addClickEventListener = (listener: () => void) => {
  document.addEventListener("click", listener);
};

addClickEventListener(() => {
  console.log("Clicked!");
});

addClickEventListener(
  // @ts-expect-error
  "abc",
);
