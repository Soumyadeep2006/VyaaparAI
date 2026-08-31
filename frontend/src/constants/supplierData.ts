import type { Supplier } from "../types/supplier";

export const initialSuppliers: Supplier[] = [
  { id: 1, name: "ABC Traders", company: "ABC Traders", phone: "9876543210", email: "abc@gmail.com", address: "Jaipur", totalPurchase: 250000, pendingPayment: 25000, paymentStatus: "pending" },
  { id: 2, name: "Sharma Distributors", company: "Sharma Distributors", phone: "9988776655", email: "sharma@gmail.com", address: "Delhi", totalPurchase: 180000, pendingPayment: 10000, paymentStatus: "pending" },
  { id: 3, name: "Raj Enterprises", company: "Raj Enterprises", phone: "9123456789", email: "raj@gmail.com", address: "Mumbai", totalPurchase: 320000, pendingPayment: 0, paymentStatus: "paid" },
];
