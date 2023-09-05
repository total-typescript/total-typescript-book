type ButtonType = "button" | "submit" | "reset";

type ButtonAttributes = {
  cancel: {
    type: ButtonType;
  };
  confirm: {
    type: ButtonType;
  };
};

const modifyButtons = (attributes: ButtonAttributes) => {};

const buttonAttributes = {
  cancel: {
    type: "button",
  },
  confirm: {
    type: "button",
  },
} as const;

modifyButtons(buttonAttributes);
