interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

const addProduct = (productInfo: Pick<Product, "name" | "description">) => {
  // Do something with the productInfo
};

addProduct({
  name: "Book",
  description: "A book about Dragons",
});

addProduct({
  // @ts-expect-error
  id: 1,
  name: "Book",
  description: "A book about Dragons",
});

addProduct({
  // @ts-expect-error
  price: 10,
  name: "Book",
  description: "A book about Dragons",
});
