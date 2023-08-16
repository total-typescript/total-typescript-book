interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

const addProduct = (productInfo: Omit<Product, "id">) => {
  // Do something with the productInfo
};

addProduct({
  name: "Book",
  price: 12.99,
  description: "A book about Dragons",
});

addProduct({
  // @ts-expect-error
  id: 1,
  name: "Book",
  price: 12.99,
  description: "A book about Dragons",
});
