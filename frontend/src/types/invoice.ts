export type InvoiceStatus = "Pending" | "Paid" | "Cancelled";
export type PaymentMethod = "Cash" | "UPI" | "Card" | "Bank Transfer";

export interface InvoiceItem {
  productId?: string;
  product_id?: string;
  product?: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id?: string;
  _id?: string;
  customer: string;
  customer_id?: string;
  items?: InvoiceItem[];
  total: number;
  status?: InvoiceStatus;
  payment_method?: PaymentMethod;
  created_at?: string;
  date?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  payment_gateway?: string;
  payment_status?: string;
}
