interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

const updateProduct = (id: number, productInfo: Omit<Product, "id">) => {
  // Do something with the productInfo
};

// Should be able to update individual pieces of information
updateProduct(1, {
  name: "Book",
});

updateProduct(1, {
  price: 12.99,
});

updateProduct(1, {
  description: "A book about Dragons",
});

// Should be able to update more than one piece of info at once
updateProduct(1, {
  name: "Book",
  price: 12.99,
});

updateProduct(1, {
  name: "Book",
  description: "A book about Dragons",
});
