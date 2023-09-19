const addClickEventListener = (listener) => {
  document.addEventListener("click", listener);
};

addClickEventListener(() => {
  console.log("Clicked!");
});

addClickEventListener(
  // @ts-expect-error
  "abc",
);
