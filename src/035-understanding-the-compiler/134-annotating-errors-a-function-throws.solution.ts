const getUserFromLocalStorage = (
  id: string,
):
  | {
      success: true;
      data: any;
    }
  | {
      success: false;
      error: SyntaxError | DOMException;
    } => {
  try {
    const user = localStorage.getItem(id);
    if (!user) {
      return {
        success: true,
        data: undefined,
      };
    }

    return {
      success: true,
      data: JSON.parse(user),
    };
  } catch (e) {
    if (e instanceof DOMException) {
      return {
        success: false,
        error: e,
      };
    }
    if (e instanceof SyntaxError) {
      return {
        success: false,
        error: e,
      };
    }
    throw e;
  }
};

const user = getUserFromLocalStorage("user-1");

if (user.success) {
  user.data;
} else {
  user.error;
}
