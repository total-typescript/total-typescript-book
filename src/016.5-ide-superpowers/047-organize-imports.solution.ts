import { MAX_PAGE } from "./dummy-import-2";

const handlePage = (page: number) => {
  if (page > MAX_PAGE) {
    console.log("Page is too large!");
  }
};
