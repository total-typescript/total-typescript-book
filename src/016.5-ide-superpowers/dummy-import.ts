// You can also CMD-click hiThere to jump to its implementations
export const hiThere = () => {
  console.log("Hi!");
};

export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7; // 7 days
export const SESSION_EXPIRATION_TIME_IN_SECONDS =
  SESSION_EXPIRATION_TIME / 1000;
export const SESSION_EXPIRATION_TIME_IN_MINUTES =
  SESSION_EXPIRATION_TIME_IN_SECONDS / 60;
export const SESSION_EXPIRATION_TIME_IN_HOURS =
  SESSION_EXPIRATION_TIME_IN_MINUTES / 60;
