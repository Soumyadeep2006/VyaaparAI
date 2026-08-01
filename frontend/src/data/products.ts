export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

export const products: Product[] = [
  {
    id: 1,
    name: "Basmati Rice",
    sku: "R001",
    category: "Groceries",
    stock: 45,
    price: 120,
    status: "In Stock",
  },
  {
    id: 2,
    name: "Sugar",
    sku: "S001",
    category: "Groceries",
    stock: 12,
    price: 50,
    status: "Low Stock",
  },
  {
    id: 3,
    name: "Cooking Oil",
    sku: "O001",
    category: "Groceries",
    stock: 0,
    price: 180,
    status: "Out of Stock",
  },
  {
    id: 4,
    name: "Milk",
    sku: "M001",
    category: "Dairy",
    stock: 38,
    price: 65,
    status: "In Stock",
  },
  {
    id: 5,
    name: "Bread",
    sku: "B001",
    category: "Bakery",
    stock: 9,
    price: 40,
    status: "Low Stock",
  },
];