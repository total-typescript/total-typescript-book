const getResolvedIconSize = (
  iconSize: "small" | "medium" | "large" | string,
) => {
  switch (iconSize) {
    case "small":
      return 16;
    case "medium":
      return 32;
    case "large":
      return 48;
    default:
      return iconSize;
  }
};

// It doesn't give you autocomplete for 'small', 'medium', or 'large'!
getResolvedIconSize("awdawd");
