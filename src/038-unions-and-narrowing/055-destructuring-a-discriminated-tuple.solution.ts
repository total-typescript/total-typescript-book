type User = {
  id: string;
};

type ApiResponse = ["success", User[]] | ["error", string];

async function fetchData(): Promise<ApiResponse> {
  try {
    const response = await fetch("https://api.example.com/data");
    if (!response.ok) {
      return [
        "error",
        // TODO - more detailed error handling here
        "An error occurred",
      ];
    }

    const data = await response.json();
    return ["success", data];
  } catch (error) {
    return ["error", "An error occurred"];
  }
}

async function exampleFunc() {
  const [status, value] = await fetchData();

  if (status === "success") {
    console.log(value);
    type test = Expect<Equal<typeof value, User[]>>;
  } else {
    console.error(value);

    type test = Expect<Equal<typeof value, string>>;
  }
}
