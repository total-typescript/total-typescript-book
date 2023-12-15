interface ShoppingCart {
  items: string[];
}

const shoppingCart: ShoppingCart = {
  items: [],
};

console.log(shoppingCart.items);

shoppingCart.items.push("Apple");
shoppingCart.items.push("Banana");
