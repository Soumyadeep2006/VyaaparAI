export type PaymentStatus =
  | "paid"
  | "pending"
  | "cancelled";

export interface Supplier {
  id: string | number;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  totalPurchase: number;
  pendingPayment: number;
  paymentStatus: PaymentStatus;
}