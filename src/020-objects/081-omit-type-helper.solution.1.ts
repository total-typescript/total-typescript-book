interface WithId {
  id: number;
}

interface ProductInfo {
  name: string;
  price: number;
  description: string;
}

interface Product extends WithId, ProductInfo {}

const addProduct = (productInfo: ProductInfo) => {
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
