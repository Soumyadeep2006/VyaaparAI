import type { Product } from "../types/product";

export const initialProducts: Product[] = [
  {
    id: "1",
    name: "Basmati Rice",
    sku: "RICE-001",
    category: "Groceries",
    price: 120,
    stock: 85,
  },
  {
    id: "2",
    name: "Cooking Oil",
    sku: "OIL-014",
    category: "Groceries",
    price: 180,
    stock: 32,
  },
  {
    id: "3",
    name: "Bluetooth Speaker",
    sku: "ELE-203",
    category: "Electronics",
    price: 2499,
    stock: 6,
  },
  {
    id: "4",
    name: "Tea Pack",
    sku: "TEA-011",
    category: "Beverages",
    price: 210,
    stock: 0,
  },
];