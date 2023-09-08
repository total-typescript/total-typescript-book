/**
 * How do we annotate the errors this function throws?
 */

type PossibleErrors = SyntaxError | DOMException;

const getUserFromLocalStorage = (id: string) => {
  const user = localStorage.getItem(id);
  if (!user) {
    return undefined;
  }

  return JSON.parse(user);
};

try {
  const user = getUserFromLocalStorage("user-1");
} catch (
  // How do we make this typed as PossibleErrors?
  e
) {}
