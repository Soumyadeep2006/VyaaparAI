export type PaymentStatus =
  | "paid"
  | "pending"
  | "cancelled";

export interface Customer {
  id: string | number;
  name: string;
  phone: string;
  email?: string;
  address?: string;

  totalPurchase: number;
  outstanding: number;

  paymentStatus: PaymentStatus;
}