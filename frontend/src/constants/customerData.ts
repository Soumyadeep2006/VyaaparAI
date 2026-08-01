import type { Customer } from "../types/customer";

export const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Mohit Raj",
    phone: "9876543210",
    email: "mohit@example.com",
    address: "Jaipur",
    totalPurchase: 25000,
    outstanding: 1200,
  },
  {
    id: 2,
    name: "Rahul Kumar",
    phone: "9123456789",
    email: "rahul@example.com",
    address: "Delhi",
    totalPurchase: 18000,
    outstanding: 0,
  },
  {
    id: 3,
    name: "Priya Sharma",
    phone: "9988776655",
    email: "priya@example.com",
    address: "Mumbai",
    totalPurchase: 42000,
    outstanding: 3500,
  },
];