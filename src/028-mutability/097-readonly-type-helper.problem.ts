type SearchParams = {
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: "asc" | "desc";
};

const handleSearchParams = (search: SearchParams) => {
  // Do something with the search params

  // @ts-expect-error Should not be able to modify readonly
  search.q = "test";

  // @ts-expect-error Should not be able to modify readonly
  search.page = 1;

  // @ts-expect-error Should not be able to modify readonly
  search.pageSize = 10;

  // @ts-expect-error Should not be able to modify readonly
  search.sort = "name";

  // @ts-expect-error Should not be able to modify readonly
  search.order = "asc";
};
